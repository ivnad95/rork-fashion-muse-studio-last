import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage } from '@/utils/download';
import { COLORS, glassStyles } from '@/constants/glassStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Icons matching ManusAI reference
const EyeIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M7 10l5 5 5-5" />
    <Path d="M12 15V3" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

/**
 * ResultsScreen - Display generation results in a grid
 * Matches ManusAI reference design exactly
 */

export default function ResultsScreen() {
  const { showToast } = useToast();
  const { generatedImages, isGenerating, generationCount } = useGeneration();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (!generationCount) {
      return 0;
    }
    return Math.min(100, Math.round((generatedImages.length / generationCount) * 100));
  }, [generatedImages.length, generationCount]);

  const handleDownload = async (imageUri: string) => {
    const success = await downloadImage(imageUri, { filename: `fashion-${Date.now()}.jpg` });
    showToast(success ? 'Image downloaded!' : 'Failed to download', success ? 'success' : 'error');
  };

  const remainingCount = Math.max(0, generationCount - generatedImages.length);
  const loadingPlaceholders = isGenerating && remainingCount > 0 ? Array(remainingCount).fill(null) : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={[COLORS.lightColor1, COLORS.lightColor2, COLORS.lightColor1]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Results</GlassyTitle>

        {isGenerating && (
          <GlassPanel style={styles.progressPanel} radius={20}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% complete</Text>
          </GlassPanel>
        )}

        {generatedImages.length === 0 && !isGenerating ? (
          <GlassPanel style={styles.emptyPanel} radius={20}>
            <Text style={styles.emptyIcon}>🎨</Text>
            <Text style={styles.emptyText}>No results yet</Text>
            <Text style={styles.emptySubtext}>Generate your first photoshoot to see results here</Text>
          </GlassPanel>
        ) : (
          <View style={styles.grid}>
            {generatedImages.map((img, index) => (
              <GlassPanel key={`img-${index}`} style={styles.gridItem} radius={20}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                  <View style={styles.overlay}>
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={() => setPreviewImage(img)}
                    >
                      <EyeIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={() => handleDownload(img)}
                    >
                      <DownloadIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassPanel>
            ))}

            {loadingPlaceholders.map((_, index) => (
              <GlassPanel key={`loading-${index}`} style={styles.gridItem} radius={20}>
                <View style={styles.loadingCard}>
                  <Text style={styles.loadingText}>Generating...</Text>
                </View>
              </GlassPanel>
            ))}
          </View>
        )}

        {!isGenerating && generatedImages.length > 0 && (
          <GlassPanel style={styles.successPanel} radius={20}>
            <View style={styles.successContent}>
              <CheckCircleIcon />
              <Text style={styles.successText}>Your fashion photos are ready!</Text>
            </View>
          </GlassPanel>
        )}
      </ScrollView>

      {/* Lightbox Modal */}
      <Modal
        visible={previewImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPreviewImage(null)}
        >
          <View style={styles.modalContent}>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
  progressPanel: {
    padding: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.lightColor3,
  },
  progressText: {
    color: COLORS.silverMid,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 56) / 2,
    aspectRatio: 3 / 4,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  overlayButton: {
    padding: 12,
    minWidth: 52,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  loadingCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.silverMid,
  },
  emptyPanel: {
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: COLORS.silverLight,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: COLORS.silverMid,
    textAlign: 'center',
  },
  successPanel: {
    padding: 16,
    marginTop: 16,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
