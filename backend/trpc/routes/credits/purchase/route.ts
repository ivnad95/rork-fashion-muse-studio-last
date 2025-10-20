import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const purchaseCreditsInputSchema = z.object({
  planId: z.string(),
  credits: z.number().min(1),
  price: z.number().min(0),
});

export const purchaseCreditsProcedure = publicProcedure
  .input(purchaseCreditsInputSchema)
  .mutation(async ({ input }) => {
    const { planId, credits, price } = input;

    console.log('Processing credit purchase:', planId, credits, price);

    return {
      success: true,
      credits,
      transactionId: 'txn_' + Date.now(),
    };
  });
