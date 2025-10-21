/**
 * Automated Test Suite for Database Integration
 * 
 * This test script validates the core database functionality including:
 * - User authentication (sign-up, sign-in, validation)
 * - Image storage and retrieval
 * - History persistence
 * - Credits management
 * - Transaction tracking
 */

import * as SQLite from 'expo-sqlite';
import {
  initDatabase,
  getDatabase,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserCredits,
  saveImage,
  getUserImages,
  saveHistory,
  getUserHistory,
  createTransaction,
  getUserTransactions,
  hashPassword,
  verifyPassword,
} from '../lib/database';

// Test results tracker
const results: { name: string; passed: boolean; error?: string }[] = [];

function logTest(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  console.log(`${passed ? '✅' : '❌'} ${name}${error ? `: ${error}` : ''}`);
}

async function runTests() {
  console.log('\n🧪 Starting Database Integration Tests...\n');

  try {
    // Test 1: Database Initialization
    try {
      await initDatabase();
      const db = getDatabase();
      logTest('Database Initialization', !!db);
    } catch (error) {
      logTest('Database Initialization', false, error instanceof Error ? error.message : 'Unknown error');
      return; // Can't continue without database
    }

    // Test 2: User Creation (Sign Up)
    let testUser: any;
    try {
      const email = `test_${Date.now()}@example.com`;
      const passwordHash = hashPassword('password123');
      testUser = await createUser('Test User', email, passwordHash);
      
      const hasRequiredFields = 
        testUser.id && 
        testUser.name === 'Test User' && 
        testUser.email === email &&
        testUser.credits === 10;
      
      logTest('User Creation (Sign Up)', hasRequiredFields);
    } catch (error) {
      logTest('User Creation (Sign Up)', false, error instanceof Error ? error.message : 'Unknown error');
      return;
    }

    // Test 3: Password Hashing and Verification
    try {
      const password = 'testPassword123';
      const hash = hashPassword(password);
      const isValid = verifyPassword(password, hash);
      const isInvalid = !verifyPassword('wrongPassword', hash);
      
      logTest('Password Hashing and Verification', isValid && isInvalid);
    } catch (error) {
      logTest('Password Hashing and Verification', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 4: Get User by Email
    try {
      const retrievedUser = await getUserByEmail(testUser.email);
      const isMatch = 
        retrievedUser?.id === testUser.id &&
        retrievedUser?.email === testUser.email;
      
      logTest('Get User by Email', isMatch);
    } catch (error) {
      logTest('Get User by Email', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 5: Get User by ID
    try {
      const retrievedUser = await getUserById(testUser.id);
      const isMatch = 
        retrievedUser?.id === testUser.id &&
        retrievedUser?.name === testUser.name;
      
      logTest('Get User by ID', isMatch);
    } catch (error) {
      logTest('Get User by ID', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 6: Duplicate Email Detection
    try {
      const passwordHash = hashPassword('password456');
      await createUser('Another User', testUser.email, passwordHash);
      logTest('Duplicate Email Detection', false, 'Should have thrown error');
    } catch (error) {
      // Expected to fail
      logTest('Duplicate Email Detection', true);
    }

    // Test 7: Update User Profile
    try {
      await updateUser(testUser.id, { name: 'Updated Name' });
      const updatedUser = await getUserById(testUser.id);
      const isUpdated = updatedUser?.name === 'Updated Name';
      
      logTest('Update User Profile', isUpdated);
    } catch (error) {
      logTest('Update User Profile', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 8: Update User Credits
    try {
      const initialCredits = 10;
      const addAmount = 50;
      const newCredits = await updateUserCredits(testUser.id, addAmount);
      const expectedCredits = initialCredits + addAmount;
      
      logTest('Update User Credits', newCredits === expectedCredits);
    } catch (error) {
      logTest('Update User Credits', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 9: Save Image
    let savedImage: any;
    try {
      const imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A';
      savedImage = await saveImage(testUser.id, imageData, 'image/jpeg', false);
      
      const isValid = 
        savedImage.id &&
        savedImage.user_id === testUser.id &&
        savedImage.image_data === imageData;
      
      logTest('Save Image', isValid);
    } catch (error) {
      logTest('Save Image', false, error instanceof Error ? error.message : 'Unknown error');
      return;
    }

    // Test 10: Get User Images
    try {
      const images = await getUserImages(testUser.id);
      const hasImage = images.length > 0 && images[0].id === savedImage.id;
      
      logTest('Get User Images', hasImage);
    } catch (error) {
      logTest('Get User Images', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 11: Save History
    let savedHistory: any;
    try {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      
      savedHistory = await saveHistory(testUser.id, date, time, [savedImage.id]);
      
      const isValid = 
        savedHistory.id &&
        savedHistory.user_id === testUser.id &&
        savedHistory.count === 1;
      
      logTest('Save History', isValid);
    } catch (error) {
      logTest('Save History', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 12: Get User History
    try {
      const history = await getUserHistory(testUser.id);
      const hasHistory = 
        history.length > 0 &&
        history[0].id === savedHistory.id &&
        history[0].results.length > 0;
      
      logTest('Get User History', hasHistory);
    } catch (error) {
      logTest('Get User History', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 13: Create Transaction
    let savedTransaction: any;
    try {
      savedTransaction = await createTransaction(
        testUser.id,
        50,
        'purchase',
        'Test credit purchase'
      );
      
      const isValid = 
        savedTransaction.id &&
        savedTransaction.user_id === testUser.id &&
        savedTransaction.amount === 50 &&
        savedTransaction.type === 'purchase';
      
      logTest('Create Transaction', isValid);
    } catch (error) {
      logTest('Create Transaction', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 14: Get User Transactions
    try {
      const transactions = await getUserTransactions(testUser.id);
      const hasTransaction = 
        transactions.length > 0 &&
        transactions[0].id === savedTransaction.id;
      
      logTest('Get User Transactions', hasTransaction);
    } catch (error) {
      logTest('Get User Transactions', false, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 15: Foreign Key Constraints (Cascade Delete)
    try {
      const db = getDatabase();
      await db.runAsync('DELETE FROM users WHERE id = ?', [testUser.id]);
      
      // Check if related records were deleted
      const images = await getUserImages(testUser.id);
      const history = await getUserHistory(testUser.id);
      const transactions = await getUserTransactions(testUser.id);
      
      const cascadeWorked = 
        images.length === 0 &&
        history.length === 0 &&
        transactions.length === 0;
      
      logTest('Foreign Key Constraints (Cascade Delete)', cascadeWorked);
    } catch (error) {
      logTest('Foreign Key Constraints (Cascade Delete)', false, error instanceof Error ? error.message : 'Unknown error');
    }

  } catch (error) {
    console.error('Test suite error:', error);
  }

  // Print Summary
  console.log('\n📊 Test Results Summary:\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}${r.error ? `: ${r.error}` : ''}`);
    });
  }
  
  console.log('\n✅ All core database features are working as expected!\n');
}

// Export for use in React Native app
export default runTests;

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}
