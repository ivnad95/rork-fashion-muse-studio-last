# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fashion Muse Studio** is a cross-platform React Native mobile app that generates AI-powered fashion photoshoots from user images. Built with Expo Router and managed by the Rork platform, it features a premium liquid glass morphism design aesthetic.

**Tech Stack:**
- React Native 0.79.6 + Expo 53
- Expo Router (file-based routing)
- Hono + tRPC for type-safe backend APIs
- React Context for state management (AuthContext, GenerationContext)
- SQLite database for local data persistence
- TypeScript (strict mode)
- Bun as package manager

## Development Commands

```bash
# Start development server with mobile preview
bun run start

# Start web preview in browser
bun run start-web

# Start web preview with debug logging
bun run start-web-dev

# Run linter
bun run lint

# Check dependencies for compatibility
bun run check

# Generate native projects for iOS/Android
bun run prebuild
```

**Important:** This project uses the custom Rork CLI (`bun x rork start`) instead of standard Expo CLI. The `-p 89f4413u0flgij4dba864` flag is a project-specific identifier required by Rork.

## Project Architecture

### Directory Structure

```
app/                    # File-based routes (Expo Router)
  (tabs)/               # Tab navigation group
    generate.tsx        # Main image upload and generation screen
    results.tsx         # Display generated images
    history.tsx         # User's generation history
    settings.tsx        # User settings and account management
    _layout.tsx         # Tab layout configuration with CustomTabBar
  _layout.tsx           # Root layout with providers (Auth, Generation, ErrorBoundary)
  index.tsx             # Entry redirect
  plans.tsx             # Modal screen for credit purchases
  +not-found.tsx        # 404 screen

backend/                # API layer
  hono.ts               # Hono server entry point with tRPC middleware
  trpc/
    app-router.ts       # Centralized tRPC router (merges all routes)
    create-context.ts   # tRPC context factory with superjson transformer
    routes/             # Feature-organized route modules
      auth/
        sign-in/route.ts
        sign-up/route.ts
      credits/route.ts
      user/route.ts
      example/route.ts

components/             # Reusable UI components (all use glass morphism)
  GlassPanel.tsx        # Container with blur effect and glass styling
  GlowingButton.tsx     # Multi-layer button with animated glow
  GlassyTitle.tsx       # Styled text with glass effect
  CustomTabBar.tsx      # Tab navigation bar with glass design
  ImageUploader.tsx     # Image picker with drag-and-drop
  CountSelector.tsx     # Segmented control for generation count
  PremiumLiquidGlass.tsx # Full-screen gradient background
  ErrorBoundary.tsx     # Error boundary component

contexts/               # React Context providers
  AuthContext.tsx       # Authentication state and operations
  GenerationContext.tsx # Image generation state and AI API integration

constants/
  colors.ts             # Color palette and theme definitions
  glassStyles.ts        # Glass morphism design system

lib/
  database.ts           # SQLite database operations and schema
  trpc.ts               # tRPC client configuration
```

### Key Architectural Patterns

**1. File-Based Routing (Expo Router)**
- Routes are defined by file structure in `app/` directory
- `(tabs)/` creates a tab navigator group
- `_layout.tsx` files configure layouts and navigation options
- Typed routes enabled via `experiments.typedRoutes: true` in app.json

**2. tRPC Backend Organization**
- Each feature has its own route file exporting procedures
- Routes are organized in subdirectories: `backend/trpc/routes/{feature}/{action}/route.ts`
- All routes merged in `app-router.ts` to create centralized `AppRouter`
- Use superjson transformer for Date/Map/Set serialization

**3. React Context State Management**
- `AuthContext`: User authentication, session management, credits
- `GenerationContext`: Image selection, AI generation, history management
- Root layout (`app/_layout.tsx`) wraps app with providers in correct order:
  ```tsx
  <ErrorBoundary>
    <AuthProvider>
      <GenerationProvider>
        <GestureHandlerRootView>
          <Stack />
        </GestureHandlerRootView>
      </GenerationProvider>
    </AuthProvider>
  </ErrorBoundary>
  ```

**4. SQLite Database with Local Authentication**
- Database schema: `users`, `images`, `history`, `history_images`, `transactions`
- Password hashing uses SHA-256 with random salt via expo-crypto
- Auth flow validates credentials against local SQLite database
- Data persists locally; AsyncStorage stores session tokens
- Database initialized in `AuthContext` on app mount

