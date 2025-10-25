import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import GlowingButton from '@/components/GlowingButton';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, glassStyles } from '@/constants/glassStyles';

export default function GenerateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    selectedImage,
    setSelectedImage,
    generationCount,
    setGenerationCount,
    selectedStyleId,
    setSelectedStyleId,
    isGenerating,
    generateImages,
  } = useGeneration();
  const [uploading, setUploading] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleImageSelect = async () => {
    try {
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
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      showToast('Please upload an image first', 'warning');
      return;
    }

    if (!user) {
      showToast('Please sign in to generate images', 'warning');
      return;
    }

    if (user.credits < generationCount) {
      showToast(`You need ${generationCount} credits but only have ${user.credits}`, 'warning');
      return;
    }

    router.push('/(tabs)/results');
    generateImages(user.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={[COLORS.lightColor1, COLORS.lightColor2, COLORS.lightColor1]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>
          {greeting}, {user?.name || 'Muse'}
        </GlassyTitle>

        <GlassPanel style={styles.creditPanel} radius={24}>
          <Text style={styles.creditLabel}>Credits available</Text>
          <Text style={styles.creditValue}>{user?.credits ?? 0}</Text>
          <Text style={styles.creditHint}>Each variation consumes one credit.</Text>
        </GlassPanel>

        <GlassPanel style={styles.countPanel} radius={24}>
          <Text style={styles.sectionTitle}>Variations</Text>
          <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
        </GlassPanel>

        <ImageUploader uploadedImage={selectedImage} uploading={uploading} onImageSelect={handleImageSelect} />

        <GlowingButton
          onPress={handleGenerate}
          text={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          variant="primary"
          style={[styles.generateButton, (isGenerating || !selectedImage) && styles.disabledButton]}
          disabled={isGenerating || !selectedImage}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  creditPanel: {
    marginBottom: 16,
    alignItems: 'center',
    gap: 8,
  },
  creditLabel: {
    color: COLORS.silverMid,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  creditValue: {
    color: COLORS.silverLight,
    fontSize: 32,
    fontWeight: '700',
    textShadowColor: COLORS.shadowColor,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  creditHint: {
    color: COLORS.silverMid,
    fontSize: 12,
    textAlign: 'center',
  },
  countPanel: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.silverLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  generateButton: {
    width: '100%',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
