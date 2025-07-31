import { ApiProperty } from "@nestjs/swagger";

export class GoogleLoginDto {
  @ApiProperty({
    description: "Google OAuth ID token",
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2Mz...",
  })
  token: string;
}
