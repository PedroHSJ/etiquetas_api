import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseDto } from "@/shared/dto/base.dto";

export class UserWorkspaceDto extends BaseDto {
  @ApiProperty({
    description: "Id of the user for relationship",
    example: "111",
  })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  userId: number;

  @ApiProperty({
    description: "Id of the workspace for relationship",
    example: "222",
  })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  workspaceId: number;
}
