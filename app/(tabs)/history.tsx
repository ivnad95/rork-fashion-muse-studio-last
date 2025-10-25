import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  Share2,
  Trash2,
  X,
} from 'lucide-react-native';
import GlassPanel from '@/components/GlassPanel';
import GlassyTitle from '@/components/GlassyTitle';
import { useGeneration, type HistoryItem } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, GRADIENTS, SPACING, RADIUS, glassStyles } from '@/constants/glassStyles';
import { downloadImage, shareImage } from '@/utils/download';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PreviewState = {
  item: HistoryItem;
  index: number;
};

const parseHistoryDate = (dateStr: string, timeStr: string) => {
  const parsed = new Date(`${dateStr} ${timeStr}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatHistoryTimestamp = (item: HistoryItem) => {
  const parsed = parseHistoryDate(item.date, item.time);
  if (!parsed) {
    return `${item.date} · ${item.time}`;
  }

  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getItemImages = (item: HistoryItem) => {
  if (item.results.length > 0) {
    return item.results;
  }
  return item.thumbnail ? [item.thumbnail] : [];
};

export default function HistoryScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { history, loadHistory, deleteHistoryItem } = useGeneration();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      if (!user) {
        if (mounted) {
          setLoading(false);
          setError(null);
        }
        return;
      }

      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        await loadHistory(user.id);
      } catch (err) {
        console.error('Failed to load history:', err);
        if (mounted) {
          setError('Unable to load your history right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, [user, loadHistory]);

  const orderedHistory = useMemo(() => {
    const sorted = [...history];
    return sorted.sort((a, b) => {
      const dateA = parseHistoryDate(a.date, a.time)?.getTime() ?? 0;
      const dateB = parseHistoryDate(b.date, b.time)?.getTime() ?? 0;
      return dateB - dateA;
    });
  }, [history]);

  const historySummary = useMemo(() => {
    if (orderedHistory.length === 0) {
      return {
        shoots: 0,
        variations: 0,
        lastRun: 'No shoots yet',
      };
    }

    const variations = orderedHistory.reduce((sum, item) => sum + getItemImages(item).length, 0);

    return {
      shoots: orderedHistory.length,
      variations,
      lastRun: formatHistoryTimestamp(orderedHistory[0]),
    };
  }, [orderedHistory]);

  const handleDelete = async (historyId: string) => {
    if (!user) {
      showToast('Please sign in to manage your history', 'warning');
      return;
    }

    try {
      await deleteHistoryItem(historyId);
      if (preview?.item.id === historyId) {
        setPreview(null);
      }
      showToast('Removed from history', 'success');
    } catch (err) {
      console.error('Failed to delete history item:', err);
      showToast('Failed to delete item', 'error');
    }
  };

  const handleDownload = async (uri?: string) => {
    if (!uri) {
      return;
    }

    const success = await downloadImage(uri);
    showToast(
      success ? 'Image saved to your library' : 'Download failed, please try again',
      success ? 'success' : 'error'
    );
  };

  const handleShare = async (uri?: string) => {
    if (!uri) {
      return;
    }

    const success = await shareImage(uri);
    if (success) {
      showToast('Share sheet opened', 'success');
    } else {
      showToast('Unable to share image', 'error');
    }
  };

  const previewImage = preview ? getItemImages(preview.item)[preview.index] : undefined;
  const previewCount = preview ? getItemImages(preview.item).length : 0;

  const showNextPreview = () => {
    if (!preview) return;
    const images = getItemImages(preview.item);
    if (images.length <= 1) return;
    const nextIndex = (preview.index + 1) % images.length;
    setPreview({ item: preview.item, index: nextIndex });
  };

  const showPreviousPreview = () => {
    if (!preview) return;
    const images = getItemImages(preview.item);
    if (images.length <= 1) return;
    const nextIndex = (preview.index - 1 + images.length) % images.length;
    setPreview({ item: preview.item, index: nextIndex });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>History</GlassyTitle>

        {!user ? (
          <GlassPanel style={styles.messagePanel} radius={30}>
            <Text style={styles.messageTitle}>Sign in to sync your gallery</Text>
            <Text style={styles.messageBody}>
              Create an account to store every shoot, download high-res images, and keep all
              your edits synced across devices.
            </Text>
          </GlassPanel>
        ) : loading ? (
          <GlassPanel style={styles.loaderPanel} radius={30}>
            <ActivityIndicator size="large" color={COLORS.silverLight} />
            <Text style={styles.loaderText}>Fetching your shoots…</Text>
          </GlassPanel>
        ) : error ? (
          <GlassPanel style={styles.messagePanel} radius={30}>
            <Text style={styles.messageTitle}>Something went wrong</Text>
            <Text style={styles.messageBody}>{error}</Text>
          </GlassPanel>
        ) : orderedHistory.length === 0 ? (
          <GlassPanel style={styles.messagePanel} radius={30}>
            <Text style={styles.messageTitle}>No shoots yet</Text>
            <Text style={styles.messageBody}>
              Generate your first ManusAI shoot from the Generate tab to populate this gallery.
            </Text>
          </GlassPanel>
        ) : (
          <>
            <GlassPanel style={styles.summaryPanel} radius={30}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Shoots</Text>
                  <Text style={styles.summaryValue}>{historySummary.shoots}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Variations</Text>
                  <Text style={styles.summaryValue}>{historySummary.variations}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Last shoot</Text>
                  <Text style={styles.summaryValueSmall}>{historySummary.lastRun}</Text>
                </View>
              </View>
              <Text style={styles.summaryHint}>Tap any tile to open a full-screen preview.</Text>
            </GlassPanel>

            <View style={styles.historyList}>
              {orderedHistory.map((item) => {
                const images = getItemImages(item);
                if (images.length === 0) {
                  return null;
                }
                const primaryImage = images[0];

                return (
                  <GlassPanel key={item.id} style={styles.historyCard} radius={34}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>{formatHistoryTimestamp(item)}</Text>
                        <Text style={styles.cardMeta}>{item.count} generated variations</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        style={styles.deleteButton}
                        activeOpacity={0.85}
                      >
                        <Trash2 size={18} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.imageGrid}>
                      {images.map((uri, index) => (
                        <TouchableOpacity
                          key={`${item.id}-${index}`}
                          style={styles.imageTile}
                          onPress={() => setPreview({ item, index })}
                          activeOpacity={0.85}
                        >
                          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                          <View style={styles.imageOverlay}>
                            <LayoutGrid size={16} color={COLORS.silverLight} />
                            <Text style={styles.overlayText}>Preview</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={styles.footerMeta}>
                        <Calendar size={16} color={COLORS.silverMid} />
                        <Text style={styles.footerText}>{formatHistoryTimestamp(item)}</Text>
                      </View>

                      <View style={styles.footerActions}>
                        <TouchableOpacity
                          onPress={() => setPreview({ item, index: 0 })}
                          style={styles.actionPill}
                          activeOpacity={0.85}
                        >
                          <LayoutGrid size={16} color={COLORS.silverLight} />
                          <Text style={styles.actionText}>View set</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDownload(primaryImage)}
                          style={styles.actionPill}
                          activeOpacity={0.85}
                          disabled={!primaryImage}
                        >
                          <Download size={16} color={primaryImage ? COLORS.silverLight : COLORS.silverDark} />
                          <Text style={[styles.actionText, !primaryImage && styles.actionTextDisabled]}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleShare(primaryImage)}
                          style={styles.actionPill}
                          activeOpacity={0.85}
                          disabled={!primaryImage}
                        >
                          <Share2 size={16} color={primaryImage ? COLORS.silverLight : COLORS.silverDark} />
                          <Text style={[styles.actionText, !primaryImage && styles.actionTextDisabled]}>Share</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </GlassPanel>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={Boolean(preview)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreview(null)}
      >
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modalPanel} radius={36} noPadding>
            <View style={styles.modalImageContainer}>
              {previewImage ? (
                <Image source={{ uri: previewImage }} style={styles.modalImage} resizeMode="contain" />
              ) : null}

              {previewCount > 1 && (
                <>
                  <TouchableOpacity
                    onPress={showPreviousPreview}
                    style={[styles.carouselButton, styles.carouselLeft]}
                    activeOpacity={0.85}
                  >
                    <ChevronLeft size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showNextPreview}
                    style={[styles.carouselButton, styles.carouselRight]}
                    activeOpacity={0.85}
                  >
                    <ChevronRight size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {preview && (
              <View style={styles.modalFooter}>
                <View>
                  <Text style={styles.modalTitle}>{formatHistoryTimestamp(preview.item)}</Text>
                  <Text style={styles.modalSubtitle}>
                    {previewCount > 1
                      ? `Variation ${preview.index + 1} of ${previewCount}`
                      : 'Single variation'}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => handleDownload(previewImage)}
                    style={styles.modalIconButton}
                    activeOpacity={0.85}
                  >
                    <Download size={18} color={COLORS.silverLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleShare(previewImage)}
                    style={styles.modalIconButton}
                    activeOpacity={0.85}
                  >
                    <Share2 size={18} color={COLORS.silverLight} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setPreview(null)}
              style={styles.modalClose}
              activeOpacity={0.85}
            >
              <X size={16} color={COLORS.silverLight} />
            </TouchableOpacity>
          </GlassPanel>
        </View>
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
  messagePanel: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  messageTitle: {
    color: COLORS.silverLight,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageBody: {
    color: COLORS.silverMid,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loaderPanel: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  loaderText: {
    color: COLORS.silverMid,
    fontSize: 14,
  },
  summaryPanel: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  summaryLabel: {
    color: COLORS.silverMid,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    color: COLORS.silverLight,
    fontSize: 22,
    fontWeight: '700',
  },
  summaryValueSmall: {
    color: COLORS.silverLight,
    fontSize: 14,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 54,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  summaryHint: {
    color: COLORS.silverMid,
    fontSize: 12,
    textAlign: 'center',
  },
  historyList: {
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  historyCard: {
    gap: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: COLORS.silverLight,
    fontSize: 18,
    fontWeight: '700',
  },
  cardMeta: {
    color: COLORS.silverMid,
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    padding: SPACING.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.md,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  imageTile: {
    width: (SCREEN_WIDTH - 80) / 2, // Better calculation for consistent sizing
    aspectRatio: 3 / 4,
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.glassDark,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  overlayText: {
    color: COLORS.silverLight,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardFooter: {
    gap: SPACING.md,
  },
  footerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  footerText: {
    color: COLORS.silverMid,
    fontSize: 13,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionText: {
    color: COLORS.silverLight,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionTextDisabled: {
    color: COLORS.silverDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalPanel: {
    width: '100%',
    maxWidth: 520,
    overflow: 'hidden',
  },
  modalImageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.bgDeep,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalFooter: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  modalTitle: {
    color: COLORS.silverLight,
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: COLORS.silverMid,
    fontSize: 13,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modalIconButton: {
    padding: SPACING.md,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  modalClose: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.md,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  carouselButton: {
    position: 'absolute',
    top: '45%',
    padding: SPACING.md,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  carouselLeft: {
    left: SPACING.md,
  },
  carouselRight: {
    right: SPACING.md,
  },
});
