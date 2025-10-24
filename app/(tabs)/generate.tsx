import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import GlowingButton from '@/components/GlowingButton';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { selectedImage, setSelectedImage, generationCount, setGenerationCount, isGenerating, generateImages } = useGeneration();
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageSelect = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
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
      const msg = 'Failed to upload image. Please try again.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Upload Error', msg);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      const msg = 'Please upload an image first.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('No Image', msg);
      return;
    }

    if (!user) {
      const msg = 'Please sign in to generate images.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Authentication Required', msg);
      return;
    }

    // Check if user has enough credits
    if (user.credits < generationCount) {
      if (user.isGuest) {
        // Guest user out of credits - prompt to sign in
        const msg = `You need ${generationCount} credits but only have ${user.credits}. Sign in to get more credits and save your progress!`;
        if (Platform.OS === 'web') {
          if (confirm(msg + '\n\nGo to Sign In now?')) {
            router.push('/auth/login');
          }
        } else {
          Alert.alert(
            'Credits Required',
            msg,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign In', onPress: () => router.push('/auth/login') },
            ]
          );
        }
      } else {
        // Authenticated user out of credits - go to plans
        const msg = `You need ${generationCount} credits but only have ${user.credits}. Purchase more credits to continue.`;
        if (Platform.OS === 'web') {
          if (confirm(msg + '\n\nGo to Plans now?')) {
            router.push('/plans');
          }
        } else {
          Alert.alert(
            'Insufficient Credits',
            msg,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Buy Credits', onPress: () => router.push('/plans') },
            ]
          );
        }
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
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
