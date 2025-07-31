import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceEntity } from "./entities/workspace.entity";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { Module } from "@nestjs/common";
import { SubscriptionModule } from "../subscription/subscription.module";
import { UserWorkspaceEntity } from "../user-workspace/entities/user-workspace.entity";
import { RoleModule } from "../role/role.module";
import { UserEntity } from "../user/entities/user.entity";
import { InviteEntity } from "../invite/entities/invite.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity,
      UserWorkspaceEntity,
      UserEntity,
      InviteEntity,
    ]),
    SubscriptionModule,
    RoleModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
