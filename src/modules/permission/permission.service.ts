import { Injectable } from "@nestjs/common";
import { UserRoleWorkspaceEntity } from "../role/entities/user-role-workspace.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PermissionEntity } from "./entities/permission.entity";
import { FeatureDto } from "../feature/dto/feature.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(UserRoleWorkspaceEntity)
    private userRoleWorkspaceRepository: Repository<UserRoleWorkspaceEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  /**
   * Verifica se um usuário tem acesso a uma funcionalidade específica em um workspace
   */
  async userHasFeatureAccess(args: {
    userId: number;
    workspaceId: number;
    featureName: string;
  }): Promise<boolean> {
    const { userId, workspaceId, featureName } = args;
    const userRoles = await this.userRoleWorkspaceRepository.find({
      where: { userId, workspaceId },
      relations: { role: true },
    });

    const permissions = await this.permissionRepository.find({
      where: { feature: { name: featureName } },
      relations: { role: true },
    });

    const userHasAccess = userRoles.some((userRole) => {
      return permissions.some((permission) => {
        return permission.roleId === userRole.roleId;
      });
    });

    return userHasAccess;
  }

  /**
   * Lista as funcionalidades que um usuário tem acesso em um workspace
   */
  async listFeaturesByUser(
    userId: number,
    workspaceId: number,
  ): Promise<FeatureDto[]> {
    console.log("userId:", userId);
    console.log("workspaceId:", workspaceId);
    const userRoles = await this.userRoleWorkspaceRepository.find({
      where: { userId, workspaceId },
      relations: { role: true },
    });
    console.log(userRoles);
    const rolesIds = userRoles.map((userRole) => userRole.roleId);
    console.log(rolesIds);
    const permissions = await this.permissionRepository.find({
      where: { roleId: In(rolesIds) },
      relations: { feature: true },
    });
    console.log(permissions);
    return plainToInstance(
      FeatureDto,
      permissions.map((permission) => permission.feature),
    );
  }
}
