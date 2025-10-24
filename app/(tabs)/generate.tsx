import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import GlowingButton from '@/components/GlowingButton';
import StyleSelector from '@/components/StyleSelector';
import * as haptics from '@/utils/haptics';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { selectedImage, setSelectedImage, generationCount, setGenerationCount, isGenerating, generateImages } = useGeneration();
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('casual');

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
      {/* Premium dark gradient background */}
      <LinearGradient
        colors={[COLORS.bgDeepest, COLORS.bgDeep, COLORS.bgMid, COLORS.bgBase]}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle noise texture overlay */}
      <View style={[StyleSheet.absoluteFill, { opacity: 0.03, backgroundColor: 'transparent' }]}
        pointerEvents="none"
      />
      <View style={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 100 }]}>
        {/* Title with Credit Badge */}
        <View style={styles.titleSection}>
          <GlassyTitle><Text>Generate</Text></GlassyTitle>
          {/* Credit Badge - top-right corner */}
          <GlassPanel style={styles.creditBadge}>
            <Text style={styles.creditText}>{user?.credits || 0} credits</Text>
          </GlassPanel>
        </View>

        {/* Style Selector Section */}
        <StyleSelector
          selectedStyleId={selectedStyleId}
          onSelectStyle={setSelectedStyleId}
        />

        {/* Count Selector Section */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>NUMBER OF VARIATIONS</Text>
          <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
        </View>

        {/* Image Uploader Section - flex to fill remaining space */}
        <View style={styles.uploaderSection}>
          <Text style={styles.sectionLabel}>UPLOAD PHOTO</Text>
          <ImageUploader uploadedImage={selectedImage} uploading={uploading} onImageSelect={handleImageSelect} />
        </View>

        {/* Generate Button Section */}
        <View style={styles.buttonSection}>
          <Text style={styles.sectionLabel}>GENERATE</Text>
          <GlowingButton
            onPress={handleGenerate}
            disabled={isGenerating}
            text={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,                   // 24px
  },
  creditBadge: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md + 4,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  creditText: {
    ...TEXT_STYLES.labelPrimary,
    color: COLORS.silverLight,
  },
  sectionLabel: {
    ...TEXT_STYLES.overlineSecondary,
    textTransform: 'uppercase',
    color: COLORS.silverDark,
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  selectorSection: {
    marginBottom: SPACING.xl,                   // 24px
  },
  uploaderSection: {
    flex: 1,
    marginBottom: SPACING.xl,                   // 24px
  },
  buttonSection: {
    marginBottom: 0,
  },
});
