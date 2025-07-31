import { ProductSubgroup } from "@/modules/product-subgroup/entities/product-subgroup.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("product_groups")
export class ProductGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 7, nullable: true })
  color: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => ProductSubgroup, (subgroup) => subgroup.productGroup)
  subgroups: ProductSubgroup[];
}
