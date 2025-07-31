import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class SendInviteDto {
  @ApiProperty({
    description: "Email of the user to invite",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Email deve ser válido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email: string;

  @ApiProperty({
    description: "ID of the workspace to invite user to",
    example: 1,
  })
  @IsNumber({}, { message: "ID do workspace deve ser um número" })
  @Min(1, { message: "ID do workspace deve ser maior que 0" })
  workspaceId: number;

  @ApiProperty({
    description: "ID of the role to assign to the user",
    example: 2,
  })
  @IsNumber({}, { message: "ID da role deve ser um número" })
  @Min(1, { message: "ID da role deve ser maior que 0" })
  roleId: number;

  @ApiProperty({
    description: "ID of the subworkspace (UAN) to invite user to",
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "ID do subworkspace deve ser um número" })
  @Min(1, { message: "ID do subworkspace deve ser maior que 0" })
  subworkspaceId?: number;
}