import { PlanEntity } from "@/modules/plan/entities/plan.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { FeatureEntity } from "./feature.entity";
import { UserFeatureLimitEntity } from "./user-feature-limit.entity";

@Entity("tb_feature_limit")
export class FeatureLimitEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "plan_id" })
  planId: number;

  @ManyToOne(() => PlanEntity)
  @JoinColumn({ name: "plan_id" })
  subscriptionType: PlanEntity;

  @Column({ name: "feature_id" })
  featureId: number;

  @ManyToOne(() => FeatureEntity, (feature) => feature.limits)
  @JoinColumn({ name: "feature_id" })
  feature: FeatureEntity;

  @Column({ name: "max_value" })
  maxValue: number;

  @Column({ name: "is_unlimited", default: false })
  isUnlimited: boolean;

  @OneToMany(
    () => UserFeatureLimitEntity,
    (userFeatureLimit) => userFeatureLimit.featureLimit,
  )
  userLimits: UserFeatureLimitEntity[];
}
