import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanController } from "./plan.controller";
import { PlanService } from "./plan.service";
import { Module } from "@nestjs/common";
import { PlanEntity } from "./entities/plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
