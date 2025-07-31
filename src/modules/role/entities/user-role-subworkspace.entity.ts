import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_user_role_subworkspace")
export class UserRoleSubworkspaceEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;
  @Column({ name: "user_id" })
  userId: number;
  @Column({ name: "subworkspace_id" })
  subworkspaceId: number;
  @Column({ name: "role_id" })
  roleId: number;
}
