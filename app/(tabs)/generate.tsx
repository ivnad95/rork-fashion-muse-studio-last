import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Sparkles, Wand2 } from 'lucide-react-native';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, GRADIENTS, SPACING, RADIUS } from '@/constants/glassStyles';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    selectedImage,
    setSelectedImage,
    generationCount,
    setGenerationCount,
    isGenerating,
    generateImages,
  } = useGeneration();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Handle image selection
  const handleImageSelect = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        setSelectedImage(result.assets[0].uri);
        setError(null);
        setUploading(false);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      showToast('Failed to upload image', 'error');
      setUploading(false);
    }
  };

  // Handle generate button press
  const handleGenerate = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please upload an image first.');
      return;
    }

    if (!user) {
      showToast('Loading user data...', 'warning');
      return;
    }

    if (user.credits < generationCount) {
      if (user.isGuest) {
        Alert.alert(
          'Not Enough Credits',
          `You need ${generationCount} credits but only have ${user.credits}. Sign in to get more credits!`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => router.push('/auth/login') }
          ]
        );
      } else {
        Alert.alert(
          'Insufficient Credits',
          `You need ${generationCount} credits but only have ${user.credits}.`,
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Buy Credits', onPress: () => router.push('/plans') }
          ]
        );
      }
      return;
    }

    setError(null);

    try {
      // Navigate to results and start generation
      router.push('/(tabs)/results');
      await generateImages(user.id);
      
      showToast('Generation started!', 'success');
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate images. Please try again.');
      showToast('Generation failed', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={GRADIENTS.background}
        style={StyleSheet.absoluteFill} 
      />

      <View style={[styles.content, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Create</Text>
            <Text style={styles.subtitle}>Fashion Photo Studio</Text>
          </View>
          
          {user && (
            <TouchableOpacity 
              style={styles.creditBadge}
              onPress={() => {
                if (user.isGuest) {
                  router.push('/auth/login');
                } else {
                  router.push('/plans');
                }
              }}
              activeOpacity={0.7}
              testID="credit-badge"
              accessibilityLabel="Credits"
            >
              <Sparkles size={16} color={COLORS.accent} strokeWidth={2.5} />
              <Text style={styles.creditText}>{user.credits}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {user?.isGuest && (
          <GlassPanel style={styles.guestBanner} radius={RADIUS.md}>
            <Text style={styles.guestBannerText}>
              <Text style={styles.guestBannerBold}>{user.credits}</Text> free credits
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={styles.guestBannerButton}
              activeOpacity={0.8}
            >
              <Text style={styles.guestBannerButtonText}>Sign In</Text>
            </TouchableOpacity>
          </GlassPanel>
        )}
        
        <View style={styles.mainContent}>
          <View style={styles.uploaderSection}>
            <ImageUploader
              uploadedImage={selectedImage}
              uploading={uploading}
              onImageSelect={handleImageSelect}
            />
          </View>
          
          <View style={styles.controlsSection}>
            <View style={styles.countSection}>
              <Text style={styles.countLabel}>Variations</Text>
              <CountSelector
                value={generationCount}
                onChange={setGenerationCount}
                disabled={isGenerating}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.generateSection}>
          <TouchableOpacity
            style={[
              styles.generateButton,
              (isGenerating || !selectedImage) && styles.disabledButton,
            ]}
            onPress={handleGenerate}
            disabled={isGenerating || !selectedImage}
            activeOpacity={0.85}
            testID="generate-button"
            accessibilityLabel={isGenerating ? 'Creating' : 'Generate shoot'}
          >
            <LinearGradient
              colors={[
                'rgba(56, 189, 248, 0.30)',
                'rgba(56, 189, 248, 0.15)',
                'rgba(56, 189, 248, 0.08)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.generateButtonContent}>
              <Wand2 size={22} color={COLORS.textPrimary} strokeWidth={2.5} />
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Creating...' : 'Generate'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.creditsInfo}>
            {generationCount} credit{generationCount !== 1 ? 's' : ''} per generation
          </Text>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
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
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.silverMid,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  creditText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  guestBannerText: {
    color: COLORS.silverMid,
    fontSize: 12,
    fontWeight: '500' as const,
  },
  guestBannerBold: {
    color: COLORS.accent,
    fontWeight: '700' as const,
  },
  guestBannerButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  guestBannerButtonText: {
    color: COLORS.bgDeep,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  mainContent: {
    flex: 1,
    gap: SPACING.lg,
  },
  uploaderSection: {
    flex: 1,
  },
  controlsSection: {
    gap: SPACING.md,
  },
  countSection: {
    gap: SPACING.xs,
  },
  countLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    marginLeft: 4,
  },
  generateSection: {
    gap: SPACING.xs,
  },
  generateButton: {
    height: 60,
    borderRadius: RADIUS.xxxl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderTopColor: 'rgba(56, 189, 248, 0.45)',
    borderLeftColor: 'rgba(56, 189, 248, 0.35)',
    borderRightColor: 'rgba(56, 189, 248, 0.20)',
    borderBottomColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accentShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  generateButtonText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(56, 189, 248, 0.80)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  creditsInfo: {
    color: COLORS.silverMid,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  errorContainer: {
    paddingVertical: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
