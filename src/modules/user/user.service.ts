import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { I18nService } from "nestjs-i18n";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Like, Not, Repository } from "typeorm";
import { paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { UserEntity } from "./entities/user.entity";
import { plainToInstance } from "class-transformer";
import { UserDto } from "./dto/user.dto";
import * as crypto from "crypto";
import { RoleService } from "../role/role.service";
import { UserWorkspaceService } from "../user-workspace/user-workspace.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { CreateWorkspaceDto } from "../workspace/dto/create-workspace.dto";
import { CreateUserWorkspaceDto } from "../user-workspace/dto/create-user-workspace.dto";
import { Transactional } from "typeorm-transactional";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SubscriptionService } from "../subscription/subscription.service";
import { PlanEntity } from "../plan/entities/plan.entity";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { SubworkspaceEntity } from "../subworkspace/entities/subworkspace.entity";

@Injectable()
export class UserService {
  constructor(
    @Inject(I18nService)
    private readonly i18n: I18nService,
    @Inject(RoleService)
    private readonly roleService: RoleService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(UserWorkspaceService)
    private readonly userWorkspaceService: UserWorkspaceService,
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(SubworkspaceEntity)
    private readonly subworkspaceRepository: Repository<SubworkspaceEntity>,
  ) {}

  async b64EncodeUnicode(str: string): Promise<string> {
    return Buffer.from(str).toString("base64");
  }

  async b64DecodeUnicode(str: string): Promise<string> {
    return Buffer.from(str, "base64").toString("utf-8");
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }

  @Transactional()
  async create(createUserDto: CreateUserDto): Promise<IApiResponse<UserDto>> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: createUserDto.email }],
      });
      if (existingUser) {
        throw new ConflictException(
          this.i18n.t("events.commons.alreadyExists"),
        );
      }
      const passwordHash = await this.hashPassword(createUserDto.password);

      const activationToken = await this.b64EncodeUnicode(
        crypto.randomBytes(32).toString("hex"),
      );
      const fiveMinutes = 1000 * 60 * 5;
      const activationExpires = new Date(Date.now() + fiveMinutes);

      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: passwordHash,
        token: createUserDto.isGoogleLogin ? null : activationToken,
        tokenExpires: activationExpires,
        active: createUserDto.isGoogleLogin ? true : false,
      });

      const plan = await this.planRepository.findOne({
        where: { name: "FREE" },
      });
      if (!plan)
        throw new NotFoundException(this.i18n.t("events.commons.notFound"));

      await this.subscriptionService.create({
        userId: newUser.id,
        planId: plan.id,
        paymentMethodId: null,
      });

      return {
        message: await this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, newUser),
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IApiResponse<UserDto>> {
    try {
      await this.userRepository.findOneOrFail({ where: { id } });

      await this.userRepository.update(id, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { id } });

      return {
        message: await this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, updatedUser, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async listByEmail(email: string): Promise<IApiResponse<UserDto[]>> {
    try {
      const users = await this.userRepository.find({
        where: { email: Like(`%${email}%`) },
        order: { name: "ASC" },
      });
      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, users, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async listAllPaginated(query: PaginateQuery): Promise<Paginated<UserDto>> {
    try {
      const { data, links, meta } = await paginate<UserDto>(
        query,
        this.userRepository,
        {
          sortableColumns: ["name", "email"],
        },
      );
      return {
        data: plainToInstance(UserDto, data, { excludeExtraneousValues: true }),
        meta,
        links,
      };
    } catch (error) {
      throw error;
    }
  }

  async listAll(): Promise<IApiResponse<UserDto[]>> {
    try {
      const users = await this.userRepository.find();

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, users, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async listByWorkspaceOwner(
    workspaceId: number,
    userId: number,
  ): Promise<IApiResponse<UserDto[]>> {
    try {
      const users = await this.userRepository.find({
        where: {
          userWorkspaces: {
            workspaceId,
            workspace: {
              createdBy: userId,
            },
          },
        },
        order: { name: "ASC" },
      });

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, users, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async listBySubworkspaceId(subworkspaceId: number): Promise<UserDto[]> {
    try {
      // Buscar o subworkspace para obter o workspaceId
      const subworkspace = await this.subworkspaceRepository.findOne({
        where: { id: subworkspaceId },
        select: ["workspaceId"],
      });

      if (!subworkspace) {
        throw new NotFoundException(this.i18n.t("events.commons.notFound"));
      }

      const users = await this.userRepository.find({
        where: [
          // Usuários que estão no subworkspace específico
          {
            userWorkspaces: {
              workspace: {
                id: subworkspace.workspaceId,
              },
            },
          },

          {
            userWorkspaces: {
              workspace: {
                subworkspaces: {
                  id: IsNull(),
                },
              },
            },
          },
          {
            id: Not(1),
          },
        ],
        order: { name: "ASC" },
        relations: {
          userRoles: {
            role: true,
          },
        },
      });

      return plainToInstance(UserDto, users, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<IApiResponse<UserDto>> {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });
      if (!user) {
        throw new NotFoundException(this.i18n.t("events.commons.notFound"));
      }
      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      return this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity> {
    try {
      return this.userRepository.findOne({
        where: { email },
        select: ["id", "email", "password", "isGoogleLogin", "active"],
      });
    } catch (error) {
      throw error;
    }
  }

  async findByCpf(cpf: string): Promise<UserEntity> {
    try {
      return this.userRepository.findOne({
        where: { cpf },
      });
    } catch (error) {
      throw error;
    }
  }

  async activateUser(activationToken: string): Promise<IApiResponse<UserDto>> {
    try {
      const user = await this.userRepository.findOne({
        where: { token: activationToken },
      });
      if (!user)
        throw new NotFoundException(this.i18n.t("events.commons.notFound"));

      if (user.tokenExpires < new Date())
        throw new ConflictException(this.i18n.t("events.commons.expiredToken"));

      user.active = true;
      user.token = null;
      user.tokenExpires = null;
      await this.userRepository.save(user);

      const createWorkspace: CreateWorkspaceDto = {
        name: `${user.name.toLocaleUpperCase()}'s workspace`,
        createdBy: user.id,
      };

      // APOS CRIAR UM WORKSPACE PARA O USUARIO
      const newWorkspace = await this.workspaceService.create(createWorkspace);
      const newUserWorkspace: CreateUserWorkspaceDto = {
        userId: user.id,
        workspaceId: newWorkspace.id,
      };

      await this.userWorkspaceService.create(newUserWorkspace);

      // SETANDO O PAPEL DE MANAGER PARA O USUÁRIO CRIADO
      const managerRole = await this.roleService.findByName("Manager");
      await this.roleService.createUserRole({
        userId: user.id,
        roleId: managerRole.data.id,
        workspaceId: newWorkspace.id,
      });

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserDto, user),
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<IApiResponse<void>> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(this.i18n.t("events.common.notFound"));
      }

      await this.userRepository.update(user.id, { active: false });

      return {
        message: this.i18n.t("events.commons.success"),
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }
}
