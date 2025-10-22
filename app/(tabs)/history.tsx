import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Animated, Modal, Dimensions, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Calendar, Trash2, X } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';

import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import { glassStyles } from '@/constants/glassStyles';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { history, loadHistory, deleteHistoryItem } = useGeneration();
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
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [selectedGeneration, fadeAnim, scaleAnim]);

  const mockHistory = [
    {
      id: '1',
      imageUrls: [
        'https://via.placeholder.com/300x400/002857/FFFFFF?text=Gen+1-1',
        'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Gen+1-2',
        'https://via.placeholder.com/300x400/002857/FFFFFF?text=Gen+1-3',
        'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Gen+1-4',
      ],
      prompt: 'Fashion photoshoot in urban setting',
      style: 'Urban',
      aspectRatio: 'portrait',
      createdAt: new Date().toISOString(),
    },
  ];

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
      <ScrollView style={styles.scrollView} contentContainerStyle={[glassStyles.screenContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <GlassyTitle><Text>History</Text></GlassyTitle>
        {isLoading ? (
          <PremiumLiquidGlass style={styles.messagePanel} variant="elevated" borderRadius={24}>
            <View style={styles.messageContent}>
              <Text style={styles.messageText}><Text>Loading history...</Text></Text>
            </View>
          </PremiumLiquidGlass>
        ) : error ? (
          <PremiumLiquidGlass style={styles.messagePanel} variant="elevated" borderRadius={24}>
            <View style={styles.messageContent}>
              <Text style={styles.errorText}><Text>{error}</Text></Text>
            </View>
          </PremiumLiquidGlass>
        ) : displayHistory.length === 0 ? (
          <PremiumLiquidGlass style={styles.messagePanel} variant="elevated" borderRadius={24}>
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>
                <Text>{!user ? 'Sign in to view your generation history' : 'No generations yet. Start creating!'}</Text>
              </Text>
            </View>
          </PremiumLiquidGlass>
        ) : (
          <View style={styles.historyList}>
            {displayHistory.map((generation) => (
              <TouchableOpacity
                key={generation.id}
                onPress={() => handleGenerationPress(generation)}
                activeOpacity={0.9}
              >
                <PremiumLiquidGlass style={styles.generationCard} variant="elevated" borderRadius={24}>
                  <View style={styles.cardHeader}>
                    <View style={styles.dateContainer}>
                      <Calendar size={16} color={Colors.dark.textSecondary} />
                      <Text style={styles.dateText}><Text>{generation.createdAt}</Text></Text>
                    </View>
                  </View>
                  <View style={styles.imageGrid}>
                    {generation.imageUrls.slice(0, 4).map((url, index) => (
                      <View key={index} style={styles.imageGridItem}>
                        <Image source={{ uri: url }} style={styles.historyImage} resizeMode="cover" />
                        <LinearGradient
                          colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                          style={styles.imageOverlay}
                        />
                      </View>
                    ))}
                  </View>
                  <View style={styles.generationInfo}>
                    <Text style={styles.promptText}><Text>{generation.prompt}</Text></Text>
                  </View>
                </PremiumLiquidGlass>
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
            <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
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
                <PremiumLiquidGlass style={styles.modalCard} variant="elevated" borderRadius={24}>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalDateContainer}>
                      <Calendar size={18} color={Colors.dark.textSecondary} />
                      <Text style={styles.modalDateText}><Text>{selectedGeneration.createdAt}</Text></Text>
                    </View>
                    {user && (
                      <TouchableOpacity
                        onPress={handleDeleteGeneration}
                        style={styles.deleteButton}
                        activeOpacity={0.8}
                      >
                        <Trash2 size={18} color={Colors.dark.error} />
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
                        <Image
                          source={{ uri: url }}
                          style={styles.modalImage}
                          resizeMode="contain"
                        />
                      </View>
                    ))}
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <Text style={styles.modalPromptText}><Text>{selectedGeneration.prompt}</Text></Text>
                  </View>
                </PremiumLiquidGlass>

                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.closeButtonContainer}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.08)']}
                      style={styles.closeButtonGradient}
                    >
                      <View style={styles.closeButtonGlass}>
                        <X size={24} color="#ffffff" strokeWidth={2.5} />
                      </View>
                    </LinearGradient>
                  </View>
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
  messagePanel: { padding: 32, marginTop: 20 },
  messageContent: { alignItems: 'center' },
  messageText: { 
    color: Colors.dark.textSecondary, 
    textAlign: 'center', 
    fontSize: 16,
    fontWeight: '500' as const,
  },
  errorText: {
    color: Colors.dark.error,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  historyList: { gap: 16 },
  generationCard: { padding: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: { 
    color: Colors.dark.textSecondary, 
    fontSize: 14,
    fontWeight: '500' as const,
  },
  imageGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 12,
  },
  imageGridItem: { 
    width: (SCREEN_WIDTH - 80) / 2, 
    aspectRatio: 3 / 4, 
    borderRadius: 12, 
    overflow: 'hidden',
  },
  historyImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  generationInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  promptText: { 
    color: Colors.dark.text, 
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    gap: 20,
  },
  modalCard: {
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  modalDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalDateText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  imageScroll: {
    width: '100%',
  },
  modalImageContainer: {
    width: SCREEN_WIDTH > 500 ? 500 : SCREEN_WIDTH - 40,
    aspectRatio: 3 / 4,
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  modalFooter: {
    padding: 16,
    paddingTop: 12,
  },
  modalPromptText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  closeButton: {
    width: 52,
    height: 52,
    marginTop: 16,
  },
  closeButtonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 22,
    elevation: 12,
  },
  closeButtonGradient: {
    flex: 1,
    padding: 2,
  },
  closeButtonGlass: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.25)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
});