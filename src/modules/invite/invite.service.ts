import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";
import { InviteEntity } from "./entities/invite.entity";
import { Repository } from "typeorm";
import { InviteStatusEnum } from "@/shared/enums/inviteStatus.enum";
import { UserWorkspaceEntity } from "../user-workspace/entities/user-workspace.entity";
import { SubworkspaceEntity } from "../subworkspace/entities/subworkspace.entity";
import { UserSubworkspaceEntity } from "../user-subworkspace/entities/user-subworkspace.entity";
import { RoleEntity } from "../role/entities/role.entity";
import { UserRoleWorkspaceEntity } from "../role/entities/user-role-workspace.entity";
import { UserRoleSubworkspaceEntity } from "../role/entities/user-role-subworkspace.entity";
import { CreateInviteDto } from "./dto/create-invite.dto";
import { UserEntity } from "../user/entities/user.entity";
import { I18nService } from "nestjs-i18n";
import { OnboadingManagerDto } from "../auth/auth.service";
import { InviteDto } from "./dto/invite.dto";
import { plainToInstance } from "class-transformer";
import { SendInviteDto } from "./dto/send-invite.dto";
import { SendBulkInvitesDto } from "./dto/send-bulk-invites.dto";
import { SendInviteResponseDto, SendBulkInvitesResponseDto } from "./dto/send-invite-response.dto";

@Injectable()
export class InviteService {
  constructor(
    @Inject(I18nService)
    private readonly i18n: I18nService,
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    @InjectRepository(UserSubworkspaceEntity)
    private readonly userSubworkspaceRepository: Repository<UserSubworkspaceEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleWorkspaceEntity)
    private readonly userRoleWorkspaceRepository: Repository<UserRoleWorkspaceEntity>,
    @InjectRepository(UserRoleSubworkspaceEntity)
    private readonly userRoleSubworkspaceRepository: Repository<UserRoleSubworkspaceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // @Transactional()
  // async inviteUser(
  //   createInviteDto: CreateInviteDto,
  //   userId: number,
  // ): Promise<void> {
  //   try {
  //     const { email, workspaceId, roleId } = createInviteDto;

  //     const userRequested = await this.userRepository.findOneOrFail({
  //       where: { id: userId },
  //     });

  //     if (userRequested.email == email) throw new ConflictException();

  //     // Verifica se o usuário existe
  //     const user = await this.userRepository.findOneOrFail({
  //       where: { email },
  //     });

  //     // Verifica se o usuário já está no workspace
  //     const existingUserWorkspace = await this.userWorkspaceRepository.findOne({
  //       where: { userId: user.id, workspaceId },
  //     });
  //     if (existingUserWorkspace) throw new ConflictException();

  //     const userRequestedInWorkspace =
  //       await this.userWorkspaceRepository.findOne({
  //         where: { userId, workspaceId },
  //       });

  //     //NAO POSSO CONVIDAR USUÁRIO SE O USUÁRIO QUE ESTÁ CONVIDANDO NÃO ESTIVER NO WORKSPACE
  //     if (!userRequestedInWorkspace) {
  //       throw new ConflictException(
  //         this.i18n.t("events.commons.userNotInWorkspace"),
  //       );
  //     }

  //     const inviteCreated = this.inviteRepository.create({
  //       userId: user.id,
  //       workspaceId,
  //       status: InviteStatusEnum.PENDING,
  //       roleId,
  //       createdBy: userRequested.id,
  //     });

