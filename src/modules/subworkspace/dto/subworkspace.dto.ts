import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class SubworkspaceDto {
  @Expose()
  @ApiProperty({
    description: "Unique identifier for the subworkspace",
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: "Name of the subworkspace",
    example: "Development Team",
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Workspace ID to which this subworkspace belongs",
    example: 123,
  })
  workspaceId: number;
}
