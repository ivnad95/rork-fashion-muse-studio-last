import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, Sparkles, Image as ImageIcon } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector from '@/components/StyleSelector';
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('casual');



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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + 120 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <GlassyTitle><Text>Create</Text></GlassyTitle>
          
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
              activeOpacity={0.8}
            testID="credit-badge"
            accessibilityLabel="Credits"
            >
              <Sparkles size={18} color={COLORS.accent} strokeWidth={2.5} />
              <Text style={styles.creditText}>{user.credits}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {user?.isGuest && (
          <GlassPanel style={styles.guestBanner} radius={RADIUS.lg}>
            <Text style={styles.guestBannerText}>
              <Text style={styles.guestBannerBold}>{user.credits} free credits</Text> remaining. Sign in to unlock unlimited generations.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={styles.guestBannerButton}
              activeOpacity={0.85}
            >
              <Text style={styles.guestBannerButtonText}>Sign In</Text>
            </TouchableOpacity>
          </GlassPanel>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Variations</Text>
          <CountSelector
            value={generationCount}
            onChange={setGenerationCount}
            disabled={isGenerating}
          />
        </View>
        
        <View style={styles.uploaderSection}>
          <ImageUploader
            uploadedImage={selectedImage}
            uploading={uploading}
            onImageSelect={handleImageSelect}
          />
        </View>
        
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
          activeOpacity={0.8}
        testID="advanced-toggle"
        accessibilityLabel="Toggle advanced options"
        >
          <Text style={styles.advancedToggleText}>Advanced Options</Text>
          {showAdvanced ? (
            <ChevronUp size={18} color={COLORS.silverMid} />
          ) : (
            <ChevronDown size={18} color={COLORS.silverMid} />
          )}
        </TouchableOpacity>
        
        {showAdvanced && (
          <View style={styles.advancedSection}>
            <StyleSelector
              selectedStyleId={selectedStyle}
              onSelectStyle={setSelectedStyle}
            />
          </View>
        )}
        
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
              <ImageIcon size={24} color={COLORS.textPrimary} strokeWidth={2.5} />
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Creating...' : 'Generate Shoot'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.creditsInfo}>
            {generationCount} credit{generationCount !== 1 ? 's' : ''} per generation
          </Text>
        </View>
        
        {error && (
          <GlassPanel style={styles.errorPanel} radius={RADIUS.lg}>
            <Text style={styles.errorText}>{error}</Text>
          </GlassPanel>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  creditText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  guestBannerText: {
    flex: 1,
    color: COLORS.silverMid,
    fontSize: 13,
    lineHeight: 18,
  },
  guestBannerBold: {
    color: COLORS.accent,
    fontWeight: '700' as const,
  },
  guestBannerButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  guestBannerButtonText: {
    color: COLORS.bgDeep,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  section: {
    gap: SPACING.md,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  uploaderSection: {
    marginTop: -SPACING.sm,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  advancedToggleText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  advancedSection: {
    marginTop: SPACING.sm,
  },
  generateSection: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  generateButton: {
    height: 68,
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
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.90,
    shadowRadius: 32,
    elevation: 16,
    overflow: 'hidden',
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  generateButtonText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(56, 189, 248, 0.90)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  disabledButton: {
    opacity: 0.4,
  },
  creditsInfo: {
    color: COLORS.silverMid,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  errorPanel: {
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500' as const,
  },
});
