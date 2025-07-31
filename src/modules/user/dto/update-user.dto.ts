import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: "Flag indicating if the user has completed onboarding",
    example: true,
    required: false,
  })
  @IsBoolean()
  onboardingCompleted?: boolean;
}
