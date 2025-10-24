# Design System Migration Guide

## Overview

This guide helps you migrate from the **dual conflicting style systems** (`neumorphicStyles.ts` + old `glassStyles.ts`) to the **unified deep blue glass design system** in the new `glassStyles.ts`.

---

## What Changed?

### Before (Problems)
- **TWO separate files** with conflicting colors and styles
- `neumorphicStyles.ts`: 50+ blue glass colors (`NEU_COLORS`)
- Old `glassStyles.ts`: Minimal gray/white glass (`COLORS`)
- Components importing from both = visual chaos
- Inconsistent naming conventions

### After (Solution)
- **ONE unified file**: `constants/glassStyles.ts`
- Deep blue premium glass theme (professional iOS 26 aesthetic)
- Standardized values: `COLORS`, `SPACING`, `RADIUS`, `BLUR`, `SHADOW`, `ANIMATION`
- Pre-built component templates: `glassPanel`, `glassButton`, `glassChip`, etc.
- Platform-specific helpers: `getBlurStyle()`, `getPlatformShadow()`
- Gradient presets: `GRADIENTS.background`, `GRADIENTS.topShine`, etc.

---

## Migration Quick Reference

### Color Mapping

| Old (`NEU_COLORS` / old `COLORS`) | New (`COLORS`) | Notes |
|-----------------------------------|----------------|-------|
| `NEU_COLORS.bgDeepest` / `COLORS.bgDeepest` | `COLORS.bgDeepest` | Slightly adjusted for consistency |
| `NEU_COLORS.glassBase` | `COLORS.glassLight` | Renamed for clarity |
| `NEU_COLORS.textPrimary` | `COLORS.textPrimary` | Same value |
| `NEU_COLORS.accentStart` | `COLORS.accent` | Single accent color |
| `NEU_COLORS.shadowBlack` | `COLORS.shadowBlack` | Same value |
| `COLORS.silverLight` (old) | `COLORS.textPrimary` | Renamed for clarity |
| `COLORS.accent` (old: `#0A76AF`) | `COLORS.accent` (new: `#38BDF8`) | Brighter blue |

### Style Mapping

| Old Style | New Style | Notes |
|-----------|-----------|-------|
| `neumorphicStyles.glassPanel` | `glassStyles.glassPanel` | Simplified 3-layer structure |
| `neumorphicStyles.glassButton` | `glassStyles.glassButton` | Standard glass button |
| `neumorphicStyles.neuButtonActive` | `glassStyles.glassButtonActive` | Active state with accent glow |
| `neumorphicStyles.glassChip` | `glassStyles.glassChip` | Circular chip/badge |
| `glassStyles.glass3DSurface` (old) | `glassStyles.glassPanel` | Use `glassPanel` (backward compatible alias exists) |
| `glassStyles.glass3DButton` (old) | `glassStyles.glassButton` | Use `glassButton` (backward compatible alias exists) |
| `glassStyles.activeButton` (old) | `glassStyles.glassButtonActive` | Use `glassButtonActive` (backward compatible alias exists) |

### Constants Mapping

| Old | New | Notes |
|-----|-----|-------|
| `NEU_SPACING` | `SPACING` | Same values |
| `NEU_RADIUS` | `RADIUS` | Same values |
| `NEU_COLORS.depthLayer1/2/3` | `GRADIENTS.glassDepth` | Now a gradient array |
| N/A | `BLUR` | New: standardized blur intensities |
| N/A | `SHADOW` | New: pre-configured shadow elevations |
| N/A | `ANIMATION` | New: timing and spring physics constants |

---

## Step-by-Step Migration

### Step 1: Update Imports

**Before:**
```typescript
import { neumorphicStyles, NEU_COLORS, NEU_RADIUS, NEU_SPACING } from '@/constants/neumorphicStyles';
import { glassStyles, COLORS, RADIUS } from '@/constants/glassStyles';
```

**After:**
```typescript
import { glassStyles, COLORS, SPACING, RADIUS, BLUR, SHADOW, GRADIENTS } from '@/constants/glassStyles';
```

---

### Step 2: Update Component Styles

#### Example 1: Glass Panel Component

**Before (using neumorphicStyles):**
```typescript
<View style={neumorphicStyles.glassPanel}>
  <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill}>
    <LinearGradient
      colors={[
        NEU_COLORS.gradient1,
        NEU_COLORS.gradient2,
        NEU_COLORS.gradient3,
      ]}
      style={StyleSheet.absoluteFill}
    />
  </BlurView>
  {children}
</View>
```

**After (using unified glassStyles):**
```typescript
<View style={glassStyles.glassPanel}>
  {Platform.OS !== 'web' && (
    <BlurView
      intensity={BLUR.medium}  // Standardized blur
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
  )}

  <LinearGradient
    colors={GRADIENTS.topShine}  // Pre-defined gradient
    style={glassStyles.topHighlight}
  />

  <View style={{ zIndex: 10 }}>
    {children}
  </View>
</View>
```

