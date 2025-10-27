import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
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
      showToast('Please sign in to generate images', 'warning');
      return;
    }

    if (user.credits < generationCount) {
      Alert.alert(
        'Insufficient Credits',
        `You need ${generationCount} credits but only have ${user.credits}.`
      );
      return;
    }

    setError(null);

    try {
      // Navigate to results and start generation
      router.push('/(tabs)/results');
      await generateImages(user.id);
      
      Alert.alert('Success', 'Generation started! Check the Results tab.');
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
          {
            paddingTop: insets.top + SPACING.xl,
            paddingBottom: insets.bottom + 120,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <GlassyTitle><Text>Generate</Text></GlassyTitle>
          
          {user && (
            <View style={styles.creditBadge}>
              <Sparkles size={16} color={COLORS.accent} />
              <Text style={styles.creditText}>{user.credits}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of images</Text>
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
        
        <TouchableOpacity
          style={[
            styles.generateButton,
            (isGenerating || !selectedImage) && styles.disabledButton,
          ]}
          onPress={handleGenerate}
          disabled={isGenerating || !selectedImage}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[
              'rgba(10, 118, 175, 0.25)',
              'rgba(10, 118, 175, 0.15)',
              'rgba(10, 118, 175, 0.08)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.creditsInfo}>
          Cost: {generationCount} credit{generationCount !== 1 ? 's' : ''}
        </Text>
        
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
    gap: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(10, 118, 175, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(10, 118, 175, 0.30)',
  },
  creditText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    paddingLeft: SPACING.xxs,
  },
  uploaderSection: {
    marginVertical: SPACING.sm,
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
  generateButton: {
    height: 64,
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderTopColor: 'rgba(10, 118, 175, 0.40)',
    borderLeftColor: 'rgba(10, 118, 175, 0.30)',
    borderRightColor: 'rgba(10, 118, 175, 0.15)',
    borderBottomColor: 'rgba(10, 118, 175, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    shadowColor: COLORS.shadowAccent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.80,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  generateButtonText: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
    textShadowColor: 'rgba(10, 118, 175, 0.80)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  creditsInfo: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: SPACING.sm,
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
