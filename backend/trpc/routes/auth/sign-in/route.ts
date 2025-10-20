import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInProcedure = publicProcedure
  .input(signInInputSchema)
  .mutation(async ({ input }) => {
    const { email } = input;

    console.log('Sign in attempt:', email);

    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        profileImage: null,
        credits: 10,
      },
      token: 'mock_token_' + Date.now(),
    };
  });
