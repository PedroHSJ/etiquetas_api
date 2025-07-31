import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("TB_SETTINGS")
export class ConfigurationEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "key", length: 255, nullable: false })
  key: string;

  @Column({ name: "value", type: "text", nullable: false })
  value: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({ name: "active", type: "boolean", default: true })
  active: boolean;
}
