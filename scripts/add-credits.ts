/**
 * Development utility to add credits for testing
 *
 * Usage in browser console:
 * 1. Open DevTools (F12)
 * 2. Run: localStorage.setItem('@fashion_ai_guest_credits', '50')
 * 3. Refresh the page
 *
 * For native/database users, use Expo CLI to access SQLite:
 * npx expo start --dev-client
 * Then use SQLite viewer or run SQL commands
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_CREDITS_KEY = '@fashion_ai_guest_credits';

/**
 * Add credits to guest user
 * @param amount Number of credits to add (can be negative to subtract)
 */
export async function addGuestCredits(amount: number): Promise<number> {
  try {
    const currentCreditsStr = await AsyncStorage.getItem(GUEST_CREDITS_KEY);
    const currentCredits = currentCreditsStr ? parseInt(currentCreditsStr, 10) : 50;
    const newCredits = Math.max(0, currentCredits + amount);

    await AsyncStorage.setItem(GUEST_CREDITS_KEY, String(newCredits));
    console.log(`✅ Credits updated: ${currentCredits} → ${newCredits}`);
    return newCredits;
  } catch (error) {
    console.error('❌ Error updating credits:', error);
    throw error;
  }
}

/**
 * Set credits to exact amount
 * @param amount Exact number of credits to set
 */
export async function setGuestCredits(amount: number): Promise<void> {
  try {
    const credits = Math.max(0, amount);
    await AsyncStorage.setItem(GUEST_CREDITS_KEY, String(credits));
    console.log(`✅ Credits set to: ${credits}`);
  } catch (error) {
    console.error('❌ Error setting credits:', error);
    throw error;
  }
}

/**
 * Get current guest credits
 */
export async function getGuestCredits(): Promise<number> {
  try {
    const creditsStr = await AsyncStorage.getItem(GUEST_CREDITS_KEY);
    const credits = creditsStr ? parseInt(creditsStr, 10) : 50;
    console.log(`💰 Current credits: ${credits}`);
    return credits;
  } catch (error) {
    console.error('❌ Error getting credits:', error);
    throw error;
  }
}

// For browser console access (web only)
if (typeof window !== 'undefined') {
  (window as any).testUtils = {
    addCredits: (amount: number) => {
      const current = parseInt(localStorage.getItem('@fashion_ai_guest_credits') || '50', 10);
      const newAmount = Math.max(0, current + amount);
      localStorage.setItem('@fashion_ai_guest_credits', String(newAmount));
      console.log(`✅ Credits: ${current} → ${newAmount}. Refresh the page to see changes.`);
      return newAmount;
    },
    setCredits: (amount: number) => {
      localStorage.setItem('@fashion_ai_guest_credits', String(Math.max(0, amount)));
      console.log(`✅ Credits set to ${amount}. Refresh the page to see changes.`);
    },
    getCredits: () => {
      const credits = parseInt(localStorage.getItem('@fashion_ai_guest_credits') || '50', 10);
      console.log(`💰 Current credits: ${credits}`);
      return credits;
    }
  };

  console.log('%c🛠️ Test Utils Available', 'color: #0A76AF; font-size: 16px; font-weight: bold;');
  console.log('%cUse these commands in the browser console:', 'color: #C8CDD5; font-size: 12px;');
  console.log('%c  testUtils.setCredits(50)  - Set credits to 50', 'color: #F5F7FA; font-size: 11px;');
  console.log('%c  testUtils.addCredits(10)  - Add 10 credits', 'color: #F5F7FA; font-size: 11px;');
  console.log('%c  testUtils.getCredits()    - Show current credits', 'color: #F5F7FA; font-size: 11px;');
}
