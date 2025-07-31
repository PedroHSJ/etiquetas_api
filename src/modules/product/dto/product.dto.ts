import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsHexColor,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { ProductSubgroupDto } from "./product-subgroup.dto";
export enum OrigemDados {
  MANUAL = "MANUAL",
  ANVISA = "ANVISA",
  OPEN_FOOD_FACTS = "OPEN_FOOD_FACTS",
}
export class UnitDto {
  @ApiProperty({ description: "Unit ID" })
  @Expose()
  id: number;

  @ApiProperty({ description: "Unit name" })
  @Expose()
  name: string;

  @ApiProperty({ description: "Unit abbreviation" })
  @Expose()
  abbreviation: string;

  @ApiProperty({ description: "Unit type (weight, volume, quantity)" })
  @Expose()
  type: string;

  @ApiProperty({ description: "Whether the unit is active" })
  @Expose()
  active: boolean;

  @ApiProperty({ description: "Creation date" })
  @Expose()
  createdAt: Date;
}

export class ProductGroupDto {
  @ApiProperty({ description: "Product group ID" })
  @Expose()
  id: number;

  @ApiProperty({ description: "Product group name" })
  @Expose()
  name: string;

  @ApiPropertyOptional({ description: "Product group description" })
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: "Product group color (hex)" })
  @Expose()
  color?: string;

  @ApiPropertyOptional({ description: "Product group icon name" })
  @Expose()
  icon?: string;

  @ApiProperty({ description: "Whether the group is active" })
  @Expose()
  active: boolean;

  @ApiProperty({ description: "Creation date" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "Product subgroups",
    type: () => ProductSubgroupDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ProductSubgroupDto)
  subgroups?: ProductSubgroupDto[];
}

export class ProductDto {
  @ApiProperty({ description: "Product ID" })
  @Expose()
  id: number;

  @ApiProperty({ description: "Product name" })
  @Expose()
  name: string;

  @ApiPropertyOptional({ description: "Product description" })
  @Expose()
  description?: string;

  @ApiProperty({ description: "Product subgroup ID" })
  @Expose()
  productSubgroupId: number;

  @ApiProperty({ description: "Default unit ID" })
  @Expose()
  defaultUnitId: number;

  @ApiPropertyOptional({ description: "Product image URL" })
  @Expose()
  imageUrl?: string;

  @ApiProperty({ description: "Whether the product is active" })
  @Expose()
  active: boolean;

  @ApiProperty({ description: "Creation date" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "Product subgroup",
    type: () => ProductSubgroupDto,
  })
  @Expose()
  @Type(() => ProductSubgroupDto)
  productSubgroup?: ProductSubgroupDto;

  @ApiPropertyOptional({ description: "Default unit", type: UnitDto })
  @Expose()
  @Type(() => UnitDto)
  defaultUnit?: UnitDto;
}

export class CreateProductDto {
  @ApiProperty({ description: "Product name" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: "Product description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Product subgroup ID" })
  @IsNumber()
  productSubgroupId: number;

  @ApiProperty({ description: "Default unit ID" })
  @IsNumber()
  defaultUnitId: number;

  @ApiPropertyOptional({ description: "Product SKU" })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: "Product barcode" })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: "Minimum stock level" })
  @IsOptional()
  @IsNumber()
  minimumStock?: number;

  @ApiPropertyOptional({ description: "Maximum stock level" })
  @IsOptional()
  @IsNumber()
  maximumStock?: number;

  @ApiPropertyOptional({ description: "Cost price" })
  @IsOptional()
  @IsNumber()
  costPrice?: number;
}
