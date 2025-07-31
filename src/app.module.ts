import { PlanModule } from "./modules/plan/plan.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./shared/modules/database/database.module";
import { LanguageModule } from "./shared/modules/language/i18n.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthService } from "./modules/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { RoleModule } from "./modules/role/role.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { PermissionModule } from "./modules/permission/permission.module";
import { UserMiddleware } from "./shared/helpers/middlewares/request-user.middleware";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { ScheduleModule } from "@nestjs/schedule";
import { FeatureModule } from "./modules/feature/feature.module";
import { InviteModule } from "./modules/invite/invite-module";
import { SubworkspaceModule } from "./modules/subworkspace/subworkspace.module";
import { ProductModule } from "./modules/product/product.module";
import { StockModule } from "./modules/stock/stock.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    LanguageModule,
    UserModule,
    WorkspaceModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    SubscriptionModule,
    FeatureModule,
    ScheduleModule.forRoot(),
    PlanModule,
    InviteModule,
    SubworkspaceModule,
    ProductModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AuthService, JwtService, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes("*");
  }
}
