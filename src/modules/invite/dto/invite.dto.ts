import { InviteStatusEnum } from "@/shared/enums/inviteStatus.enum";
import { WorkspaceDto } from "../../workspace/dto/workspace.dto";
import { Expose, Transform, Type } from "class-transformer";
import { UserDto } from "@/modules/user/dto/user.dto";
import { RoleDto } from "@/modules/role/dto/role.dto";
import { ApiProperty } from "@nestjs/swagger";
import { SubworkspaceDto } from "@/modules/subworkspace/dto/subworkspace.dto";

@Expose()
export class InviteDto {
  @Expose()
  @ApiProperty({
    description: "Unique identifier for the invite",
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: "Email of the user being invited",
    example: "joao@emial.com",
  })
  userEmail: string;

  @Expose()
  @ApiProperty({
    description: "Workspace ID associated with the invite",
    example: 123,
  })
  workspaceId: number;

  @Expose()
  @ApiProperty({
    description: "Subworkspace ID associated with the invite, if applicable",
    example: 456,
    required: false,
  })
  subworkspaceId?: number;

  @Expose()
  @ApiProperty({
    description: "Role ID assigned to the invited user",
    example: 2,
  })
  roleId: number;

  @Expose()
  @ApiProperty({
    description: "Current status of the invitation",
    enum: InviteStatusEnum,
    example: InviteStatusEnum.PENDING,
  })
  status: InviteStatusEnum;

  @Expose()
  @Type(() => WorkspaceDto)
  @ApiProperty({
    description: "Full workspace information",
    type: () => WorkspaceDto,
  })
  workspace: WorkspaceDto;

  @Expose()
  @Type(() => SubworkspaceDto)
  @ApiProperty({
    description: "Subworkspace information if the invite is for a subworkspace",
    type: () => SubworkspaceDto,
    required: false,
  })
  subworkspace?: SubworkspaceDto;

  @Expose()
  @Type(() => RoleDto)
  @ApiProperty({
    description: "Role assigned to the invited user",
    type: () => RoleDto,
  })
  role: RoleDto;

  @Expose()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @ApiProperty({
    description: "Timestamp when the invite was created",
    example: "2023-05-30T12:00:00Z",
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty({
    description: "User who created the invitation",
    type: () => UserDto,
  })
  createdByUser: UserDto;
}
