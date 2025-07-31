import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { SendInviteDto } from "./send-invite.dto";

export class SendBulkInvitesDto {
  @ApiProperty({
    description: "Array of invites to send",
    type: [SendInviteDto],
    example: [
      {
        email: "user1@example.com",
        workspaceId: 1,
        roleId: 2,
        subworkspaceId: 3,
      },
      {
        email: "user2@example.com",
        workspaceId: 1,
        roleId: 2,
      },
    ],
  })
  @IsArray({ message: "Convites deve ser um array" })
  @ArrayMinSize(1, { message: "Pelo menos um convite deve ser enviado" })
  @ValidateNested({ each: true })
  @Type(() => SendInviteDto)
  invites: SendInviteDto[];
}