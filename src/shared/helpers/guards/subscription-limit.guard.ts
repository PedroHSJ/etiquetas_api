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
import { SubscriptionLimitService } from "@/modules/subscription/subscription-limit.service";
import { RolesGuardRequest } from "@/shared/interfaces/rolesGuardRequest.interface";

@Injectable()
export class SubscriptionLimitGuard implements CanActivate {
  constructor(
    @Inject(I18nService)
    private readonly i18n: I18nService,
    private reflector: Reflector,
    private subscriptionLimitService: SubscriptionLimitService,
  ) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const features = this.reflector.get<string[]>(
      "features",
      executionContext.getHandler(),
    );

    // Se não houver features definidas, não permite acesso
    if (!features || features.length === 0) {
      throw new ForbiddenException(this.i18n.t("events.commons.unauthorized"));
    }

    // Se a feature "OPEN" estiver presente, permite acesso sem verificação de limite
    if (features.includes("OPEN")) {
      console.log("Feature 'OPEN' detected, access granted");
      return true;
    }

    const request = executionContext
      .switchToHttp()
      .getRequest<RolesGuardRequest>();

    // Adiciona as features ao objeto request para uso posterior
    request.features = features.map((feature) => ({
      name: feature,
    })) as FeatureDto[];

    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException(this.i18n.t("events.commons.unauthorized"));
    }

    // Para cada feature, verifica se o usuário atingiu o limite
    for (const feature of features) {
      try {
        console.log(feature);
        const hasAvailableLimit =
          await this.subscriptionLimitService.checkFeatureLimit(
            userId,
            feature,
          );
        if (!hasAvailableLimit) {
          throw new ForbiddenException(
            this.i18n.t("events.commons.resourceLimitReached", {
              args: { feature },
            }),
          );
        }
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw error;
        }
        console.log(error);
        // Se for outro tipo de erro (ex: usuário sem assinatura ativa)
        throw new ForbiddenException(
          this.i18n.t("events.commons.noActiveSubscription"),
        );
      }
    }

    return true;
  }
}
