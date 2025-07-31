import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { RoleEntity } from "@/modules/role/entities/role.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { WorkspaceEntity } from "@/modules/workspace/entities/workspace.entity";

@Entity("tb_user_role_workspace")
export class UserRoleWorkspaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "role_id" })
  roleId: number;

  @Column({ name: "workspace_id" })
  workspaceId: number;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.userRoles)
  @JoinColumn({ name: "workspace_id" })
  workspace: WorkspaceEntity;
}
