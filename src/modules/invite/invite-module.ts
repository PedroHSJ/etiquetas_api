import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InviteService } from "./invite.service";
import { RoleEntity } from "../role/entities/role.entity";
import { UserRoleSubworkspaceEntity } from "../role/entities/user-role-subworkspace.entity";
import { UserRoleWorkspaceEntity } from "../role/entities/user-role-workspace.entity";
import { SubworkspaceEntity } from "../subworkspace/entities/subworkspace.entity";
import { UserSubworkspaceEntity } from "../user-subworkspace/entities/user-subworkspace.entity";
import { UserWorkspaceEntity } from "../user-workspace/entities/user-workspace.entity";
import { UserEntity } from "../user/entities/user.entity";
import { InviteEntity } from "./entities/invite.entity";
import { InviteController } from "./invite.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InviteEntity,
      UserWorkspaceEntity,
      SubworkspaceEntity,
      RoleEntity,
      UserSubworkspaceEntity,
      UserRoleWorkspaceEntity,
      UserRoleSubworkspaceEntity,
      UserEntity,
    ]),
  ],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
