// src/controllers/stock.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UserEntity } from "../user/entities/user.entity";
import { StockService } from "./stock.service";
import {
  CreateStockEntryDto,
  StockEntryResponseDto,
} from "./dto/create-stock-entry.dto";
import { StockDto, StockMovementDto } from "./dto/stock.dto";
import { Stock } from "./entities/stock.entity";
import { StockMovement } from "../stock-movement/entities/stock-movement.entity";

@ApiTags("Stock")
@Controller("stock")
@ApiBearerAuth()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post("entry")
  @ApiOperation({
    summary: "Create stock entry",
    description: "Register a new stock entry with multiple products",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Stock entry created successfully",
    type: StockEntryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  async createStockEntry(
    @Body() createStockEntryDto: CreateStockEntryDto,
    @Request() req: Request,
  ): Promise<StockEntryResponseDto> {
    return this.stockService.createStockEntry(createStockEntryDto, req.user.id);
  }

  @Get("subworkspace/:subworkspaceId")
  @ApiOperation({
    summary: "Get stock by subworkspace",
    description: "Retrieve current stock levels for a specific subworkspace",
  })
  @ApiParam({
    name: "subworkspaceId",
    type: Number,
    description: "The subworkspace ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Stock data retrieved successfully",
    type: Stock,
    isArray: true,
  })
  async getStockBySubworkspace(
    @Param("subworkspaceId", ParseIntPipe) subworkspaceId: number,
  ): Promise<Stock[]> {
    return this.stockService.getStockBySubworkspace(subworkspaceId);
  }

  @Get("movements/:subworkspaceId")
  @ApiOperation({
    summary: "Get stock movements",
    description: "Retrieve stock movement history for a specific subworkspace",
  })
  @ApiParam({
    name: "subworkspaceId",
    type: Number,
    description: "The subworkspace ID",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of records to return (default: 50)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Stock movements retrieved successfully",
    type: StockMovement,
    isArray: true,
  })
  async getStockMovements(
    @Param("subworkspaceId", ParseIntPipe) subworkspaceId: number,
    @Query("limit") limit?: number,
  ): Promise<StockMovement[]> {
    return this.stockService.getStockMovements(subworkspaceId, limit);
  }
}
