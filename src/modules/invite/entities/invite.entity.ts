import { RoleEntity } from "@/modules/role/entities/role.entity";
import { SubworkspaceEntity } from "@/modules/subworkspace/entities/subworkspace.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { WorkspaceEntity } from "@/modules/workspace/entities/workspace.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import { InviteStatusEnum } from "@/shared/enums/inviteStatus.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("tb_invite")
export class InviteEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "user_email" })
  email: string;

  @Column({ name: "workspace_id" })
  workspaceId: number;

  @Column({ name: "subworkspace_id", nullable: true })
  subworkspaceId?: number;

  @Column({ name: "role_id" })
  roleId: number;

  @Column({
    type: "enum",
    enum: InviteStatusEnum,
    default: InviteStatusEnum.PENDING,
    name: "status",
  })
  status: InviteStatusEnum;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.invites)
  @JoinColumn({
    name: "workspace_id",
    referencedColumnName: "id",
  })
  workspace: WorkspaceEntity;

  @ManyToOne(() => SubworkspaceEntity, (subworkspace) => subworkspace.id, {
    nullable: true,
  })
  @JoinColumn({
    name: "subworkspace_id",
    referencedColumnName: "id",
  })
  subworkspace?: SubworkspaceEntity;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({
    name: "role_id",
    referencedColumnName: "id",
  })
  role: RoleEntity;

  @Column({ name: "created_by", type: "int", nullable: true })
  createdBy: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: "created_by",
    referencedColumnName: "id",
  })
  createdByUser: UserEntity;
}
