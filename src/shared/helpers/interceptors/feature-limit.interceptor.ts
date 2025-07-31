import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FeatureDto } from "@/modules/feature/dto/feature.dto";
import { SubscriptionLimitService } from "@/modules/subscription/subscription-limit.service";

@Injectable()
export class FeatureLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly subscriptionLimitService: SubscriptionLimitService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    return next.handle().pipe(
      tap(async (response) => {
        // Verifica se a operação foi bem-sucedida
        if (response && userId) {
          const features = request.features as FeatureDto[]; // Supondo que as features estejam no request
          if (features) {
            for (const feature of features) {
              await this.subscriptionLimitService.incrementResourceUsage(
                userId,
                feature.name,
              );
            }
          }
        }
      }),
    );
  }
}
