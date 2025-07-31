import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SendInviteResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Convite enviado com sucesso",
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: "Email that received the invite",
    example: "user@example.com",
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "Workspace ID",
    example: 1,
  })
  @Expose()
  workspaceId: number;

  @ApiProperty({
    description: "Subworkspace ID (if applicable)",
    example: 3,
    required: false,
  })
  @Expose()
  subworkspaceId?: number;
}

export class SendBulkInvitesResponseDto {
  @ApiProperty({
    description: "Overall success message",
    example: "Convites enviados com sucesso",
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: "Number of invites sent successfully",
    example: 2,
  })
  @Expose()
  successCount: number;

  @ApiProperty({
    description: "Number of invites that failed",
    example: 0,
  })
  @Expose()
  failCount: number;

  @ApiProperty({
    description: "Details of each invite sent",
    type: [SendInviteResponseDto],
  })
  @Expose()
  results: SendInviteResponseDto[];
}