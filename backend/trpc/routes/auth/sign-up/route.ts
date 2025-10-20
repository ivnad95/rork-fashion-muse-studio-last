import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const signUpInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpProcedure = publicProcedure
  .input(signUpInputSchema)
  .mutation(async ({ input }) => {
    const { name, email } = input;

    console.log('Sign up attempt:', name, email);

    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name,
        email,
        profileImage: null,
        credits: 10,
      },
      token: 'mock_token_' + Date.now(),
    };
  });
