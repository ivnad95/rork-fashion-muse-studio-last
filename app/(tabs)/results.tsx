import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Download, Trash2, Share2, X, Image as ImageIcon } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';
import FavoriteButton from '@/components/FavoriteButton';
import NeumorphicPanel from '@/components/NeumorphicPanel';
import { NEU_COLORS, NEU_SPACING, NEU_RADIUS, neumorphicStyles } from '@/constants/neumorphicStyles';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import ShimmerLoader from '@/components/ShimmerLoader';
import * as haptics from '@/utils/haptics';
import { downloadImage, shareImage } from '@/utils/download';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function EmptyPlaceholder() {
  return (
    <View style={styles.emptyPlaceholder}>
      {/* Multi-layer glass effect background */}
      <LinearGradient
        colors={[
          'rgba(42, 63, 95, 0.35)',
          'rgba(30, 49, 73, 0.45)',
          'rgba(26, 47, 79, 0.4)'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Depth layer 1 - top gradient */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.04)',
          'rgba(255, 255, 255, 0.02)',
          'transparent'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '50%' }]}
      />

      {/* Depth layer 2 - bottom shadow */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(0, 0, 0, 0.03)',
          'rgba(0, 0, 0, 0.06)'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { top: '50%' }]}
      />

      {/* Logo container with refraction effect */}
      <View style={styles.logoContainer}>
        {/* Subtle glow behind logo */}
        <View style={styles.logoGlow}>
          <LinearGradient
            colors={[
              'rgba(200, 220, 255, 0.08)',
              'rgba(150, 180, 230, 0.05)',
              'transparent'
            ]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Logo image */}
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.emptyPlaceholderLogo}
          resizeMode="contain"
        />
      </View>

      {/* Top shine highlight */}
      <View style={styles.topShine} />
    </View>
  );
}

