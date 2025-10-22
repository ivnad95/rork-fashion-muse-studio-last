import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  initDatabase, 
  getUserByEmail, 
  getUserById, 
  createUser as dbCreateUser, 
  updateUser as dbUpdateUser,
  updateUserCredits as dbUpdateUserCredits,
  hashPassword,
  verifyPassword,
} from '@/lib/database';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  credits: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@fashion_ai_user_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize database
      await initDatabase();
      
      // Load user session
      const sessionJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        const dbUser = await getUserById(session.userId);
        
        if (dbUser) {
          const user: User = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            profileImage: dbUser.profile_image,
            credits: dbUser.credits,
          };
          setState({ user, isAuthenticated: true, isLoading: false });
        } else {
          // Session exists but user not in DB - clear session
          await AsyncStorage.removeItem(STORAGE_KEY);
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
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
      
      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };

      // Save session
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: user.id }));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      // Create user in database
      const passwordHash = await hashPassword(password);
      const dbUser = await dbCreateUser(name, email, passwordHash);
      
      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profileImage: dbUser.profile_image,
        credits: dbUser.credits,
      };

      // Save session
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: user.id }));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setState({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;

    try {
      // Update in database
      await dbUpdateUser(state.user.id, {
        name: updates.name,
        profile_image: updates.profileImage,
      });
      
      const updatedUser = { ...state.user, ...updates };
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [state.user]);

  const updateCredits = useCallback(async (amount: number) => {
    if (!state.user) return;

    try {
      // Update in database
      const newCredits = await dbUpdateUserCredits(state.user.id, amount);
      
      const updatedUser = { ...state.user, credits: newCredits };
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Error updating credits:', error);
      throw error;
    }
  }, [state.user]);

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updateCredits,
    }),
    [state, signIn, signUp, signOut, updateProfile, updateCredits]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
