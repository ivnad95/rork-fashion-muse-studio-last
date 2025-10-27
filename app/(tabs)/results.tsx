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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, Eye, CheckCircle2, Sparkles } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import ProgressBar from '@/components/ProgressBar';
import GlowingButton from '@/components/GlowingButton';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage } from '@/utils/download';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '@/constants/glassStyles';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = SPACING.md;
const TILE_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - GRID_GAP) / 2;

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

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
        <GlassyTitle><Text>Results</Text></GlassyTitle>

        {(isGenerating || generatedImages.length > 0) && (
          <GlassPanel style={styles.statusPanel} radius={RADIUS.xl}>
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
            </View>

            <ProgressBar
              progress={progress}
              current={generatedImages.length}
              total={generationCount}
              label={statusLabel}
            />
          </GlassPanel>
        )}

        {!isGenerating && generatedImages.length === 0 && (
          <GlassPanel style={styles.emptyPanel} radius={RADIUS.xl}>
            <Sparkles size={48} color={COLORS.accent} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload a photo on the Generate tab to create your first fashion shoot.
            </Text>
            <GlowingButton 
              onPress={() => router.push('/(tabs)/generate')} 
              text="Go to Generate"
              variant="primary"
            />
          </GlassPanel>
        )}

        {generatedImages.length > 0 && (
          <View style={styles.grid}>
            {generatedImages.map((img, index) => (
              <GlassPanel key={`img-${index}`} style={styles.gridItem} radius={RADIUS.lg} noPadding>
                <TouchableOpacity activeOpacity={0.9} style={styles.imageWrapper} onPress={() => setPreviewImage(img)}>
                  <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.75)']}
                    style={styles.overlay}
                  >
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={() => setPreviewImage(img)}
                      activeOpacity={0.85}
                    >
                      <Eye size={20} color={COLORS.silverLight} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={() => handleDownload(img)}
                      activeOpacity={0.85}
                    >
                      <Download size={20} color={COLORS.silverLight} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              </GlassPanel>
            ))}

            {loadingPlaceholders.map((_, index) => (
              <GlassPanel key={`loading-${index}`} style={styles.gridItem} radius={RADIUS.lg}>
                <View style={styles.loadingCard}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
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
          <GlassPanel style={styles.successPanel} radius={RADIUS.lg}>
            <View style={styles.successContent}>
              <CheckCircle2 size={24} color={COLORS.success} strokeWidth={2.5} />
              <View style={styles.successTextContainer}>
                <Text style={styles.successText}>Shoot complete</Text>
                <Text style={styles.successSubtext}>Download or share your favorites</Text>
              </View>
            </View>
          </GlassPanel>
        )}
      </ScrollView>

      <Modal
        visible={previewImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setPreviewImage(null)}
          />
          <GlassPanel style={styles.modalPanel} radius={RADIUS.xxl} noPadding>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </GlassPanel>
        </View>
      </Modal>
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
  statusPanel: {
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
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
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
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  successPanel: {
    marginTop: SPACING.md,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  successTextContainer: {
    flex: 1,
  },
  successText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  successSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalPanel: {
    width: '90%',
    maxWidth: 520,
    aspectRatio: 3 / 4,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
