import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { PermissionDto } from "@/modules/permission/dto/permission.dto";
export class RoleDto {
  @Expose()
  @ApiProperty({
    description: "Identifier",
    example: 9,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: "Name of the role",
    example: "Chef",
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Description of the role",
    example: "Administrator role",
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: "Role icon",
    example: "Briefcase",
  })
  icon: string;

  @Expose()
  permissions: PermissionDto[];
}
