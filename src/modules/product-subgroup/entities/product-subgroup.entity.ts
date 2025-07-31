import { ProductGroup } from "@/modules/product-groups/entities/product-groups.entity";
import { Product } from "@/modules/product/entities/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

@Entity("product_subgroups")
export class ProductSubgroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "product_group_id" })
  productGroupId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => ProductGroup, (group) => group.subgroups, { lazy: true })
  @JoinColumn({ name: "product_group_id" })
  productGroup: Promise<ProductGroup>;

  @OneToMany(() => Product, (product) => product.productSubgroup, {
    lazy: true,
  })
  products: Promise<Product[]>;
}
