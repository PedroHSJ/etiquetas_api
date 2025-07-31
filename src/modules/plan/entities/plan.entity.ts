import { PlanPriceEntity } from "@/modules/plan/entities/plan-price.entity";
import { SubscriptionEntity } from "@/modules/subscription/entities/subscription.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PlanItemEntity } from "./plan-item.entity";

@Entity("tb_plan")
export class PlanEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", length: 50, unique: true })
  name: string;

  @Column({ name: "description", type: "text", nullable: true })
  description: string;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan)
  subscriptions: SubscriptionEntity[];

  @OneToMany(
    () => PlanPriceEntity,
    (subscriptionPrice) => subscriptionPrice.plan,
  )
  planPrices: PlanPriceEntity[];

  @OneToMany(() => PlanItemEntity, (planItem) => planItem.plan)
  planItems: PlanItemEntity[];
}
