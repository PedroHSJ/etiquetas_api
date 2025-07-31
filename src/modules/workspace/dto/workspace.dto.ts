import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { SubworkspaceDto } from "@/modules/subworkspace/dto/subworkspace.dto";
import { UserWorkspaceDto } from "@/modules/user-workspace/dto/user-workspace.dto";
import { BaseDto } from "@/shared/dto/base.dto";

export class WorkspaceDto extends BaseDto {
  @ApiProperty({
    description: "Name of the workspace",
    example: "Workspace 1",
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "Status of the workspace",
    example: true,
    readOnly: true,
  })
  @Expose()
  active: boolean;

  @ApiProperty({
    description: "Creation date of the record",
    readOnly: true,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: "List of subworkspaces",
    type: SubworkspaceDto,
    isArray: true,
  })
  @Expose()
  @Type(() => SubworkspaceDto)
  subworkspaces?: SubworkspaceDto[];

  @ApiProperty({
    description: "List of user workspaces",
    type: UserWorkspaceDto,
    isArray: true,
  })
  @Expose()
  @Type(() => UserWorkspaceDto)
  userWorkspaces?: UserWorkspaceDto[];
}
