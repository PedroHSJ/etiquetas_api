import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { WorkspaceModule } from "../workspace/workspace.module";
import { PermissionModule } from "../permission/permission.module";
import { RoleModule } from "../role/role.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRoleWorkspaceEntity } from "../role/entities/user-role-workspace.entity";
import { InviteModule } from "../invite/invite-module";
import { SubworkspaceEntity } from "../subworkspace/entities/subworkspace.entity";
import { SubworkspaceModule } from "../subworkspace/subworkspace.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleWorkspaceEntity]),
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secretKey",
      signOptions: { expiresIn: "60m" },
    }),
    UserModule,
    WorkspaceModule,
    RoleModule,
    InviteModule,
    SubworkspaceModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule],
})
export class AuthModule {}
