# Testing Guide for Database Integration

## Overview
This app now uses a local SQLite database for storing users, images, and transaction history instead of AsyncStorage.

## Database Features Implemented

### 1. User Authentication
- **Sign Up**: Creates user in database with hashed password
- **Sign In**: Validates credentials against database
- **Session Management**: Stores session info in AsyncStorage, user data in SQLite

### 2. Image Storage
- Generated images are stored in the database with base64 encoding
- Each image is linked to a user
- Images are organized into history sessions

### 3. Credits System
- User credits are persisted in the database
- Transactions are recorded for purchases and deductions
- Credits update when generating images or purchasing plans

### 4. History Persistence
- Generation history is stored in the database
- Each history entry links to multiple images
- History is loaded from database when user logs in

## Manual Testing Steps

### Test 1: User Registration
1. Open the app
2. Go to Settings tab
3. Scroll to "Sign Up" section
4. Enter:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
5. Tap "Sign Up"
6. **Expected**: User created with 10 initial credits

### Test 2: User Sign In
1. Sign out if logged in
2. Go to Settings tab
3. Scroll to "Sign In" section
4. Enter:
   - Email: "test@example.com"
   - Password: "password123"
5. Tap "Sign In"
6. **Expected**: User logged in, credits displayed

### Test 3: Invalid Credentials
1. Try to sign in with wrong password
2. **Expected**: Error message "Invalid email or password"

### Test 4: Duplicate Email
1. Try to sign up with existing email
2. **Expected**: Error message "Email already registered"

### Test 5: Image Generation (requires user login)
1. Sign in to the app
2. Go to Generate tab
3. Upload an image
4. Select generation count (e.g., 2 images)
5. Tap "Generate Photoshoot"
6. **Expected**: 
   - Images generated and displayed
   - Images saved to database
   - History entry created

### Test 6: History Persistence
1. After generating images, go to History tab
2. **Expected**: Generated images appear in history
3. Close and restart the app
4. Sign in again
5. Go to History tab
6. **Expected**: History persists across app restarts

### Test 7: Credits Purchase (via tRPC)
This requires calling the tRPC endpoint:
```typescript
// Example call from code:
trpc.credits.purchase.mutate({
  userId: user.id,
  planId: 'starter',
  credits: 50,
  price: 9.99
});
```
**Expected**: Credits updated in database and transaction recorded

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's name
- `email`: Unique email
- `password_hash`: Hashed password
- `profile_image`: Optional profile image
- `credits`: Current credit balance
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Images Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `image_data`: Base64 encoded image
- `mime_type`: Image MIME type
- `is_original`: Flag for original vs generated
- `created_at`: Timestamp

### History Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `date`: Generation date
- `time`: Generation time
- `count`: Number of images
- `thumbnail_image_id`: Foreign key to images
- `created_at`: Timestamp

### History_Images Table
- `history_id`: Foreign key to history
- `image_id`: Foreign key to images
- `order_index`: Display order

### Transactions Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `amount`: Credits amount
- `type`: 'purchase' | 'deduction' | 'refund'
- `description`: Optional description
- `created_at`: Timestamp

## Security Features

### Password Hashing
- Passwords are hashed before storage
- Basic hash function for local app (production should use bcrypt)
- Passwords never stored in plain text

### Secure ID Generation
- Uses `expo-crypto.randomUUID()` for secure IDs
- Fallback to timestamp-based IDs if crypto unavailable
- No use of `Math.random()` for security-sensitive operations

## Known Limitations

1. **Password Security**: Current hashing is basic. For production, use bcrypt or similar.
2. **Local Only**: Database is local to the device, no cloud sync.
3. **No Backup**: User data not backed up automatically.
4. **Image Size**: Large images may impact database performance.

## Troubleshooting

### Database Not Initializing
- Check console for errors in `initDatabase()`
- Ensure expo-sqlite is properly installed
- Try clearing app data and reinstalling

### Session Lost After Restart
- Check AsyncStorage for session data
- Verify database has user record
- Check AuthContext initialization

### Images Not Saving
- Check console for database errors
- Verify user is logged in
- Check available storage space

### Credits Not Updating
- Verify database transaction is committing
- Check user record in database
- Ensure no errors in updateUserCredits function

## Development Notes

- Database file: `fashionmuse.db` (in app's document directory)
- Database is excluded from git via `.gitignore`
- Foreign key constraints are enabled
- All queries use prepared statements for security
