import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

@Exclude()
export class CreateWorkspaceDto {
  @ApiProperty({
    description: "Name of the workspace",
    example: "Workspace 1",
  })
  @IsString({
    message: i18nValidationMessage("events.validation.mustBeString"),
  })
  @IsNotEmpty({
    message: i18nValidationMessage("events.validation.required"),
  })
  @MaxLength(255, {
    message: i18nValidationMessage("events.validation.max", {
      max: 255,
    }),
  })
  @MinLength(3, {
    message: i18nValidationMessage("events.validation.min", {
      min: 3,
    }),
  })
  @Transform(({ value }) => value.trim())
  @Expose()
  name: string;

  @ApiProperty({
    description: "ID of the user who created the workspace",
    example: 1,
    readOnly: true,
  })
  createdBy: number;
}