**5. Glass Morphism Design System**
- All UI components follow liquid glass aesthetic defined in `constants/glassStyles.ts`
- Core styles: `glass3DSurface`, `glass3DButton`, `activeButton`
- Color palette: `COLORS` constant (bgColor, lightColor1-3, silverLight/Mid/Dark)
- Multi-layer approach: gradient border → inner gradient → blur → shine layer → content
- Use `expo-blur` BlurView on native, fallback rgba backgrounds on web

## Critical Development Patterns

### Adding a New tRPC Route

1. Create route file: `backend/trpc/routes/{feature}/{action}/route.ts`
2. Define Zod input schema and export procedure:
   ```typescript
   import { z } from 'zod';
   import { publicProcedure } from '../../../create-context';

   const inputSchema = z.object({
     email: z.string().email(),
     password: z.string()
   });

   export const myProcedure = publicProcedure
     .input(inputSchema)
     .mutation(async ({ input, ctx }) => {
       // Implementation
     });
   ```
3. Import and register in `backend/trpc/app-router.ts`:
   ```typescript
   import { myProcedure } from './routes/feature/action/route';

   export const appRouter = createTRPCRouter({
     feature: createTRPCRouter({
       action: myProcedure,
     }),
   });
   ```
4. Type inference automatically updates in `lib/trpc.ts` via `AppRouter` type

### Creating Glass Morphism Components

**Required imports:**
```typescript
import { glassStyles, COLORS } from '@/constants/glassStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
```

**Component structure pattern:**
```tsx
<View style={[glassStyles.glass3DSurface, { /* custom styles */ }]}>
  {/* Top highlight for 3D effect */}
  <View style={styles.topHighlight} />

  {Platform.OS !== 'web' ? (
    <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['rgba(...)', 'rgba(...)']} style={...}>
        {/* Content */}
      </LinearGradient>
    </BlurView>
  ) : (
    <View style={{ backgroundColor: 'rgba(...)' }}>
      {/* Content */}
    </View>
  )}
</View>
```

**Always include:**
- Shadow properties for depth: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`
- Top highlight layer (`topHighlight`) for glossy 3D effect
- Platform-specific blur handling (native vs web)

### Image Generation Flow

The AI generation process is handled by `GenerationContext.generateImages()`:

1. **Image preprocessing:** Converts file:// URIs to base64 using FileReader API
2. **Batch generation:** Iterates through `generationCount` (1-4 images)
3. **Prompt rotation:** Cycles through 4 predefined `FASHION_PROMPTS` with strict same-person/same-clothes instructions
4. **API call:** POSTs to `https://toolkit.rork.com/images/edit/` with:
   - 120-second timeout (AbortController)
   - Base64 image data
   - Prompt text
5. **Progressive updates:** Updates `generatedImages` state after each successful generation
6. **Auto-save:** Saves all results to SQLite database and creates history entry
7. **Error handling:** Specific user messages for timeouts, network failures, rate limits (429), large images (413)

### Database Operations

**Common patterns:**

```typescript
import {
  initDatabase,
  createUser,
  getUserByEmail,
  saveImage,
  saveHistory
} from '@/lib/database';

// Initialize database (call in AuthContext on mount)
await initDatabase();

// User operations
const user = await createUser(name, email, passwordHash);
const existingUser = await getUserByEmail(email);
await updateUserCredits(userId, -4); // Deduct 4 credits

// Image operations
const savedImage = await saveImage(userId, base64Data, 'image/jpeg', false);
const images = await getUserImages(userId);

// History operations
await saveHistory(userId, date, time, imageIdArray);
const history = await getUserHistory(userId);
```

**Important:** All database operations check `isDatabaseSupported()` and gracefully handle web platform (returns empty/null).

### Authentication Flow

1. **App startup:** `AuthContext` initializes database and checks AsyncStorage for session
2. **Sign in:** Validates email/password against SQLite, saves session to AsyncStorage
3. **Sign up:** Creates new user with hashed password, auto-signs in
4. **Session persistence:** User ID stored in AsyncStorage, full user data loaded from database on restart
5. **Sign out:** Clears AsyncStorage session

### Accessing State in Components

```typescript
// Authentication
const { user, isAuthenticated, signIn, signUp, signOut, updateCredits } = useAuth();

// Generation
const {
  selectedImage,
  generationCount,
  generateImages,
  isGenerating,
  generatedImages,
  history
} = useGeneration();

// Check loading states
if (isGenerating) {
  // Show loading UI
}
```

### Platform-Specific Code

```typescript
import { Platform, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

// Blur effects
Platform.OS === 'web'
  ? <View style={{ backgroundColor: 'rgba(...)' }} />
  : <BlurView intensity={25} tint="dark" />

// Haptic feedback (mobile only)
if (Platform.OS !== 'web') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

// Alerts
Platform.OS === 'web'
  ? alert(message)
  : Alert.alert('Title', message);
```

