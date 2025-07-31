import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { PlanStatusEnum } from "@/shared/enums/planStatus.enum";
import { SubscriptionDto } from "./dto/subcription.dto";
import { plainToInstance } from "class-transformer";
import { Transactional } from "typeorm-transactional";
import { UserFeatureLimitEntity } from "../feature/entities/user-feature-limit.entity";

@Injectable()
export class SubscriptionLimitService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,

    @InjectRepository(UserFeatureLimitEntity)
    private userFeatureLimitRepository: Repository<UserFeatureLimitEntity>,
  ) {}

  /**
   * Verifica se o usuário tem uma assinatura ativa
   */
  async getUserActiveSubscription(userId: number): Promise<SubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOneOrFail({
      where: {
        userId,
        status: In([PlanStatusEnum.ACTIVE, PlanStatusEnum.TRIAL]),
        active: true,
      },
    });
    return plainToInstance(SubscriptionDto, subscription);
  }

  /**
   * Verifica se o usuário atingiu o limite para uma determinada feature
   */
  async checkFeatureLimit(
    userId: number,
    featureName: string,
  ): Promise<boolean> {
    // Ignora verificação para a feature "OPEN"
    if (featureName === "OPEN") {
      return true;
    }

    // Obtém a assinatura ativa do usuário
    const subscription = await this.getUserActiveSubscription(userId);

    // Busca o limite individualizado para o usuário, a feature e a assinatura ativa
    const userFeatureLimit = await this.userFeatureLimitRepository.findOne({
      where: {
        userId,
        subscriptionId: subscription.id, // Filtra pela assinatura ativa
        active: true,
        featureLimit: { feature: { name: Like(`%${featureName}%`) } },
      },
      relations: {
        featureLimit: {
          feature: true,
        },
      },
    });

    // Se não há limite definido para essa feature, permite o acesso
    if (
      !userFeatureLimit ||
      userFeatureLimit.featureLimit.feature.name !== featureName
    ) {
      return true;
    }

    // Verifica se o recurso é ilimitado
    if (userFeatureLimit.featureLimit.isUnlimited) {
      return true;
    }

    // Verifica se o usuário atingiu o limite
    return (
      userFeatureLimit.currentValue < userFeatureLimit.featureLimit.maxValue
    );
  }

  /**
   * Incrementa o contador de uso de um recurso
   */
  @Transactional()
  async incrementResourceUsage(
    userId: number,
    featureName: string,
  ): Promise<void> {
    console.log("Incrementando...");

    // Obtém a assinatura ativa do usuário
    const subscription = await this.getUserActiveSubscription(userId);

    // Busca o limite individualizado para o usuário, a feature e a assinatura ativa
    const userFeatureLimit = await this.userFeatureLimitRepository.findOne({
      where: {
        userId,
        subscriptionId: subscription.id, // Filtra pela assinatura ativa
        active: true,
        featureLimit: {
          feature: {
            name: featureName,
          },
        },
      },
      relations: {
        featureLimit: {
          feature: true,
        },
      },
    });

    if (!userFeatureLimit) {
      console.warn(
        `Nenhum limite encontrado para o usuário ${userId} e a feature ${featureName}`,
      );
      return;
    }

    // Incrementa o uso apenas se o recurso não for ilimitado
    if (
      userFeatureLimit.featureLimit.feature.name === featureName &&
      !userFeatureLimit.featureLimit.isUnlimited
    ) {
      userFeatureLimit.currentValue += 1;
      await this.userFeatureLimitRepository.save(userFeatureLimit);
    }
  }

  /**
   * Decrementa o contador de uso de um recurso
   */
  async decrementResourceUsage(
    userId: number,
    featureName: string,
  ): Promise<void> {
    const subscription = await this.getUserActiveSubscription(userId);

    const userFeatureLimit = await this.userFeatureLimitRepository.findOne({
      where: {
        userId,
        active: true,
      },
      relations: ["featureLimit"], // Inclui a relação com FeatureLimitEntity
    });

    if (
      userFeatureLimit &&
      userFeatureLimit.featureLimit.feature.name === featureName &&
      !userFeatureLimit.featureLimit.isUnlimited &&
      userFeatureLimit.currentValue > 0
    ) {
      userFeatureLimit.currentValue -= 1;
      await this.userFeatureLimitRepository.save(userFeatureLimit);
    }
  }
}
