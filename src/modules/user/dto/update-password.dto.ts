import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, Matches } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class UpdatePasswordDto {
  @ApiProperty({
    description: "Current password",
    example: "12345678",
  })
  @IsString({
    message: i18nValidationMessage("events.validation.mustBeString"),
  })
  @IsNotEmpty({
    message: i18nValidationMessage("events.validation.required"),
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: i18nValidationMessage("events.validation.passwordRule"),
    },
  )
  @Expose()
  newPassword: string;
}
