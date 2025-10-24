import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Animated, Modal, Dimensions, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Calendar, Trash2, X, Sparkles } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollNavbar } from '@/hooks/useScrollNavbar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { history, loadHistory, deleteHistoryItem } = useGeneration();
  const { handleScroll } = useScrollNavbar();
  const [items, setItems] = useState(history);
  const [selectedGeneration, setSelectedGeneration] = useState<typeof mockHistory[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          setError(null);
          await loadHistory(user.id);
        } catch (err) {
          console.error('Failed to load history:', err);
          setError('Failed to load history');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user, loadHistory]);

  useEffect(() => {
    setItems(history);
  }, [history]);

  useEffect(() => {
    if (selectedGeneration) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [selectedGeneration, fadeAnim, scaleAnim]);

  const mockHistory: {
    id: string;
    imageUrls: string[];
    prompt: string;
    style: string;
    aspectRatio: 'portrait' | 'square' | 'landscape';
    createdAt: string;
  }[] = [];

  const displayHistory = items.length > 0 ? items.map(h => ({
    id: h.id,
    imageUrls: h.results.length > 0 ? h.results : [h.thumbnail],
    prompt: `${h.count} images generated`,
    style: '',
    aspectRatio: 'portrait' as const,
    createdAt: `${h.date} ${h.time}`,
  })) : (!user ? mockHistory : []);

  const handleGenerationPress = (generation: typeof displayHistory[0]) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGeneration(generation);
  };

  const handleCloseModal = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGeneration(null);
  };

  const handleDeleteGeneration = async () => {
    if (!selectedGeneration || !user) return;

    const confirmDelete = async () => {
      try {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        await deleteHistoryItem(selectedGeneration.id);
        handleCloseModal();
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (err) {
        console.error('Failed to delete history item:', err);
        if (Platform.OS === 'web') {
          alert('Failed to delete history item');
        } else {
          Alert.alert('Error', 'Failed to delete history item');
        }
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this generation?')) {
        await confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Generation',
        'Are you sure you want to delete this generation?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  // Group history by date
  const groupedHistory = displayHistory.reduce((acc, item) => {
    const date = item.createdAt.split(' ')[0]; // Extract date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof displayHistory>);

  const dateGroups = Object.keys(groupedHistory).map(date => ({
    date,
    items: groupedHistory[date]
  }));

  return (
    <View style={styles.container}>
      {/* Premium dark gradient background */}
      <LinearGradient
        colors={[COLORS.bgDeepest, COLORS.bgDeep, COLORS.bgMid, COLORS.bgBase]}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { opacity: 0.03, backgroundColor: 'transparent' }]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: SPACING.lg  // 20px floating margins
          }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <GlassyTitle><Text>History</Text></GlassyTitle>
        {isLoading ? (
          <View style={styles.messagePanel}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassCard}
            >
              <View style={styles.glassInner}>
                <Sparkles size={32} color="rgba(200, 220, 255, 0.8)" />
                <Text style={styles.messageText}><Text>Loading history...</Text></Text>
              </View>
            </LinearGradient>
          </View>
        ) : error ? (
          <View style={styles.messagePanel}>
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassCard}
            >
              <View style={styles.glassInner}>
                <Text style={styles.errorText}><Text>{error}</Text></Text>
              </View>
            </LinearGradient>
          </View>
        ) : displayHistory.length === 0 ? (
          <GlassPanel style={styles.emptyState}>
            <Sparkles size={32} color={COLORS.silverMid} />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>
              {!user ? 'Sign in to view your generation history' : 'Your past generations will appear here'}
            </Text>
          </GlassPanel>
        ) : (
          <View style={styles.historyList}>
            {dateGroups.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.dateGroup}>
                {/* Date Header */}
                <Text style={styles.dateLabel}>{group.date}</Text>

                {/* History Items for this date */}
                {group.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleGenerationPress(item)}
                    activeOpacity={0.92}
                  >
                    <GlassPanel style={styles.historyCard}>
                      {/* Header Row */}
                      <View style={styles.cardHeader}>
                        <Text style={styles.timeText}>{item.createdAt.split(' ').slice(1).join(' ')}</Text>
                        {user && (
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              setSelectedGeneration(item);
                              setTimeout(() => handleDeleteGeneration(), 100);
                            }}
                            style={styles.deleteButtonSmall}
                          >
                            <Text style={styles.deleteText}>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Image Grid (horizontal scroll) */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.imageRow}
                      >
                        {item.imageUrls.map((url, imgIndex) => (
                          <View key={imgIndex} style={styles.historyImage}>
                            <Image
                              source={{ uri: url }}
                              style={styles.thumbnailImage}
                              resizeMode="cover"
                            />
                          </View>
                        ))}
                      </ScrollView>

                      {/* Footer */}
                      <View style={styles.cardFooter}>
                        <Text style={styles.countText}>{item.prompt}</Text>
                      </View>
                    </GlassPanel>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedGeneration !== null}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: fadeAnim },
          ]}
        >
          {Platform.OS === 'web' ? (
            <View style={styles.modalBlur} />
          ) : (
            <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="dark" />
          )}

          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleCloseModal}
          />

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            {selectedGeneration && (
              <>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.08)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalCard}
                >
                  <View style={styles.modalCardInner}>
                    <View style={styles.modalHeader}>
                      <LinearGradient
                        colors={['rgba(200, 220, 255, 0.28)', 'rgba(200, 220, 255, 0.15)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalDateContainer}
                      >
                        <Calendar size={16} color="rgba(255, 255, 255, 0.95)" />
                        <Text style={styles.modalDateText}><Text>{selectedGeneration.createdAt}</Text></Text>
                      </LinearGradient>
                      {user && (
                        <TouchableOpacity
                          onPress={handleDeleteGeneration}
                          style={styles.deleteButton}
                          activeOpacity={0.85}
                        >
                          <LinearGradient
                            colors={['rgba(239, 68, 68, 0.25)', 'rgba(239, 68, 68, 0.15)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.deleteButtonGradient}
                          >
                            <Trash2 size={18} color="rgba(255, 100, 100, 0.95)" />
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>

                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      style={styles.imageScroll}
                      contentContainerStyle={{
                        alignItems: 'center',
                        paddingHorizontal: 0,
                      }}
                    >
                      {selectedGeneration.imageUrls.map((url, index) => (
                        <View key={index} style={styles.modalImageContainer}>
                          <View style={styles.modalImageFrame}>
                            <Image
                              source={{ uri: url }}
                              style={styles.modalImage}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                      <Text style={styles.modalPromptText}><Text>{selectedGeneration.prompt}</Text></Text>
                    </View>
                  </View>
                </LinearGradient>

                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.12)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.closeButtonGradient}
                  >
                    <View style={styles.closeButtonInner}>
                      <X size={22} color="#ffffff" strokeWidth={2.8} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </Animated.View>
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
  scrollContent: {
    paddingBottom: SPACING.xxxl,            // Extra padding at bottom
  },
  emptyState: {
    marginTop: SPACING.xxxl,                // 48px
    paddingVertical: SPACING.xxxl * 1.25,   // 60px
    paddingHorizontal: SPACING.xxl,         // 32px
    alignItems: 'center',
    gap: SPACING.xs,                        // 8px
  },
  emptyText: {
    ...TEXT_STYLES.h4Primary,
    color: COLORS.silverLight,
  },
  emptySubtext: {
    ...TEXT_STYLES.bodyRegularSecondary,
    color: COLORS.silverMid,
    textAlign: 'center',
  },
  historyList: {
    gap: SPACING.xxl,                       // 32px between date groups
  },
  dateGroup: {
    marginBottom: SPACING.xxl,              // 32px
  },
  dateLabel: {
    ...TEXT_STYLES.overlineSecondary,
    textTransform: 'uppercase',
    color: COLORS.silverDark,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  historyCard: {
    marginBottom: SPACING.md,               // 16px between cards
    padding: SPACING.md,                    // 16px internal padding
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,               // 12px
  },
  timeText: {
    ...TEXT_STYLES.labelSecondary,
    color: COLORS.silverMid,
  },
  deleteButtonSmall: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,          // 12px
    borderRadius: SPACING.sm,               // 12px
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.30)',
  },
  deleteText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    fontWeight: '600',
  },
  imageRow: {
    gap: SPACING.sm,                        // 12px between images
    paddingBottom: SPACING.xxs,             // 4px
  },
  historyImage: {
    width: 100,
    height: 133,                            // 3:4 aspect ratio
    borderRadius: SPACING.md,               // 16px
    overflow: 'hidden',
    backgroundColor: COLORS.glassBase,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cardFooter: {
    marginTop: SPACING.sm,                  // 12px
    paddingTop: SPACING.sm,                 // 12px
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  countText: {
    ...TEXT_STYLES.captionMuted,
    color: COLORS.silverDark,
  },
  messagePanel: {
    marginTop: SPACING.xxl,                 // 32px
    marginBottom: SPACING.xxl,              // 32px
  },
  glassCard: {
    borderRadius: 32,
    padding: 3,
    shadowColor: 'rgba(200, 220, 255, 0.45)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 36,
    elevation: 18,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.35)',
    borderRightColor: 'rgba(255, 255, 255, 0.18)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  glassInner: {
    backgroundColor: 'rgba(20, 25, 35, 0.5)',
    borderRadius: 30,
    padding: 48,
    alignItems: 'center',
    gap: 18,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  messageText: {
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  errorText: {
    color: 'rgba(255, 100, 100, 0.95)',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 8, 12, 0.95)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    alignItems: 'center',
    gap: 28,
  },
  modalCard: {
    width: '100%',
    borderRadius: 36,
    padding: 3.5,
    overflow: 'hidden',
    shadowColor: 'rgba(200, 220, 255, 0.6)',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.8,
    shadowRadius: 48,
    elevation: 25,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftColor: 'rgba(255, 255, 255, 0.42)',
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomColor: 'rgba(255, 255, 255, 0.18)',
  },
  modalCardInner: {
    backgroundColor: 'rgba(12, 18, 28, 0.75)',
    borderRadius: 33,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.16)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  modalDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.28)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalDateText: {
    color: 'rgba(255, 255, 255, 0.98)',
    fontSize: 15,
    fontWeight: '800' as const,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  deleteButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  deleteButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(239, 68, 68, 0.45)',
    borderLeftColor: 'rgba(239, 68, 68, 0.38)',
    borderRightColor: 'rgba(239, 68, 68, 0.25)',
    borderBottomColor: 'rgba(239, 68, 68, 0.18)',
    shadowColor: 'rgba(239, 68, 68, 0.6)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 10,
  },
  imageScroll: {
    width: '100%',
    maxHeight: 600,
  },
  modalImageContainer: {
    width: SCREEN_WIDTH > 540 ? 540 : SCREEN_WIDTH - 48,
    aspectRatio: 3 / 4,
    padding: 24,
  },
  modalImageFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 3,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.32)',
    borderRightColor: 'rgba(255, 255, 255, 0.18)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: 'rgba(0, 0, 0, 0.7)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 15,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalFooter: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  modalPromptText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 16,
    fontWeight: '700' as const,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  closeButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 3,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.55)',
    borderLeftColor: 'rgba(255, 255, 255, 0.45)',
    borderRightColor: 'rgba(255, 255, 255, 0.28)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(200, 220, 255, 0.7)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.8,
    shadowRadius: 36,
    elevation: 20,
  },
  closeButtonInner: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftColor: 'rgba(255, 255, 255, 0.35)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
});
