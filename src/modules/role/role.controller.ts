import { Controller, Get, Post, Body } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Public } from "@/shared/helpers/decorators/public.decorator";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { Request } from "@nestjs/common";
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import {
  ApiArrayResponseDto,
  IApiResponse,
} from "@/shared/dto/apiResponse.dto";
import { RoleDto } from "./dto/role.dto";
import { UserRoleDto } from "./dto/user-role.dto";
import { ApiResponseArrayWrapper } from "@/shared/helpers/decorators/api-response.decorator";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: "List all roles by user id",
    description: "List all roles by user id",
  })
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("/list/user-role")
  async listUserRolesByUserId(
    @Request() req: Request,
  ): Promise<IApiResponse<UserRoleDto[]>> {
    return await this.roleService.listUserRolesByUserId(req.user.id);
  }

  @ApiOperation({
    summary: "List all roles",
    description: "List all roles",
  })
  @ApiOkResponse({
    description: "List all roles",
    type: RoleDto,
    isArray: true,
  })
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("/list")
  async listAll(): Promise<RoleDto[]> {
    return await this.roleService.listAll();
  }
}
