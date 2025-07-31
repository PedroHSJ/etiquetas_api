import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
} from "@nestjs/common";
import { SubworkspaceService } from "./subworkspace.service";
import { CreateSubworkspaceDto } from "./dto/create-subworkspace.dto";
import { UpdateSubworkspaceDto } from "./dto/update-subworkspace.dto";
import { SubworkspaceEntity } from "./entities/subworkspace.entity";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiResponse,
} from "@nestjs/swagger";
import { SubworkspaceDto } from "./dto/subworkspace.dto";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { FeaturesEnum } from "@/shared/enums/feature.enum";

@ApiTags("Subworkspace")
@Controller("subworkspace")
export class SubworkspaceController {
  constructor(private readonly subworkspaceService: SubworkspaceService) {}

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Post()
  @ApiOperation({ summary: "Create a new subworkspace" })
  @ApiResponse({
    status: 201,
    description: "Subworkspace created successfully",
    type: SubworkspaceDto,
  })
  async create(
    @Body() dto: CreateSubworkspaceDto,
    @Request() req: Request,
  ): Promise<SubworkspaceDto> {
    return await this.subworkspaceService.create(dto, req.user.id);
  }

  @ApiExcludeEndpoint()
  @Get()
  @ApiOperation({ summary: "List all subworkspaces" })
  async findAll(): Promise<SubworkspaceEntity[]> {
    return this.subworkspaceService.findAll();
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get(":id")
  @ApiOperation({ summary: "Get subworkspace by id" })
  @ApiParam({
    name: "id",
    description: "ID of the subworkspace",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Subworkspace found",
    type: SubworkspaceDto,
  })
  @ApiResponse({
    status: 404,
    description: "Subworkspace not found",
  })
  async findById(@Param("id") id: string): Promise<SubworkspaceDto> {
    return this.subworkspaceService.findOne(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(":id")
  @ApiOperation({ summary: "Update a subworkspace by id" })
  @ApiParam({ name: "id", description: "ID of the subworkspace" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateSubworkspaceDto,
  ): Promise<SubworkspaceDto> {
    return this.subworkspaceService.update(+id, dto);
  }

  @ApiExcludeEndpoint()
  @Delete(":id")
  @ApiOperation({ summary: "Delete a subworkspace by id" })
  @ApiParam({ name: "id", description: "ID of the subworkspace" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.subworkspaceService.remove(+id);
  }

  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @Get("list-by-workspace/:workspaceId")
  @ApiOperation({ summary: "List subworkspaces by workspace ID" })
  @ApiParam({
    name: "workspaceId",
    description: "ID of the workspace to list subworkspaces for",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "List of subworkspaces for the specified workspace",
    type: SubworkspaceDto,
    isArray: true,
  })
  async listByWorkspaceId(
    @Request() req: Request,
    @Param("workspaceId") workspaceId: string,
  ): Promise<SubworkspaceDto[]> {
    return this.subworkspaceService.listByWorkspaceId(
      +workspaceId,
      req.user.id,
    );
  }
}
