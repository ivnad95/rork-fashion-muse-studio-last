# Database Migration Guide

## Overview
This app has been upgraded from AsyncStorage to SQLite database for better data management and persistence.

## What Changed

### Before (AsyncStorage)
- User data stored as JSON in `@fashion_ai_user`
- No password validation
- Credits stored in user object
- History stored in GenerationContext state (memory only)
- Images stored as base64 in history (memory only)

### After (SQLite Database)
- Users table with hashed passwords
- Images table with user relationships
- History table with proper relationships
- Transactions table for credit purchases
- Proper foreign key constraints
- Data persists across app restarts

## Automatic Migration

The app will automatically handle migration:

1. **On First Launch**: Database is initialized with empty tables
2. **Old Session Data**: If an old AsyncStorage session exists, it will be cleared
3. **User Must Re-register**: Users need to create a new account

## Manual Migration (if needed)

If you need to preserve existing user data:

### 1. Export Old Data
```typescript
// Run this in your app before updating
import AsyncStorage from '@react-native-async-storage/async-storage';

async function exportOldData() {
  const userData = await AsyncStorage.getItem('@fashion_ai_user');
  console.log('Old user data:', userData);
  // Save this data somewhere
}
```

### 2. Import to New Database
```typescript
// After update, create user with old data
import { createUser, updateUserCredits } from '@/lib/database';

async function importOldUser(oldUserData) {
  const oldUser = JSON.parse(oldUserData);
  
  // Create new user (they'll need to set a password)
  const newUser = await createUser(
    oldUser.name,
    oldUser.email,
    hashPassword('temporary_password') // User should change this
  );
  
  // Restore credits
  const creditDiff = oldUser.credits - 10; // 10 is default
  if (creditDiff > 0) {
    await updateUserCredits(newUser.id, creditDiff);
  }
}
```

## Breaking Changes

### Auth Context
- `signIn()` and `signUp()` now validate against database
- Passwords are required and must be at least 6 characters
- Email must be unique in database

### Generation Context
- `generateImages()` now requires `userId` parameter
- `saveToHistory()` now requires `userId` parameter
- `loadHistory()` new method to load from database
- `deleteHistoryItem()` new method to delete from database

### Update Your Code

If you have custom screens calling these methods:

```typescript
// Old way
const { generateImages } = useGeneration();
generateImages();

// New way
const { generateImages } = useGeneration();
const { user } = useAuth();
if (user) {
  generateImages(user.id);
}
```

```typescript
// Old way
const { saveToHistory } = useGeneration();
saveToHistory();

// New way
const { saveToHistory } = useGeneration();
const { user } = useAuth();
if (user) {
  await saveToHistory(user.id);
}
```

## Testing After Migration

1. **Test Sign Up**
   - Create a new account
   - Verify you get 10 initial credits

2. **Test Sign In**
   - Sign out
   - Sign back in
   - Verify session persists

3. **Test Image Generation**
   - Upload an image
   - Generate images
   - Verify images save to database

4. **Test History**
   - Check history tab shows generated images
   - Restart app
   - Sign in again
   - Verify history persists

5. **Test Credits**
   - Note your credit count
   - Restart app
   - Sign in again
   - Verify credits persist

## Rollback Procedure

If you need to rollback to the old version:

1. Uninstall the app
2. Reinstall the previous version
3. Your old AsyncStorage data should still be there

Note: Data created in the SQLite version will not be available in the old version.

## Support

If you encounter issues:

1. Check the console for error messages
2. Try clearing app data and signing up again
3. Check TESTING.md for common issues
4. File an issue on GitHub with:
   - Error messages from console
   - Steps to reproduce
   - Device/platform information

## Database File Location

- **iOS**: `~/Library/Application Support/[app-bundle-id]/SQLite/fashionmuse.db`
- **Android**: `/data/data/[package-name]/databases/fashionmuse.db`
- **Web**: IndexedDB (browser-specific location)

## Backup Recommendations

Since the database is local only:

1. **Regular Exports**: Consider implementing export functionality
2. **Cloud Sync**: Future enhancement to sync to cloud storage
3. **Device Backup**: Use iCloud/Google Drive device backups

## Performance Considerations

### Image Storage
- Images are stored as base64 strings
- Large number of images may slow down queries
- Consider implementing pagination for history

### Database Size
- Monitor database file size
- Implement cleanup for old history items
- Consider image compression

## Future Enhancements

Planned improvements:

1. **Cloud Sync**: Sync database to cloud storage
2. **Backup/Restore**: Built-in backup functionality
3. **Image Optimization**: Compress images before storage
4. **Pagination**: Paginate history queries
5. **Search**: Add search functionality for history
6. **Export**: Export user data as JSON
