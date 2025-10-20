import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const updateProfileInputSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  profileImage: z.string().nullable().optional(),
});

export const updateProfileProcedure = publicProcedure
  .input(updateProfileInputSchema)
  .mutation(async ({ input }) => {
    console.log('Updating profile:', input);

    return {
      success: true,
      user: {
        id: 'user_id',
        ...input,
        credits: 10,
      },
    };
  });
