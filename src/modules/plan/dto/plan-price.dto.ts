import { ApiProperty } from "@nestjs/swagger";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";

export class PlanPriceDto {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the plan price",
  })
  planId: number;

  @ApiProperty({
    example: 9.99,
    description: "The price of the plan",
  })
  price: number;

  @ApiProperty({
    example: "MONTHLY",
    description: "The billing cycle of the plan",
    enum: BillingCycleEnum,
  })
  billingCycle: BillingCycleEnum;
}
