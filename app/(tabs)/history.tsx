import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  Share2,
  Trash2,
  X,
} from 'lucide-react-native';
import GlassPanel from '@/components/GlassPanel';
import GlassyTitle from '@/components/GlassyTitle';
import { useGeneration, type HistoryItem } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, GRADIENTS, SPACING, glassStyles } from '@/constants/glassStyles';
import { downloadImage, shareImage } from '@/utils/download';

type HistoryGroup = {
  date: string;
  items: HistoryItem[];
};

type PreviewState = {
  item: HistoryItem;
  index: number;
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

  const groupedHistory = useMemo<HistoryGroup[]>(() => {
    const groups = new Map<string, HistoryItem[]>();

    history.forEach((item) => {
      const existing = groups.get(item.date) ?? [];
      existing.push(item);
      groups.set(item.date, existing);
    });

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      items,
    }));
  }, [history]);

  const getImages = (item: HistoryItem) => {
    if (item.results.length > 0) {
      return item.results;
    }
    return item.thumbnail ? [item.thumbnail] : [];
  };

  const formatGroupLabel = (isoDate: string) => {
    const parsed = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return isoDate;
    }
    return parsed.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimestamp = (item: HistoryItem) => {
    const parsed = new Date(`${item.date} ${item.time}`);
    if (Number.isNaN(parsed.getTime())) {
      return `${item.date} · ${item.time}`;
    }
    return parsed.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

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

  const previewImage = preview ? getImages(preview.item)[preview.index] : undefined;
  const previewCount = preview ? getImages(preview.item).length : 0;

  const showNextPreview = () => {
    if (!preview) return;
    const images = getImages(preview.item);
    if (images.length <= 1) return;
    const nextIndex = (preview.index + 1) % images.length;
    setPreview({ item: preview.item, index: nextIndex });
  };

  const showPreviousPreview = () => {
    if (!preview) return;
    const images = getImages(preview.item);
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
          <GlassPanel style={styles.messagePanel} radius={28}>
            <Text style={styles.messageTitle}>No session active</Text>
            <Text style={styles.messageBody}>
              Sign in to sync your fashion shoots across devices.
            </Text>
          </GlassPanel>
        ) : loading ? (
          <GlassPanel style={styles.loaderPanel} radius={28}>
            <ActivityIndicator size="large" color={COLORS.silverLight} />
            <Text style={styles.loaderText}>Fetching your shoots…</Text>
          </GlassPanel>
        ) : error ? (
          <GlassPanel style={styles.messagePanel} radius={28}>
            <Text style={styles.messageTitle}>Something went wrong</Text>
            <Text style={styles.messageBody}>{error}</Text>
          </GlassPanel>
        ) : history.length === 0 ? (
          <GlassPanel style={styles.messagePanel} radius={28}>
            <Text style={styles.messageTitle}>No shoots yet</Text>
            <Text style={styles.messageBody}>
              Generate a photoshoot to start building your gallery.
            </Text>
          </GlassPanel>
        ) : (
          <View style={styles.groups}>
            {groupedHistory.map((group) => (
              <View key={group.date} style={styles.groupContainer}>
                <Text style={styles.groupLabel}>{formatGroupLabel(group.date)}</Text>

                {group.items.map((item) => {
                  const images = getImages(item);
                  if (images.length === 0) {
                    return null;
                  }
                  const primaryImage = images[0];

                  return (
                    <GlassPanel key={item.id} style={styles.historyCard} radius={28}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.cardDate}>{formatTimestamp(item)}</Text>
                          <Text style={styles.cardCount}>{item.count} variations</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => handleDelete(item.id)}
                          style={styles.iconButtonDanger}
                          activeOpacity={0.85}
                        >
                          <Trash2 size={18} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.imageGrid}>
                        {images.map((uri, index) => (
                          <TouchableOpacity
                            key={`${item.id}-${index}`}
                            style={styles.imageWrapper}
                            onPress={() => setPreview({ item, index })}
                            activeOpacity={0.9}
                          >
                            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                          </TouchableOpacity>
                        ))}
                      </View>

                      <View style={styles.cardFooter}>
                        <View style={styles.footerMeta}>
                          <Calendar size={16} color={COLORS.silverMid} />
                          <Text style={styles.footerText}>{formatTimestamp(item)}</Text>
                        </View>

                        <View style={styles.footerActions}>
                          <TouchableOpacity
                            onPress={() => handleDownload(primaryImage)}
                            style={styles.iconButton}
                            activeOpacity={0.85}
                            disabled={!primaryImage}
                          >
                            <Download
                              size={18}
                              color={primaryImage ? COLORS.silverLight : COLORS.silverDark}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleShare(primaryImage)}
                            style={styles.iconButton}
                            activeOpacity={0.85}
                            disabled={!primaryImage}
                          >
                            <Share2
                              size={18}
                              color={primaryImage ? COLORS.silverLight : COLORS.silverDark}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </GlassPanel>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={Boolean(preview)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreview(null)}
      >
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modalPanel} radius={32} noPadding>
            <View style={styles.modalImageContainer}>
              {previewImage ? (
                <Image source={{ uri: previewImage }} style={styles.modalImage} resizeMode="contain" />
              ) : null}
            </View>

            {preview && (
              <View style={styles.modalFooter}>
                <View>
                  <Text style={styles.modalTitle}>{formatTimestamp(preview.item)}</Text>
                  <Text style={styles.modalSubtitle}>
                    {previewCount > 1
                      ? `Image ${preview.index + 1} of ${previewCount}`
                      : 'Single variation'}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => handleDownload(previewImage)}
                    style={styles.modalIconButton}
                    activeOpacity={0.85}
                  >
                    <Download size={20} color={COLORS.silverLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleShare(previewImage)}
                    style={styles.modalIconButton}
                    activeOpacity={0.85}
                  >
                    <Share2 size={20} color={COLORS.silverLight} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setPreview(null)}
              style={styles.modalClose}
              activeOpacity={0.85}
            >
              <X size={20} color={COLORS.silverLight} />
            </TouchableOpacity>

            {previewCount > 1 && (
              <>
                <TouchableOpacity
                  onPress={showPreviousPreview}
                  style={[styles.carouselButton, styles.carouselLeft]}
                  activeOpacity={0.85}
                >
                  <ChevronLeft size={24} color={COLORS.silverLight} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showNextPreview}
                  style={[styles.carouselButton, styles.carouselRight]}
                  activeOpacity={0.85}
                >
                  <ChevronRight size={24} color={COLORS.silverLight} />
                </TouchableOpacity>
              </>
            )}
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
  groups: {
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  groupContainer: {
    gap: SPACING.md,
  },
  groupLabel: {
    color: COLORS.silverMid,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  historyCard: {
    gap: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    color: COLORS.silverLight,
    fontSize: 16,
    fontWeight: '600',
  },
  cardCount: {
    color: COLORS.silverMid,
    fontSize: 12,
    marginTop: 4,
  },
  iconButtonDanger: {
    padding: SPACING.xs,
    borderRadius: SPACING.sm,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  imageWrapper: {
    flexBasis: '47%',
    aspectRatio: 3 / 4,
    borderRadius: SPACING.md,
    overflow: 'hidden',
    backgroundColor: COLORS.glassDark,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
    borderRadius: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
    alignItems: 'center',
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
    fontWeight: '600',
  },
  modalSubtitle: {
    color: COLORS.silverMid,
    fontSize: 12,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modalIconButton: {
    padding: SPACING.sm,
    borderRadius: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  modalClose: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.sm,
    borderRadius: SPACING.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  carouselButton: {
    position: 'absolute',
    top: '45%',
    padding: SPACING.md,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  carouselLeft: {
    left: SPACING.md,
  },
  carouselRight: {
    right: SPACING.md,
  },
});
