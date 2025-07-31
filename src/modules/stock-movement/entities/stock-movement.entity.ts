import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { SubworkspaceEntity } from "../../subworkspace/entities/subworkspace.entity";
import { Product } from "../../product/entities/product.entity";
import { UserEntity } from "../../user/entities/user.entity";

export enum MovementType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
  ADJUSTMENT = "ADJUSTMENT",
  TRANSFER = "TRANSFER",
}

@Entity("stock_movements")
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "subworkspace_id" })
  subworkspaceId: number;

  @Column({ name: "product_id" })
  productId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ type: "enum", enum: MovementType, name: "movement_type" })
  movementType: MovementType;

  @Column({ type: "decimal", precision: 10, scale: 3 })
  quantity: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    name: "unit_cost",
  })
  unitCost: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    name: "total_cost",
  })
  totalCost: number;

  @Column({ length: 100, nullable: true, name: "lot_number" })
  lotNumber: string;

  @Column({ type: "date", nullable: true, name: "expiry_date" })
  expiryDate: Date;

  @Column({ length: 200, nullable: true })
  supplier: string;

  @Column({ length: 100, nullable: true, name: "invoice_number" })
  invoiceNumber: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ nullable: true, name: "reference_id" })
  referenceId: number;

  @Column({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => SubworkspaceEntity, { lazy: true })
  @JoinColumn({ name: "subworkspace_id" })
  subworkspace: Promise<SubworkspaceEntity>;

  @ManyToOne(() => Product, { lazy: true })
  @JoinColumn({ name: "product_id" })
  product: Promise<Product>;

  @ManyToOne(() => UserEntity, { lazy: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<UserEntity>;
}
