import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "@/shared/entities/base.entity";
import { WorkspaceEntity } from "@/modules/workspace/entities/workspace.entity";
import { UserSubworkspaceEntity } from "@/modules/user-subworkspace/entities/user-subworkspace.entity";

@Entity("tb_subworkspace")
export class SubworkspaceEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.subworkspaces, {
    nullable: false,
  })
  @JoinColumn({ name: "workspace_id" })
  workspace: WorkspaceEntity;

  @Column({ name: "workspace_id", nullable: false })
  workspaceId: number;

  @OneToMany(
    () => UserSubworkspaceEntity,
    (userSubws) => userSubws.subworkspace,
  )
  userSubworkspaces: UserSubworkspaceEntity[];
}
