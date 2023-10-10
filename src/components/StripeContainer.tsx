import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import PaymentForm, { PaymentFormProps } from './PaymentForm';
import stripeService from '@/services/stripe/stripe.service';

export interface SripeContainerProps extends PaymentFormProps {
  currency: string;
  amount: number;
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const StripeContainer = ({ currency, amount, onSubmit }: SripeContainerProps) => {
  const { data, mutate } = useMutation({
    mutationFn: stripeService.getClientSecret,
  });

  useEffect(() => {
    mutate({ currency, amount });
  }, [currency, amount, mutate]);

  return (
    data &&
    stripePromise && (
      <>
        <Elements stripe={stripePromise} options={{ clientSecret: data.clientSecret }}>
          <PaymentForm onSubmit={onSubmit} />
        </Elements>
      </>
    )
  );
};
