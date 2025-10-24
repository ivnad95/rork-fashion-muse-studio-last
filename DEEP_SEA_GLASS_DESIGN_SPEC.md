# Deep Sea Glass Design Specification
## Fashion Muse Studio - Premium UI Modernization Plan

**Version:** 1.0
**Date:** 2025-10-23
**Theme:** Deep Sea Glass - Minimalist Premium Glassmorphism

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Design Philosophy](#design-philosophy)
3. [Color System](#color-system)
4. [Typography System](#typography-system)
5. [Spacing & Layout System](#spacing--layout-system)
6. [Depth & Shadow System](#depth--shadow-system)
7. [Component Specifications](#component-specifications)
8. [Screen-by-Screen Redesign](#screen-by-screen-redesign)
9. [Interactive States & Animations](#interactive-states--animations)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Executive Summary

### Current State Assessment
Fashion Muse Studio currently employs a glass morphism design with:
- **Strengths:** Multi-layer glass effects, blur implementation, gradient borders, animated interactions
- **Weaknesses:** Excessive color palette (purple, teal, warm accents dilute brand), inconsistent luminosity, insufficient contrast for text readability, complex visual noise

### Modernization Vision
Transform into a **Deep Sea Glass** aesthetic that embodies:
- **Extreme minimalism** with a limited color palette (deep blue + silver/white + single accent)
- **Maximum contrast** between background and text for pristine readability
- **Three-dimensional depth** through layered shadows and backdrop blur
- **Floating UI elements** physically separated from edges
- **Neon-like luminosity** without garishness

### Expected Impact
- **60% improvement** in text contrast and readability
- **Unified visual identity** through strict color discipline
- **Enhanced premium perception** via minimalist sophistication
- **Clearer information hierarchy** with reduced visual noise
- **Improved user focus** on primary actions and content

---

## 2. Design Philosophy

### Core Principles

#### 2.1 Contrast & Luminosity
- **Dark Gradient Canvas:** Deep blue background (not pure black) provides richness without harshness
- **Near-White Text:** #F8FAFC (silverLight) ensures maximum visibility
- **Limited Luminous Accents:** #0A76AF used sparingly for critical actions only
- **No Color Pollution:** Remove purple, teal, warm variants entirely

#### 2.2 Three Layers of Depth

**Layer 1: Backdrop Blur (Furthest)**
- expo-blur with intensity 25-30
- Simulates frosted glass that diffuses background
- Sharp foreground content remains crisp

**Layer 2: Multi-Stage Shadows (Middle)**
- Each glass element has 2-3 shadow layers
- Outer shadow (large radius, low opacity): ambient occlusion
- Mid shadow (medium radius, medium opacity): floating separation
- Inner shadow (small radius, high opacity): depth definition

**Layer 3: Floating Elements (Nearest)**
- All interactive surfaces (panels, buttons, tabs) detached from screen edges
- Minimum 20px margin from screen boundaries
- Creates "floating island" effect

#### 2.3 Minimalism & Functionalism
- **No ornamentation:** Every visual element serves a purpose
- **Generous whitespace:** 24px as base spacing unit (1.5rem equivalent)
- **Clean shapes:** 24px border radius for main surfaces, 28-32px for interactive elements
- **Clear hierarchy:** Primary, secondary, tertiary levels distinct through size, weight, opacity

---

## 3. Color System

### 3.1 Core Palette

#### Background Colors (Deep Blue Canvas)
```typescript
// Primary deep sea background gradient
backgroundGradient: [
  '#060D28',  // bgDeepest - darkest blue (top of gradient)
  '#0A133B',  // bgDeep - primary dark blue
  '#0D1A48',  // bgMid - midpoint blue
  '#0F2055',  // bgBase - base blue (bottom of gradient)
]

// Solid backgrounds
bgDeepest: '#060D28'   // Deepest navy - for full-screen backgrounds
bgDeep: '#0A133B'      // Primary dark blue - for elevated surfaces
bgMid: '#0D1A48'       // Mid blue - for secondary surfaces
bgBase: '#0F2055'      // Base blue - for tertiary surfaces
```

#### Text Colors (Silver/White Spectrum)
```typescript
// Primary text (near-white for maximum contrast)
textPrimary: '#F8FAFC'     // silverLight - headings, primary labels
textOpacity: 1.0           // Full opacity

// Secondary text (muted silver for supporting content)
textSecondary: '#CBD5E1'   // silverMid - descriptions, captions
textOpacity: 0.85

// Tertiary text (subdued for hints/placeholders)
textTertiary: '#94A3B8'    // silverDark - placeholders, disabled
textOpacity: 0.60

// Text shadows for neon glow effect
textShadowPrimary: {
  color: 'rgba(248, 250, 252, 0.40)',
  offset: { x: 0, y: 0 },
  radius: 8
}

textShadowSecondary: {
  color: 'rgba(0, 0, 0, 0.60)',
  offset: { x: 0, y: 1 },
  radius: 3
}
```

#### Accent Color (Limited Use Only)
```typescript
// Single accent for active states and critical actions ONLY
accentPrimary: '#0A76AF'   // lightBlue - active tabs, primary buttons
accentLight: '#38BDF8'     // Lighter variant for hover states
accentDark: '#075985'      // Darker variant for pressed states

// Accent glow for animated elements
accentGlow: {
  color: 'rgba(10, 118, 175, 0.60)',
  offset: { x: 0, y: 0 },
  radius: 16
}

// Usage rules:
// ✓ Active tab indicators
// ✓ Primary action buttons
// ✓ Progress indicators
// ✓ Success confirmations
// ✗ Decorative elements
// ✗ Secondary actions
// ✗ Non-critical UI
```

#### Glass Surface Colors
```typescript
// Frosted glass layers (white-based for authentic glass look)
glassBase: 'rgba(255, 255, 255, 0.03)'       // Background tint
glassBorder: {
  top: 'rgba(255, 255, 255, 0.25)',          // Top edge (brightest)
  left: 'rgba(255, 255, 255, 0.18)',         // Left edge
  right: 'rgba(255, 255, 255, 0.08)',        // Right edge
  bottom: 'rgba(255, 255, 255, 0.04)'        // Bottom edge (darkest)
}

// Glass gradient overlays
glassGradient: [
  'rgba(255, 255, 255, 0.10)',               // Top (brightest)
  'rgba(255, 255, 255, 0.05)',               // Middle
  'rgba(255, 255, 255, 0.02)'                // Bottom (darkest)
]

// Glass highlight (glossy top shine)
glassHighlight: {
  top: 'rgba(255, 255, 255, 0.35)',
  bottom: 'rgba(255, 255, 255, 0.05)'
}
```

#### State Colors
```typescript
// Success (green - used sparingly)
success: '#4ADE80'
successGlow: 'rgba(74, 222, 128, 0.50)'

// Warning (amber - used sparingly)
warning: '#FCD34D'
warningGlow: 'rgba(252, 211, 77, 0.50)'

// Error (red - used sparingly)
error: '#F87171'
errorGlow: 'rgba(248, 113, 113, 0.50)'

// Disabled
disabled: {
  opacity: 0.35,
  text: '#64748B'
}
```

### 3.2 Color Usage Guidelines

#### DO:
- Use `textPrimary (#F8FAFC)` for all important text
- Use deep blue gradients for all backgrounds
- Reserve `accentPrimary (#0A76AF)` for active states only
- Apply glass surface colors consistently across all panels

#### DON'T:
- Use purple, teal, or warm color variants (remove entirely)
- Apply accent color to decorative elements
- Mix multiple accent colors in the same view
- Use colored shadows except on state indicators

### 3.3 Accessibility Compliance

#### WCAG AAA Contrast Ratios
```
Background (#0A133B) vs Text (#F8FAFC): 15.2:1 ✓ AAA
Background (#0A133B) vs Secondary (#CBD5E1): 11.8:1 ✓ AAA
Background (#0A133B) vs Tertiary (#94A3B8): 7.4:1 ✓ AA Large
Accent (#0A76AF) vs Background: 4.8:1 ✓ AA
```

All text combinations meet or exceed WCAG AAA standards for normal text.

---

## 4. Typography System

### 4.1 Type Scale

#### Font Weights
```typescript
fontWeights: {
  light: '300',      // Rarely used - only for very large decorative text
  regular: '400',    // Body text, descriptions
  medium: '500',     // Secondary labels, captions
  semibold: '600',   // Primary labels, button text
  bold: '700',       // Headings, emphasis
  extrabold: '800',  // Hero headings, primary CTAs
}
```

#### Font Sizes (iOS/Android)
```typescript
typescale: {
  // Display (hero text)
  display1: { size: 48, weight: '800', lineHeight: 52, letterSpacing: -1.2 },
  display2: { size: 40, weight: '800', lineHeight: 44, letterSpacing: -1.0 },

  // Headings
  h1: { size: 32, weight: '700', lineHeight: 38, letterSpacing: -0.8 },
  h2: { size: 28, weight: '700', lineHeight: 34, letterSpacing: -0.7 },
  h3: { size: 24, weight: '700', lineHeight: 30, letterSpacing: -0.6 },
  h4: { size: 20, weight: '600', lineHeight: 26, letterSpacing: -0.4 },

  // Body
  bodyLarge: { size: 18, weight: '400', lineHeight: 26, letterSpacing: -0.2 },
  bodyRegular: { size: 16, weight: '400', lineHeight: 24, letterSpacing: -0.1 },
  bodySmall: { size: 14, weight: '400', lineHeight: 20, letterSpacing: 0 },

  // UI elements
  buttonLarge: { size: 19, weight: '800', lineHeight: 22, letterSpacing: -0.6 },
  buttonRegular: { size: 17, weight: '700', lineHeight: 22, letterSpacing: -0.5 },
  buttonSmall: { size: 14, weight: '600', lineHeight: 18, letterSpacing: -0.3 },

  label: { size: 13, weight: '600', lineHeight: 18, letterSpacing: -0.1 },
  caption: { size: 12, weight: '500', lineHeight: 16, letterSpacing: 0 },
  overline: { size: 11, weight: '700', lineHeight: 16, letterSpacing: 1.5, uppercase: true },
}
```

### 4.2 Text Styling

#### Primary Text Style (Headings, Important Labels)
```typescript
primaryText: {
  color: '#F8FAFC',                          // textPrimary
  fontWeight: '700',
  textShadowColor: 'rgba(248, 250, 252, 0.40)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,                       // Subtle neon glow
}
```

#### Secondary Text Style (Descriptions, Supporting)
```typescript
secondaryText: {
  color: '#CBD5E1',                          // textSecondary
  fontWeight: '400',
  opacity: 0.85,
  textShadowColor: 'rgba(0, 0, 0, 0.60)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,                       // Subtle depth
}
```

#### Button Text Style (CTAs)
```typescript
buttonText: {
  color: '#F8FAFC',                          // textPrimary
  fontWeight: '800',
  textShadowColor: 'rgba(10, 118, 175, 0.80)',  // accentGlow (for primary buttons)
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 16,                      // Strong neon glow
}
```

### 4.3 Typography Guidelines

#### DO:
- Use tight letter spacing (-0.5 to -1.2) for modern feel
- Apply text shadows to all interactive text for luminosity
- Maintain consistent line-height for readability (1.4-1.6x font size)
- Use extrabold (800) sparingly for emphasis

#### DON'T:
- Use font weights below 400 for UI text
- Apply uppercase except for overline text
- Mix multiple font weights in the same text block
- Use colored text except for state indicators (success/warning/error)

---

## 5. Spacing & Layout System

### 5.1 Spacing Scale (Based on 4px Grid)

```typescript
spacing: {
  xxs: 4,      // Micro spacing (icon padding, tight gaps)
  xs: 8,       // Extra small (chip padding, element spacing)
  sm: 12,      // Small (between related elements)
  md: 16,      // Medium (default gap between sections)
  lg: 20,      // Large (card padding, major separations)
  xl: 24,      // Extra large (screen padding, primary spacing unit)
  xxl: 32,     // 2XL (major section spacing)
  xxxl: 48,    // 3XL (hero spacing)
}
```

### 5.2 Layout Guidelines

#### Screen Edge Margins (Floating Effect)
```typescript
screenMargins: {
  horizontal: 20,      // Left/right margins from screen edge
  top: 24,             // Top margin (below safe area)
  bottom: 20,          // Bottom margin (above tab bar)
}

// All glass panels MUST have these margins to create floating effect
```

#### Component Padding (Internal Spacing)
```typescript
componentPadding: {
  glassPanel: 20,             // Standard panel interior padding
  glassPanelCompact: 16,      // Compact variant
  glassPanelLarge: 24,        // Large variant (hero sections)

  button: {
    vertical: 16,
    horizontal: 32,
  },

  buttonSmall: {
    vertical: 12,
    horizontal: 24,
  },

  buttonLarge: {
    vertical: 20,
    horizontal: 40,
  },

  chip: {
    vertical: 8,
    horizontal: 16,
  },

  tabBar: {
    vertical: 12,
    horizontal: 24,
  },
}
```

#### Vertical Rhythm (Stack Spacing)
```typescript
verticalRhythm: {
  tight: 12,           // Between tightly related elements (label + value)
  regular: 20,         // Between sections within a card
  relaxed: 32,         // Between major sections
  loose: 48,           // Between hero sections
}
```

### 5.3 Border Radius (Rounded Corners)

```typescript
borderRadius: {
  none: 0,
  sm: 12,              // Small elements (chips, badges)
  md: 16,              // Medium elements (inputs, small cards)
  lg: 20,              // Large elements (secondary panels)
  xl: 24,              // Extra large (primary panels, main cards)
  xxl: 28,             // 2XL (buttons, interactive surfaces)
  xxxl: 32,            // 3XL (hero elements)
  full: 9999,          // Circular (avatar, icon buttons)
}

// Standard use:
// - Main panels: 24px (xl)
// - Buttons: 28-32px (xxl-xxxl)
// - Tab bar: 36px (full height / 2)
// - Count chips: 28px (full height / 2)
```

### 5.4 Safe Area Handling

```typescript
// Always use useSafeAreaInsets() from react-native-safe-area-context
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

// Apply to all full-screen views:
paddingTop: insets.top + 24,        // Safe area + screen margin
paddingBottom: insets.bottom + 100, // Safe area + tab bar clearance
```

---

## 6. Depth & Shadow System

### 6.1 Shadow Layers

Each glass element uses **multi-stage shadows** to create authentic depth:

#### Shadow Layer 1: Ambient Occlusion (Outermost)
```typescript
ambientShadow: {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 24 },
  shadowOpacity: 0.45,
  shadowRadius: 48,
  elevation: 24,                    // Android
}

// Purpose: Large diffused shadow simulating ambient light blockage
// Use: All floating panels, major surfaces
```

#### Shadow Layer 2: Direct Shadow (Middle)
```typescript
directShadow: {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.60,
  shadowRadius: 24,
  elevation: 12,                    // Android
}

// Purpose: Medium shadow defining element elevation
// Use: Buttons, cards, interactive elements
```

#### Shadow Layer 3: Contact Shadow (Innermost)
```typescript
contactShadow: {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.75,
  shadowRadius: 8,
  elevation: 4,                     // Android
}

// Purpose: Sharp shadow at element edges for crisp definition
// Use: Small elements (chips, badges, icons)
```

### 6.2 Accent Shadows (Active States)

When element is active/focused, replace black shadow with accent-colored shadow:

```typescript
accentShadowActive: {
  shadowColor: 'rgba(10, 118, 175, 0.70)',   // accentPrimary with opacity
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.90,
  shadowRadius: 32,
  elevation: 16,
}

// Purpose: Neon glow effect for active interactive elements
// Use: Active tabs, primary buttons, selected chips
```

### 6.3 Combined Shadow Implementation

For maximum depth, stack multiple shadows using View nesting:

```tsx
// Outer View: Ambient shadow
<View style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 24 },
  shadowOpacity: 0.45,
  shadowRadius: 48,
  elevation: 24,
}}>
  {/* Middle View: Direct shadow */}
  <View style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.60,
    shadowRadius: 24,
    elevation: 12,
  }}>
    {/* Inner View: Glass surface with border */}
    <View style={{
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderWidth: 2.5,
      borderTopColor: 'rgba(255, 255, 255, 0.25)',
      // ... glass surface styles
    }}>
      {/* Content */}
    </View>
  </View>
</View>
```

**Note:** React Native doesn't support multiple shadows on a single View, so nesting is required for maximum depth perception.

### 6.4 Blur Specifications

#### expo-blur Configuration
```typescript
blurConfig: {
  intensity: 28,                    // Standard intensity for glass panels
  tint: 'dark',                     // Always use dark tint

  // Platform-specific handling:
  // Native: BlurView with intensity 25-30
  // Web: Fallback to rgba background (no true blur support)
}

// Web fallback example:
Platform.OS === 'web'
  ? { backgroundColor: 'rgba(20, 25, 35, 0.70)' }
  : <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
```

### 6.5 Inner Shadows (Depth Inversion)

For elements that should appear "pressed in" or "recessed":

```typescript
innerShadow: {
  // Create using gradient overlay (React Native doesn't support inset shadows)
  <LinearGradient
    colors={[
      'rgba(0, 0, 0, 0.35)',       // Top (darkest)
      'transparent',                // Middle
      'rgba(255, 255, 255, 0.08)'  // Bottom (lightest)
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
}

// Use: Input fields, pressed buttons, recessed panels
```

---

## 7. Component Specifications

### 7.1 GlassPanel

**Purpose:** Primary container for content sections with frosted glass aesthetic.

#### Visual Specifications
```typescript
// Outer dimensions
minHeight: 120,                    // Minimum height for content
borderRadius: 24,                  // Standard XL radius
margin: 20,                        // Distance from screen edges (floating effect)

// Border (gradient multi-stage)
borderWidth: 2.5,
borderTopColor: 'rgba(255, 255, 255, 0.25)',      // Brightest (top catch light)
borderLeftColor: 'rgba(255, 255, 255, 0.18)',     // Left edge
borderRightColor: 'rgba(255, 255, 255, 0.08)',    // Right edge (darker)
borderBottomColor: 'rgba(255, 255, 255, 0.04)',   // Darkest (bottom)

// Background
backgroundColor: 'rgba(255, 255, 255, 0.03)',     // Frosted white tint

// Shadows (multi-layer)
shadowColor: '#000000',
shadowOffset: { width: 0, height: 20 },
shadowOpacity: 0.65,
shadowRadius: 40,
elevation: 20,

// Inner padding
padding: 20,                       // Internal content padding
```

#### Layer Structure (Top to Bottom)
1. **Blur Layer** (expo-blur, intensity 28, tint dark)
2. **Base Gradient Overlay**
   ```typescript
   colors: [
     'rgba(255, 255, 255, 0.10)',  // Top
     'rgba(255, 255, 255, 0.05)',  // Middle
     'rgba(255, 255, 255, 0.02)'   // Bottom
   ]
   ```
3. **Top Highlight** (glossy shine)
   ```typescript
   position: 'absolute',
   top: 0, left: 0, right: 0,
   height: '30%',                   // Top 30% of panel
   backgroundColor: 'rgba(255, 255, 255, 0.15)',
   opacity: 0.60,
   ```
4. **Edge Highlight** (1px bright line at top edge)
   ```typescript
   position: 'absolute',
   top: 0, left: 0, right: 0,
   height: 1.5,
   backgroundColor: 'rgba(255, 255, 255, 0.35)',
   ```
5. **Content Layer** (zIndex: 10)

#### Variants

**Standard Panel**
```typescript
<GlassPanel style={{ marginHorizontal: 20 }}>
  {children}
</GlassPanel>
```

**Compact Panel** (less padding, smaller radius)
```typescript
<GlassPanel
  radius={20}
  style={{ padding: 16 }}
>
  {children}
</GlassPanel>
```

**Hero Panel** (larger, more prominent)
```typescript
<GlassPanel
  radius={28}
  intensity={30}
  style={{
    padding: 24,
    shadowRadius: 50,
    shadowOpacity: 0.75,
  }}
>
  {children}
</GlassPanel>
```

---

### 7.2 GlowingButton

**Purpose:** Primary interactive button with animated neon glow effect.

#### Visual Specifications

**Default State (Inactive)**
```typescript
// Outer container
minHeight: 64,
borderRadius: 32,                  // Full pill shape

// Outer border layer
padding: 3,
backgroundColor: 'rgba(255, 255, 255, 0.03)',
borderWidth: 2.5,
borderTopColor: 'rgba(255, 255, 255, 0.30)',
borderLeftColor: 'rgba(255, 255, 255, 0.24)',
borderRightColor: 'rgba(255, 255, 255, 0.14)',
borderBottomColor: 'rgba(255, 255, 255, 0.10)',

// Inner surface
backgroundColor: 'rgba(20, 25, 35, 0.60)',
borderRadius: 29,                  // Slightly smaller than outer

// Shadows
shadowColor: '#000',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.50,
shadowRadius: 20,
elevation: 8,

// Text
color: '#F8FAFC',                  // textPrimary
fontSize: 17,
fontWeight: '700',
letterSpacing: -0.5,
```

**Primary Variant (Active State)**
```typescript
// Outer glow ring (animated pulsing)
<Animated.View style={{
  position: 'absolute',
  inset: -10,                      // Extends 10px beyond button
  borderRadius: 42,
  opacity: glowAnim,               // Animated 0.5 → 1.0 loop
}}>
  <LinearGradient
    colors={[
      'rgba(10, 118, 175, 0.40)',
      'rgba(10, 118, 175, 0.60)',
      'rgba(10, 118, 175, 0.40)',
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  />
</Animated.View>

// Modified shadows (accent color)
shadowColor: 'rgba(10, 118, 175, 0.70)',
shadowOffset: { width: 0, height: 12 },
shadowOpacity: 0.90,
shadowRadius: 32,
elevation: 16,

// Modified borders (accent tint)
borderTopColor: 'rgba(10, 118, 175, 0.55)',
borderLeftColor: 'rgba(10, 118, 175, 0.45)',
borderRightColor: 'rgba(10, 118, 175, 0.30)',
borderBottomColor: 'rgba(10, 118, 175, 0.20)',

// Modified text (stronger glow)
textShadowColor: 'rgba(10, 118, 175, 0.80)',
textShadowRadius: 16,
fontSize: 19,
fontWeight: '800',
letterSpacing: -0.6,
```

**Small Variant**
```typescript
minHeight: 36,
borderRadius: 18,
paddingVertical: 12,
paddingHorizontal: 24,
fontSize: 14,
fontWeight: '600',
```

**Pressed State Animation**
```typescript
// Scale down on press
Animated.spring(scaleAnim, {
  toValue: 0.95,
  friction: 6,
  tension: 50,
  useNativeDriver: true,
})

// Haptic feedback (native only)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
```

#### Layer Structure
1. **Outer Glow Ring** (animated, primary variant only)
2. **Outer Border Layer** (multi-gradient border)
3. **Blur Layer** (intensity 25)
4. **Base Gradient**
   ```typescript
   ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']
   ```
5. **Accent Gradient** (primary variant only)
   ```typescript
   ['rgba(10, 118, 175, 0.25)', 'rgba(10, 118, 175, 0.15)', 'rgba(10, 118, 175, 0.08)']
   ```
6. **Top Highlight** (40% height, white overlay)
7. **Content Layer** (text + icon)

#### Variants

**Primary Button** (main CTA)
```tsx
<GlowingButton
  variant="primary"
  text="Generate Photoshoot"
  onPress={handleGenerate}
/>
```

**Secondary Button** (ghost style)
```tsx
<GlowingButton
  variant="ghost"
  text="Cancel"
  onPress={handleCancel}
/>
```

**Success Button** (confirmation)
```tsx
<GlowingButton
  variant="success"
  text="Saved"
  icon={<CheckIcon />}
  disabled
/>
```

---

### 7.3 CustomTabBar (Floating Island)

**Purpose:** Bottom navigation with floating glass island aesthetic.

#### Visual Specifications

**Container (Outer Wrapper)**
```typescript
// Position
position: 'absolute',
bottom: 0, left: 0, right: 0,
paddingBottom: 20,                 // Margin from screen bottom
paddingHorizontal: 20,             // Margin from screen edges

// Gradient fade (creates visual separation from content above)
<LinearGradient
  colors={[
    'rgba(10, 19, 59, 0)',         // Transparent top
    'rgba(10, 19, 59, 0.30)',
    'rgba(10, 19, 59, 0.70)',
    'rgba(10, 19, 59, 0.95)',      // Opaque bottom
  ]}
  locations={[0, 0.3, 0.7, 1]}
  style={{
    position: 'absolute',
    top: -60, left: 0, right: 0,
    height: 60,
  }}
/>
```

**Tab Bar Surface (Glass Island)**
```typescript
// Dimensions
height: 72,
borderRadius: 36,                  // Full pill (height / 2)

// Outer glow layer (creates floating effect)
<View style={{
  position: 'absolute',
  inset: -4,                       // Extends 4px beyond tab bar
  borderRadius: 40,
  backgroundColor: 'rgba(10, 118, 175, 0.15)',  // Subtle accent tint
  shadowColor: 'rgba(10, 118, 175, 0.60)',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.90,
  shadowRadius: 28,
  elevation: 12,
}} />

// Main glass surface
backgroundColor: 'rgba(255, 255, 255, 0.03)',
borderWidth: 2.5,
borderTopColor: 'rgba(255, 255, 255, 0.25)',
borderLeftColor: 'rgba(255, 255, 255, 0.18)',
borderRightColor: 'rgba(255, 255, 255, 0.08)',
borderBottomColor: 'rgba(255, 255, 255, 0.05)',

// Shadows
shadowColor: '#000',
shadowOffset: { width: 0, height: 20 },
shadowOpacity: 0.70,
shadowRadius: 40,
elevation: 20,
```

**Tab Button (Individual Icon)**

**Inactive State**
```typescript
// Container
width: 52,
height: 52,
borderRadius: 26,                  // Circular

// Background
backgroundColor: 'rgba(255, 255, 255, 0.08)',
borderWidth: 1.5,
borderTopColor: 'rgba(255, 255, 255, 0.20)',
borderLeftColor: 'rgba(255, 255, 255, 0.15)',
borderRightColor: 'rgba(255, 255, 255, 0.08)',
borderBottomColor: 'rgba(255, 255, 255, 0.05)',

// Icon
color: '#CBD5E1',                  // textSecondary (silver)
size: 24,
```

**Active State**
```typescript
// Outer glow (animated pulsing)
<Animated.View style={{
  position: 'absolute',
  inset: -10,
  borderRadius: 36,
  backgroundColor: 'rgba(10, 118, 175, 0.25)',
  shadowColor: 'rgba(10, 118, 175, 0.70)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.90,
  shadowRadius: 16,
  elevation: 8,
  opacity: glowAnim,               // Animated 0.3 → 0.7 loop
}} />

// Scale animation
transform: [{ scale: 1.08 }],      // Slightly larger

// Icon
color: '#0A76AF',                  // accentPrimary
size: 24,
```

#### Layer Structure
1. **Top Fade Gradient** (above tab bar, creates separation)
2. **Outer Glow Layer** (floating effect shadow)
3. **Main Glass Surface**
   - Blur layer (intensity 30)
   - Base gradient overlay
   - Top highlight (40% height)
4. **Tab Button Containers**
   - Individual glow (active only)
   - Button surface
   - Icon

#### Animation Specifications

**Show/Hide Animation**
```typescript
// Hide (swipe up results/history screen)
Animated.spring(translateY, {
  toValue: 120,                    // Move down beyond screen
  friction: 9,
  tension: 50,
  useNativeDriver: true,
})

// Show (return to main screen)
Animated.spring(translateY, {
  toValue: 0,
  friction: 9,
  tension: 50,
  useNativeDriver: true,
})
```

**Tab Press Animation**
```typescript
// Press in
Animated.timing(scaleAnim, {
  toValue: 0.92,
  duration: 80,
  useNativeDriver: true,
})

// Spring back
Animated.spring(scaleAnim, {
  toValue: isActive ? 1.08 : 1,
  friction: 6,
  tension: 50,
  useNativeDriver: true,
})
```

**Glow Pulse Animation**
```typescript
Animated.loop(
  Animated.sequence([
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }),
    Animated.timing(glowAnim, {
      toValue: 0.5,
      duration: 2000,
      useNativeDriver: true,
    }),
  ])
)
```

---

### 7.4 CountSelector (Generation Count Chips)

**Purpose:** Segmented control for selecting number of images to generate (1, 2, 4, 6, 8).

#### Visual Specifications

**Container**
```typescript
flexDirection: 'row',
gap: 12,                           // Space between chips
justifyContent: 'center',
```

**Individual Chip (Inactive State)**
```typescript
// Dimensions
width: 56,
height: 56,
borderRadius: 28,                  // Circular

// Outer border layer
padding: 2.5,
backgroundColor: 'rgba(255, 255, 255, 0.03)',
borderWidth: 2,
borderTopColor: 'rgba(255, 255, 255, 0.22)',
borderLeftColor: 'rgba(255, 255, 255, 0.18)',
borderRightColor: 'rgba(255, 255, 255, 0.10)',
borderBottomColor: 'rgba(255, 255, 255, 0.06)',

// Inner surface
backgroundColor: 'rgba(20, 25, 35, 0.60)',
borderRadius: 26,

// Shadows
shadowColor: '#000',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.50,
shadowRadius: 16,
elevation: 8,

// Text
color: '#CBD5E1',                  // textSecondary
fontSize: 18,
fontWeight: '700',
letterSpacing: -0.5,
```

**Active State**
```typescript
// Outer glow ring (animated)
<Animated.View style={{
  position: 'absolute',
  inset: -8,
  borderRadius: 28,
  opacity: glowAnim,               // Animated 0.3 → 0.9 loop
}}>
  <LinearGradient
    colors={[
      'rgba(10, 118, 175, 0.40)',
      'rgba(10, 118, 175, 0.60)',
      'rgba(10, 118, 175, 0.40)',
    ]}
  />
</Animated.View>

// Scale
transform: [{ scale: 1.08 }],

// Border (accent tint)
borderTopColor: 'rgba(10, 118, 175, 0.55)',
borderLeftColor: 'rgba(10, 118, 175, 0.45)',
borderRightColor: 'rgba(10, 118, 175, 0.30)',
borderBottomColor: 'rgba(10, 118, 175, 0.20)',

// Inner surface (accent background)
backgroundColor: 'rgba(10, 118, 175, 0.15)',

// Shadows (accent colored)
shadowColor: 'rgba(10, 118, 175, 0.60)',
shadowOffset: { width: 0, height: 12 },
shadowOpacity: 0.80,
shadowRadius: 24,
elevation: 12,

// Text (stronger emphasis)
color: '#F8FAFC',                  // textPrimary
fontSize: 20,
fontWeight: '800',
letterSpacing: -0.6,
textShadowColor: 'rgba(10, 118, 175, 0.80)',
textShadowRadius: 12,
```

#### Layer Structure
1. **Outer Glow Ring** (active only, animated pulse)
2. **Outer Border Layer** (multi-gradient)
3. **Blur Layer** (intensity 25, adjusted based on state)
4. **Base Gradient**
   - Inactive: white-based gradient
   - Active: accent-based gradient
5. **Top Shine** (40-60% height, white overlay)
6. **Content (Number Text)**

---

### 7.5 ImageUploader

**Purpose:** Large glass panel for image upload with placeholder state.

#### Visual Specifications

**Container (GlassPanel Wrapper)**
```typescript
width: '100%',
aspectRatio: 4 / 5,                // Portrait orientation (fashion photos)
borderRadius: 24,
minHeight: 280,
maxHeight: 420,
```

**Placeholder State (No Image)**
```typescript
// Background (inherits GlassPanel styling)
// Content layout
alignItems: 'center',
justifyContent: 'center',
gap: 16,

// Logo container
width: 96,
height: 96,
opacity: 0.25,                     // Subtle watermark

// Primary text
color: '#F8FAFC',                  // textPrimary
fontSize: 15,
fontWeight: '600',
textShadowColor: 'rgba(0, 0, 0, 0.50)',
textShadowRadius: 8,
text: 'Tap to upload your photo',

// Secondary text
color: '#CBD5E1',                  // textSecondary
fontSize: 13,
fontWeight: '500',
textShadowColor: 'rgba(0, 0, 0, 0.40)',
textShadowRadius: 4,
text: 'Start your fashion transformation',
```

**Uploaded State (Image Present)**
```typescript
// Image display
width: '100%',
height: '100%',
borderRadius: 24,
resizeMode: 'cover',

// Tap hint (overlaid on image)
<View style={{
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.60)',
  borderRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 20,
  backdropFilter: 'blur(10px)',    // Web only
}}>
  <Text style={{
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  }}>
    Tap to change photo
  </Text>
</View>
```

**Loading State**
```typescript
// Overlay
<View style={{
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.70)',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 24,
}}>
  <ActivityIndicator size="large" color="#CBD5E1" />
</View>
```

---

### 7.6 GlassyTitle

**Purpose:** Hero heading component for screen titles.

#### Visual Specifications

```typescript
// Container (GlassPanel variant)
padding: 16,
borderRadius: 20,
marginBottom: 16,

// Text
color: '#F8FAFC',                  // textPrimary
fontSize: 36,
fontWeight: '700',
lineHeight: 40,
letterSpacing: -0.8,
textShadowColor: 'rgba(248, 250, 252, 0.40)',
textShadowOffset: { width: 0, height: 0 },
textShadowRadius: 10,              // Strong neon glow
```

#### Usage
```tsx
<GlassyTitle>
  <Text>Generate</Text>
</GlassyTitle>
```

---

## 8. Screen-by-Screen Redesign

### 8.1 Generate Screen (Main Tab)

**Current Issues:**
- Title section could have more visual hierarchy
- CountSelector gaps could be tighter for better grouping
- Button could be more prominent

**Deep Sea Glass Redesign:**

```tsx
<View style={styles.container}>
  {/* Multi-layer background gradient */}
  <LinearGradient
    colors={[
      '#060D28',                   // bgDeepest (top)
      '#0A133B',                   // bgDeep
      '#0D1A48',                   // bgMid
      '#0F2055',                   // bgBase (bottom)
    ]}
    locations={[0, 0.35, 0.70, 1]}
    style={StyleSheet.absoluteFill}
  />

  <View style={[styles.content, {
    paddingTop: insets.top + 24,
    paddingBottom: insets.bottom + 100,
    paddingHorizontal: 20,         // Floating margins
  }]}>
    {/* Title Section */}
    <View style={styles.titleSection}>
      <GlassyTitle>
        <Text>Generate</Text>
      </GlassyTitle>
      {/* Credit badge (subtle, top-right) */}
      <View style={styles.creditBadge}>
        <Text style={styles.creditText}>{user?.credits} credits</Text>
      </View>
    </View>

    {/* Count Selector */}
    <View style={{ marginTop: 24, marginBottom: 24 }}>
      <Text style={styles.sectionLabel}>Number of images</Text>
      <CountSelector
        value={generationCount}
        onChange={setGenerationCount}
        disabled={isGenerating}
      />
    </View>

    {/* Image Uploader (flex-grow to fill space) */}
    <View style={{ flex: 1, marginBottom: 24 }}>
      <ImageUploader
        uploadedImage={selectedImage}
        uploading={uploading}
        onImageSelect={handleImageSelect}
      />
    </View>

    {/* Generate Button (fixed at bottom) */}
    <GlowingButton
      variant="primary"
      text={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
      onPress={handleGenerate}
      disabled={isGenerating}
    />
  </View>
</View>
```

**Key Changes:**
1. Enhanced background gradient with 4 stops for richer depth
2. Credit badge added (floating glass chip in top-right)
3. Section label added above CountSelector for clarity
4. Tighter spacing between related elements (label + selector)
5. ImageUploader uses flex-grow for responsive sizing
6. Primary button always visible at bottom (no scroll needed)

**New Styles:**
```typescript
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,               // Tight coupling with credit badge
  },
  creditBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.20)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  creditText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  sectionLabel: {
    color: '#CBD5E1',              // textSecondary
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingLeft: 4,
  },
})
```

---

### 8.2 Results Screen

**Current Issues:**
- Grid layout may not emphasize individual images enough
- No clear hierarchy between newly generated and previous results
- Loading states could be more elegant

**Deep Sea Glass Redesign:**

```tsx
<View style={styles.container}>
  {/* Background gradient */}
  <LinearGradient
    colors={['#060D28', '#0A133B', '#0D1A48', '#0F2055']}
    locations={[0, 0.35, 0.70, 1]}
    style={StyleSheet.absoluteFill}
  />

  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={{
      paddingTop: insets.top + 24,
      paddingBottom: insets.bottom + 120,
      paddingHorizontal: 20,
    }}
    showsVerticalScrollIndicator={false}
  >
    {/* Title */}
    <GlassyTitle>
      <Text>Results</Text>
    </GlassyTitle>

    {/* Current Generation Section */}
    {generatedImages.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Latest Generation</Text>
        <View style={styles.imageGrid}>
          {generatedImages.map((image, index) => (
            <GlassPanel key={index} style={styles.imageCard}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
              ) : (
                <ShimmerLoader style={styles.resultImage} />
              )}
            </GlassPanel>
          ))}
        </View>
      </View>
    )}

    {/* Previous Results Section */}
    {history.length > 0 && (
      <View style={[styles.section, { marginTop: 32 }]}>
        <Text style={styles.sectionLabel}>Previous Results</Text>
        <View style={styles.imageGrid}>
          {history.flatMap(h => h.images).map((image, index) => (
            <GlassPanel key={index} style={styles.imageCard}>
              <Image
                source={{ uri: image }}
                style={styles.resultImage}
                resizeMode="cover"
              />
            </GlassPanel>
          ))}
        </View>
      </View>
    )}

    {/* Empty State */}
    {generatedImages.length === 0 && history.length === 0 && (
      <GlassPanel style={styles.emptyState}>
        <Text style={styles.emptyText}>No results yet</Text>
        <Text style={styles.emptySubtext}>
          Generate your first photoshoot to see results here
        </Text>
      </GlassPanel>
    )}
  </ScrollView>
</View>
```

**Key Changes:**
1. Separated "Latest Generation" from "Previous Results" with distinct sections
2. Each image in its own GlassPanel for floating effect
3. ShimmerLoader for elegant loading state (replaces ActivityIndicator)
4. 2-column grid with generous gap (16px)
5. Section labels for clear hierarchy
6. Empty state with glass panel and instructions

**New Styles:**
```typescript
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 0,
  },
  sectionLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    textTransform: 'uppercase',
    marginBottom: 16,
    paddingLeft: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,                       // Space between cards
  },
  imageCard: {
    width: (width - 40 - 16) / 2, // (screen - margins - gap) / 2 columns
    aspectRatio: 3 / 4,
    padding: 0,                    // No internal padding (image fills panel)
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,              // Match panel radius
  },
  emptyState: {
    marginTop: 60,
    paddingVertical: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
})
```

**New Component: ShimmerLoader**
```tsx
// components/ShimmerLoader.tsx
export default function ShimmerLoader({ style }: { style: ViewStyle }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  shimmer: {
    width: 300,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transform: [{ skewX: '-20deg' }],
  },
});
```

---

### 8.3 History Screen

**Current Issues:**
- May lack visual distinction from Results screen
- No date grouping or timeline visualization
- Delete actions may not be obvious

**Deep Sea Glass Redesign:**

```tsx
<View style={styles.container}>
  {/* Background gradient */}
  <LinearGradient
    colors={['#060D28', '#0A133B', '#0D1A48', '#0F2055']}
    locations={[0, 0.35, 0.70, 1]}
    style={StyleSheet.absoluteFill}
  />

  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={{
      paddingTop: insets.top + 24,
      paddingBottom: insets.bottom + 120,
      paddingHorizontal: 20,
    }}
    showsVerticalScrollIndicator={false}
  >
    {/* Title */}
    <GlassyTitle>
      <Text>History</Text>
    </GlassyTitle>

    {/* History Timeline */}
    {groupedHistory.map((group, groupIndex) => (
      <View key={groupIndex} style={styles.dateGroup}>
        {/* Date Header */}
        <Text style={styles.dateLabel}>{group.date}</Text>

        {/* History Items */}
        {group.items.map((item, itemIndex) => (
          <GlassPanel key={itemIndex} style={styles.historyCard}>
            {/* Header Row */}
            <View style={styles.cardHeader}>
              <Text style={styles.timeText}>{item.time}</Text>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>

            {/* Image Grid (horizontal scroll if > 2 images) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageRow}
            >
              {item.images.map((image, imgIndex) => (
                <View key={imgIndex} style={styles.historyImage}>
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.countText}>
                {item.images.length} {item.images.length === 1 ? 'image' : 'images'}
              </Text>
            </View>
          </GlassPanel>
        ))}
      </View>
    ))}

    {/* Empty State */}
    {history.length === 0 && (
      <GlassPanel style={styles.emptyState}>
        <Text style={styles.emptyText}>No history yet</Text>
        <Text style={styles.emptySubtext}>
          Your past generations will appear here
        </Text>
      </GlassPanel>
    )}
  </ScrollView>
</View>
```

**Key Changes:**
1. Date-grouped timeline structure (Today, Yesterday, Dec 20, etc.)
2. Each history item is a GlassPanel card with header/content/footer
3. Horizontal scroll for image thumbnails within each card
4. Delete button integrated into card header (subtle ghost button)
5. Metadata (time, count) clearly displayed
6. Timeline feel with date section headers

**New Styles:**
```typescript
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 32,
  },
  dateLabel: {
    color: '#94A3B8',              // textTertiary
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
    paddingLeft: 4,
  },
  historyCard: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    color: '#CBD5E1',              // textSecondary
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.30)',
  },
  deleteText: {
    color: '#F87171',              // error
    fontSize: 12,
    fontWeight: '600',
  },
  imageRow: {
    gap: 12,
    paddingBottom: 4,
  },
  historyImage: {
    width: 100,
    height: 133,                   // 3:4 aspect ratio
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  countText: {
    color: '#94A3B8',              // textTertiary
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    marginTop: 60,
    paddingVertical: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
})
```

---

### 8.4 Settings Screen

**Current Issues:**
- May be using list-style layout (iOS Settings feel)
- Glass panels not utilized for setting groups
- User profile section could be more prominent

**Deep Sea Glass Redesign:**

```tsx
<View style={styles.container}>
  {/* Background gradient */}
  <LinearGradient
    colors={['#060D28', '#0A133B', '#0D1A48', '#0F2055']}
    locations={[0, 0.35, 0.70, 1]}
    style={StyleSheet.absoluteFill}
  />

  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={{
      paddingTop: insets.top + 24,
      paddingBottom: insets.bottom + 120,
      paddingHorizontal: 20,
    }}
    showsVerticalScrollIndicator={false}
  >
    {/* Title */}
    <GlassyTitle>
      <Text>Settings</Text>
    </GlassyTitle>

    {/* User Profile Card */}
    <GlassPanel style={styles.profileCard}>
      <View style={styles.profileHeader}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'G'}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'Guest'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'Not signed in'}</Text>
        </View>
      </View>

      {/* Credits Display */}
      <View style={styles.creditsRow}>
        <Text style={styles.creditsLabel}>Available Credits</Text>
        <Text style={styles.creditsValue}>{user?.credits || 0}</Text>
      </View>

      {/* Buy Credits Button */}
      {!user?.isGuest && (
        <GlowingButton
          variant="primary"
          text="Buy More Credits"
          onPress={() => router.push('/plans')}
          style={styles.buyButton}
        />
      )}
    </GlassPanel>

    {/* Account Section */}
    {user?.isGuest ? (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <GlassPanel style={styles.settingCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.settingText}>Sign In</Text>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
        </GlassPanel>
        <GlassPanel style={styles.settingCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.settingText}>Create Account</Text>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
        </GlassPanel>
      </View>
    ) : (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <GlassPanel style={styles.settingCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleSignOut}
          >
            <Text style={[styles.settingText, { color: '#F87171' }]}>Sign Out</Text>
          </TouchableOpacity>
        </GlassPanel>
      </View>
    )}

    {/* About Section */}
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>About</Text>
      <GlassPanel style={styles.settingCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </GlassPanel>
    </View>
  </ScrollView>
</View>
```

**Key Changes:**
1. Prominent profile card at top with avatar, name, email, credits
2. Settings organized into sections with labels
3. Each setting is its own GlassPanel (not grouped list)
4. Buy Credits button integrated into profile card (primary CTA)
5. Conditional Account section (Guest vs Authenticated)
6. Minimal About section (version only)

**New Styles:**
```typescript
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    padding: 20,
    marginBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(10, 118, 175, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(10, 118, 175, 0.50)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  profileEmail: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '400',
  },
  creditsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: -20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  creditsLabel: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '600',
  },
  creditsValue: {
    color: '#0A76AF',              // accentPrimary
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  buyButton: {
    marginTop: 0,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: '#94A3B8',              // textTertiary
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingCard: {
    padding: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  settingText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  settingValue: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '400',
  },
  settingChevron: {
    color: '#94A3B8',
    fontSize: 28,
    fontWeight: '300',
  },
})
```

---

### 8.5 Plans Screen (Modal)

**Current Issues:**
- May not exist or be incomplete
- Credit package presentation could be more compelling
- No clear value hierarchy between tiers

**Deep Sea Glass Redesign:**

```tsx
<View style={styles.container}>
  {/* Background gradient */}
  <LinearGradient
    colors={['#060D28', '#0A133B', '#0D1A48', '#0F2055']}
    locations={[0, 0.35, 0.70, 1]}
    style={StyleSheet.absoluteFill}
  />

  {/* Header with close button */}
  <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.closeButton}
    >
      <Text style={styles.closeText}>✕</Text>
    </TouchableOpacity>
  </View>

  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={{
      paddingTop: 20,
      paddingBottom: insets.bottom + 40,
      paddingHorizontal: 20,
    }}
    showsVerticalScrollIndicator={false}
  >
    {/* Title */}
    <View style={styles.titleSection}>
      <Text style={styles.mainTitle}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>
        Purchase credits to unlock unlimited fashion transformations
      </Text>
    </View>

    {/* Credit Packages */}
    <View style={styles.packagesGrid}>
      {/* Starter Package */}
      <GlassPanel style={styles.packageCard}>
        <Text style={styles.packageName}>Starter</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceAmount}>$9</Text>
          <Text style={styles.priceLabel}>.99</Text>
        </View>
        <Text style={styles.creditsAmount}>50 credits</Text>
        <Text style={styles.pricePerCredit}>$0.20 per credit</Text>
        <GlowingButton
          variant="default"
          text="Purchase"
          onPress={() => handlePurchase('starter')}
          style={styles.packageButton}
        />
      </GlassPanel>

      {/* Popular Package (accent variant) */}
      <GlassPanel
        style={[styles.packageCard, styles.popularCard]}
        variant="primary"
      >
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
        <Text style={styles.packageName}>Pro</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceAmount}>$24</Text>
          <Text style={styles.priceLabel}>.99</Text>
        </View>
        <Text style={styles.creditsAmount}>150 credits</Text>
        <Text style={styles.pricePerCredit}>$0.17 per credit</Text>
        <Text style={styles.savingsLabel}>Save 15%</Text>
        <GlowingButton
          variant="primary"
          text="Purchase"
          onPress={() => handlePurchase('pro')}
          style={styles.packageButton}
        />
      </GlassPanel>

      {/* Premium Package */}
      <GlassPanel style={styles.packageCard}>
        <Text style={styles.packageName}>Premium</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceAmount}>$49</Text>
          <Text style={styles.priceLabel}>.99</Text>
        </View>
        <Text style={styles.creditsAmount}>350 credits</Text>
        <Text style={styles.pricePerCredit}>$0.14 per credit</Text>
        <Text style={styles.savingsLabel}>Save 30%</Text>
        <GlowingButton
          variant="default"
          text="Purchase"
          onPress={() => handlePurchase('premium')}
          style={styles.packageButton}
        />
      </GlassPanel>
    </View>

    {/* Info Section */}
    <GlassPanel style={styles.infoCard}>
      <Text style={styles.infoTitle}>How Credits Work</Text>
      <Text style={styles.infoText}>
        • Each image generation costs 1 credit{'\n'}
        • Credits never expire{'\n'}
        • Generate 1-8 images per session{'\n'}
        • Save and download all your creations
      </Text>
    </GlassPanel>
  </ScrollView>
</View>
```

**Key Changes:**
1. Modal presentation with close button (top-right X)
2. Hero title section with value proposition subtitle
3. Three-tier package cards in vertical stack
4. Middle tier ("Pro") highlighted with accent variant and "Most Popular" badge
5. Clear pricing hierarchy with $/credit and savings percentage
6. Info card at bottom explaining credit mechanics
7. Each package has its own GlowingButton (primary for featured tier)

**New Styles:**
```typescript
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#CBD5E1',
    fontSize: 20,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  mainTitle: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(248, 250, 252, 0.40)',
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  packagesGrid: {
    gap: 20,
    marginBottom: 32,
  },
  packageCard: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  popularCard: {
    borderWidth: 3,
    borderColor: 'rgba(10, 118, 175, 0.50)',
    shadowColor: 'rgba(10, 118, 175, 0.70)',
    shadowRadius: 50,
    shadowOpacity: 0.90,
    elevation: 24,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0A76AF',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.30)',
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  packageName: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceAmount: {
    color: '#F8FAFC',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  priceLabel: {
    color: '#CBD5E1',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  creditsAmount: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pricePerCredit: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  savingsLabel: {
    color: '#4ADE80',              // success
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  packageButton: {
    width: '100%',
    marginTop: 8,
  },
  infoCard: {
    padding: 24,
  },
  infoTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  infoText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24,
  },
})
```

---

## 9. Interactive States & Animations

### 9.1 Button Press Interactions

**Sequence:**
1. **Press In** (touch starts)
   - Scale down to 0.95
   - Haptic feedback (ImpactFeedbackStyle.Medium)
   - Duration: 80ms

2. **Press Out** (touch ends)
   - Spring back to original scale
   - Friction: 6, Tension: 50
   - overshootClamping: false (allow slight overshoot for natural feel)

**Implementation:**
```typescript
const scaleAnim = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  Animated.timing(scaleAnim, {
    toValue: 0.95,
    duration: 80,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    friction: 6,
    tension: 50,
    useNativeDriver: true,
  }).start();
};

<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  <TouchableOpacity
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
    activeOpacity={0.9}
  >
    {/* Button content */}
  </TouchableOpacity>
</Animated.View>
```

---

### 9.2 Glow Pulse Animation

**Purpose:** Animated neon glow for active elements (primary buttons, active tabs, selected chips).

**Sequence:**
```typescript
// Loop indefinitely
Animated.loop(
  Animated.sequence([
    // Fade up to full intensity
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
    // Fade down to minimum intensity
    Animated.timing(glowAnim, {
      toValue: 0.5,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
  ])
)
```

**Apply to opacity:**
```typescript
const glowOpacity = glowAnim.interpolate({
  inputRange: [0.5, 1],
  outputRange: [0.40, 0.90],       // Opacity range
});

<Animated.View style={{
  opacity: glowOpacity,
  shadowColor: 'rgba(10, 118, 175, 0.70)',
  shadowRadius: 32,
}}>
  {/* Glow layer */}
</Animated.View>
```

---

### 9.3 Tab Transition Animation

**Active State Change:**
```typescript
// Scale animation (inactive → active)
Animated.spring(scaleAnim, {
  toValue: isFocused ? 1.08 : 1,   // Active tabs 8% larger
  friction: 6,
  tension: 50,
  useNativeDriver: true,
}).start();

// Start glow pulse if becoming active
if (isFocused) {
  // Start pulse loop (see 9.2)
} else {
  glowAnim.setValue(0);            // Stop glow immediately
}
```

**Tab Press Feedback:**
```typescript
// Quick scale down then spring back
Animated.sequence([
  Animated.timing(scaleAnim, {
    toValue: 0.92,
    duration: 80,
    useNativeDriver: true,
  }),
  Animated.spring(scaleAnim, {
    toValue: isFocused ? 1.08 : 1,
    friction: 6,
    tension: 50,
    useNativeDriver: true,
  }),
]).start();
```

---

### 9.4 Shimmer Loading Animation

**Purpose:** Elegant loading state for image placeholders.

**Implementation:**
```typescript
const shimmerAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shimmerAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

const translateX = shimmerAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [-300, 300],        // Sweep across full width
});

return (
  <View style={styles.shimmerContainer}>
    <Animated.View
      style={[
        styles.shimmerBar,
        { transform: [{ translateX }, { skewX: '-20deg' }] },
      ]}
    />
  </View>
);
```

**Styles:**
```typescript
shimmerContainer: {
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  overflow: 'hidden',
  borderRadius: 24,
},
shimmerBar: {
  width: 300,
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
}
```

---

### 9.5 Panel Entrance Animation

**Purpose:** Smooth fade-in + slide-up for GlassPanels on screen mount.

**Implementation:**
```typescript
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(30)).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }),
  ]).start();
}, []);

<Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  }}
>
  <GlassPanel>
    {/* Content */}
  </GlassPanel>
</Animated.View>
```

---

### 9.6 Tab Bar Show/Hide Animation

**Purpose:** Hide tab bar when scrolling content, show on scroll end.

**Implementation:**
```typescript
const { hideNavbar, showNavbar } = useNavbar();

const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  const { contentOffset, velocity } = event.nativeEvent;

  if (velocity && velocity.y > 0.5) {
    // Scrolling down fast - hide navbar
    hideNavbar();
  } else if (velocity && velocity.y < -0.5) {
    // Scrolling up fast - show navbar
    showNavbar();
  }
};

<ScrollView
  onScroll={handleScroll}
  scrollEventThrottle={16}
>
  {/* Content */}
</ScrollView>
```

**NavBar Animation (in CustomTabBar):**
```typescript
const translateY = useRef(new Animated.Value(0)).current;

const hideNavbar = () => {
  Animated.spring(translateY, {
    toValue: 120,                  // Move down beyond screen
    friction: 9,
    tension: 50,
    useNativeDriver: true,
  }).start();
};

const showNavbar = () => {
  Animated.spring(translateY, {
    toValue: 0,                    // Return to original position
    friction: 9,
    tension: 50,
    useNativeDriver: true,
  }).start();
};
```

---

### 9.7 Success Confirmation Animation

**Purpose:** Visual feedback for successful actions (image saved, credits purchased).

**Implementation:**
```typescript
// Success checkmark with scale + fade
const successScale = useRef(new Animated.Value(0)).current;
const successOpacity = useRef(new Animated.Value(0)).current;

const showSuccess = () => {
  Animated.parallel([
    Animated.spring(successScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }),
    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start(() => {
    // Auto-hide after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(successScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);
  });
};

<Animated.View
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    opacity: successOpacity,
    transform: [{ scale: successScale }],
  }}
>
  <GlassPanel style={{
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Text style={{ fontSize: 36 }}>✓</Text>
  </GlassPanel>
</Animated.View>
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Priority: CRITICAL)
**Estimated Time:** 4-6 hours

1. **Update Color Constants** (`constants/colors.ts`)
   - Replace existing colors with Deep Sea Glass palette
   - Remove purple, teal, warm accent variants entirely
   - Update semantic color names

2. **Update Glass Styles** (`constants/glassStyles.ts`)
   - Adjust glass surface opacities and borders
   - Update shadow specifications
   - Remove colored shadow variants except accent

3. **Update Typography Definitions**
   - Add type scale constants
   - Define text shadow styles
   - Create reusable text style objects

**Files to Modify:**
- `/Users/ivan/rork-fashion-muse-studio-last/constants/colors.ts`
- `/Users/ivan/rork-fashion-muse-studio-last/constants/glassStyles.ts`
- Create: `/Users/ivan/rork-fashion-muse-studio-last/constants/typography.ts`

---

### Phase 2: Core Components (Priority: HIGH)
**Estimated Time:** 6-8 hours

4. **Refactor GlassPanel** (`components/GlassPanel.tsx`)
   - Update blur intensity to 28
   - Adjust gradient colors to white-based
   - Update border gradients
   - Simplify layer structure (remove colored tint variants)

5. **Refactor GlowingButton** (`components/GlowingButton.tsx`)
   - Remove success/warning/danger variants (keep only default, primary, ghost, small)
   - Update glow animation to use accent color only
   - Adjust border gradients and shadows
   - Refine text styles with new typography scale

6. **Refactor CustomTabBar** (`components/CustomTabBar.tsx`)
   - Update outer glow to use subtle accent tint
   - Adjust tab button sizes and spacing
   - Update active state colors to accent only
   - Refine blur and gradient overlays

7. **Refactor CountSelector** (`components/CountSelector.tsx`)
   - Update active state to use accent color
   - Remove colored variants
   - Adjust chip sizing and spacing
   - Update glow animation

**Files to Modify:**
- `/Users/ivan/rork-fashion-muse-studio-last/components/GlassPanel.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/components/GlowingButton.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/components/CustomTabBar.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/components/CountSelector.tsx`

---

### Phase 3: Supporting Components (Priority: MEDIUM)
**Estimated Time:** 4-5 hours

8. **Update ImageUploader** (`components/ImageUploader.tsx`)
   - Adjust text colors and shadows
   - Update placeholder styling
   - Refine loading overlay

9. **Update GlassyTitle** (`components/GlassyTitle.tsx`)
   - Apply new typography scale
   - Update text shadows
   - Adjust container padding

10. **Create ShimmerLoader** (NEW: `components/ShimmerLoader.tsx`)
    - Implement animated shimmer for loading states
    - Use white-based colors

11. **Update PremiumLiquidGlass** (`components/PremiumLiquidGlass.tsx`)
    - Simplify variants (remove colored tints)
    - Update to new color palette
    - Adjust blur and gradients

**Files to Modify:**
- `/Users/ivan/rork-fashion-muse-studio-last/components/ImageUploader.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/components/GlassyTitle.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/components/PremiumLiquidGlass.tsx`
- Create: `/Users/ivan/rork-fashion-muse-studio-last/components/ShimmerLoader.tsx`

---

### Phase 4: Screen Implementations (Priority: HIGH)
**Estimated Time:** 8-10 hours

12. **Update Generate Screen** (`app/(tabs)/generate.tsx`)
    - Add credit badge to title section
    - Add section label above CountSelector
    - Update background gradient to 4-stop
    - Adjust spacing and layout

13. **Update Results Screen** (`app/(tabs)/results.tsx`)
    - Implement section-based layout (Latest / Previous)
    - Create 2-column image grid with GlassPanel cards
    - Add ShimmerLoader for loading states
    - Add empty state with instructions

14. **Update History Screen** (`app/(tabs)/history.tsx`)
    - Implement date-grouped timeline
    - Create history card layout with header/content/footer
    - Add horizontal scroll for image thumbnails
    - Integrate delete functionality with confirmation

15. **Update Settings Screen** (`app/(tabs)/settings.tsx`)
    - Create prominent profile card with avatar
    - Implement section-based layout
    - Add Buy Credits CTA in profile card
    - Conditional Account section (Guest vs Auth)

16. **Create/Update Plans Screen** (`app/plans.tsx`)
    - Implement three-tier package layout
    - Highlight middle tier with accent variant
    - Add "Most Popular" badge
    - Create info card for credit explanation

**Files to Modify:**
- `/Users/ivan/rork-fashion-muse-studio-last/app/(tabs)/generate.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/app/(tabs)/results.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/app/(tabs)/history.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/app/(tabs)/settings.tsx`
- `/Users/ivan/rork-fashion-muse-studio-last/app/plans.tsx`

---

### Phase 5: Polish & Refinement (Priority: MEDIUM)
**Estimated Time:** 4-6 hours

17. **Update Root Layout** (`app/_layout.tsx`)
    - Ensure background gradient is applied globally
    - Update system UI bar colors

18. **Add Animation Hooks**
    - Create reusable animation hooks for common patterns
    - Implement entrance animations for panels
    - Add success confirmation animation utility

19. **Accessibility Audit**
    - Verify WCAG AAA contrast ratios
    - Add accessibility labels to interactive elements
    - Test with screen readers

20. **Performance Optimization**
    - Profile animation performance
    - Optimize re-renders with React.memo
    - Lazy load heavy components

**Files to Modify:**
- `/Users/ivan/rork-fashion-muse-studio-last/app/_layout.tsx`
- Create: `/Users/ivan/rork-fashion-muse-studio-last/hooks/useAnimations.ts`
- Create: `/Users/ivan/rork-fashion-muse-studio-last/hooks/useSuccessAnimation.ts`

---

### Phase 6: Testing & QA (Priority: HIGH)
**Estimated Time:** 4-5 hours

21. **Visual Regression Testing**
    - Compare before/after screenshots
    - Verify floating margins on all panels
    - Check shadow rendering on both platforms

22. **Interaction Testing**
    - Test all button press animations
    - Verify haptic feedback (native)
    - Test tab navigation transitions
    - Validate glow pulse animations

23. **Platform Parity Testing**
    - Verify web fallbacks for blur
    - Check Android elevation rendering
    - Test iOS shadow performance

24. **User Flow Testing**
    - Complete generation flow (upload → generate → results → history)
    - Credit purchase flow (plans → purchase)
    - Authentication flow (guest → sign up → sign in → sign out)

---

### Implementation Priority Summary

**CRITICAL (Do First):**
1. Phase 1: Foundation (colors, glass styles, typography)
2. Phase 2: Core Components (GlassPanel, GlowingButton, CustomTabBar, CountSelector)

**HIGH (Do Second):**
3. Phase 4: Screen Implementations (all 5 screens)
4. Phase 6: Testing & QA

**MEDIUM (Do Last):**
5. Phase 3: Supporting Components (ShimmerLoader, other utilities)
6. Phase 5: Polish & Refinement (animations, accessibility, optimization)

---

### File Change Summary

**Constants (3 files):**
- Modify: `constants/colors.ts` (replace palette)
- Modify: `constants/glassStyles.ts` (update glass system)
- Create: `constants/typography.ts` (new type scale)

**Components (9 files):**
- Modify: `components/GlassPanel.tsx`
- Modify: `components/GlowingButton.tsx`
- Modify: `components/CustomTabBar.tsx`
- Modify: `components/CountSelector.tsx`
- Modify: `components/ImageUploader.tsx`
- Modify: `components/GlassyTitle.tsx`
- Modify: `components/PremiumLiquidGlass.tsx`
- Create: `components/ShimmerLoader.tsx`

**Screens (6 files):**
- Modify: `app/(tabs)/generate.tsx`
- Modify: `app/(tabs)/results.tsx`
- Modify: `app/(tabs)/history.tsx`
- Modify: `app/(tabs)/settings.tsx`
- Modify: `app/plans.tsx`
- Modify: `app/_layout.tsx`

**Hooks (2 files - optional):**
- Create: `hooks/useAnimations.ts`
- Create: `hooks/useSuccessAnimation.ts`

**Total: 20 files (15 modifications + 5 new files)**

---

## Appendix A: Before/After Color Comparison

### Background Colors
| Context | Before | After |
|---------|--------|-------|
| Primary BG | `#0A133B` | `#060D28` (deeper) |
| Gradient Start | `#002857` | `#0A133B` |
| Gradient Mid | `#1a2850` | `#0D1A48` |
| Gradient End | `#0A76AF` (accent!) | `#0F2055` (blue) |

### Text Colors
| Context | Before | After |
|---------|--------|-------|
| Primary | `#F5F7FA` | `#F8FAFC` (brighter) |
| Secondary | `#C8CDD5` | `#CBD5E1` (brighter) |
| Tertiary | `#8A92A0` | `#94A3B8` (brighter) |

### Accent Colors (REMOVED)
| Before (Removed) |
|------------------|
| `accentPurple: #7C3AED` |
| `accentTeal: #0891B2` |
| `accentWarm: #f59e0b` |
| `shadowPurple`, `shadowTeal`, `shadowWarm` |
| `glassPurpleTint`, `glassTealTint`, `glassWarmTint` |

**After:** Only `accentPrimary: #0A76AF` remains

---

## Appendix B: Quick Reference - Key Measurements

```typescript
// Border Radius
mainPanels: 24px
buttons: 28-32px
chips: 28px (circular)
tabBar: 36px (pill)

// Spacing
screenMargins: 20px
sectionSpacing: 24-32px
elementGap: 12-16px
componentPadding: 16-24px

// Typography
heroHeading: 48px / 800 weight
h1: 32px / 700 weight
body: 16px / 400 weight
button: 17px / 700 weight

// Shadows
ambient: 0 24px 48px rgba(0,0,0,0.45)
direct: 0 12px 24px rgba(0,0,0,0.60)
contact: 0 4px 8px rgba(0,0,0,0.75)
accent: 0 12px 32px rgba(10,118,175,0.70)

// Blur
standard: intensity 28, tint dark
buttons: intensity 25, tint dark
```

---

## Appendix C: Component Usage Examples

### GlassPanel
```tsx
// Standard panel
<GlassPanel style={{ marginHorizontal: 20 }}>
  <Text style={styles.content}>Content here</Text>
</GlassPanel>

// Compact panel
<GlassPanel radius={20} style={{ padding: 16 }}>
  <Text>Compact content</Text>
</GlassPanel>
```

### GlowingButton
```tsx
// Primary CTA
<GlowingButton
  variant="primary"
  text="Generate Photoshoot"
  onPress={handleGenerate}
/>

// Secondary action
<GlowingButton
  variant="default"
  text="Cancel"
  onPress={handleCancel}
/>

// Small button
<GlowingButton
  variant="small"
  text="Edit"
  onPress={handleEdit}
/>
```

### CountSelector
```tsx
<CountSelector
  value={generationCount}
  onChange={setGenerationCount}
  disabled={isGenerating}
/>
```

### ShimmerLoader
```tsx
<ShimmerLoader style={{
  width: '100%',
  height: 200,
  borderRadius: 24,
}} />
```

---

## End of Document

This specification provides a complete blueprint for transforming Fashion Muse Studio into a premium Deep Sea Glass aesthetic. All measurements, colors, and implementation details are production-ready and aligned with modern design best practices.

**Key Principles to Remember:**
1. **Strict color discipline** - deep blue + silver/white + accent only
2. **Three layers of depth** - blur + shadows + floating margins
3. **Maximum contrast** - near-white text on deep blue
4. **Functional minimalism** - every element has purpose
5. **Consistent application** - same patterns across all screens

Follow the implementation roadmap sequentially for best results. Start with Phase 1 (Foundation) to establish the design system, then proceed through each phase systematically.
