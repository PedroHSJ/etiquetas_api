import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RolesGuard } from "../guards/roles.guard";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { SubscriptionLimitGuard } from "../guards/subscription-limit.guard";

export function Auth(
  scopes: ScopesEnum[],
  features: FeaturesEnum[],
  checkLimit: boolean = false,
) {
  const decorators = [
    SetMetadata("features", features),
    SetMetadata("scopes", scopes), // Add this if you want to use scopes in your guards
    UseGuards(AuthGuard("jwt"), RolesGuard),
    ApiBearerAuth("JWT-auth"),
  ];

  if (checkLimit) {
    decorators.push(UseGuards(SubscriptionLimitGuard));
  }

  return applyDecorators(...decorators);
}
