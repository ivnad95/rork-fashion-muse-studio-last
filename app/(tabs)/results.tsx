import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { glassStyles, COLORS } from '@/constants/glassStyles';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { generatedImages, isGenerating } = useGeneration();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [progress] = useState<number>(isGenerating ? 40 : 100);

  const mockResults = [
    'https://via.placeholder.com/300x400/002857/FFFFFF?text=Result+1',
    'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Result+2',
    'https://via.placeholder.com/300x400/002857/FFFFFF?text=Result+3',
    'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Result+4',
  ];

  const displayImages = generatedImages.length > 0 ? generatedImages : mockResults;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#030711', '#060d1f', '#0d1736', '#121f4a']} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      <ScrollView style={styles.scrollView} contentContainerStyle={[glassStyles.screenContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <GlassyTitle><Text>Results</Text></GlassyTitle>

        {isGenerating && (
          <GlassPanel style={styles.progressPanel} radius={20}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </GlassPanel>
        )}

        <View style={styles.grid}>
          {displayImages.map((img, i) => (
            <GlassPanel key={i} style={styles.gridItem} radius={20}>
              <TouchableOpacity style={styles.imageWrapper} activeOpacity={0.8} onPress={() => setSelectedImage(img)} testID={`result-card-${i}`}>
                <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
              </TouchableOpacity>
            </GlassPanel>
          ))}
        </View>
      </ScrollView>

      <Modal visible={selectedImage !== null} transparent animationType="fade" onRequestClose={() => setSelectedImage(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedImage(null)}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundDeep },
  scrollView: { flex: 1 },
  progressPanel: { padding: 16, marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: COLORS.lightColor3 },
  progressText: { color: COLORS.silverMid, fontSize: 14, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  gridItem: { width: (SCREEN_WIDTH - 56) / 2, aspectRatio: 3 / 4 },
  imageWrapper: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  resultImage: { width: '100%', height: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', height: '80%' },
  modalImage: { width: '100%', height: '100%' },
});