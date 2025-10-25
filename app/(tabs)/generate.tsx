import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, glassStyles } from '@/constants/glassStyles';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector from '@/components/StyleSelector';

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
        contentContainerStyle={[glassStyles.screenContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>
          {greeting}, {user?.name || 'Muse'}
        </GlassyTitle>

        <View style={styles.inlineRow}>
          <GlassPanel style={styles.creditPanel} radius={24}>
            <Text style={styles.creditLabel}>Credits</Text>
            <Text style={styles.creditValue}>{user?.credits ?? 0}</Text>
          </GlassPanel>
          <GlassPanel style={styles.countPanel} radius={24}>
            <Text style={styles.sectionTitle}>Variations</Text>
            <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
          </GlassPanel>
        </View>

        <GlassPanel style={styles.sectionPanel} radius={24}>
          <Text style={styles.sectionTitle}>Pick Your Style</Text>
          <StyleSelector selectedStyleId={selectedStyleId} onSelectStyle={setSelectedStyleId} />
        </GlassPanel>

        <ImageUploader uploadedImage={selectedImage} uploading={uploading} onImageSelect={handleImageSelect} />

        <TouchableOpacity
          style={[
            glassStyles.glass3DButton,
            glassStyles.primaryButton,
            styles.generateButton,
            (isGenerating || !selectedImage) && styles.disabledButton,
          ]}
          onPress={handleGenerate}
          disabled={isGenerating || !selectedImage}
          activeOpacity={0.8}
        >
          <Text style={[glassStyles.buttonText, glassStyles.primaryButtonText]}>
            {isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          </Text>
        </TouchableOpacity>
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
  inlineRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  creditPanel: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
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
  countPanel: {
    flex: 0.65,
  },
  sectionTitle: {
    color: COLORS.silverLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionPanel: {
    marginBottom: 16,
  },
  generateButton: {
    width: '100%',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
