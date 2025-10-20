import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { glassStyles, COLORS } from '@/constants/glassStyles';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history } = useGeneration();
  const [items, setItems] = useState(history);

  useEffect(() => {
    setItems(history);
  }, [history]);

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
    imageUrls: [h.thumbnail],
    prompt: 'Generated set',
    style: null,
    aspectRatio: 'portrait',
    createdAt: `${h.date} ${h.time}`,
  })) : mockHistory;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#030711', '#060d1f', '#0d1736', '#121f4a']} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      <ScrollView style={styles.scrollView} contentContainerStyle={[glassStyles.screenContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <GlassyTitle><Text>History</Text></GlassyTitle>
        {displayHistory.length === 0 ? (
          <GlassPanel style={styles.messagePanel} radius={20}>
            <Text style={styles.messageText}>No generations found.</Text>
          </GlassPanel>
        ) : (
          <View style={styles.historyList}>
            {displayHistory.map((generation) => (
              <GlassPanel key={generation.id} style={styles.generationCard} radius={24}>
                <View style={styles.imageGrid}>
                  {generation.imageUrls.map((url, index) => (
                    <View key={index} style={styles.imageGridItem}>
                      <Image source={{ uri: url }} style={styles.historyImage} resizeMode="cover" />
                    </View>
                  ))}
                </View>
                <View style={styles.generationInfo}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.dateText}>{generation.createdAt}</Text>
                    <Text style={styles.promptText}>{generation.prompt}</Text>
                  </View>
                </View>
              </GlassPanel>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundDeep },
  scrollView: { flex: 1 },
  messagePanel: { padding: 24 },
  messageText: { color: '#9CA3AF', textAlign: 'center', fontSize: 14 },
  historyList: { gap: 24 },
  generationCard: { padding: 16 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  imageGridItem: { width: '47%', aspectRatio: 3 / 4, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  historyImage: { width: '100%', height: '100%' },
  generationInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLeft: { flex: 1 },
  dateText: { color: '#fff', fontSize: 14, marginBottom: 4 },
  promptText: { color: '#9CA3AF', fontSize: 12 },
});