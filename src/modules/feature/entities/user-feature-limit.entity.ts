import { UserEntity } from "@/modules/user/entities/user.entity";
import { FeatureLimitEntity } from "@/modules/feature/entities/feature-limit.entity";
import { SubscriptionEntity } from "@/modules/subscription/entities/subscription.entity"; // Import da entidade de assinatura
import { BaseEntity } from "@/shared/entities/base.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SimpleBaseEntity } from "@/shared/entities/simple-base.entity";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";

@Entity("tb_user_feature_limit")
export class UserFeatureLimitEntity extends SimpleBaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.featureLimits)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(
    () => FeatureLimitEntity,
    (featureLimit) => featureLimit.userLimits,
  )
  @JoinColumn({ name: "feature_limit_id" })
  featureLimit: FeatureLimitEntity;

  @Column({ name: "feature_limit_id" })
  featureLimitId: number;

  @ManyToOne(
    () => SubscriptionEntity,
    (subscription) => subscription.featureLimits,
  )
  @JoinColumn({ name: "subscription_id" }) // Relaciona com a assinatura vigente
  subscription: SubscriptionEntity;

  @Column({ name: "subscription_id" })
  subscriptionId: number;

  @Column({ name: "current_value", default: 0 })
  currentValue: number;

  @Column({
    name: "last_reset_date",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastResetDate: Date;

  @Column({ name: "active", default: true })
  active: boolean;
}
