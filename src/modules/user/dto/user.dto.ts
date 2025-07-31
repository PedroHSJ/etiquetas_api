import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { Exclude, Expose, Transform } from "class-transformer";
import { BaseDto } from "@/shared/dto/base.dto";
import { UserRoleDto } from "@/modules/role/dto/user-role.dto";

export class UserDto extends BaseDto {
  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "Email of the user",
    example: "john.doe@example.com",
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "Flag indicating if the user has completed onboarding",
    example: true,
  })
  @Expose()
  onboardingCompleted: boolean;

  @ApiProperty({
    description: "Picture of the user",
    example: "https://example.com/picture.jpg",
  })
  @Expose()
  picture: string;

  @Exclude()
  isGoogleLogin: boolean;

  @Exclude()
  password: string;

  @ApiProperty({
    description: "Roles associated with the user",
    type: UserRoleDto,
    isArray: true,
  })
  @Expose()
  userRoles: UserRoleDto[];
}
