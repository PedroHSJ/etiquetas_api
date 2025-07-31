import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { I18nService } from "nestjs-i18n";
import { FeatureDto } from "@/modules/feature/dto/feature.dto";
import { PermissionService } from "@/modules/permission/permission.service";
import { RolesGuardRequest } from "@/shared/interfaces/rolesGuardRequest.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(I18nService)
    private readonly i18n: I18nService,
    private reflector: Reflector,
  ) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const features = this.reflector.get<string[]>(
      "features",
      executionContext.getHandler(),
    );

    const request = executionContext
      .switchToHttp()
      .getRequest<RolesGuardRequest>();

    if (features.includes("OPEN")) {
      return true;
    }
    console.log("request", request);
    const { user, roles } = request;
    console.log("user", user);
    console.log("roles", roles);
    if (!user || !roles)
      throw new ForbiddenException(this.i18n.t("events.commons.unauthorized"));
    if (!features) {
      return true;
    }

    const hasRequiredFeatures = features.some((feature) =>
      roles.find((rolesFromRequest) =>
        rolesFromRequest.role.permissions.some(
          (permission) => permission.feature.name === feature,
        ),
      ),
    );

    if (!hasRequiredFeatures) {
      console.log("User does not have required features");
      throw new ForbiddenException(this.i18n.t("events.commons.forbidden"));
    }

    return true;
  }
}