---

#### Example 2: Button Component

**Before (using neumorphicStyles):**
```typescript
<TouchableOpacity
  style={[
    neumorphicStyles.glassButton,
    isActive && neumorphicStyles.neuButtonActive,
  ]}
  onPress={handlePress}
>
  <Text style={[
    neumorphicStyles.neuTextPrimary,
    isActive && styles.activeText,
  ]}>
    {title}
  </Text>
</TouchableOpacity>
```

**After (using unified glassStyles):**
```typescript
<TouchableOpacity
  style={[
    glassStyles.glassButton,
    isActive && glassStyles.glassButtonActive,
  ]}
  onPress={handlePress}
>
  <Text style={[
    glassStyles.buttonText,
    isActive && glassStyles.buttonTextActive,
  ]}>
    {title}
  </Text>
</TouchableOpacity>
```

---

#### Example 3: Chip/Badge Component

**Before (using neumorphicStyles):**
```typescript
<View style={[
  neumorphicStyles.neuChip,
  isSelected && neumorphicStyles.neuChipActive,
]}>
  <Text style={neumorphicStyles.neuTextPrimary}>{count}</Text>
</View>
```

**After (using unified glassStyles):**
```typescript
<View style={[
  glassStyles.glassChip,
  isSelected && glassStyles.glassChipActive,
]}>
  <Text style={glassStyles.textPrimary}>{count}</Text>
</View>
```

---

### Step 3: Update Color References

**Before:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: NEU_COLORS.bgDeep,
    borderColor: NEU_COLORS.borderTop,
  },
  text: {
    color: NEU_COLORS.textSecondary,
  },
  accent: {
    backgroundColor: NEU_COLORS.accentStart,
    shadowColor: NEU_COLORS.accentGlow,
  },
});
```

**After:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgDeep,
    borderColor: COLORS.borderTop,
  },
  text: {
    color: COLORS.textSecondary,
  },
  accent: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accentGlow,
  },
});
```

---

### Step 4: Use New Helper Functions

#### Blur Handling

**Before:**
```typescript
{Platform.OS === 'web' ? (
  <View style={{ backgroundColor: 'rgba(26, 47, 79, 0.4)' }} />
) : (
  <BlurView intensity={28} tint="dark" />
)}
```

**After:**
```typescript
{Platform.OS === 'web' ? (
  <View style={getBlurStyle(BLUR.medium)} />
) : (
  <BlurView {...getBlurStyle(BLUR.medium)} style={StyleSheet.absoluteFill} />
)}
```

#### Shadow Handling

**Before:**
```typescript
const styles = StyleSheet.create({
  button: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
});
```

**After:**
```typescript
const styles = StyleSheet.create({
  button: {
    ...getPlatformShadow('medium'),
    // or directly:
    ...SHADOW.medium,
  },
});
```

---

### Step 5: Use Gradient Presets

**Before:**
```typescript
<LinearGradient
  colors={[
    '#0A0F1C',
    '#0D1929',
    '#1A2F4F',
  ]}
  style={StyleSheet.absoluteFill}
/>
```

**After:**
```typescript
<LinearGradient
  colors={GRADIENTS.background}
  style={StyleSheet.absoluteFill}
/>
```

---

### Step 6: Update Animation Values

**Before:**
```typescript
Animated.spring(scaleAnim, {
  toValue: 0.95,
  friction: 8,
  tension: 300,
  useNativeDriver: true,
}).start();
```

**After:**
```typescript
Animated.spring(scaleAnim, {
  toValue: 0.95,
  ...ANIMATION.spring.snappy,
  useNativeDriver: true,
}).start();
```

---

## Component-Specific Migration

### GlassPanel.tsx

**Current imports:**
```typescript
import { glassStyles, COLORS, RADIUS } from '@/constants/glassStyles';
```

**Changes needed:**
✅ Already using unified system! Just verify:
- Uses `BLUR.medium` instead of hardcoded `28`
- Uses `GRADIENTS.topShine` instead of inline colors
- Uses `GRADIENTS.innerDepth` for inner gradient

---

### GlowingButton.tsx

**Current imports:**
```typescript
import { COLORS, RADIUS } from '@/constants/glassStyles';
```

**Changes needed:**
✅ Already using unified system! Consider:
- Replace inline gradient colors with `GRADIENTS.accent`
- Use `BLUR.medium` instead of hardcoded `28`
- Use `ANIMATION.spring.snappy` for press animation

---

### NeumorphicButton.tsx

**Current imports:**
```typescript
import { neumorphicStyles, NEU_COLORS, NEU_RADIUS } from '@/constants/neumorphicStyles';
```

**Changes needed:**
🔴 **Full migration required:**

1. Replace imports:
   ```typescript
   import { glassStyles, COLORS, RADIUS, BLUR, GRADIENTS, ANIMATION } from '@/constants/glassStyles';
   ```

