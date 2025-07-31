import { ProductSubgroup } from "@/modules/product-subgroup/entities/product-subgroup.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from "typeorm";
import { Unit } from "./unit.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "varchar", length: 200, nullable: false })
  name: string;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @Column({ name: "product_subgroup_id", type: "integer", nullable: false })
  productSubgroupId: number;

  @ManyToOne(() => ProductSubgroup)
  @JoinColumn({ name: "product_subgroup_id" })
  productSubgroup: ProductSubgroup;

  @Column({ name: "default_unit_id", type: "integer", nullable: false })
  defaultUnitId: number;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: "default_unit_id" })
  defaultUnit: Unit;

  @Column({ name: "image_url", type: "varchar", length: 500, nullable: true })
  imageUrl?: string;

  @Column({
    name: "quantity",
    type: "integer",
    precision: 10,
    scale: 3,
  })
  quantity: number;

  @Column({ name: "active", type: "boolean", nullable: false, default: true })
  active: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
