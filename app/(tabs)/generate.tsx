import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, GRADIENTS, glassStyles } from '@/constants/glassStyles';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import GlassContainer from '@/components/GlassContainer';
import GlassButton from '@/components/GlassButton';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector from '@/components/StyleSelector';
import * as haptics from '@/utils/haptics';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { selectedImage, setSelectedImage, generationCount, setGenerationCount, selectedStyleId, setSelectedStyleId, isGenerating, generateImages } = useGeneration();
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageSelect = async () => {
    try {
      haptics.light();
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      showToast('Please upload an image first.', 'warning');
      return;
    }

    if (!user) {
      showToast('Please sign in to generate images.', 'warning');
      return;
    }

    // Check if user has enough credits
    if (user.credits < generationCount) {
      if (user.isGuest) {
        // Guest user out of credits - prompt to sign in
        showToast(`You need ${generationCount} credits but only have ${user.credits}. Sign in to get more!`, 'warning', 4000);
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        // Authenticated user out of credits - go to plans
        showToast(`You need ${generationCount} credits but only have ${user.credits}. Buy more to continue.`, 'warning', 4000);
        setTimeout(() => router.push('/plans'), 2000);
      }
      return;
    }

    haptics.heavy();
    // Redirect to results immediately so user can see loading placeholders
    router.push('/(tabs)/results');
    // Start generation in background
    generateImages(user.id);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen gradient background */}
      <LinearGradient
        colors={GRADIENTS.background as any}
        style={StyleSheet.absoluteFill}
      />

      {/* Fixed Header - Title + Credit Badge */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[glassStyles.titleText, styles.title]}>Generate</Text>
        <GlassContainer variant="card" noPadding style={styles.creditBadge}>
          <View style={styles.creditBadgeInner}>
            <Text style={[glassStyles.textPrimary, styles.creditText]}>{user?.credits || 0}</Text>
          </View>
        </GlassContainer>
      </View>

      {/* Main Content - Flex Fill */}
      <View style={styles.content}>
        {/* Style Selector - Horizontal scroll, compact */}
        <View style={styles.styleSection}>
          <StyleSelector
            selectedStyleId={selectedStyleId}
            onSelectStyle={setSelectedStyleId}
          />
        </View>

        {/* Image Uploader - Centered, optimized size */}
        <View style={styles.uploaderSection}>
          <ImageUploader
            uploadedImage={selectedImage}
            uploading={uploading}
            onImageSelect={handleImageSelect}
          />
        </View>

        {/* Count Selector - Compact */}
        <View style={styles.selectorSection}>
          <Text style={[glassStyles.textMuted, styles.sectionLabel]}>VARIATIONS</Text>
          <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
        </View>
      </View>

      {/* Fixed Footer - Generate Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GlassButton
          title={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          onPress={handleGenerate}
          disabled={isGenerating}
          size="large"
          fullWidth
          active={!isGenerating && !!selectedImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
  },
  creditBadge: {
    minWidth: 64,
    backgroundColor: COLORS.glassMinimalLight,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
  },
  creditBadgeInner: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  creditText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-evenly',
  },
  styleSection: {
    flex: 0,
  },
  uploaderSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '45%',
  },
  selectorSection: {
    flex: 0,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.xxs,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
});
