import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { InviteService } from "./invite.service";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { InviteDto } from "./dto/invite.dto";
import { SendInviteDto } from "./dto/send-invite.dto";
import {
  SendBulkInvitesResponseDto,
  SendInviteResponseDto,
} from "./dto/send-invite-response.dto";
import { SendBulkInvitesDto } from "./dto/send-bulk-invites.dto";

@ApiTags("Invite")
@Controller("invite")
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @ApiResponse({
    status: 200,
    description: "List of pending invites retrieved successfully.",
    type: InviteDto,
    isArray: true,
  })
  @ApiOperation({
    summary: "List pending invites",
    description: "Retrieves a list of all pending invites.",
  })
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("list-pending")
  async listPendingInvites(@Request() req: Request) {
    return this.inviteService.listPendingInvites(req.user.email);
  }

  @ApiOperation({
    summary: "Accept invite",
    description: "Accepts an invite using the invite ID and user ID.",
  })
  @ApiOkResponse({
    description: "Invite accepted successfully.",
  })
  @ApiBadRequestResponse({
    description: "Bad request, possibly due to invalid invite ID or user ID.",
  })
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post("accept-invite/:inviteId")
  async acceptInvite(
    @Request() req: Request,
    @Param("inviteId") inviteId: string,
  ): Promise<void> {
    await this.inviteService.acceptInvite(+inviteId, req.user.id);
  }

  @ApiOperation({
    summary: "Reject invite",
    description: "Rejects an invite using the invite ID and user ID.",
  })
  @ApiOkResponse({
    description: "Invite rejected successfully.",
  })
  @ApiBadRequestResponse({
    description: "Bad request, possibly due to invalid invite ID or user ID.",
  })
  @Post("reject-invite/:inviteId")
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  async rejectInvite(
    @Request() req: Request,
    @Param("inviteId") inviteId: string,
  ): Promise<void> {
    await this.inviteService.rejectInvite(+inviteId, req.user.id);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post("send")
  @ApiOperation({
    summary: "Send invite to user",
    description:
      "Send an invitation to a user to join a workspace or subworkspace",
  })
  @ApiBody({
    type: SendInviteDto,
    description: "Invite details",
    examples: {
      workspaceInvite: {
        summary: "Invite to workspace only",
        value: {
          email: "user@example.com",
          workspaceId: 1,
          roleId: 2,
        },
      },
      subworkspaceInvite: {
        summary: "Invite to workspace and subworkspace",
        value: {
          email: "user@example.com",
          workspaceId: 1,
          roleId: 2,
          subworkspaceId: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Invite sent successfully",
    type: SendInviteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - validation errors",
  })
  @ApiResponse({
    status: 409,
    description: "Conflict - user already invited or in workspace",
  })
  async sendInvite(
    @Body() sendInviteDto: SendInviteDto,
    @Request() req: Request,
  ): Promise<SendInviteResponseDto> {
    return this.inviteService.sendInvite(sendInviteDto, req.user.id);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post("send-bulk")
  @ApiOperation({
    summary: "Send multiple invites",
    description: "Send multiple invitations at once to different users",
  })
  @ApiBody({
    type: SendBulkInvitesDto,
    description: "Bulk invite details",
    examples: {
      bulkInvites: {
        summary: "Multiple invites example",
        value: {
          invites: [
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
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Bulk invites processed",
    type: SendBulkInvitesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - validation errors",
  })
  async sendBulkInvites(
    @Body() sendBulkInvitesDto: SendBulkInvitesDto,
    @Request() req: Request,
  ): Promise<SendBulkInvitesResponseDto> {
    return this.inviteService.sendBulkInvites(sendBulkInvitesDto, req.user.id);
  }
}
