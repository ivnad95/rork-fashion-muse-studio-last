import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useGeneration, HistoryItem } from '@/contexts/GenerationContext';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';

const PLACEHOLDER_IMAGE =
  'https://storage.googleapis.com/static.a-b-c.io/app-assets/uploaded/pmlogo1.jpg-5a2dd41a-457d-454a-8654-878b3f37d728/original.jpeg';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history } = useGeneration();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (history.length > 0 && !selectedItem) {
      setSelectedItem(history[0]);
    }
  }, [history, selectedItem]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const displayImage = selectedItem?.thumbnail || PLACEHOLDER_IMAGE;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030711', '#060d1f', '#0d1736', '#121f4a']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 60, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={['rgba(90, 143, 214, 0.12)', 'rgba(61, 107, 184, 0.06)']}
                style={styles.emptyIconGradient}
              >
                <Clock size={52} color={Colors.dark.textMuted} strokeWidth={1.5} />
              </LinearGradient>
            </View>
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptySubtitle}>Your generated images will appear here</Text>
          </View>
        ) : (
          <>
            <Text style={styles.mainTitle}>History</Text>

            <View style={styles.featuredContainer}>
              <PremiumLiquidGlass
                style={styles.featuredImageWrapper}
                variant="elevated"
                borderRadius={28}
              >
                <Image
                  source={{ uri: displayImage }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />
              </PremiumLiquidGlass>

              {selectedItem && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsDate}>{formatDate(selectedItem.date)}</Text>
                  <Text style={styles.detailsTime}>{selectedItem.time}</Text>
                  <Text style={styles.detailsCount}>
                    {selectedItem.count} {selectedItem.count === 1 ? 'image' : 'images'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.historyList}>
              <Text style={styles.listTitle}>Recent Generations</Text>
              {history.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedItem(item);
                  }}
                  style={styles.historyCardContainer}
                >
                  <PremiumLiquidGlass
                    style={[
                      styles.historyCard,
                      selectedItem?.id === item.id && styles.historyCardSelected,
                    ]}
                    variant={selectedItem?.id === item.id ? 'primary' : 'default'}
                    borderRadius={18}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.thumbnail}>
                        <Image
                          source={{ uri: item.thumbnail }}
                          style={styles.thumbnailImage}
                          contentFit="cover"
                        />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                        <Text style={styles.cardTime}>{item.time}</Text>
                        <Text style={styles.cardCount}>
                          {item.count} {item.count === 1 ? 'image' : 'images'}
                        </Text>
                      </View>
                    </View>
                  </PremiumLiquidGlass>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundDeep,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1.2,
    marginBottom: 28,
  },
  featuredContainer: {
    marginBottom: 32,
  },
  featuredImageWrapper: {
    width: '100%',
    aspectRatio: 4 / 5,
    marginBottom: 18,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  detailsContainer: {
    paddingHorizontal: 8,
    gap: 4,
  },
  detailsDate: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  detailsTime: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  detailsCount: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    marginBottom: 24,
  },
  emptyIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  historyList: {
    gap: 14,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  historyCardContainer: {
    marginBottom: 4,
  },
  historyCard: {
    minHeight: 96,
  },
  historyCardSelected: {
    shadowColor: Colors.dark.primaryGlow,
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  thumbnail: {
    width: 74,
    height: 92,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardDate: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  cardTime: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  cardCount: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.dark.textMuted,
  },
});
