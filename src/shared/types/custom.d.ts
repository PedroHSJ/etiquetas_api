import { UserDto } from "@/modules/user/dto/user.dto";
import { UserEntity } from "../../modules/user/entities/user.entity";

declare module "@nestjs/common" {
  interface Request {
    user?: UserDto;
    features?: FeatureDto[];
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDto;
    features?: FeatureDto[];
    roles?: UserRoleDto[];
  }
}
