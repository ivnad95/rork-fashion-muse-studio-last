import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Animated, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { Download, Trash2, Share2, X } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import ShimmerLoader from '@/components/ShimmerLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function EmptyPlaceholder() {
  return (
    <View style={styles.emptyPlaceholder}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.emptyPlaceholderLogo}
        resizeMode="contain"
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
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
  const { generatedImages, isGenerating, generationCount, deleteImage } = useGeneration();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Show loading placeholders when generating
  const loadingPlaceholders = isGenerating ? Array(generationCount).fill(null) : [];

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
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedImage(img);
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedImage(null);
    setSelectedImageIndex(-1);
  };

  const handleDownload = async () => {
    if (!selectedImage) return;

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = selectedImage;
        link.download = `photoshoot-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        alert('Image downloaded successfully!');
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant permission to save images to your gallery.');
          return;
        }

        const fileUri = FileSystem.documentDirectory + `photoshoot-${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, selectedImage.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Photoshoot', asset, false);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Image saved to gallery!');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      if (Platform.OS === 'web') {
        alert('Failed to download image');
      } else {
        Alert.alert('Error', 'Failed to download image');
      }
    }
  };

  const handleShare = async () => {
    if (!selectedImage) return;

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      if (Platform.OS === 'web') {
        if (navigator.share) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          const file = new File([blob], `photoshoot-${Date.now()}.png`, { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'Photoshoot Result',
          });
        } else {
          alert('Sharing is not supported in this browser');
        }
      } else {
        const fileUri = FileSystem.documentDirectory + `photoshoot-${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, selectedImage.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedImageIndex < 0 || selectedImageIndex >= generatedImages.length) return;

    const confirmDelete = () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      deleteImage(selectedImageIndex);
      handleCloseModal();
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this image?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Image',
        'Are you sure you want to delete this image?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Multi-layer background with depth */}
      <LinearGradient colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />

      {/* Subtle ambient glow */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(10, 118, 175, 0.05)',
          'rgba(10, 118, 175, 0.08)',
          'transparent',
        ]}
        locations={[0, 0.3, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40, paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <GlassyTitle><Text>Results</Text></GlassyTitle>

        <View style={styles.grid}>
          {/* Show loading placeholders when generating */}
          {loadingPlaceholders.map((_, i) => (
            <View key={`loading-${i}`} style={styles.gridItem}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gridItemGradient}
              >
                <View style={styles.gridItemInner}>
                  <ShimmerLoader width="100%" height="100%" borderRadius={16} />
                </View>
              </LinearGradient>
            </View>
          ))}

          {/* Show empty placeholders with logo when no images and not generating */}
          {emptyPlaceholders.map((_, i) => (
            <View key={`empty-${i}`} style={styles.gridItem}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gridItemGradient}
              >
                <View style={styles.gridItemInner}>
                  <EmptyPlaceholder />
                </View>
              </LinearGradient>
            </View>
          ))}

          {/* Show generated images */}
          {displayImages.map((img, i) => (
            <View key={`image-${i}`} style={styles.gridItem}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.06)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gridItemGradient}
              >
                <View style={styles.gridItemInner}>
                  <TouchableOpacity
                    style={styles.imageWrapper}
                    activeOpacity={0.92}
                    onPress={() => handleImagePress(img, i)}
                    testID={`result-card-${i}`}
                  >
                    <View style={styles.imageFrame}>
                      <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                      <LinearGradient
                        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                        style={styles.imageOverlay}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
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
  container: { flex: 1, backgroundColor: Colors.dark.backgroundDeep },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,  // 2 columns: subtract padding (24*2) and gap (16), then divide by 2
    aspectRatio: 3 / 4,
    minWidth: 150,
  },
  gridItemGradient: {
    flex: 1,
    borderRadius: 24,                                   // Spec: 24px border radius
    padding: 3,
    shadowColor: 'rgba(200, 220, 255, 0.45)',          // Spec: colored shadows for depth
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 36,
    elevation: 18,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',        // Spec: gradient borders
    borderLeftColor: 'rgba(255, 255, 255, 0.35)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  gridItemInner: {
    flex: 1,
    backgroundColor: 'rgba(15, 20, 30, 0.6)',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  imageFrame: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  resultImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
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
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
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
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(10, 19, 59, 0.4)',
  },
  emptyPlaceholderLogo: {
    width: '50%',
    height: '50%',
    opacity: 0.3,
    zIndex: 10,
  },
});