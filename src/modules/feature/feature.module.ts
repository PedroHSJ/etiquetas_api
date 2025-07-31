import { Module } from "@nestjs/common";
import { FeatureLimitService } from "./feature-limit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureEntity } from "./entities/feature.entity";
import { FeatureLimitEntity } from "./entities/feature-limit.entity";
import { UserFeatureLimitEntity } from "./entities/user-feature-limit.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeatureEntity,
      FeatureLimitEntity,
      UserFeatureLimitEntity,
    ]),
  ],
  providers: [FeatureLimitService],
})
export class FeatureModule {}
