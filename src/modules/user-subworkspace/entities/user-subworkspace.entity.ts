import { SubworkspaceEntity } from "@/modules/subworkspace/entities/subworkspace.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";

@Entity("rel_user_subworkspace")
export class UserSubworkspaceEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "subworkspace_id" })
  subworkspaceId: number;

  @ManyToOne(
    () => SubworkspaceEntity,
    (subworkspace) => subworkspace.userSubworkspaces,
  )
  @JoinColumn({ name: "subworkspace_id" })
  subworkspace: Relation<SubworkspaceEntity>;
}
