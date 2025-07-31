import { Controller, Get } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { Public } from "@/shared/helpers/decorators/public.decorator";
import {
  ApiExcludeController,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { PlanDto } from "./dto/plan.dto";

@ApiTags("Plan")
@Controller("/plan")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiOperation({
    summary: "List all plans",
    description: "Retrieves a list of all available plans.",
  })
  @ApiOkResponse({
    description: "List of all plans retrieved successfully.",
    type: PlanDto,
    isArray: true,
  })
  @Get()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  async listAll(): Promise<PlanDto[]> {
    return await this.planService.listAll();
  }
}