  //     //Envia o convite para o usuário
  //     await this.inviteRepository.save(inviteCreated);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Transactional()
  async inviteUsersByOnboarding(data: {
    workspaceId: number;
    email: string;
    roleId: number;
    subworkspaceId?: number;
    userId: number;
  }): Promise<void> {
    try {
      const { email, workspaceId, roleId, subworkspaceId, userId } = data;

      // Cria o convite
      const inviteCreated = this.inviteRepository.create({
        email,
        workspaceId,
        subworkspaceId,
        status: InviteStatusEnum.PENDING,
        roleId,
        createdBy: userId,
      });

      // Envia o convite para o usuário
      await this.inviteRepository.save(inviteCreated);
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async acceptInvite(id: number, userId: number): Promise<void> {
    try {
      const { workspaceId, subworkspaceId, roleId } =
        await this.inviteRepository.findOneOrFail({
          where: { id, status: InviteStatusEnum.PENDING },
        });

      console.log("workspaceId", workspaceId);
      console.log("subworkspaceId", subworkspaceId);

      const userExists = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (userExists.email !== userExists.email) {
        throw new BadRequestException(
          this.i18n.t("events.commons.userNotInWorkspace"),
        );
      }

      // // Adiciona o usuário ao workspace
      await this.userWorkspaceRepository.save({
        userId,
        workspaceId,
      });

      if (subworkspaceId) {
        // // Adiciona o usuário ao subworkspace, se existir
        try {
          await this.userSubworkspaceRepository.save({
            userId,
            subworkspaceId,
          });
        } catch (error) {
          console.error("Error adding user to subworkspace:", error);
        }
      }

      const roleEntity = await this.roleRepository.findOneOrFail({
        where: { id: roleId },
      });

      if (roleEntity.name === "Manager") {
        // // Atribui a Role ao usuário no workspace
        await this.userRoleWorkspaceRepository.save({
          userId,
          roleId,
          workspaceId,
        });
      }
      if (subworkspaceId) {
        await this.userRoleSubworkspaceRepository.save({
          userId,
          roleId,
          subworkspaceId: subworkspaceId || undefined,
        });
      }

      await this.inviteRepository.update(id, {
        status: InviteStatusEnum.ACCEPTED,
        updatedBy: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async rejectInvite(id: number, userId: number): Promise<void> {
    try {
      await this.inviteRepository.update(id, {
        status: InviteStatusEnum.REJECTED,
        updatedBy: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  async listPendingInvites(email: string): Promise<InviteDto[]> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
      });

      if (!user)
        throw new NotFoundException(this.i18n.t("events.commons.userNotFound"));

      if (user.email !== email)
        throw new BadRequestException(
          this.i18n.t("events.commons.userNotInWorkspace"),
        );

      const invites = await this.inviteRepository.find({
        where: { email, status: InviteStatusEnum.PENDING },
        relations: {
          workspace: true,
          role: true,
          createdByUser: true,
          subworkspace: true,
        },
      });
      return plainToInstance(InviteDto, invites, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async sendInvite(
    sendInviteDto: SendInviteDto,
    userId: number,
  ): Promise<SendInviteResponseDto> {
    try {
      const { email, workspaceId, roleId, subworkspaceId } = sendInviteDto;

      // Verificar se o usuário que está enviando o convite existe
      const userRequested = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });

      // Verificar se o usuário não está tentando convidar a si mesmo
      if (userRequested.email === email) {
        throw new ConflictException(
          this.i18n.t("events.commons.cannotInviteYourself"),
        );
      }

      // Verificar se o usuário que está enviando o convite está no workspace
      const userRequestedInWorkspace = await this.userWorkspaceRepository.findOne({
        where: { userId, workspaceId },
      });

      if (!userRequestedInWorkspace) {
        throw new ConflictException(
          this.i18n.t("events.commons.userNotInWorkspace"),
        );
      }

      // Verificar se já existe um convite pendente para este email e workspace
      const existingInvite = await this.inviteRepository.findOne({
        where: {
          email,
          workspaceId,
          subworkspaceId: subworkspaceId || null,
          status: InviteStatusEnum.PENDING,
        },
      });

      if (existingInvite) {
        throw new ConflictException(
          this.i18n.t("events.commons.inviteAlreadyExists"),
        );
      }

      // Verificar se o usuário convidado já existe e já está no workspace
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        const existingUserWorkspace = await this.userWorkspaceRepository.findOne({
          where: { userId: existingUser.id, workspaceId },
        });

        if (existingUserWorkspace) {
          throw new ConflictException(
            this.i18n.t("events.commons.userAlreadyInWorkspace"),
          );
        }
      }

      // Criar o convite
      const inviteCreated = this.inviteRepository.create({
        email,
        workspaceId,
        subworkspaceId,
        status: InviteStatusEnum.PENDING,
        roleId,
        createdBy: userId,
      });

      await this.inviteRepository.save(inviteCreated);

      return {
        message: this.i18n.t("events.commons.inviteSentSuccessfully"),
        email,
        workspaceId,
        subworkspaceId,
      };
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async sendBulkInvites(
    sendBulkInvitesDto: SendBulkInvitesDto,
    userId: number,
  ): Promise<SendBulkInvitesResponseDto> {
    const results: SendInviteResponseDto[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const inviteDto of sendBulkInvitesDto.invites) {
      try {
        const result = await this.sendInvite(inviteDto, userId);
        results.push(result);
        successCount++;
      } catch (error) {
        results.push({
          message: error.message || "Erro ao enviar convite",
          email: inviteDto.email,
          workspaceId: inviteDto.workspaceId,
          subworkspaceId: inviteDto.subworkspaceId,
        });
        failCount++;
      }
    }

    return {
      message: `${successCount} convite(s) enviado(s) com sucesso`,
      successCount,
      failCount,
      results,
    };
  }

  //   async findInviteById(id: number): Promise<IApiResponse<InviteEntity>> {
  //     try {
  //       const invite = await this.workspaceInviteRepository.findOneOrFail({
  //         where: { id },
  //       });

  //       return {
  //         message: this.i18n.t("events.commons.success"),
  //         data: plainToInstance(InviteEntity, invite, {
  //           excludeExtraneousValues: true,
  //         }),
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async listAllPaginatedInvites(
  //     query: PaginateQuery,
  //   ): Promise<Paginated<WorkspaceInviteDto>> {
  //     try {
  //       const { data, links, meta } = await paginate<WorkspaceInviteDto>(
  //         query,
  //         this.workspaceInviteRepository,
  //         {
  //           sortableColumns: ["createdAt"],
  //           filterableColumns: {
  //             status: [FilterOperator.EQ],
  //             userId: [FilterOperator.EQ],
  //           },
  //           relations: {
  //             user: true,
  //             workspace: true,
  //             role: true,
  //             createdByUser: true,
  //           },
  //         },
  //       );
  //       return {
  //         data: plainToInstance(WorkspaceInviteDto, data, {
  //           excludeExtraneousValues: true,
  //         }),
  //         meta,
  //         links,
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
