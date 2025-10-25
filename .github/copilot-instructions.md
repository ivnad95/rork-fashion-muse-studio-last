# Fashion Muse Studio – Copilot Guide

## Core Context
- AI fashion photoshoot app built with Expo Router + React Native 0.79.6, orchestrated by the Rork platform (see app/(tabs)/generate.tsx).
- Hono+tRPC backend co-exists in backend/ and is consumed through the typed client in lib/trpc.ts.
- React Context (Auth, Generation, Theme, Toast) owns runtime state; Zustand is not currently used despite being installed.
- Bun is the only package manager; the start scripts wrap `bun x rork start` so avoid calling `expo start` directly.
- TypeScript runs in strict mode with the `@/*` path alias; prefer absolute imports to maintain consistency across platforms.

## Architecture & State
- app/_layout.tsx composes ErrorBoundary → ThemeProvider → ToastProvider → AuthProvider → GenerationProvider before rendering the router; preserve this order when introducing new providers.
- AuthContext.tsx initializes SQLite, recreates guest sessions via AsyncStorage keys (`@fashion_ai_user_session`, `@fashion_ai_guest_credits`), and enforces credit accounting through updateUserCredits.
- GenerationContext.tsx layers prompts from constants/styles.ts with fixed pose prompts, enforces a 4 MB upload limit, a 180 s timeout, and two retries per image, then persists results + history via lib/database.ts.
- ToastContext.tsx and ThemeContext.tsx supply glass-themed notifications and theme switching (AsyncStorage-backed); consume them with useToast/useTheme rather than duplicating state.
- scripts/add-credits.ts injects dev helpers when NODE_ENV===development—keep helper imports guarded to avoid leaking into production builds.

## Data & Backend
- lib/database.ts boots Expo SQLite on native and returns safe fallbacks on web; wrap new DB code with Platform checks or reuse the exported helpers.
- Tables cover users, images, history, history_images, transactions, and favorites; secure IDs come from expo-crypto’s randomUUID helper.
- Password flows must use hashPassword/verifyPassword to keep the SHA-256+salt contract that AuthContext expects.
- backend/trpc/routes/* houses one procedure per file with Zod schemas; register them in backend/trpc/app-router.ts so AppRouter types cascade to lib/trpc.ts.
- services/ exposes authService, creditService, generationService, and storageService—update service logic alongside contexts to keep business rules centralized.

## UI & Styling
- constants/glassStyles.ts defines the Deep Sea Glass tokens; always use glassStyles.glassPanel/glassButton (or primitives like GlassPanel.tsx, GlowingButton.tsx) instead of legacy neumorphicStyles.ts.
- PremiumLiquidGlass and GlassContainer establish background gradients; wrap new screens with these before placing glass surfaces.
- constants/styles.ts drives the style selector chips; GenerationContext expects ids like `casual`, so reuse getStyleById/getStylePrompt when adding variants.
- app/(tabs)/history.tsx and settings.tsx still contain old panels—follow the migration notes in AGENTS.md to replace them with glass primitives.
- Lucide icons (`lucide-react-native`) and Platform-specific fallbacks (BlurView vs rgba View) are standard; mirror the patterns in components/GlassPanel.tsx when building new UI.

## Workflows & Gotchas
- Primary commands live in package.json: `bun run start` (mobile tunnel), `bun run start-web`, `bun run start-web-dev` (DEBUG=expo*).
- Rork CLI requires the project flag `-p 89f4413u0flgij4dba864`; keep it in any custom automation.
- SQLite is unavailable on web builds, so persistence work must be exercised on device/emulator; lib/database.ts gracefully no-ops when unsupported.
- Generation flows store base64 URIs directly—respect MAX_IMAGE_SIZE, timeout, and retry guards when touching GenerationContext or generationService.
- __tests__/database.test.ts covers the DB contract but no npm script runs it; execute with Bun manually when migrating schema or auth logic.
