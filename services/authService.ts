import {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  hashPassword,
  verifyPassword,
} from '@/lib/database';
import { storageService } from './storageService';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  credits: number;
}

/**
 * Authentication service
 * Handles user authentication, registration, and session management
 */
export const authService = {
  /**
   * Initialize authentication
   * Checks for existing session and loads user data
   */
  async initialize(): Promise<User | null> {
    try {
      const session = await storageService.getUserSession();
      if (!session) return null;

      const dbUser = await getUserById(session.userId);
      if (!dbUser) {
        // Session exists but user not in DB - clear session
        await storageService.clearUserSession();
        return null;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      return null;
    }
  },

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      // Get user from database
      const dbUser = await getUserByEmail(email);

      if (!dbUser) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValid = await verifyPassword(password, dbUser.password_hash);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      // Save session
      await storageService.saveUserSession(dbUser.id);

      // Return user data
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
   * Sign up new user
   */
  async signUp(name: string, email: string, password: string): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const dbUser = await createUser(name, email, passwordHash);

      // Save session
      await storageService.saveUserSession(dbUser.id);

      // Return user data
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await storageService.clearUserSession();
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: { name?: string; email?: string; profileImage?: string }): Promise<User> {
    try {
      // Update user in database
      await updateUser(userId, updates);

      // Fetch updated user
      const dbUser = await getUserById(userId);
      if (!dbUser) {
        throw new Error('User not found after update');
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const dbUser = await getUserById(userId);
      if (!dbUser) return null;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },
};
