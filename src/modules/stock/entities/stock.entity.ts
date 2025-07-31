// src/entities/stock.entity.ts
import { Product } from "@/modules/product/entities/product.entity";
import { SubworkspaceEntity } from "@/modules/subworkspace/entities/subworkspace.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

@Entity("stock")
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "subworkspace_id" })
  subworkspaceId: number;

  @Column({ name: "product_id" })
  productId: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 3,
    default: 0,
    name: "current_quantity",
  })
  currentQuantity: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 3,
    default: 0,
    name: "reserved_quantity",
  })
  reservedQuantity: number;

  @Column({ nullable: true, name: "last_entry_date" })
  lastEntryDate: Date;

  @Column({ nullable: true, name: "last_exit_date" })
  lastExitDate: Date;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  // Remover lazy loading
  @ManyToOne(() => SubworkspaceEntity)
  @JoinColumn({ name: "subworkspace_id" })
  subworkspace: SubworkspaceEntity;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;
}
