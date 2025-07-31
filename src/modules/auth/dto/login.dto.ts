import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class LoginDto {
  @ApiProperty({
    description: "User email",
    type: "string",
    example: "john.doe@example.com",
  })
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  email: string;

  @ApiProperty({
    description: "User password",
    type: "string",
    example: "StrongPassword123!",
  })
  @Transform(({ value }) => value?.trim())
  password: string;
}
