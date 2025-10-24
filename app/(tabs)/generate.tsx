import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { NEU_COLORS, NEU_SPACING, neumorphicStyles } from '@/constants/neumorphicStyles';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import NeumorphicPanel from '@/components/NeumorphicPanel';
import NeumorphicButton from '@/components/NeumorphicButton';
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
      {/* Fixed Header - Title + Credit Badge */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Generate</Text>
        <NeumorphicPanel style={styles.creditBadge} noPadding>
          <View style={styles.creditBadgeInner}>
            <Text style={styles.creditText}>{user?.credits || 0}</Text>
          </View>
        </NeumorphicPanel>
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
          <Text style={styles.sectionLabel}>VARIATIONS</Text>
          <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
        </View>
      </View>

      {/* Fixed Footer - Generate Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <NeumorphicButton
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
    backgroundColor: NEU_COLORS.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: NEU_SPACING.lg,
    paddingBottom: NEU_SPACING.sm,
  },
  title: {
    ...neumorphicStyles.neuTitle,
    fontSize: 32,
    letterSpacing: -1,
  },
  creditBadge: {
    minWidth: 80,
  },
  creditBadgeInner: {
    paddingVertical: NEU_SPACING.xs,
    paddingHorizontal: NEU_SPACING.md,
    alignItems: 'center',
  },
  creditText: {
    ...neumorphicStyles.neuTextPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: NEU_SPACING.lg,
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
    ...neumorphicStyles.neuTextMuted,
    textTransform: 'uppercase',
    marginBottom: NEU_SPACING.xs,
    paddingLeft: NEU_SPACING.xxs,
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: NEU_SPACING.lg,
    paddingTop: NEU_SPACING.sm,
  },
});
