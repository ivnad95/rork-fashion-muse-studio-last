import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, Download, Share2, Trash2, X } from 'lucide-react-native';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage, shareImage } from '@/utils/download';
import FavoriteButton from '@/components/FavoriteButton';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { COLORS, glassStyles } from '@/constants/glassStyles';

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { generatedImages, generatedImageIds, isGenerating, generationCount, deleteImage } = useGeneration();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage = selectedIndex !== null ? generatedImages[selectedIndex] : null;
  const progress = useMemo(() => {
    if (!generationCount) return 0;
    return Math.min(100, Math.round((generatedImages.length / generationCount) * 100));
  }, [generatedImages.length, generationCount]);

  const handleDownload = async (imageUri?: string) => {
    const target = imageUri ?? selectedImage;
    if (!target) return;
    const success = await downloadImage(target, { filename: `fashion-${Date.now()}.jpg` });
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={[COLORS.lightColor1, COLORS.lightColor2, COLORS.lightColor1]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[glassStyles.screenContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Results</GlassyTitle>

        {isGenerating && (
          <GlassPanel style={styles.progressPanel} radius={20}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% complete</Text>
          </GlassPanel>
        )}

        {generatedImages.length === 0 && !isGenerating ? (
          <GlassPanel style={styles.emptyPanel} radius={20}>
            <Text style={styles.emptyIcon}>🎨</Text>
            <Text style={styles.emptyText}>No results yet</Text>
            <Text style={styles.emptySubtext}>Generate your first photoshoot to see results here</Text>
          </GlassPanel>
        ) : (
          <View style={styles.grid}>
            {generatedImages.map((img, i) => (
              <GlassPanel key={`img-${i}`} style={styles.gridItem} radius={20}>
                <TouchableOpacity style={styles.imageWrapper} activeOpacity={0.85} onPress={() => setSelectedIndex(i)}>
                  <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                  <View style={styles.overlay}>
                    <TouchableOpacity style={styles.overlayButton} onPress={() => setSelectedIndex(i)}>
                      <Eye size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.overlayButton} onPress={() => handleDownload(img)}>
                      <Download size={28} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {generatedImageIds[i] && (
                    <View style={styles.favoriteBadge}>
                      <FavoriteButton imageId={generatedImageIds[i]} size={18} />
                    </View>
                  )}
                </TouchableOpacity>
              </GlassPanel>
            ))}

            {loadingPlaceholders.map((_, i) => (
              <GlassPanel key={`loading-${i}`} style={styles.gridItem} radius={20}>
                <View style={styles.loadingCard}>
                  <Text style={styles.loadingText}>Generating...</Text>
                </View>
              </GlassPanel>
            ))}
          </View>
        )}

        {!isGenerating && generatedImages.length > 0 && (
          <GlassPanel style={styles.successPanel} radius={20}>
            <Text style={styles.successText}>Your fashion photos are ready!</Text>
          </GlassPanel>
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
                  <TouchableOpacity onPress={() => handleDownload()} style={styles.actionButton}>
                    <Download size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                    <Share2 size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Trash2 size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setSelectedIndex(null)} style={styles.actionButton}>
                    <X size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
  progressPanel: {
    padding: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.lightColor3,
  },
  progressText: {
    color: COLORS.silverMid,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '47%',
    aspectRatio: 3 / 4,
    padding: 0,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    opacity: 1,
  },
  overlayButton: {
    padding: 8,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  loadingCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.silverMid,
  },
  emptyPanel: {
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: COLORS.silverLight,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: COLORS.silverMid,
    textAlign: 'center',
  },
  successPanel: {
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    gap: 16,
  },
  modalImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
