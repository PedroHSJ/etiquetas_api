import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateUserDto {
  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
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
  name: string;

  @ApiProperty({
    description: "Email of the user",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsNotEmpty({
    message: i18nValidationMessage("events.validation.required"),
  })
  @MaxLength(255, {
    message: i18nValidationMessage("events.validation.max"),
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  // @ApiProperty({
  //   description: "CPF of the user",
  //   example: "12345678900",
  // })
  // @IsString()
  // @IsOptional()
  // @MaxLength(11)
  // @MinLength(11)
  // @Transform(({ value }) => value?.trim())
  // cpf?: string;

  @ApiPropertyOptional({
    description: "Picture of the user",
    example: "https://example.com/picture.jpg",
    required: false,
  })
  @ValidateIf((o) => o.picture !== undefined)
  @IsString({
    message: i18nValidationMessage("events.validation.mustBeString"),
  })
  @IsOptional()
  picture: string;

  @ApiProperty({
    description: "Password of the user",
    example: "StrongPassword123!",
  })
  @IsString({
    message: i18nValidationMessage("events.validation.mustBeString"),
  })
  @IsNotEmpty({
    message: i18nValidationMessage("events.validation.required"),
  })
  @MinLength(8, {
    message: i18nValidationMessage("events.validation.min"),
  })
  @MaxLength(255, {
    message: i18nValidationMessage("events.validation.max"),
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
    {
      message: i18nValidationMessage("events.validation.passwordRule"),
    },
  )
  password: string;

  @ApiHideProperty()
  isGoogleLogin: boolean;
}
