import { ApiProperty } from "@nestjs/swagger";
import { PlanDto } from "./plan.dto";

export class PlanItemDto {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the plan item",
  })
  planId: string;

  @ApiProperty({
    example: "Basic Features",
    description: "The name of the plan item",
  })
  description: string;

  @ApiProperty({
    example: "This plan includes basic features such as X, Y, and Z.",
    description: "A brief description of the plan item",
    type: () => PlanDto,
  })
  plan: PlanDto;
}
