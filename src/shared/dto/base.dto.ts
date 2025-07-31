import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class BaseDto {
  @ApiProperty({
    description: "Unique identifier",
    readOnly: true,
  })
  @Expose()
  id: number;
}
