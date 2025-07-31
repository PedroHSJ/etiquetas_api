import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Request,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExcludeController,
} from "@nestjs/swagger";
import { Paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { UserDto } from "./dto/user.dto";
import { Public } from "@/shared/helpers/decorators/public.decorator";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { ScopesEnum } from "@/shared/enums/scopes.enum";

@ApiHeader({
  name: "Accept-Language",
  description: "Language",
  example: "pt-br",
})
@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<UserDto>> {
    return await this.userService.create(createUserDto);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("list-by-email/:email")
  async listByEmail(
    @Param("email") email: string,
  ): Promise<IApiResponse<UserDto[]>> {
    return await this.userService.listByEmail(email);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("list-by-workspace-owner/:workspaceId/:ownerId")
  @ApiOperation({ summary: "List users by workspace owner" })
  @ApiParam({
    name: "workspaceId",
    description: "ID of the workspace",
    type: Number,
  })
  @ApiParam({
    name: "ownerId",
    description: "ID of the workspace owner",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "List of users by workspace owner",
    type: () => UserDto,
    isArray: true,
  })
  async listByWorkspaceOwner(
    @Param("workspaceId") workspaceId: string,
    @Param("ownerId") ownerId: string,
  ): Promise<IApiResponse<UserDto[]>> {
    return await this.userService.listByWorkspaceOwner(+workspaceId, +ownerId);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("list-by-subworkspace-id/:subworkspaceId")
  @ApiOperation({ summary: "List users by subworkspace ID" })
  @ApiParam({
    name: "subworkspaceId",
    description: "ID of the subworkspace",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "List of users by subworkspace ID",
    type: () => UserDto,
    isArray: true,
  })
  async listBySubworkspaceId(
    @Param("subworkspaceId") subworkspaceId: number,
  ): Promise<UserDto[]> {
    return this.userService.listBySubworkspaceId(+subworkspaceId);
  }

  // @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.USER_LIST])
  // @Get()
  // @ApiOperation({ summary: "Get all users" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Return all users",
  //   type: () => UserDto,
  // })
  // @ApiBadRequestResponse({ description: "Bad request" })
  // async findAll(): Promise<IApiResponse<UserDto[]>> {
  //   return await this.userService.listAll();
  // }

  // @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.USER_LIST])
  // @Get("paginate")
  // @ApiOperation({ summary: "Get all paginated users" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Return all paginated users",
  //   type: () => UserDto,
  // })
  // @ApiResponse({ status: 400, description: "Bad request" })
  // async findAllPaginated(
  //   @Paginate() query: PaginateQuery,
  // ): Promise<Paginated<UserDto>> {
  //   return await this.userService.listAllPaginated(query);
  // }

  // @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.USER_LIST])
  // @Get(":id")
  // @ApiOperation({ summary: "Get a user by ID" })
  // @ApiParam({ name: "id", description: "ID of the user" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Return the user",
  // })
  // @ApiResponse({ status: 404, description: "User not found" })
  // async findOne(@Param("id") id: string): Promise<IApiResponse<UserDto>> {
  //   return await this.userService.findById(+id);
  // }

  // @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.USER_LIST])
  // @Patch(":id")
  // @ApiOperation({ summary: "Update a user by ID" })
  // @ApiParam({ name: "id", description: "ID of the user" })
  // @ApiResponse({
  //   status: 200,
  //   description: "User updated successfully",
  // })
  // @ApiResponse({ status: 400, description: "Bad request" })
  // @ApiResponse({ status: 404, description: "User not found" })
  // @ApiBody({ type: UpdateUserDto })
  // async update(
  //   @Param("id") id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<IApiResponse<UserDto>> {
  //   return await this.userService.update(+id, updateUserDto);
  // }

  // @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.USER_LIST])
  // @Delete(":id")
  // @ApiOperation({ summary: "Delete a user by id" })
  // @ApiParam({ name: "id", description: "Id of the user" })
  // @ApiResponse({
  //   status: 200,
  //   description: "User deleted successfully",
  // })
  // @ApiNotFoundResponse({ description: "User not found" })
  // async remove(@Param("id") id: string): Promise<IApiResponse<void>> {
  //   return await this.userService.remove(+id);
  // }
}