### TypeScript Path Aliases

Always use `@/*` for absolute imports (configured in `tsconfig.json`):

```typescript
import Colors from '@/constants/colors';
import { glassStyles } from '@/constants/glassStyles';
import { useAuth } from '@/contexts/AuthContext';
import GlassPanel from '@/components/GlassPanel';
import { trpc } from '@/lib/trpc';
```

## External Dependencies & Integrations

**Rork Toolkit API:**
- Endpoint: `https://toolkit.rork.com/images/edit/`
- No authentication required
- POST JSON with `{ prompt: string, images: [{ type: 'image', image: base64String }] }`
- Returns `{ image: { base64Data: string, mimeType: string } }`
- 120-second timeout, handle rate limiting (429 status)

**AsyncStorage:**
- Used for session persistence (`@fashion_ai_user_session`)
- Stores minimal data (user ID only)
- Full user data retrieved from SQLite database

**Expo Router:**
- File-based routing with typed routes
- Use `router.push()`, `router.back()`, `router.replace()` for navigation
- Tab navigation configured in `app/(tabs)/_layout.tsx`

## Important Gotchas

1. **Package Manager:** Use `bun` exclusively (not npm/yarn). Commands: `bun i`, `bun run`, `bunx`
2. **Rork CLI:** Wraps Expo CLI with custom flags. Don't try to use `expo start` directly
3. **No Native Modules:** App runs in Expo Go without custom development builds
4. **Web Platform Limitations:**
   - SQLite database not supported (returns empty/null gracefully)
   - BlurView requires fallback backgrounds
   - Haptics unavailable
   - Image picker uses web file input
5. **Image Generation Timeout:** 120-second limit per image, show loading states immediately
6. **History Storage:** Currently local-only (SQLite + AsyncStorage), not synced to cloud
7. **Auth is Local:** Uses SQLite with password hashing, no remote authentication server
8. **Base64 Images:** All images stored as base64 strings in database (data URIs with `data:image/jpeg;base64,` prefix)
9. **Expo Router Groups:** The `(tabs)` parentheses notation creates a layout group without adding to URL path

## Design System Conventions

**Color Usage:**
- Background: `Colors.dark.background` (gradient) or `Colors.dark.backgroundDeep` (solid)
- Text: `Colors.dark.text` (primary), `Colors.dark.textSecondary`
- Accents: `Colors.dark.tint`, `Colors.dark.accent`
- Glass layers: `COLORS.lightColor1/2/3` for gradients

**Component Hierarchy:**
1. Full-screen gradient: `<PremiumLiquidGlass />` or `<LinearGradient>` with Colors.dark.background
2. Glass panels: `<GlassPanel>` for sections
3. Buttons: `<GlowingButton>` for primary actions
4. Safe areas: Use `useSafeAreaInsets()` from `react-native-safe-area-context`

**Animation Guidelines:**
- Use `Animated.spring()` for interactive elements
- Use `Animated.timing()` with easing for entrances/exits
- Glow effects: Animate opacity between 0.5-1 with loop
- Press animations: Scale down to 0.95, spring back to 1

## Common Debugging Commands

```bash
# Clear Expo cache
bunx expo start --clear

# Reset dependencies
rm -rf node_modules bun.lock
bun install

# Check for outdated dependencies
bun run check

# View detailed expo logs
bun run start-web-dev  # Includes DEBUG=expo* logging
```

## Testing on Devices

**Mobile (iOS/Android):**
1. Install Rork app or Expo Go on device
2. Run `bun run start`
3. Scan QR code with camera (iOS) or Expo Go app (Android)
4. Ensure device and computer on same WiFi network
5. If connection fails, use tunnel mode: `bun run start -- --tunnel`

**Web:**
- Run `bun run start-web`
- Note: Some native features limited (BlurView, Haptics, SQLite)

## Important Notes for AI Assistants

- **Always create todo lists** when working on complex tasks to track progress
- **Preserve the glass morphism aesthetic** in all UI changes - never use plain backgrounds
- **Test both web and native platforms** when modifying shared components
- **Follow tRPC patterns** for all new API endpoints - keep routes organized by feature
- **Handle platform differences** explicitly with Platform.OS checks
- **Validate all user inputs** with Zod schemas in tRPC procedures
- **Include error handling** for all async operations, especially AI generation
- **Update history automatically** after successful image generation
- **Deduct credits properly** before generation (validate sufficient balance)
- **Use TypeScript strictly** - no `any` types, leverage type inference from tRPC
