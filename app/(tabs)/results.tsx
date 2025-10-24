import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Download, Share2 } from 'lucide-react-native';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage, shareImage } from '@/utils/download';

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { generatedImages, isGenerating, generationCount } = useGeneration();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!selectedImage) return;
    const success = await downloadImage(selectedImage, { filename: `fashion-${Date.now()}.jpg` });
    if (success) showToast('Image downloaded!', 'success');
    else showToast('Failed to download', 'error');
  };

  const handleShare = async () => {
    if (!selectedImage) return;
    const success = await shareImage(selectedImage);
    if (success) showToast('Image shared!', 'success');
  };

  const remainingCount = Math.max(0, generationCount - generatedImages.length);
  const loadingPlaceholders = isGenerating && remainingCount > 0 ? Array(remainingCount).fill(null) : [];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0F1C', '#0D1929', '#1A2F4F']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }
        ]}
      >
        <Text style={styles.title}>Results</Text>

        {generatedImages.length === 0 && !isGenerating ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎨</Text>
            <Text style={styles.emptyText}>No results yet</Text>
            <Text style={styles.emptySubtext}>Generate your first photoshoot to see results here</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {generatedImages.map((img, i) => (
              <TouchableOpacity
                key={`img-${i}`}
                onPress={() => setSelectedImage(img)}
                style={styles.imageCard}
                activeOpacity={0.8}
              >
                <Image source={{ uri: img }} style={styles.image} />
              </TouchableOpacity>
            ))}

            {loadingPlaceholders.map((_, i) => (
              <View key={`loading-${i}`} style={styles.imageCard}>
                <View style={styles.loadingCard}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}
          />

          <View style={styles.modalContent}>
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
                    <Download size={24} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                    <Share2 size={24} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.actionButton}>
                    <X size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
    paddingHorizontal: 20,
    gap: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    maxWidth: 250,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  modalImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
