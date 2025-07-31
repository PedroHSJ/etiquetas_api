import { FeatureLimitEntity } from "@/modules/feature/entities/feature-limit.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserFeatureLimitEntity } from "./user-feature-limit.entity";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";

@Entity("tb_feature")
export class FeatureEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", length: 255, nullable: false })
  name: string;

  @Column({
    name: "reset_frequency",
    type: "enum",
    enum: BillingCycleEnum,
    default: BillingCycleEnum.NEVER,
  })
  resetFrequency: BillingCycleEnum;

  @OneToMany(() => FeatureLimitEntity, (featureLimit) => featureLimit.feature)
  limits: FeatureLimitEntity[];
}
