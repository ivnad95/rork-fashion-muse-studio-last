import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { updateUser, getUserById } from '@/lib/database';

const updateProfileInputSchema = z.object({
  userId: z.string(),
  name: z.string().min(2).optional(),
  profileImage: z.string().nullable().optional(),
});

export const updateProfileProcedure = publicProcedure
  .input(updateProfileInputSchema)
  .mutation(async ({ input }) => {
    const { userId, ...updates } = input;
    
    console.log('Updating profile:', userId, updates);

    // Update user in database
    await updateUser(userId, {
      name: updates.name,
      profile_image: updates.profileImage,
    });

    // Get updated user
    const user = await getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
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
    };
  });
