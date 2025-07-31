import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateRoleDto {
  @ApiProperty({
    name: "name",
    example: "Adm",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {
    message: i18nValidationMessage("events.validation.max", {
      max: 255,
    }),
  })
  @Transform(({ value }) => value.trim())
  name: string;
}
