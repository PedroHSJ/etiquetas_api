import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("units")
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10 })
  abbreviation: string;

  @Column({ length: 50 })
  type: string; // weight, volume, quantity

  @Column({ default: true })
  active: boolean;

  @Column({ name: "created_at" })
  createdAt: Date;
}
