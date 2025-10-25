import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Image as ImageIcon } from 'lucide-react-native';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, SPACING, GRADIENTS, RADIUS } from '@/constants/glassStyles';
import SimpleButton from '@/components/SimpleButton';
import SimpleCard from '@/components/SimpleCard';
import StyleSelector from '@/components/StyleSelector';

const VARIATION_COUNTS = [1, 2, 4, 6, 8];

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
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.background as unknown as string[]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + SPACING.lg, paddingBottom: insets.bottom + SPACING.xxxl },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Generate</Text>
            <Text style={styles.subtitle}>Upload a photo and pick your style</Text>
          </View>
          <View style={styles.creditBadge}>
            <Text style={styles.creditLabel}>Credits</Text>
            <Text style={styles.creditValue}>{user?.credits ?? 0}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <StyleSelector selectedStyleId={selectedStyleId} onSelectStyle={setSelectedStyleId} />
        </View>

        <SimpleCard style={styles.uploadCard}>
          <TouchableOpacity onPress={handleImageSelect} style={styles.uploadArea} activeOpacity={0.85}>
            {uploading ? (
              <ActivityIndicator size="large" color={COLORS.accent} />
            ) : selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.placeholderContent}>
                <View style={styles.uploadIcon}>
                  <ImageIcon size={32} color={COLORS.accent} />
                </View>
                <Text style={styles.uploadText}>Tap to upload photo</Text>
                <Text style={styles.uploadSubtext}>Supports JPG or PNG up to 4MB</Text>
              </View>
            )}
          </TouchableOpacity>
        </SimpleCard>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of variations</Text>
          <View style={styles.countRow}>
            {VARIATION_COUNTS.map((count) => {
              const isActive = generationCount === count;
              return (
                <TouchableOpacity
                  key={count}
                  onPress={() => setGenerationCount(count)}
                  style={[styles.countButton, isActive && styles.countButtonActive]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.countText, isActive && styles.countTextActive]}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <SimpleButton
          title={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          onPress={handleGenerate}
          disabled={isGenerating || !selectedImage}
          loading={isGenerating}
          fullWidth
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 15,
  },
  creditBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.glassMinimalLight,
    borderWidth: 1,
    borderColor: COLORS.borderMinimalLeft,
    alignItems: 'center',
  },
  creditLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  creditValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  section: {
    gap: SPACING.sm,
  },
  uploadCard: {
    padding: 0,
    overflow: 'hidden',
  },
  uploadArea: {
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
  },
  placeholderContent: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  uploadIcon: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glassMinimalMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  uploadSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  countRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  countButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderMinimalLeft,
    backgroundColor: COLORS.glassMinimalLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  countTextActive: {
    color: COLORS.textPrimary,
  },
});

