// src/dto/create-stock-entry.dto.ts (atualizado)
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { StockMovementDto } from "./stock.dto";
import { Type } from "class-transformer";

export class StockEntryItemDto {
  @ApiProperty({ description: "Product ID" })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: "Quantity to add to stock" })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ description: "Unit cost of the product" })
  @IsNumber()
  @IsOptional()
  unitCost?: number;

  @ApiPropertyOptional({ description: "Lot number" })
  @IsString()
  @IsOptional()
  lotNumber?: string;

  @ApiPropertyOptional({ description: "Expiry date (YYYY-MM-DD)" })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({ description: "Notes for this item" })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateStockEntryDto {
  @ApiProperty({ description: "Subworkspace ID" })
  @IsNumber()
  subworkspaceId: number;

  @ApiPropertyOptional({ description: "Supplier name" })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional({ description: "Invoice number" })
  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @ApiPropertyOptional({ description: "General notes for this entry" })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: "List of items to add to stock",
    type: [StockEntryItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => StockEntryItemDto)
  items: StockEntryItemDto[];
}

export class StockEntryResponseDto {
  @ApiProperty({ description: "Whether the operation was successful" })
  success: boolean;

  @ApiProperty({
    description: "Created stock movements",
    type: [StockMovementDto],
  })
  movements: StockMovementDto[];
}
