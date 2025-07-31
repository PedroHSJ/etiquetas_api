import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { UserRoleWorkspaceEntity } from "./entities/user-role-workspace.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserRoleWorkspaceEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
