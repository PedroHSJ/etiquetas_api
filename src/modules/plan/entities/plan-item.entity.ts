import { BaseEntity } from "@/shared/entities/base.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PlanEntity } from "./plan.entity";

@Entity("tb_plan_item")
export class PlanItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "plan_id" })
  planId: string;

  @ManyToOne(() => PlanEntity, (plan) => plan.planItems)
  @JoinColumn({ name: "plan_id" })
  plan: PlanEntity;

  @Column({ name: "description", type: "text", nullable: true })
  description: string;
}
