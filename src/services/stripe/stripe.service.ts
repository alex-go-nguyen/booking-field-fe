import { IStripePaymentPayload } from './stripe.dto';
import axiosInstance from '@/utils/axiosConfig';

export const getClientSecret = async (payload: IStripePaymentPayload) => {
  const { currency, amount } = payload;
  const { data } = await axiosInstance.post('/stripe/create-payment-intent', {
    currency,
    amount,
  });

  return data.clientSecret;
};
