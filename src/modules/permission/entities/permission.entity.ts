import { FeatureEntity } from "@/modules/feature/entities/feature.entity";
import { RoleEntity } from "@/modules/role/entities/role.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";

@Entity("tb_permission")
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "role_id" })
  roleId: number;

  @Column({ name: "feature_id" })
  featureId: number;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  @ManyToOne(() => FeatureEntity)
  @JoinColumn({ name: "feature_id" })
  feature: FeatureEntity;
}
