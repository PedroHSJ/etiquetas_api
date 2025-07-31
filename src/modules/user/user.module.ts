import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { RoleModule } from "../role/role.module";
import { UserWorkspaceModule } from "../user-workspace/user-workspace.module";
import { WorkspaceModule } from "../workspace/workspace.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { PlanEntity } from "../plan/entities/plan.entity";
import { SubworkspaceEntity } from "../subworkspace/entities/subworkspace.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PlanEntity, SubworkspaceEntity]),
    RoleModule,
    UserWorkspaceModule,
    WorkspaceModule,
    SubscriptionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
