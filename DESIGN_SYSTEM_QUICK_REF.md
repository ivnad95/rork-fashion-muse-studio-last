# Design System Quick Reference Card

**TL;DR:** Unified deep blue glass design system at `/constants/glassStyles.ts`

---

## 🎨 Most Common Colors

```typescript
// Backgrounds
COLORS.bgDeepest  // '#0A0F1C' - darkest
COLORS.bgDeep     // '#0D1929' - main background
COLORS.bgMid      // '#1A2F4F' - lighter areas

// Glass surfaces
COLORS.glassLight   // 'rgba(42, 73, 114, 0.25)' - standard glass
COLORS.glassMedium  // 'rgba(26, 57, 98, 0.35)' - deeper glass

// Text
COLORS.textPrimary    // '#F8FAFC' - white
COLORS.textSecondary  // '#CBD5E1' - silver

// Accent (bright sky blue)
COLORS.accent      // '#38BDF8'
COLORS.accentGlow  // 'rgba(56, 189, 248, 0.70)'
```

---

## 📐 Most Common Values

```typescript
// Spacing
SPACING.xs   // 8px
SPACING.md   // 16px
SPACING.lg   // 20px
SPACING.xxl  // 32px

// Radius
RADIUS.lg   // 20px - panels
RADIUS.xl   // 24px - cards
RADIUS.xxl  // 28px - buttons
RADIUS.full // 9999 - circular

// Blur
BLUR.medium  // 28 - standard blur

// Shadows
...SHADOW.low     // small elements
...SHADOW.medium  // buttons
...SHADOW.high    // panels
```

---

## 🧩 Component Templates

```typescript
// Panel/Card
glassStyles.glassPanel     // Large container
glassStyles.glassCard      // Compact card
glassStyles.glassInset     // Input/carved

// Button
glassStyles.glassButton         // Standard button
glassStyles.glassButtonActive   // Active/selected
glassStyles.glassButtonPressed  // Pressed state
glassStyles.glassButtonSmall    // Small variant
glassStyles.glassButtonGhost    // Minimal variant

// Chip/Badge
glassStyles.glassChip        // Circular chip
glassStyles.glassChipActive  // Active chip

// Text
glassStyles.textPrimary      // Bold white
glassStyles.buttonText       // Button text
glassStyles.buttonTextActive // Active button text
glassStyles.titleText        // Large title
```

---

## 🎨 Gradient Presets

```typescript
GRADIENTS.background   // Full-screen bg gradient
GRADIENTS.topShine     // Glossy highlight
GRADIENTS.glassDepth   // Glass depth layers
GRADIENTS.accent       // Accent gradient
```

---

## 🛠️ Common Patterns

### Glass Panel
```typescript
<View style={glassStyles.glassPanel}>
  <BlurView intensity={BLUR.medium} tint="dark" style={StyleSheet.absoluteFill} />
  <LinearGradient colors={GRADIENTS.topShine} style={glassStyles.topHighlight} />
  <View style={{ zIndex: 10 }}>{children}</View>
</View>
```

### Button
```typescript
<TouchableOpacity
  style={[glassStyles.glassButton, isActive && glassStyles.glassButtonActive]}
>
  <Text style={[glassStyles.buttonText, isActive && glassStyles.buttonTextActive]}>
    {title}
  </Text>
</TouchableOpacity>
```

### Chip
```typescript
<View style={[glassStyles.glassChip, isSelected && glassStyles.glassChipActive]}>
  <Text style={glassStyles.textPrimary}>{count}</Text>
</View>
```

### Animation
```typescript
Animated.spring(scaleAnim, {
  toValue: 1,
  ...ANIMATION.spring.snappy,
  useNativeDriver: true,
}).start();
```

---

## 📦 Import

```typescript
import {
  glassStyles,
  COLORS,
  SPACING,
  RADIUS,
  BLUR,
  SHADOW,
  GRADIENTS,
  ANIMATION,
  getBlurStyle,
  getPlatformShadow,
} from '@/constants/glassStyles';
```

---

## 🔄 Migration Quick Find

| Old | New |
|-----|-----|
| `NEU_COLORS.*` | `COLORS.*` |
| `NEU_SPACING.*` | `SPACING.*` |
| `NEU_RADIUS.*` | `RADIUS.*` |
| `neumorphicStyles.glassPanel` | `glassStyles.glassPanel` |
| `neumorphicStyles.glassButton` | `glassStyles.glassButton` |
| `glassStyles.glass3DSurface` | `glassStyles.glassPanel` |
| `glassStyles.activeButton` | `glassStyles.glassButtonActive` |

---

## 🎯 Visual Goals

- Deep blue gradient aesthetic (iOS 26)
- Transparent 3D glass with blur
- Professional, premium appearance
- Consistent across all components

---

**Full docs:** `DESIGN_SYSTEM_SUMMARY.md` | **Migration:** `DESIGN_SYSTEM_MIGRATION.md`
