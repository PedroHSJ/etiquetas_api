import { Inject, Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { WorkspaceDto } from "./dto/workspace.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkspaceEntity } from "./entities/workspace.entity";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { Transactional } from "typeorm-transactional";
import { UserWorkspaceEntity } from "../user-workspace/entities/user-workspace.entity";
import { RoleService } from "../role/role.service";
import { UserEntity } from "../user/entities/user.entity";
import { InviteEntity } from "../invite/entities/invite.entity";

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(I18nService)
    private readonly i18n: I18nService,
    @Inject(RoleService)
    private readonly roleService: RoleService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(InviteEntity)
    private readonly workspaceInviteRepository: Repository<InviteEntity>,
  ) {}

  @Transactional()
  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceDto> {
    try {
      const userId = createWorkspaceDto.createdBy;
      const wsEntity = await this.workspaceRepository.save(
        this.workspaceRepository.create(createWorkspaceDto),
      );

      await this.userWorkspaceRepository.save(
        this.userWorkspaceRepository.create({
          userId,
          workspaceId: wsEntity.id,
        }),
      );

      // SETANDO O PAPEL DE MANAGER PARA O USUÁRIO CRIADO
      const managerRole = await this.roleService.findByName("Gestor");
      await this.roleService.createUserRole({
        userId,
        roleId: managerRole.data.id,
        workspaceId: wsEntity.id,
      });

      return plainToInstance(WorkspaceDto, wsEntity);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<IApiResponse<WorkspaceDto>> {
    try {
      await this.workspaceRepository.findOneOrFail({
        where: { id },
      });

      await this.workspaceRepository.update(id, updateWorkspaceDto);
      const updatedWorkspace = await this.workspaceRepository.findOne({
        where: { id },
      });

      return {
        message: await this.i18n.t("events.commons.success"),
        data: plainToInstance(WorkspaceDto, updatedWorkspace, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<WorkspaceDto> {
    try {
      const workspace = await this.workspaceRepository.findOneOrFail({
        where: { id, active: true },
        relations: {
          subworkspaces: true,
          userWorkspaces: {
            user: true,
          },
        },
      });

      return plainToInstance(WorkspaceDto, workspace, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findMostRecent(userId: number): Promise<IApiResponse<WorkspaceDto>> {
    try {
      const workspace = await this.workspaceRepository.find({
        where: { active: true, userWorkspaces: { userId } },
        order: { id: "DESC" },
        take: 1,
      });

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(
          WorkspaceDto,
          workspace.find((i) => true),
          {
            excludeExtraneousValues: true,
          },
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  async listAllPaginated(
    query: PaginateQuery,
  ): Promise<Paginated<WorkspaceDto>> {
    try {
      const { data, links, meta } = await paginate<WorkspaceDto>(
        query,
        this.workspaceRepository,
        {
          sortableColumns: ["name", "active"],
        },
      );
      return {
        data: plainToInstance(WorkspaceDto, data, {
          excludeExtraneousValues: true,
        }),
        meta,
        links,
      };
    } catch (error) {
      throw error;
    }
  }

  async listAll(id: number): Promise<IApiResponse<WorkspaceDto[]>> {
    try {
      const workspaces = await this.workspaceRepository.find({
        where: { active: true, userWorkspaces: { userId: id } },
        order: { id: "ASC" },
      });

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(WorkspaceDto, workspaces, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<IApiResponse<void>> {
    try {
      const workspace = await this.workspaceRepository.findOneByOrFail({ id });

      await this.workspaceRepository.update(workspace.id, { active: false });

      return {
        message: this.i18n.t("events.commons.success"),
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async listByUserId(userId: number): Promise<WorkspaceDto[]> {
    try {
      const workspaces = await this.workspaceRepository.find({
        where: { userWorkspaces: { userId }, active: true },
        order: { id: "ASC" },
        relations: {
          subworkspaces: true,
          userWorkspaces: true,
        },
      });

      return plainToInstance(WorkspaceDto, workspaces, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
