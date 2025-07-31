import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FeatureLimitEntity } from "./entities/feature-limit.entity";
import { UserFeatureLimitEntity } from "./entities/user-feature-limit.entity";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class FeatureLimitService {
  constructor(
    @InjectRepository(UserFeatureLimitEntity)
    private readonly userFeatureLimitRepository: Repository<UserFeatureLimitEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: "America/Sao_Paulo",
  })
  async handleDailyReset(): Promise<void> {
    await this.resetFeatureLimits();
  }

  /**
   * Reseta os limites de funcionalidades com base na frequência de redefinição.
   */
  async resetFeatureLimits(): Promise<void> {
    const now = new Date();

    // Busca todos os limites de funcionalidades de usuários
    const userFeatureLimits = await this.userFeatureLimitRepository.find({
      relations: {
        featureLimit: {
          feature: true,
        },
      },
    });

    for (const userLimit of userFeatureLimits) {
      const shouldReset = this.shouldResetLimit(
        userLimit.lastResetDate,
        userLimit.featureLimit.feature.resetFrequency,
        now,
      );

      if (shouldReset) {
        // Atualiza a data de último reset
        userLimit.lastResetDate = now;
        userLimit.currentValue = 0; // Reseta o valor atual
        await this.userFeatureLimitRepository.save(userLimit);
      }
    }
  }

  /**
   * Verifica se o limite deve ser resetado com base na frequência e na última data de reset.
   */
  private shouldResetLimit(
    lastResetDate: Date,
    frequency: BillingCycleEnum,
    now: Date,
  ): boolean {
    const nextResetDate = new Date(lastResetDate);

    switch (frequency) {
      case BillingCycleEnum.MONTHLY:
        nextResetDate.setMonth(nextResetDate.getMonth() + 1);
        break;
      case BillingCycleEnum.QUARTERLY:
        nextResetDate.setMonth(nextResetDate.getMonth() + 3);
        break;
      case BillingCycleEnum.SEMIANNUAL:
        nextResetDate.setMonth(nextResetDate.getMonth() + 6);
        break;
      case BillingCycleEnum.ANNUAL:
        nextResetDate.setFullYear(nextResetDate.getFullYear() + 1);
        break;
    }

    return now >= nextResetDate;
  }
}
