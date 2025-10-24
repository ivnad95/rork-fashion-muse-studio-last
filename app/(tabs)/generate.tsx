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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title with Credit Badge */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Generate</Text>
          {/* Credit Badge */}
          <NeumorphicPanel style={styles.creditBadge} noPadding>
            <View style={styles.creditBadgeInner}>
              <Text style={styles.creditText}>{user?.credits || 0} credits</Text>
            </View>
          </NeumorphicPanel>
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

        {/* Image Uploader Section */}
        <View style={styles.uploaderSection}>
          <Text style={styles.sectionLabel}>UPLOAD PHOTO</Text>
          <ImageUploader uploadedImage={selectedImage} uploading={uploading} onImageSelect={handleImageSelect} />
        </View>

        {/* Generate Button Section */}
        <View style={styles.buttonSection}>
          <NeumorphicButton
            title={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
            onPress={handleGenerate}
            disabled={isGenerating}
            size="large"
            fullWidth
            active={!isGenerating && !!selectedImage}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU_COLORS.base,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: NEU_SPACING.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: NEU_SPACING.xl,
  },
  title: {
    ...neumorphicStyles.neuTitle,
    fontSize: 36,
  },
  creditBadge: {
    minWidth: 110,
  },
  creditBadgeInner: {
    paddingVertical: NEU_SPACING.sm,
    paddingHorizontal: NEU_SPACING.md,
    alignItems: 'center',
  },
  creditText: {
    ...neumorphicStyles.neuTextPrimary,
    fontSize: 14,
  },
  sectionLabel: {
    ...neumorphicStyles.neuTextMuted,
    textTransform: 'uppercase',
    marginBottom: NEU_SPACING.sm,
    paddingLeft: NEU_SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  selectorSection: {
    marginBottom: NEU_SPACING.xl,
  },
  uploaderSection: {
    marginBottom: NEU_SPACING.xl,
  },
  buttonSection: {
    marginBottom: NEU_SPACING.md,
  },
});
