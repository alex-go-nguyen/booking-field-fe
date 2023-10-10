import { StripePaymentPayload, StripeResponse } from './stripe.dto';
import axiosInstance from '@/utils/axiosConfig';

const stripeService = {
  getClientSecret: async (payload: StripePaymentPayload) => {
    const { currency, amount } = payload;
    const { data } = await axiosInstance.post<StripeResponse>('/stripe/create-payment-intent', {
      currency,
      amount,
    });

    return data.data;
  },
};

export default stripeService;
