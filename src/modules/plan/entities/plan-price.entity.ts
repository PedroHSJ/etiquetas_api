import { BaseEntity } from "@/shared/entities/base.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";
import { SubscriptionEntity } from "../../subscription/entities/subscription.entity";
import { PlanEntity } from "@/modules/plan/entities/plan.entity";

@Entity("tb_plan_price")
export class PlanPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "plan_id" })
  planId: number;

  @ManyToOne(
    () => PlanEntity,
    (subscriptionType) => subscriptionType.planPrices,
  )
  @JoinColumn({ name: "plan_id" })
  plan: PlanEntity;

  @Column({ name: "price", type: "numeric", precision: 10, scale: 2 })
  price: number;

  @Column({ name: "billing_cycle" })
  billingCycle: BillingCycleEnum;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.planPrice)
  subscriptions: SubscriptionEntity[];
}
