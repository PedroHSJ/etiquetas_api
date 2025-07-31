import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateSubscriptionDto {
  @ApiProperty({ description: "ID do usuário", example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: "ID do plano", example: 2 })
  @IsInt()
  @IsNotEmpty()
  planId: number;

  @ApiProperty({ description: "ID do preço do plano", example: 3 })
  @IsInt()
  @IsNotEmpty()
  paymentMethodId: number;
}
