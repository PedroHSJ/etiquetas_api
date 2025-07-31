import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRoleWorkspaceEntity } from "./user-role-workspace.entity";
import { PermissionEntity } from "@/modules/permission/entities/permission.entity";

@Entity("tb_role")
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "text" })
  name: string;

  @Column({ name: "description", length: 255 })
  description: string;

  @Column({ name: "icon", length: 255, nullable: true })
  icon: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "active",
    type: "boolean",
    default: true,
  })
  active: boolean;

  @OneToMany(() => UserRoleWorkspaceEntity, (userRole) => userRole.role)
  userRoles: UserRoleWorkspaceEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.role)
  permissions: PermissionEntity[];
}