function LoadingPlaceholder() {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    rotate.start();
    glow.start();

    return () => {
      pulse.stop();
      rotate.stop();
      glow.stop();
    };
  }, [pulseAnim, rotateAnim, glowAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.95],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingPlaceholder}>
      <LinearGradient
        colors={['rgba(120, 180, 240, 0.18)', 'rgba(80, 140, 210, 0.12)', 'rgba(50, 100, 170, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.spinnerGlow, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={['rgba(200, 220, 255, 0.4)', 'rgba(100, 150, 220, 0.2)', 'rgba(200, 220, 255, 0.4)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.loadingSpinner, { opacity, transform: [{ rotate }] }]}>
        <View style={styles.spinnerRing} />
        <View style={[styles.spinnerRing, styles.spinnerRingInner]} />
      </Animated.View>
      <Animated.Text style={[styles.loadingText, { opacity }]}>
        <Text>Generating...</Text>
      </Animated.Text>
    </View>
  );
}

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { generatedImages, generatedImageIds, isGenerating, generationCount, deleteImage } = useGeneration();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Show loading placeholders ONLY for remaining images (not yet generated)
  const remainingCount = Math.max(0, generationCount - generatedImages.length);
  const loadingPlaceholders = isGenerating && remainingCount > 0 ? Array(remainingCount).fill(null) : [];

  // Show empty placeholders equal to generationCount when no generated images and not generating
  const emptyPlaceholders = !isGenerating && generatedImages.length === 0 ? Array(generationCount).fill(null) : [];

  // Display actual generated images
  const displayImages = generatedImages;

  useEffect(() => {
    if (selectedImage) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      fadeAnim.setValue(0);
    }
  }, [selectedImage, fadeAnim, scaleAnim]);

  const handleImagePress = (img: string, index: number) => {
    haptics.light();
    setSelectedImage(img);
    setSelectedImageIndex(index);
    // Use the real database ID from generatedImageIds
    setSelectedImageId(generatedImageIds[index] || null);
  };

  const handleCloseModal = () => {
    haptics.light();
    setSelectedImage(null);
    setSelectedImageIndex(-1);
    setSelectedImageId(null);
  };

  const handleDownload = async () => {
    if (!selectedImage) return;

    try {
      haptics.medium();
      const success = await downloadImage(selectedImage, {
        filename: `fashion-muse-${Date.now()}.jpg`,
      });

      if (success) {
        haptics.success();
        showToast('Image downloaded successfully!', 'success');
      } else {
        haptics.error();
        showToast('Failed to download image', 'error');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      haptics.error();
      showToast('Failed to download image', 'error');
    }
  };

  const handleShare = async () => {
    if (!selectedImage) return;

    try {
      haptics.medium();
      const success = await shareImage(selectedImage);

      if (success) {
        showToast('Image shared successfully!', 'success');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      showToast('Failed to share image', 'error');
    }
  };

  const handleDelete = async () => {
    if (selectedImageIndex < 0 || selectedImageIndex >= generatedImages.length) return;

    // Show confirmation toast with a delay before deletion
    showToast('Deleting image...', 'warning', 1500);

    setTimeout(() => {
      haptics.heavy();
      deleteImage(selectedImageIndex);
      handleCloseModal();
      haptics.success();
      showToast('Image deleted', 'success');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: NEU_SPACING.lg
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Results</Text>

        {/* Latest Generation Section */}
        {(isGenerating || generatedImages.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isGenerating ? 'GENERATING' : 'LATEST GENERATION'}
            </Text>
            <View style={styles.grid}>
              {/* Show loading placeholders when generating */}
              {loadingPlaceholders.map((_, i) => (
                <NeumorphicPanel key={`loading-${i}`} style={styles.imageCard} noPadding>
                  <LoadingPlaceholder />
                </NeumorphicPanel>
              ))}

              {/* Show generated images */}
              {displayImages.map((img, i) => (
                <NeumorphicPanel key={`image-${i}`} style={styles.imageCard} noPadding>
                  <TouchableOpacity
                    style={styles.imageWrapper}
                    activeOpacity={0.92}
                    onPress={() => handleImagePress(img, i)}
                    testID={`result-card-${i}`}
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    {/* Favorite Button Overlay */}
                    {user && generatedImageIds[i] && (
                      <View style={styles.favoriteOverlay}>
                        <FavoriteButton
                          imageId={generatedImageIds[i]}
                          size={20}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </NeumorphicPanel>
              ))}
            </View>
          </View>
        )}

        {/* Empty State with Logo Placeholders */}
        {!isGenerating && generatedImages.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NO RESULTS YET</Text>
            <View style={styles.grid}>
              {emptyPlaceholders.map((_, i) => (
                <NeumorphicPanel key={`empty-${i}`} style={styles.imageCard} noPadding>
                  <EmptyPlaceholder />
                </NeumorphicPanel>
              ))}
            </View>
            <Text style={[styles.emptyText, { marginTop: NEU_SPACING.xl }]}>
              Generate your first photoshoot to see results here
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal 
        visible={selectedImage !== null} 
        transparent 
        animationType="none" 
        onRequestClose={handleCloseModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: fadeAnim }
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
              }
            ]}
          >
            {selectedImage && (
              <>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.08)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.imageContainer}
                >
                  <View style={styles.imageContainerInner}>
                    <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                    {/* Favorite Button in Modal */}
                    {user && selectedImageId && (
                      <View style={styles.modalFavoriteButton}>
                        <FavoriteButton
                          imageId={selectedImageId}
                          size={24}
                        />
                      </View>
                    )}
                  </View>
                </LinearGradient>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={handleDownload}
                    style={styles.actionButton}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['rgba(74, 222, 128, 0.3)', 'rgba(34, 197, 94, 0.2)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.actionButtonGradient}
                    >
                      <View style={styles.actionButtonInner}>
                        <Download size={22} color="rgba(74, 222, 128, 0.95)" strokeWidth={2.8} />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleShare}
                    style={styles.actionButton}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['rgba(200, 220, 255, 0.3)', 'rgba(150, 180, 230, 0.2)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.actionButtonGradient}
                    >
                      <View style={styles.actionButtonInner}>
                        <Share2 size={22} color="rgba(200, 220, 255, 0.95)" strokeWidth={2.8} />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {generatedImages.includes(selectedImage) && (
                    <TouchableOpacity
                      onPress={handleDelete}
                      style={styles.actionButton}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['rgba(239, 68, 68, 0.3)', 'rgba(220, 38, 38, 0.2)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionButtonGradient}
                      >
                        <View style={styles.actionButtonInner}>
                          <Trash2 size={22} color="rgba(255, 100, 100, 0.95)" strokeWidth={2.8} />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>

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
    backgroundColor: NEU_COLORS.base,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: NEU_SPACING.xxxl,
  },
  title: {
    ...neumorphicStyles.neuTitle,
    fontSize: 36,
    marginBottom: NEU_SPACING.xl,
  },
  section: {
    marginBottom: NEU_SPACING.xxl,
  },
  sectionLabel: {
    ...neumorphicStyles.neuTextMuted,
    textTransform: 'uppercase',
    marginBottom: NEU_SPACING.md,
    paddingLeft: NEU_SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: NEU_SPACING.md,
  },
  imageCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    marginBottom: NEU_SPACING.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: NEU_RADIUS.xl,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  favoriteOverlay: {
    position: 'absolute',
    top: NEU_SPACING.xs,
    right: NEU_SPACING.xs,
    zIndex: 10,
  },
  modalFavoriteButton: {
    position: 'absolute',
    top: NEU_SPACING.md,
    right: NEU_SPACING.md,
    zIndex: 10,
  },
  loadingPlaceholder: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  spinnerGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loadingSpinner: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  spinnerRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: 'transparent',
    borderTopColor: 'rgba(200, 220, 255, 0.9)',
    borderRightColor: 'rgba(200, 220, 255, 0.8)',
  },
  spinnerRingInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: 'rgba(150, 190, 240, 0.8)',
    borderRightColor: 'rgba(150, 190, 240, 0.7)',
  },
  loadingText: {
    ...neumorphicStyles.neuTextPrimary,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  emptyText: {
    ...neumorphicStyles.neuTextSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: NEU_SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: NEU_COLORS.overlay,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    alignItems: 'center',
    gap: 26,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 24,                                   // Spec: 24px border radius for main panels
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
  imageContainerInner: {
    flex: 1,
    backgroundColor: 'rgba(12, 18, 28, 0.75)',
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.16)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'center',
  },
  actionButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 3,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftColor: 'rgba(255, 255, 255, 0.38)',
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: 'rgba(200, 220, 255, 0.5)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 32,
    elevation: 16,
  },
  actionButtonInner: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.32)',
    borderRightColor: 'rgba(255, 255, 255, 0.18)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
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
  emptyPlaceholder: {
    flex: 1,
    borderRadius: NEU_RADIUS.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    height: '60%',
    zIndex: 10,
  },
  logoGlow: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    borderRadius: 9999,
  },
  emptyPlaceholderLogo: {
    width: '100%',
    height: '100%',
    opacity: 0.25,
    zIndex: 1,
  },
  topShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: NEU_RADIUS.xl,
    borderTopRightRadius: NEU_RADIUS.xl,
  },
});