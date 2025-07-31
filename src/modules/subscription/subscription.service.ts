import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { Transactional } from "typeorm-transactional";
import { UserFeatureLimitEntity } from "../feature/entities/user-feature-limit.entity";
import { FeatureLimitEntity } from "../feature/entities/feature-limit.entity";
import { SubscriptionDto } from "./dto/subcription.dto";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { I18nService } from "nestjs-i18n";
import { plainToInstance } from "class-transformer";
import { PlanStatusEnum } from "@/shared/enums/planStatus.enum";
import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";
import { PlanEntity } from "../plan/entities/plan.entity";
import { PlanPriceEntity } from "../plan/entities/plan-price.entity";

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(I18nService)
    private readonly i18n: I18nService,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(UserFeatureLimitEntity)
    private readonly userFeatureLimitRepository: Repository<UserFeatureLimitEntity>,
    @InjectRepository(FeatureLimitEntity)
    private readonly featureLimitRepository: Repository<FeatureLimitEntity>,
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(PlanPriceEntity)
    private readonly planPriceRepository: Repository<PlanPriceEntity>,
  ) {}

  private periodEndFromBillingCycle(billingCycle: BillingCycleEnum): Date {
    const now = new Date();
    const oneMonth = 1;
    const quartely = 3;
    const semiAnnual = 6;
    const annual = 12;

    switch (billingCycle) {
      case BillingCycleEnum.MONTHLY:
        return new Date(now.setMonth(now.getMonth() + oneMonth));
      case BillingCycleEnum.QUARTERLY:
        return new Date(now.setFullYear(now.getFullYear() + quartely));
      case BillingCycleEnum.SEMIANNUAL:
        return new Date(now.setFullYear(now.getFullYear() + semiAnnual));
      case BillingCycleEnum.ANNUAL:
        return new Date(now.setFullYear(now.getFullYear() + annual));
      default:
        throw new BadRequestException("Invalid billing cycle");
    }
  }

  @Transactional()
  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<IApiResponse<SubscriptionDto>> {
    try {
      const { userId, planId, paymentMethodId } = createSubscriptionDto;

      const subAlreadyExist = await this.subscriptionRepository.findOne({
        where: {
          userId,
          active: true,
        },
      });
      if (subAlreadyExist) {
        await this.subscriptionRepository.update(subAlreadyExist.id, {
          active: false,
        });
      }
      // const {
      //   userId,
      //   stripeCustomerId,
      //   planId,
      //   paymentMethodId,
      //   trialEndDate,
      // } = createDto;

      // 1) Encontrar o preço vigente do plano
      const planPrice = await this.planPriceRepository.findOne({
        where: { plan: { id: planId }, active: true },
      });
      if (!planPrice)
        throw new NotFoundException(
          this.i18n.t("events.subscription.priceNotFound"),
        );

      // Validar se o plano existe
      const plan = await this.planRepository.findOne({
        where: { id: planId, active: true },
      });
      if (!plan)
        throw new NotFoundException(
          this.i18n.t("events.subscription.planNotFound"),
        );

      // 2) Criar no Stripe
      // const subscriptionParams: Stripe.SubscriptionCreateParams = {
      //   customer: stripeCustomerId,
      //   items: [{ price: planPrice.stripePriceId }],
      //   default_payment_method: paymentMethodId,
      //   expand: ["latest_invoice.payment_intent"],
      // };
      // if (trialEndDate) {
      //   subscriptionParams.trial_end = Math.floor(
      //     new Date(trialEndDate).getTime() / 1000,
      //   );
      // }

      // const stripeSub =
      //   await this.stripe.subscriptions.create(subscriptionParams);
      // if (stripeSub.status === "incomplete") {
      //   throw new BadRequestException(
      //     "Falha na criação da assinatura no Stripe",
      //   );
      // }

      // Criar a assinatura
      const subscription = this.subscriptionRepository.create({
        status: PlanStatusEnum.ACTIVE,
        currentPeriodEnd: this.periodEndFromBillingCycle(
          planPrice.billingCycle,
        ),
        nextBillingDate: this.periodEndFromBillingCycle(planPrice.billingCycle),
        cancelAtPeriodEnd: false,
        userId,
        planId,
        billingCycle: planPrice.billingCycle,
        paymentMethodId: createSubscriptionDto.paymentMethodId,
        planPriceId: planPrice.id,
        createdBy: userId,
        priceAtPurchase: planPrice.price,
      });

      const subEntity = await this.subscriptionRepository.save(subscription);

      await this.initializeUserFeatureLimits(userId, plan.id, subEntity.id);

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(SubscriptionDto, subEntity),
      };
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<IApiResponse<SubscriptionDto>> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id },
      });

      if (!subscription) {
        throw new NotFoundException("events.commons.notFound");
      }

      Object.assign(subscription, updateSubscriptionDto);
      const updatedSubscription =
        await this.subscriptionRepository.save(subscription);

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(SubscriptionDto, updatedSubscription),
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<IApiResponse<SubscriptionDto>> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id },
      });

      if (!subscription) throw new NotFoundException("events.commons.notFound");

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(SubscriptionDto, subscription),
      };
    } catch (error) {
      throw error;
    }
  }

  async listAll(): Promise<IApiResponse<SubscriptionDto[]>> {
    try {
      const subscriptions = await this.subscriptionRepository.find();

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(SubscriptionDto, subscriptions),
      };
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async cancelSubscription(id: number): Promise<IApiResponse<SubscriptionDto>> {
    try {
      const subscription = await this.subscriptionRepository.findOneOrFail({
        where: { id },
      });

      subscription.cancelAtPeriodEnd = true;
      const updatedSubscription =
        await this.subscriptionRepository.save(subscription);

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(SubscriptionDto, updatedSubscription),
      };
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async renewSubscription(id: number): Promise<IApiResponse<SubscriptionDto>> {
    try {
      const subscription = await this.subscriptionRepository.findOneOrFail({
        where: { id },
      });

      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      subscription.cancelAtPeriodEnd = false;
      subscription.nextBillingDate = new Date(thirtyDaysFromNow);

      const updatedSubscription =
        await this.subscriptionRepository.save(subscription);

      return {
        message: this.i18n.t("events.commons.success"),
        data: plainToInstance(SubscriptionDto, updatedSubscription),
      };
    } catch (error) {
      throw error;
    }
  } /**
   * Inicializa os limites de funcionalidades para o usuário com base no plano
   */
  @Transactional()
  private async initializeUserFeatureLimits(
    userId: number,
    planId: number,
    subscriptionId: number,
  ): Promise<void> {
    // Buscar os limites gerais para o plano
    const featureLimits = await this.featureLimitRepository.find({
      where: { active: true, planId },
      relations: {
        feature: true,
      },
    });

    // Criar limites individualizados para o usuário
    const userFeatureLimits = featureLimits.map((featureLimit) => {
      return this.userFeatureLimitRepository.create({
        userId,
        featureLimitId: featureLimit.id, // Referência ao limite geral
        currentValue: 0, // Inicializa o valor atual como 0
        subscriptionId,
      });
    });

    // Salvar os limites no banco de dados
    await this.userFeatureLimitRepository.save(userFeatureLimits);
  }
}
