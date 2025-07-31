import { Exclude } from "class-transformer";
import { UserFeatureLimitEntity } from "@/modules/feature/entities/user-feature-limit.entity";
import { UserRoleWorkspaceEntity } from "@/modules/role/entities/user-role-workspace.entity";
import { UserWorkspaceEntity } from "@/modules/user-workspace/entities/user-workspace.entity";
import { BaseEntity } from "@/shared/entities/base.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity("tb_user")
export class UserEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 14,
    unique: true,
    nullable: true,
  })
  cpf: string;

  @Column({
    name: "onboarding_completed",
    type: "boolean",
    default: false,
  })
  onboardingCompleted: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  picture: string;

  @Column({ name: "google_login", type: "boolean", default: false })
  isGoogleLogin: boolean;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({ name: "token", type: "varchar", length: 255 })
  token: string;

  @Column({ name: "token_expiration", type: "timestamp" })
  tokenExpires: Date;

  @OneToMany(() => UserRoleWorkspaceEntity, (userRole) => userRole.user)
  userRoles: UserRoleWorkspaceEntity[];

  @OneToMany(() => UserWorkspaceEntity, (userWorkspace) => userWorkspace.user)
  userWorkspaces: UserWorkspaceEntity[];

  @OneToMany(
    () => UserFeatureLimitEntity,
    (userFeatureLimit) => userFeatureLimit.user,
  )
  featureLimits: UserFeatureLimitEntity[];

  @Column({ name: "active", type: "boolean", default: true })
  active: boolean;
}
