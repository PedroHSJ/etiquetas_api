import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserWorkspaceEntity } from "../../user-workspace/entities/user-workspace.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import { UserRoleWorkspaceEntity } from "@/modules/role/entities/user-role-workspace.entity";
import { InviteEntity } from "@/modules/invite/entities/invite.entity";
import { SubworkspaceEntity } from "@/modules/subworkspace/entities/subworkspace.entity";

@Entity("tb_workspace")
export class WorkspaceEntity extends BaseEntity {
  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  name: string;

  @OneToMany(
    () => UserWorkspaceEntity,
    (userWorkspace) => userWorkspace.workspace,
  )
  userWorkspaces: UserWorkspaceEntity[];

  @OneToMany(() => UserRoleWorkspaceEntity, (userRole) => userRole.workspace)
  userRoles: UserRoleWorkspaceEntity[];

  @OneToMany(() => InviteEntity, (workspaceInvite) => workspaceInvite.workspace)
  invites: InviteEntity[];

  @OneToMany(() => SubworkspaceEntity, (subworkspace) => subworkspace.workspace)
  subworkspaces: SubworkspaceEntity[];
}
