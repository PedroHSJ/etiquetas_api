import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SupabaseTokenDto {
  @ApiProperty({
    description: "Token de acesso do Supabase",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsNotEmpty()
  @IsString()
  supabaseToken: string;
}
