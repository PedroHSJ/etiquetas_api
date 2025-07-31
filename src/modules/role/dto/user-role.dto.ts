import { WorkspaceDto } from "@/modules/workspace/dto/workspace.dto";
import { RoleDto } from "./role.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Expose()
export class UserRoleDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  roleId: number;

  @ApiProperty()
  workspaceId: number;

  @Expose()
  @ApiProperty()
  role: RoleDto;

  @ApiProperty()
  @Expose()
  workspace: WorkspaceDto;
}
