import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import ProgressBar from '@/components/ProgressBar';
import GlassButton from '@/components/GlassButton';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage } from '@/utils/download';
import { COLORS, SPACING, RADIUS, glassStyles, GRADIENTS } from '@/constants/glassStyles';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = SPACING.md;
const TILE_WIDTH = Math.max((SCREEN_WIDTH - SPACING.xl * 2 - GRID_GAP) / 2, 140);

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
  const router = useRouter();
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

  const statusLabel = isGenerating
    ? `Generating ${generationCount} variations`
    : `${generatedImages.length} finished variation${generatedImages.length === 1 ? '' : 's'}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Results</GlassyTitle>

        <GlassPanel style={styles.statusPanel} radius={30}>
          <View style={styles.statusRow}>
            <View style={styles.statusMetric}>
              <Text style={styles.metricLabel}>Generated</Text>
              <Text style={styles.metricValue}>{generatedImages.length}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusMetric}>
              <Text style={styles.metricLabel}>Remaining</Text>
              <Text style={styles.metricValue}>{Math.max(0, remainingCount)}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusMetric}>
              <Text style={styles.metricLabel}>Status</Text>
              <Text style={styles.metricSubValue}>{statusLabel}</Text>
            </View>
          </View>

          <ProgressBar
            progress={progress}
            current={generatedImages.length}
            total={generationCount}
            label={isGenerating ? 'Generation in progress' : 'Completed'}
          />
        </GlassPanel>

        {!isGenerating && generatedImages.length === 0 && (
          <GlassPanel style={styles.emptyPanel} radius={30}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload a muse photo on the Generate tab to create your first fashion shoot.
            </Text>
            <GlassButton title="Go to Generate" onPress={() => router.push('/(tabs)/generate')} fullWidth />
          </GlassPanel>
        )}

        {generatedImages.length > 0 && (
          <View style={styles.grid}>
            {generatedImages.map((img, index) => (
              <GlassPanel key={`img-${index}`} style={styles.gridItem} radius={28} noPadding>
                <TouchableOpacity activeOpacity={0.9} style={styles.imageWrapper} onPress={() => setPreviewImage(img)}>
                  <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(2, 9, 23, 0.65)']}
                    style={styles.overlay}
                  >
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={() => setPreviewImage(img)}
                      activeOpacity={0.85}
                    >
                      <EyeIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={() => handleDownload(img)}
                      activeOpacity={0.85}
                    >
                      <DownloadIcon />
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              </GlassPanel>
            ))}

            {loadingPlaceholders.map((_, index) => (
              <GlassPanel key={`loading-${index}`} style={styles.gridItem} radius={28}>
                <View style={styles.loadingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.loadingText}>Generating...</Text>
                </View>
              </GlassPanel>
            ))}
          </View>
        )}

        {!isGenerating && generatedImages.length > 0 && (
          <GlassPanel style={styles.successPanel} radius={28}>
            <View style={styles.successContent}>
              <CheckCircleIcon />
              <View>
                <Text style={styles.successText}>Shoot complete</Text>
                <Text style={styles.successSubtext}>Download or share your favorites.</Text>
              </View>
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
  statusPanel: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  statusMetric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statusDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  metricLabel: {
    color: COLORS.silverMid,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: COLORS.silverLight,
    fontSize: 24,
    fontWeight: '700',
  },
  metricSubValue: {
    color: COLORS.silverLight,
    fontSize: 14,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  gridItem: {
    width: TILE_WIDTH,
    aspectRatio: 3 / 4,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: SPACING.md,
  },
  overlayButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  loadingCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingText: {
    color: COLORS.silverLight,
    fontWeight: '600',
  },
  emptyPanel: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    color: COLORS.silverLight,
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: COLORS.silverMid,
    textAlign: 'center',
    lineHeight: 22,
  },
  successPanel: {
    marginTop: SPACING.sm,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  successText: {
    color: COLORS.silverLight,
    fontSize: 16,
    fontWeight: '700',
  },
  successSubtext: {
    color: COLORS.silverMid,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
    aspectRatio: 3 / 4,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: COLORS.bgDeep,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
