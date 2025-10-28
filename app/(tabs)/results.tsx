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
import { Download, Eye, CheckCircle2, Sparkles, Plus } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import ProgressBar from '@/components/ProgressBar';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage } from '@/utils/download';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '@/constants/glassStyles';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = SPACING.lg;
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
        <View style={styles.header}>
          <GlassyTitle><Text>Results</Text></GlassyTitle>
        </View>

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
          <GlassPanel style={styles.emptyPanel} radius={RADIUS.xxl}>
            <View style={styles.emptyIconWrapper}>
              <Sparkles size={56} color={COLORS.accent} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Ready to Create</Text>
            <Text style={styles.emptySubtitle}>
              Upload your photo and let our AI transform it into stunning professional fashion shots.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/generate')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[
                  'rgba(56, 189, 248, 0.25)',
                  'rgba(56, 189, 248, 0.12)',
                ]}
                style={StyleSheet.absoluteFill}
              />
              <Plus size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
              <Text style={styles.emptyButtonText}>Start Creating</Text>
            </TouchableOpacity>
          </GlassPanel>
        )}

        {generatedImages.length > 0 && (
          <View style={styles.grid}>
            {generatedImages.map((img, index) => (
              <GlassPanel key={`img-${index}`} style={styles.gridItem} radius={RADIUS.xl} noPadding>
                <TouchableOpacity activeOpacity={0.95} style={styles.imageWrapper} onPress={() => setPreviewImage(img)} testID={`grid-item-${index}`} accessibilityLabel="Open preview">
                  <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.85)']}
                    style={styles.overlay}
                  >
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        setPreviewImage(img);
                      }}
                      activeOpacity={0.8}
                    >
                      <Eye size={18} color={COLORS.silverLight} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.overlayButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDownload(img);
                      }}
                      activeOpacity={0.8}
                    >
                      <Download size={18} color={COLORS.silverLight} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              </GlassPanel>
            ))}

            {loadingPlaceholders.map((_, index) => (
              <View key={`loading-${index}`} style={[styles.gridItem, styles.loadingGridItem]}>
                <LinearGradient
                  colors={['rgba(56, 189, 248, 0.12)', 'rgba(56, 189, 248, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.loadingContent}>
                  <Sparkles size={32} color={COLORS.accent} strokeWidth={2} />
                  <Text style={styles.loadingText}>Creating...</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {!isGenerating && generatedImages.length > 0 && (
          <GlassPanel style={styles.successPanel} radius={RADIUS.xl}>
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <CheckCircle2 size={22} color={COLORS.success} strokeWidth={2.5} />
              </View>
              <View style={styles.successTextContainer}>
                <Text style={styles.successText}>Generation Complete</Text>
                <Text style={styles.successSubtext}>
                  {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''} ready to download
                </Text>
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
                testID="preview-image"
                accessibilityLabel="Preview image"
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
    gap: SPACING.xl,
  },
  header: {
    marginBottom: -SPACING.sm,
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
  loadingGridItem: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.20)',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    color: COLORS.silverLight,
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  emptyPanel: {
    alignItems: 'center',
    gap: SPACING.xl,
    paddingVertical: SPACING.xxxl * 2,
    paddingHorizontal: SPACING.lg,
  },
  emptyIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  emptySubtitle: {
    color: COLORS.silverMid,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.30)',
    marginTop: SPACING.md,
    overflow: 'hidden',
  },
  emptyButtonText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  successPanel: {
    marginTop: SPACING.lg,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.30)',
  },
  successTextContainer: {
    flex: 1,
  },
  successText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  successSubtext: {
    color: COLORS.silverMid,
    fontSize: 14,
    marginTop: 4,
    letterSpacing: -0.1,
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
