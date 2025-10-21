import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { getUserByEmail, createUser, hashPassword } from '@/lib/database';

const signUpInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpProcedure = publicProcedure
  .input(signUpInputSchema)
  .mutation(async ({ input }) => {
    const { name, email, password } = input;

    console.log('Sign up attempt:', name, email);

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const passwordHash = hashPassword(password);
    const user = await createUser(name, email, passwordHash);

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
