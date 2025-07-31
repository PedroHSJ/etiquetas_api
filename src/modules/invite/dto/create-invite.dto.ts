import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateInviteDto {
  @ApiProperty({ description: "Email do usuário a ser convidado" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "ID do workspace" })
  @IsInt()
  @IsNotEmpty()
  workspaceId: number;

  @ApiPropertyOptional({ description: "ID do subworkspace (opcional)" })
  @IsInt()
  @IsOptional()
  subworkspaceId?: number;

  @ApiProperty({ description: "ID da Role a ser atribuída" })
  @IsInt()
  @IsNotEmpty()
  roleId: number;
}
