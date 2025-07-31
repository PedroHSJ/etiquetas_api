import { Inject, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { In, Not, Repository } from "typeorm";
import { plainToClass, plainToInstance } from "class-transformer";
import { RoleDto } from "./dto/role.dto";
import { I18nService } from "nestjs-i18n";
import { paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import {
  ApiArrayResponseDto,
  IApiResponse,
} from "@/shared/dto/apiResponse.dto";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRoleWorkspaceEntity } from "./entities/user-role-workspace.entity";
import { Transactional } from "typeorm-transactional";
import { UserRoleDto } from "./dto/user-role.dto";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleWorkspaceEntity)
    private readonly userRoleWorkspaceRepository: Repository<UserRoleWorkspaceEntity>,
    @Inject(I18nService)
    private readonly i18n: I18nService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<IApiResponse<RoleDto>> {
    try {
      const newEntity = await this.roleRepository.save(
        this.roleRepository.create(createRoleDto),
      );

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(RoleDto, newEntity),
      };
    } catch (error) {
      throw error;
    }
  }

  async listAll(): Promise<RoleDto[]> {
    try {
      const res = await this.roleRepository.find({
        where: {
          id: Not(In([1])), // Exclude system roles like Admin and User
        },
      });
      return plainToInstance(RoleDto, res);
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<IApiResponse<RoleDto>> {
    try {
      const res = await this.roleRepository.findOneByOrFail({
        name,
      });

      return {
        data: plainToInstance(RoleDto, res),
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async createUserRole(
    createUserRole: CreateUserRoleDto,
  ): Promise<IApiResponse<UserRoleDto>> {
    try {
      // Cria a entidade UserRoleWorkspaceEntity com base no DTO
      const userRole = plainToClass(UserRoleWorkspaceEntity, createUserRole);

      // Salva a associação na tabela TB_USER_ROLE
      const savedUserRole =
        await this.userRoleWorkspaceRepository.save(userRole);

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(UserRoleDto, savedUserRole),
      };
    } catch (error) {
      console.error("Error creating user role:", error);
      throw error;
    }
  }

  async findUserRoleByUserId(
    userId: number,
  ): Promise<IApiResponse<UserRoleDto>> {
    try {
      const res = await this.userRoleWorkspaceRepository.findOneOrFail({
        where: { userId },
        relations: {
          role: {
            permissions: {
              feature: true,
            },
          },
        },
      });

      return {
        data: plainToInstance(UserRoleDto, res),
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      throw error;
    }
  }

  async listUserRolesByUserId(
    userId: number,
  ): Promise<IApiResponse<UserRoleDto[]>> {
    try {
      const res = await this.userRoleWorkspaceRepository.find({
        where: { userId },
        relations: {
          role: {
            permissions: {
              feature: true,
            },
          },
          workspace: true,
        },
      });

      return {
        data: plainToInstance(UserRoleDto, res),
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      throw error;
    }
  }

  async findUserRoleByUserIdAndWorkspaceId(
    userId: number,
    workspaceId: number,
  ): Promise<IApiResponse<UserRoleDto[]>> {
    try {
      const res = await this.userRoleWorkspaceRepository.find({
        where: { userId, workspaceId },
        relations: {
          role: {
            permissions: {
              feature: true,
            },
          },
        },
      });
      return {
        data: plainToInstance(UserRoleDto, res),
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      throw error;
    }
  }

  async listUserRolesByContext(
    userId: number,
    roleId: number,
    workspaceId: number,
  ): Promise<IApiResponse<UserRoleDto[]>> {
    try {
      const userRoles = await this.userRoleWorkspaceRepository.find({
        where: {
          userId,
          roleId,
          workspaceId,
        },
        relations: {
          role: {
            permissions: {
              feature: true,
            },
          },
          workspace: true,
        },
      });

      return {
        data: plainToInstance(UserRoleDto, userRoles),
        message: this.i18n.t("events.commons.success"),
      };
    } catch (error) {
      console.error("Error finding user roles by context:", error);
      throw error;
    }
  }
}
