import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRoleWorkspaceEntity } from "../role/entities/user-role-workspace.entity";
import { PermissionEntity } from "./entities/permission.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleWorkspaceEntity, PermissionEntity]),
  ],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
