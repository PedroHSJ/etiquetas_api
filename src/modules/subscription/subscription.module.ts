import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionLimitService } from "./subscription-limit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { FeatureLimitEntity } from "../feature/entities/feature-limit.entity";
import { FeatureEntity } from "../feature/entities/feature.entity";
import { UserFeatureLimitEntity } from "../feature/entities/user-feature-limit.entity";
import { PlanEntity } from "../plan/entities/plan.entity";
import { PlanPriceEntity } from "../plan/entities/plan-price.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionEntity,
      FeatureEntity,
      FeatureLimitEntity,
      UserFeatureLimitEntity,
      PlanEntity,
      PlanPriceEntity,
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionLimitService],
  exports: [SubscriptionService, SubscriptionLimitService],
})
export class SubscriptionModule {}
