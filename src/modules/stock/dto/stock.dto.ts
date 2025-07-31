// src/dto/stock.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductDto } from "@/modules/product/dto/product.dto";

export class StockDto {
  @ApiProperty({ description: "Stock ID" })
  id: number;

  @ApiProperty({ description: "Subworkspace ID" })
  subworkspaceId: number;

  @ApiProperty({ description: "Product ID" })
  productId: number;

  @ApiProperty({ description: "Current quantity in stock" })
  currentQuantity: number;

  @ApiProperty({ description: "Reserved quantity" })
  reservedQuantity: number;

  @ApiPropertyOptional({ description: "Last entry date" })
  lastEntryDate?: Date;

  @ApiPropertyOptional({ description: "Last exit date" })
  lastExitDate?: Date;

  @ApiProperty({ description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  updatedAt: Date;

  @ApiPropertyOptional({ description: "Product details", type: ProductDto })
  product?: ProductDto;
}

export class StockMovementDto {
  @ApiProperty({ description: "Movement ID" })
  id: number;

  @ApiProperty({ description: "Subworkspace ID" })
  subworkspaceId: number;

  @ApiProperty({ description: "Product ID" })
  productId: number;

  @ApiProperty({ description: "User ID who made the movement" })
  userId: number;

  @ApiProperty({
    description: "Movement type",
    enum: ["ENTRY", "EXIT", "ADJUSTMENT", "TRANSFER"],
  })
  movementType: string;

  @ApiProperty({ description: "Quantity moved" })
  quantity: number;

  @ApiPropertyOptional({ description: "Unit cost" })
  unitCost?: number;

  @ApiPropertyOptional({ description: "Total cost" })
  totalCost?: number;

  @ApiPropertyOptional({ description: "Lot number" })
  lotNumber?: string;

  @ApiPropertyOptional({ description: "Expiry date" })
  expiryDate?: Date;

  @ApiPropertyOptional({ description: "Supplier name" })
  supplier?: string;

  @ApiPropertyOptional({ description: "Invoice number" })
  invoiceNumber?: string;

  @ApiPropertyOptional({ description: "Notes" })
  notes?: string;

  @ApiPropertyOptional({ description: "Reference ID for related movements" })
  referenceId?: number;

  @ApiProperty({ description: "Movement creation date" })
  createdAt: Date;

  @ApiPropertyOptional({ description: "Product details", type: ProductDto })
  product?: ProductDto;
}
