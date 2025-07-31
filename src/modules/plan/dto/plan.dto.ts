import { ApiProperty } from "@nestjs/swagger";
import { PlanItemDto } from "./plan-item.dto";
import { PlanPriceDto } from "./plan-price.dto";

export class PlanDto {
  @ApiProperty({
    example: "Free Plan",
    description: "The name of the plan",
  })
  name: string;

  @ApiProperty({
    example: "This is a free plan with basic features.",
    description: "A brief description of the plan",
  })
  description: string;

  @ApiProperty({
    type: () => PlanItemDto,
    isArray: true,
  })
  planItems: PlanItemDto[];

  @ApiProperty({
    type: () => PlanPriceDto,
    isArray: true,
  })
  planPrices: PlanPriceDto[];
}
