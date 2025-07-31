import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ProductGroupDto } from "./product.dto";

export class ProductSubgroupDto {
  @ApiProperty({ description: "Product subgroup ID" })
  @Expose()
  id: number;

  @ApiProperty({ description: "Product group ID" })
  @Expose()
  productGroupId: number;

  @ApiProperty({ description: "Product subgroup name" })
  @Expose()
  name: string;

  @ApiPropertyOptional({ description: "Product subgroup description" })
  @Expose()
  description?: string;

  @ApiProperty({ description: "Whether the subgroup is active" })
  @Expose()
  active: boolean;

  @ApiProperty({ description: "Creation date" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "Product group",
    type: () => ProductGroupDto,
  })
  @Expose()
  @Type(() => ProductGroupDto)
  productGroup?: ProductGroupDto;
}
