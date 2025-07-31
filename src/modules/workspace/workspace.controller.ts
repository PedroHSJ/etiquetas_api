import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
} from "@nestjs/common";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { WorkspaceDto } from "./dto/workspace.dto";
import { WorkspaceService } from "./workspace.service";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { Paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";

@ApiHeader({
  name: "Accept-Language",
  description: "Language",
  example: "pt-br",
})
@ApiTags("Workspace")
@Controller("workspace")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post()
  @ApiOperation({ summary: "Create a new workspace" })
  @ApiResponse({
    status: 201,
    description: "Workspace created successfully",
    type: () => WorkspaceDto,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Request() req: Request,
  ): Promise<WorkspaceDto> {
    return await this.workspaceService.create({
      ...createWorkspaceDto,
      createdBy: req.user.id,
    });
  }

  @ApiExcludeEndpoint()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get()
  @ApiOperation({ summary: "Get all workspaces" })
  @ApiResponse({
    status: 200,
    description: "Return all workspaces",
    type: () => WorkspaceDto,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  async listAll(
    @Request() req: Request,
  ): Promise<IApiResponse<WorkspaceDto[]>> {
    return await this.workspaceService.listAll(req.user.id);
  }

  @ApiOperation({ summary: "List workspaces by user ID" })
  @ApiResponse({
    status: 200,
    description: "Return workspaces by user ID",
    type: () => WorkspaceDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiNotFoundResponse({ description: "User not found" })
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("/list-by-user-id")
  async listByUserId(@Request() req: Request): Promise<WorkspaceDto[]> {
    console.log("Listing workspaces for user ID:", req.user);
    return await this.workspaceService.listByUserId(req.user.id);
  }

  @ApiExcludeEndpoint()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("paginate")
  @ApiOperation({ summary: "Get all paginated workspaces" })
  @ApiResponse({
    status: 200,
    description: "Return all paginated workspaces",
    type: () => WorkspaceDto,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  async listAllPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<WorkspaceDto>> {
    return await this.workspaceService.listAllPaginated(query);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get(":id")
  @ApiOperation({ summary: "Get workspace by id" })
  @ApiParam({ name: "id", description: "ID of the workspace", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Return the workspace",
    type: () => WorkspaceDto,
  })
  @ApiNotFoundResponse({ description: "Workspace not found" })
  async findById(@Param("id") id: string): Promise<WorkspaceDto> {
    return await this.workspaceService.findById(+id);
  }

  @ApiExcludeEndpoint()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Patch(":id")
  @ApiOperation({ summary: "Update a workspace by id" })
  @ApiParam({
    name: "id",
    description: "ID of the workspace",
  })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiNotFoundResponse({ description: "Workspace not found" })
  @ApiBody({ type: UpdateWorkspaceDto })
  async update(
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<IApiResponse<WorkspaceDto>> {
    return await this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @ApiExcludeEndpoint()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Delete(":id")
  @ApiOperation({ summary: "Delete a workspace by id" })
  @ApiParam({ name: "id", description: "ID of the workspace" })
  @ApiResponse({
    status: 200,
    description: "Workspace deleted successfully",
  })
  @ApiNotFoundResponse({ description: "Workspace not found" })
  async remove(@Param("id") id: string): Promise<IApiResponse<void>> {
    return await this.workspaceService.remove(+id);
  }
}
