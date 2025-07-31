import { FeatureDto } from "@/modules/feature/dto/feature.dto";
import { RoleDto } from "@/modules/role/dto/role.dto";

export class PermissionDto {
  roleId: number;
  featureId: number;
  role: RoleDto;
  feature: FeatureDto;
}
