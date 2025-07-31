/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlanEntity } from "./entities/plan.entity";
import { Repository } from "typeorm";
import { PlanDto } from "./dto/plan.dto";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { plainToInstance } from "class-transformer";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class PlanService {
  constructor(
    @Inject()
    private readonly i18n: I18nService,
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  async listAll(): Promise<PlanDto[]> {
    try {
      const plan = await this.planRepository.find({
        relations: {
          planItems: true,
          planPrices: true,
        },
      });

      return plainToInstance(PlanDto, plan);
    } catch (error) {
      throw error;
    }
  }
}
