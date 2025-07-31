import { FeatureDto } from "@/modules/feature/dto/feature.dto";
import { UserRoleDto } from "@/modules/role/dto/user-role.dto";

export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  features?: FeatureDto[];
  roles?: UserRoleDto[];
}
