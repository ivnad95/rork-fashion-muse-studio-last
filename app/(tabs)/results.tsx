import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Download, Share2, Trash2 } from 'lucide-react-native';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage, shareImage } from '@/utils/download';
import FavoriteButton from '@/components/FavoriteButton';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/constants/glassStyles';

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { generatedImages, generatedImageIds, isGenerating, generationCount, deleteImage } = useGeneration();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage = selectedIndex !== null ? generatedImages[selectedIndex] : null;

  const handleDownload = async () => {
    if (!selectedImage) return;
    const success = await downloadImage(selectedImage, { filename: `fashion-${Date.now()}.jpg` });
    showToast(success ? 'Image downloaded!' : 'Failed to download', success ? 'success' : 'error');
  };

  const handleShare = async () => {
    if (!selectedImage) return;
    const success = await shareImage(selectedImage);
    if (success) {
      showToast('Image shared!', 'success');
    }
  };

  const handleDelete = () => {
    if (selectedIndex === null) return;
    deleteImage(selectedIndex);
    setSelectedIndex(null);
    showToast('Image deleted', 'success');
  };

  const remainingCount = Math.max(0, generationCount - generatedImages.length);
  const loadingPlaceholders = isGenerating && remainingCount > 0 ? Array(remainingCount).fill(null) : [];

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.background as unknown as string[]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + SPACING.lg, paddingBottom: insets.bottom + SPACING.xxxl },
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
                onPress={() => setSelectedIndex(i)}
                style={styles.imageCard}
                activeOpacity={0.85}
              >
                <Image source={{ uri: img }} style={styles.image} />
                {generatedImageIds[i] && (
                  <View style={styles.favoriteOverlay}>
                    <FavoriteButton imageId={generatedImageIds[i]} size={18} />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {loadingPlaceholders.map((_, i) => (
              <View key={`loading-${i}`} style={styles.imageCard}>
                <View style={styles.loadingCard}>
                  <ActivityIndicator size="large" color={COLORS.accent} />
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
        onRequestClose={() => setSelectedIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setSelectedIndex(null)} />

          <View style={styles.modalContent}>
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
                    <Download size={22} color={COLORS.textPrimary} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                    <Share2 size={22} color={COLORS.textPrimary} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Trash2 size={22} color={COLORS.textPrimary} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setSelectedIndex(null)} style={styles.actionButton}>
                    <X size={22} color={COLORS.textPrimary} />
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
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  imageCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.glassMinimalLight,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderMinimalLeft,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteOverlay: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
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
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 250,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    gap: SPACING.lg,
  },
  modalImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: RADIUS.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glassMinimalMedium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderMinimalLeft,
  },
});

