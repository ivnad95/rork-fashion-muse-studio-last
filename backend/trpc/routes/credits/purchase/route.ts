import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { updateUserCredits, createTransaction } from '@/lib/database';

const purchaseCreditsInputSchema = z.object({
  userId: z.string(),
  planId: z.string(),
  credits: z.number().min(1),
  price: z.number().min(0),
});

export const purchaseCreditsProcedure = publicProcedure
  .input(purchaseCreditsInputSchema)
  .mutation(async ({ input }) => {
    const { userId, planId, credits, price } = input;

    console.log('Processing credit purchase:', userId, planId, credits, price);

    // Update user credits
    const newCredits = await updateUserCredits(userId, credits);

    // Create transaction record
    const transaction = await createTransaction(
      userId,
      credits,
      'purchase',
      `Purchased ${credits} credits - ${planId} plan ($${price})`
    );

    return {
      success: true,
      credits: newCredits,
      transactionId: transaction.id,
    };
  });
