import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, Download, X } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { downloadImage } from '@/utils/download';
import { COLORS, glassStyles } from '@/constants/glassStyles';

export default function ResultsScreen() {
  const { showToast } = useToast();
  const { generatedImages, isGenerating, generationCount } = useGeneration();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (!generationCount) {
      return 0;
    }
    return Math.min(100, Math.round((generatedImages.length / generationCount) * 100));
  }, [generatedImages.length, generationCount]);

  const handleDownload = async (imageUri: string) => {
    const success = await downloadImage(imageUri, { filename: `fashion-${Date.now()}.jpg` });
    showToast(success ? 'Image downloaded!' : 'Failed to download', success ? 'success' : 'error');
  };

  const remainingCount = Math.max(0, generationCount - generatedImages.length);
  const loadingPlaceholders = isGenerating && remainingCount > 0 ? Array(remainingCount).fill(null) : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={[COLORS.lightColor1, COLORS.lightColor2, COLORS.lightColor1]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
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
            {generatedImages.map((img, index) => (
              <GlassPanel key={`img-${index}`} style={styles.gridItem} radius={20}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                  <View style={styles.overlay}>
                    <TouchableOpacity style={styles.overlayButton} onPress={() => setPreviewImage(img)}>
                      <Eye size={26} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.overlayButton} onPress={() => handleDownload(img)}>
                      <Download size={26} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassPanel>
            ))}

            {loadingPlaceholders.map((_, index) => (
              <GlassPanel key={`loading-${index}`} style={styles.gridItem} radius={20}>
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
        visible={previewImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setPreviewImage(null)} />
          <View style={styles.modalContent}>
            {previewImage && (
              <>
                <Image source={{ uri: previewImage }} style={styles.modalImage} resizeMode="contain" />
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => handleDownload(previewImage)} style={styles.actionButton}>
                    <Download size={22} color={COLORS.silverLight} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPreviewImage(null)} style={styles.actionButton}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  overlayButton: {
    padding: 8,
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
