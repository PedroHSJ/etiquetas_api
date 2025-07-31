import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { IApiResponse } from "@/shared/dto/apiResponse.dto";
import { SubscriptionDto } from "./dto/subcription.dto";
import { Auth } from "@/shared/helpers/decorators/auth.decorator";
import { FeaturesEnum } from "@/shared/enums/feature.enum";
import { ScopesEnum } from "@/shared/enums/scopes.enum";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExcludeController,
} from "@nestjs/swagger";

@ApiExcludeController()
@ApiHeader({
  name: "Accept-Language",
  description: "Language",
  example: "en-US",
})
@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @ApiOperation({ summary: "Create a new subscription" })
  @ApiResponse({
    status: 201,
    description: "Subscription created successfully",
    type: SubscriptionDto,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiBody({ type: CreateSubscriptionDto })
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<IApiResponse<SubscriptionDto>> {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Put(":id")
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @ApiOperation({ summary: "Update a subscription by ID" })
  @ApiParam({ name: "id", description: "ID of the subscription" })
  @ApiResponse({
    status: 200,
    description: "Subscription updated successfully",
    type: SubscriptionDto,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiNotFoundResponse({ description: "Subscription not found" })
  @ApiBody({ type: UpdateSubscriptionDto })
  async update(
    @Param("id") id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<IApiResponse<SubscriptionDto>> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Get(":id")
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @ApiOperation({ summary: "Get a subscription by ID" })
  @ApiParam({ name: "id", description: "ID of the subscription" })
  @ApiResponse({
    status: 200,
    description: "Return the subscription",
    type: SubscriptionDto,
  })
  @ApiNotFoundResponse({ description: "Subscription not found" })
  async findById(
    @Param("id") id: number,
  ): Promise<IApiResponse<SubscriptionDto>> {
    return this.subscriptionService.findById(id);
  }

  @Get()
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @ApiOperation({ summary: "Get all subscriptions" })
  @ApiResponse({
    status: 200,
    description: "Return all subscriptions",
    type: [SubscriptionDto],
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  async listAll(): Promise<IApiResponse<SubscriptionDto[]>> {
    return this.subscriptionService.listAll();
  }

  @Post(":id/cancel")
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @ApiOperation({ summary: "Cancel a subscription by ID" })
  @ApiParam({ name: "id", description: "ID of the subscription" })
  @ApiResponse({
    status: 200,
    description: "Subscription canceled successfully",
    type: SubscriptionDto,
  })
  @ApiNotFoundResponse({ description: "Subscription not found" })
  async cancelSubscription(
    @Param("id") id: number,
  ): Promise<IApiResponse<SubscriptionDto>> {
    return this.subscriptionService.cancelSubscription(id);
  }

  @Post(":id/renew")
  @Auth([ScopesEnum.GLOBAL], [FeaturesEnum.OPEN])
  @ApiOperation({ summary: "Renew a subscription by ID" })
  @ApiParam({ name: "id", description: "ID of the subscription" })
  @ApiResponse({
    status: 200,
    description: "Subscription renewed successfully",
    type: SubscriptionDto,
  })
  @ApiNotFoundResponse({ description: "Subscription not found" })
  async renewSubscription(
    @Param("id") id: number,
  ): Promise<IApiResponse<SubscriptionDto>> {
    return this.subscriptionService.renewSubscription(id);
  }
}
