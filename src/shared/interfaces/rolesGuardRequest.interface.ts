import { FeatureDto } from "@/modules/feature/dto/feature.dto";
import { UserRoleDto } from "@/modules/role/dto/user-role.dto";
import { UserDto } from "@/modules/user/dto/user.dto";

export interface RolesGuardRequest {
  user?: UserDto;
  features?: FeatureDto[];
  roles?: UserRoleDto[];
}
