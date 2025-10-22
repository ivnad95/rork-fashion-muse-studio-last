import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Animated, Modal, Dimensions, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Calendar, Trash2, X, Sparkles } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';

import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import { glassStyles } from '@/constants/glassStyles';
import Colors from '@/constants/colors';
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={[glassStyles.screenContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
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
          <View style={styles.messagePanel}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassCard}
            >
              <View style={styles.glassInner}>
                <Sparkles size={32} color="rgba(200, 220, 255, 0.8)" />
                <Text style={styles.messageText}>
                  <Text>{!user ? 'Sign in to view your generation history' : 'No generations yet. Start creating!'}</Text>
                </Text>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.historyList}>
            {displayHistory.map((generation, index) => (
              <TouchableOpacity
                key={generation.id}
                onPress={() => handleGenerationPress(generation)}
                activeOpacity={0.92}
              >
                <Animated.View style={[styles.generationCard, { opacity: 1, transform: [{ scale: 1 }] }]}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <View style={styles.dateContainer}>
                          <LinearGradient
                            colors={['rgba(200, 220, 255, 0.25)', 'rgba(200, 220, 255, 0.12)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.dateBadge}
                          >
                            <Calendar size={14} color="rgba(200, 220, 255, 0.9)" />
                            <Text style={styles.dateText}><Text>{generation.createdAt}</Text></Text>
                          </LinearGradient>
                        </View>
                      </View>
                      <View style={styles.imageGrid}>
                        {generation.imageUrls.slice(0, 4).map((url, imgIndex) => (
                          <View key={imgIndex} style={styles.imageGridItem}>
                            <View style={styles.imageFrame}>
                              <Image source={{ uri: url }} style={styles.historyImage} resizeMode="cover" />
                              <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
                                style={styles.imageOverlay}
                              />
                            </View>
                          </View>
                        ))}
                      </View>
                      <View style={styles.generationInfo}>
                        <Text style={styles.promptText} numberOfLines={2}><Text>{generation.prompt}</Text></Text>
                      </View>
                    </View>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: Colors.dark.backgroundDeep },
  scrollView: { flex: 1 },
  messagePanel: {
    marginTop: 32,
    marginBottom: 24,
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
  historyList: { gap: 24 },
  generationCard: {
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 32,
    padding: 3,
    shadowColor: 'rgba(200, 220, 255, 0.5)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftColor: 'rgba(255, 255, 255, 0.38)',
    borderRightColor: 'rgba(255, 255, 255, 0.22)',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardContent: {
    backgroundColor: 'rgba(15, 20, 30, 0.65)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderTopColor: 'rgba(200, 220, 255, 0.35)',
    borderLeftColor: 'rgba(200, 220, 255, 0.28)',
    borderRightColor: 'rgba(200, 220, 255, 0.15)',
    borderBottomColor: 'rgba(200, 220, 255, 0.1)',
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imageGridItem: {
    width: (SCREEN_WIDTH - 110) / 2,
    aspectRatio: 3 / 4,
  },
  imageFrame: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 3,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.28)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  historyImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  generationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  promptText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
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
