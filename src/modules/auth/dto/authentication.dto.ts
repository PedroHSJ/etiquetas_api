import { UserEntity } from "@/modules/user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class AuthenticationDto {
  @ApiProperty({
    description: "Authorization token",
    type: "string",
  })
  @Expose()
  access_token: string;

  @ApiProperty({
    description: "Informações do usuário",
  })
  @Expose()
  info: UserEntity;

  constructor(access_token: string, info: UserEntity) {
    this.access_token = access_token;
    this.info = info;
  }
}
