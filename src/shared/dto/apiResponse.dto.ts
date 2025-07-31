import { ApiProperty } from "@nestjs/swagger";

export class IApiResponse<T> {
  @ApiProperty({ example: "Operation successful" })
  message: string;
  @ApiProperty()
  data: T;
}

export class ApiArrayResponseDto<T> {
  @ApiProperty({ example: "Operation successful" })
  message: string;
  @ApiProperty({ type: "array", isArray: true })
  data: T[];

  constructor(data: T[], message: string) {
    this.data = data;
    this.message = message;
  }
}
