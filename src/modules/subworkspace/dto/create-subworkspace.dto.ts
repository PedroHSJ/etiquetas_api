import { ApiProperty } from "@nestjs/swagger";

export class CreateSubworkspaceDto {
  @ApiProperty({
    description: "Name of the subworkspace",
    example: "Development Team",
  })
  name: string;

  @ApiProperty({
    description: "ID of the workspace to which this subworkspace belongs",
    example: 123,
  })
  workspaceId: number;
}
