import { UserEntity } from "@/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkspaceEntity } from "../../workspace/entities/workspace.entity";

@Entity("rel_user_workspace")
export class UserWorkspaceEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({name: "user_id"})
    userId: number;

    @Column({name: "workspace_id"})
    workspaceId: number;

    @ManyToOne(() => UserEntity, (user) => user.userWorkspaces)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.userWorkspaces)
    @JoinColumn({ name: "workspace_id"})
    workspace: WorkspaceEntity;
}