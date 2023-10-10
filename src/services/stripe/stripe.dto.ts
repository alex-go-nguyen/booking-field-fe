import { BaseResponse } from '@/common/dtos/base.dto';

export interface StripePaymentPayload {
  currency: string;
  amount: number;
}

export type StripeResponse = BaseResponse<StripeData>;

export type StripeData = {
  clientSecret: string;
};
