import { UserFeatureLimitEntity } from "@/modules/feature/entities/user-feature-limit.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";
import { PlanStatusEnum } from "@/shared/enums/planStatus.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { PlanPriceEntity } from "../../plan/entities/plan-price.entity";
import { PlanEntity } from "@/modules/plan/entities/plan.entity";

@Entity("tb_subscription")
export class SubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ name: "stripe_subscription_id", unique: true, nullable: true })
  stripeSubscriptionId: string | null;

  @Column({ name: "plan_id" })
  planId: number;

  @ManyToOne(() => PlanEntity)
  @JoinColumn({ name: "plan_id" })
  plan: PlanEntity;

  @Column({ name: "payment_method_id" })
  paymentMethodId: number;

  @Column({
    name: "status",
    type: "enum",
    enum: PlanStatusEnum,
  })
  status: PlanStatusEnum;

  @Column({ name: "current_period_end", type: "timestamp" })
  currentPeriodEnd: Date;

  @Column({
    name: "billing_cycle",
    type: "enum",
    enum: BillingCycleEnum,
    default: BillingCycleEnum.MONTHLY,
  })
  billingCycle: BillingCycleEnum;

  @Column({ name: "plan_price_id" })
  planPriceId: number;

  @ManyToOne(() => PlanPriceEntity)
  @JoinColumn({ name: "plan_price_id" })
  planPrice: PlanPriceEntity;

  @Column({ name: "next_billing_date", type: "timestamp", nullable: true })
  nextBillingDate: Date;

  @Column({ name: "cancel_at_period_end", default: false })
  cancelAtPeriodEnd: boolean;

  @Column({
    name: "price_at_purchase",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  priceAtPurchase: number;

  @Column({ name: "trial_end_date", type: "timestamp", nullable: true })
  trialEndDate: Date;

  @OneToMany(
    () => UserFeatureLimitEntity,
    (userFeatureLimit) => userFeatureLimit.subscription,
  )
  featureLimits: UserFeatureLimitEntity[];
}
