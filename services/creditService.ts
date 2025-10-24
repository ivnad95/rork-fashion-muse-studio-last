import {
  updateUserCredits as dbUpdateUserCredits,
  getUserById,
  createTransaction,
} from '@/lib/database';

/**
 * Credit service
 * Handles credit purchases, deductions, and balance management
 */
export const creditService = {
  /**
   * Get user's credit balance
   */
  async getCreditBalance(userId: string): Promise<number> {
    try {
      const user = await getUserById(userId);
      return user?.credits || 0;
    } catch (error) {
      console.error('Error getting credit balance:', error);
      return 0;
    }
  },

  /**
   * Add credits to user account
   */
  async addCredits(userId: string, amount: number, reason: string = 'purchase'): Promise<number> {
    try {
      if (amount <= 0) {
        throw new Error('Amount must be positive');
      }

      // Update credits
      await dbUpdateUserCredits(userId, amount);

      // Create transaction record
      await createTransaction(userId, amount, 'purchase', reason);

      // Get new balance
      const user = await getUserById(userId);
      return user?.credits || 0;
    } catch (error) {
      console.error('Error adding credits:', error);
      throw new Error('Failed to add credits');
    }
  },

  /**
   * Deduct credits from user account
   */
  async deductCredits(userId: string, amount: number, reason: string = 'generation'): Promise<number> {
    try {
      if (amount <= 0) {
        throw new Error('Amount must be positive');
      }

      // Check balance
      const user = await getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.credits < amount) {
        throw new Error('Insufficient credits');
      }

      // Update credits (negative amount for deduction)
      await dbUpdateUserCredits(userId, -amount);

      // Create transaction record
      await createTransaction(userId, amount, 'deduction', reason);

      // Get new balance
      const updatedUser = await getUserById(userId);
      return updatedUser?.credits || 0;
    } catch (error: any) {
      console.error('Error deducting credits:', error);
      throw error;
    }
  },

  /**
   * Check if user has sufficient credits
   */
  async hasSufficientCredits(userId: string, requiredAmount: number): Promise<boolean> {
    try {
      const balance = await this.getCreditBalance(userId);
      return balance >= requiredAmount;
    } catch (error) {
      console.error('Error checking credits:', error);
      return false;
    }
  },

  /**
   * Purchase credits (mock implementation for demo)
   */
  async purchaseCredits(userId: string, planId: string, amount: number, price: number): Promise<number> {
    try {
      // In a real app, this would integrate with payment processor (Stripe, etc.)
      // For demo purposes, we just add credits directly

      console.log(`Mock purchase: Plan ${planId}, ${amount} credits for $${price}`);

      return await this.addCredits(userId, amount, `purchase:${planId}`);
    } catch (error) {
      console.error('Error purchasing credits:', error);
      throw new Error('Failed to purchase credits');
    }
  },
};
