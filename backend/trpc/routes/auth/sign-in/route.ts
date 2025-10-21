import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { getUserByEmail, verifyPassword } from '@/lib/database';

const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInProcedure = publicProcedure
  .input(signInInputSchema)
  .mutation(async ({ input }) => {
    const { email, password } = input;

    console.log('Sign in attempt:', email);

    // Get user from database
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      throw new Error('Invalid email or password');
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profile_image,
        credits: user.credits,
      },
      token: 'token_' + Date.now(),
    };
  });