2. Update color references:
   - `NEU_COLORS.textPrimary` → `COLORS.textPrimary`
   - `NEU_COLORS.accentGlow` → `COLORS.accentGlow`
   - `NEU_COLORS.gradient1/2/3` → `GRADIENTS.glassDepth`

3. Update styles:
   - `NEU_RADIUS.xxl` → `RADIUS.xxl`
   - Replace inline gradient arrays with `GRADIENTS.*`

4. Use standard blur:
   - `intensity={active ? 20 : 15}` → `intensity={BLUR.medium}`

---

### NeumorphicPanel.tsx

**If this component exists:**

🔴 **Full migration required** (similar to NeumorphicButton)

**Or better:** Consider replacing with `GlassPanel.tsx` which already follows the unified system.

---

## Testing Checklist

After migrating each component, verify:

- [ ] Visual appearance matches design (deep blue glass aesthetic)
- [ ] Active states show accent glow (bright sky blue)
- [ ] Shadows are consistent across components
- [ ] Text is readable (white/silver on blue glass)
- [ ] Buttons have tactile press animations
- [ ] Blur effects work on native (BlurView) and web (fallback)
- [ ] No console warnings about missing styles/colors

---

## Backward Compatibility

The new `glassStyles.ts` includes **legacy aliases** for gradual migration:

| Old Name | New Name | Status |
|----------|----------|--------|
| `glass3DSurface` | `glassPanel` | ✅ Alias exists (deprecated) |
| `glass3DButton` | `glassButton` | ✅ Alias exists (deprecated) |
| `activeButton` | `glassButtonActive` | ✅ Alias exists (deprecated) |
| `activeButtonText` | `buttonTextActive` | ✅ Alias exists (deprecated) |

This means **existing components won't break**, but you should update them to use new names.

---

## Recommended Migration Order

1. **Update `GlassPanel.tsx`** (if not already using unified system)
2. **Update `GlowingButton.tsx`** (minor adjustments)
3. **Migrate `NeumorphicButton.tsx`** (full migration or replace with `GlowingButton.tsx`)
4. **Migrate `NeumorphicPanel.tsx`** (replace with `GlassPanel.tsx`)
5. **Update screen components** (HomeScreen, GenerateScreen, etc.)
6. **Update utility components** (CountSelector, CustomTabBar, etc.)
7. **Delete old file**: Remove `constants/neumorphicStyles.ts` when all migrations complete

---

## Common Pitfalls

### Pitfall 1: Hardcoded Blur Intensities

**Bad:**
```typescript
<BlurView intensity={25} tint="dark" />
```

**Good:**
```typescript
<BlurView intensity={BLUR.medium} tint="dark" />
```

---

### Pitfall 2: Inline Color Values

**Bad:**
```typescript
backgroundColor: 'rgba(26, 47, 79, 0.4)'
```

**Good:**
```typescript
backgroundColor: COLORS.glassLight
```

---

### Pitfall 3: Manual Shadow Configuration

**Bad:**
```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.5,
  shadowRadius: 20,
  elevation: 8,
}
```

**Good:**
```typescript
...SHADOW.medium
```

---

### Pitfall 4: Inline Gradient Arrays

**Bad:**
```typescript
colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.08)', 'transparent']}
```

**Good:**
```typescript
colors={GRADIENTS.topShine}
```

---

## Benefits of Unified System

✅ **Consistency**: All components use same colors/values
✅ **Maintainability**: Change one constant, update everywhere
✅ **Type Safety**: TypeScript catches invalid values
✅ **Performance**: Pre-computed StyleSheet objects
✅ **Documentation**: Inline JSDoc comments explain usage
✅ **Platform Support**: Automatic web/native handling
✅ **Scalability**: Easy to add new component templates
✅ **Professional**: Deep blue glass theme looks premium

---

## Need Help?

**Questions about migration?**
- Check the inline documentation in `constants/glassStyles.ts`
- Review usage examples at bottom of the file
- Compare existing `GlassPanel.tsx` and `GlowingButton.tsx` implementations

**Found a missing style?**
- Add it to the appropriate section in `glassStyles.ts`
- Follow existing naming conventions
- Document with JSDoc comments

**Performance issues?**
- Use `BLUR.light` for overlays (faster)
- Reduce shadow radius for large lists
- Consider memoizing gradient components

---

## Summary

The unified design system consolidates **two conflicting style files** into **one professional deep blue glass system** with:

- 🎨 **Cohesive color palette** (deep blue premium glass)
- 📐 **Standardized values** (spacing, radius, blur, shadows)
- 🧩 **Pre-built templates** (panels, buttons, chips)
- 🛠️ **Helper functions** (platform-specific blur/shadow)
- 📈 **Gradients & animations** (consistent transitions)
- 🔄 **Backward compatibility** (gradual migration)

**Next step:** Start with `NeumorphicButton.tsx` and `NeumorphicPanel.tsx` to see immediate visual improvements!
