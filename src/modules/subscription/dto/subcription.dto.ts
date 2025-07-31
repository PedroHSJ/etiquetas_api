import { BillingCycleEnum } from "@/shared/enums/billingCycle.enum";
import { PlanStatusEnum } from "@/shared/enums/planStatus.enum";
import { SubscriptionTypeDto } from "./subscription-type.dto";

export class SubscriptionDto {
  id: number;
  userId: number;
  stripeSubscriptionId: string;
  subscriptionType: SubscriptionTypeDto;
  status: PlanStatusEnum;
  currentPeriodEnd: Date;
  billingCycle: BillingCycleEnum;
  priceAtPurchase: number;
  nextBillingDate: Date;
  paymentMethod: string;
  cancelAtPeriodEnd: boolean;
  trialEndDate: Date;
}
