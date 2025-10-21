# Fashion Muse Studio - AI Coding Guide

## Architecture Overview

This is a **cross-platform React Native app** built with Expo Router and managed by Rork platform. The app generates AI-powered fashion photoshoots from user images.

**Key Stack:**
- **Frontend:** React Native 0.79 + Expo 53 + Expo Router (file-based routing)
- **Backend:** Hono server with tRPC for type-safe APIs
- **State:** React Context (AuthContext, GenerationContext) + Zustand potential
- **Styling:** Custom glass morphism design system, no UI library
- **Type Safety:** TypeScript strict mode throughout

**Critical Flows:**
1. User uploads image via `ImageUploader` component
2. `GenerationContext` manages state and calls external AI API (`https://toolkit.rork.com/images/edit/`)
3. Generated images stored in history with AsyncStorage
4. Custom glass-styled UI components provide premium aesthetic

## Project Structure Patterns

```
app/              # File-based routes (Expo Router)
  (tabs)/         # Tab navigation group - generate, results, history, settings
  _layout.tsx     # Root layout with providers (Auth, Generation, ErrorBoundary)
  plans.tsx       # Modal screen for credit purchases
backend/          # API layer
  hono.ts         # Hono server entry, tRPC middleware setup
  trpc/
    app-router.ts       # Centralized tRPC router (auth, user, credits, example)
    create-context.ts   # tRPC context factory with superjson transformer
    routes/             # Organized by feature (auth/, credits/, user/)
      */route.ts        # Individual procedures with Zod schemas
components/       # Reusable UI components (ALL use glass morphism)
contexts/         # React Context providers (AuthContext, GenerationContext)
constants/        # Design system (colors.ts, glassStyles.ts)
```

## Development Commands

```bash
# Start dev server with Rork CLI (tunneled for device testing)
bun run start           # Mobile preview (scan QR)
bun run start-web       # Web browser preview
bun run start-web-dev   # Web with debug logs (DEBUG=expo*)

# Lint
bun run lint           # ESLint with expo config
```

**Note:** Uses custom Rork CLI (`bunx rork start`) instead of standard `expo start`. The `-p 89f4413u0flgij4dba864` flag is project-specific identifier.

## Critical Conventions

### Glass Morphism Design System

ALL UI components use the glass morphism aesthetic defined in `constants/glassStyles.ts`:
- `glassStyles.glass3DSurface` - Containers, panels, cards
- `glassStyles.glass3DButton` - Interactive elements
- `glassStyles.activeButton` / `glassStyles.activeButtonText` - Selected states
- Color palette in `COLORS` constant (bgColor, lightColor1-3, silverLight/Mid/Dark)

**Example:** When creating buttons, use `GlowingButton` component or apply `glassStyles.glass3DButton` + gradient layers. Never use plain backgrounds.

### Component Patterns

**GlassPanel Component:**
```tsx
// Wraps content with blur effect + glass styling
<GlassPanel radius={28} intensity={25}>
  {/* content */}
</GlassPanel>
```
- Uses `expo-blur` BlurView on native, fallback on web
- Always includes top highlight layer for 3D glass effect

**GlowingButton Component:**
```tsx
<GlowingButton 
  variant="primary"  // or "default" | "small"
  text="Generate"
  onPress={handleGenerate}
  icon={<SomeIcon />}
/>
```
- `variant="primary"` adds animated glow ring (pulsing opacity)
- Multi-layer: gradient border → inner gradient → blur → shine layer → content
- Press animations with `Animated.spring`

### tRPC Route Organization

Each route is a **separate file** exporting a procedure:
```typescript
// backend/trpc/routes/auth/sign-in/route.ts
import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const signInInputSchema = z.object({ email: z.string().email(), password: z.string() });

export const signInProcedure = publicProcedure
  .input(signInInputSchema)
  .mutation(async ({ input }) => {
    // Implementation
  });
```

Then imported in `app-router.ts`:
```typescript
export const appRouter = createTRPCRouter({
  auth: createTRPCRouter({
    signIn: signInProcedure,
  }),
});
```

**Always use superjson transformer** (already configured in `create-context.ts` and `lib/trpc.ts`).

### Context Providers Pattern

Contexts use **custom hooks for type safety**:
```tsx
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Root layout wraps app** (`app/_layout.tsx`):
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

### Image Generation Flow

`GenerationContext.generateImages()` is the core AI integration:
1. Converts local file URIs to base64 (FileReader API)
2. Iterates through `generationCount` (1-4 images)
3. Rotates through 4 predefined `FASHION_PROMPTS` (strict same-person/same-clothes prompts)
4. POSTs to `https://toolkit.rork.com/images/edit/` with 120s timeout
5. Updates state progressively as each image completes
6. Auto-saves to history with AsyncStorage

**Error Handling:** Network failures, timeouts (AbortController), large images (413), rate limits (429) - all have specific user messages.

### Platform-Specific Handling

```tsx
// Blur effects
Platform.OS === 'web' 
  ? <View style={{ backgroundColor: 'rgba(...)' }} />
  : <BlurView intensity={25} />

// Haptics (mobile only)
if (Platform.OS !== 'web') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

// Alerts
Platform.OS === 'web' ? alert(msg) : Alert.alert('Title', msg);
```

### TypeScript Path Aliases

Use `@/*` for absolute imports:
```typescript
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import GlassPanel from '@/components/GlassPanel';
```

Configured in `tsconfig.json` paths.

## Common Tasks

**Add new tRPC route:**
1. Create `backend/trpc/routes/{feature}/{action}/route.ts`
2. Define Zod schema + export procedure
3. Import in `backend/trpc/app-router.ts`
4. Type inference auto-updates in `lib/trpc.ts` via `AppRouter` type

**Add new screen:**
1. Create file in `app/` (auto-routes via Expo Router)
2. Use `Stack.Screen` in parent `_layout.tsx` for options
3. Wrap content in `<LinearGradient>` with `Colors.dark.background`
4. Use `useSafeAreaInsets()` for safe area padding

**Create new glass component:**
1. Import `glassStyles` and `COLORS` from `constants/glassStyles`
2. Layer structure: glass3DSurface → BlurView → LinearGradient → content
3. Use `topHighlight` view for 3D effect (see `GlassPanel.tsx`)
4. Add shadows: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`

**Access user state:**
```tsx
const { user, isAuthenticated, signIn, updateCredits } = useAuth();
const { selectedImage, generateImages, isGenerating } = useGeneration();
```

## External Dependencies

- **Rork Toolkit API:** `https://toolkit.rork.com/images/edit/` - External AI image generation (no auth, POST JSON with base64 images)
- **AsyncStorage:** `@react-native-async-storage/async-storage` - Persists user data and history
- **Expo Router:** File-based routing with typed routes (`experiments.typedRoutes: true`)
- **Lucide Icons:** `lucide-react-native` for SVG icons (NOT using Expo vector icons)

## Gotchas

- **Bun is package manager** (not npm/yarn) - use `bun i`, `bun run`
- **Rork CLI** wraps Expo CLI - commands differ from standard Expo docs
- **No native modules** currently - app runs in Expo Go (no custom dev client needed)
- **Web fallbacks required** for BlurView, Haptics, native image pickers
- **Image API timeout** is 120s - show loading states immediately
- **History is local only** (AsyncStorage) - not synced to backend yet
- **Auth uses SQLite database with password hashing and validation** (signIn/signUp validate against database)
