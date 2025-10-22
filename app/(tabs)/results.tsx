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
import GlassPanel from '@/components/GlassPanel';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import { glassStyles } from '@/constants/glassStyles';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function LoadingPlaceholder() {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    rotate.start();

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, [pulseAnim, rotateAnim]);

  const opacity = pulseAnim.interpolate({
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
        colors={['rgba(90, 143, 214, 0.15)', 'rgba(61, 107, 184, 0.08)', 'rgba(42, 77, 140, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
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

  // Create placeholders for the number of images being generated
  const placeholderCount = isGenerating ? generationCount : 0;
  const placeholders = Array(placeholderCount).fill(null);

  // Only show mock results if not generating and no generated images
  const mockResults = [
    'https://via.placeholder.com/300x400/002857/FFFFFF?text=Result+1',
    'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Result+2',
    'https://via.placeholder.com/300x400/002857/FFFFFF?text=Result+3',
    'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Result+4',
  ];

  const displayImages = generatedImages.length > 0 ? generatedImages : (!isGenerating ? mockResults : []);

  useEffect(() => {
    if (selectedImage) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
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
      <LinearGradient colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      <ScrollView style={styles.scrollView} contentContainerStyle={[glassStyles.screenContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <GlassyTitle><Text>Results</Text></GlassyTitle>

        <View style={styles.grid}>
          {/* Show loading placeholders when generating */}
          {isGenerating && placeholders.map((_, i) => (
            <GlassPanel key={`loading-${i}`} style={styles.gridItem} radius={20}>
              <LoadingPlaceholder />
            </GlassPanel>
          ))}
          
          {/* Show generated or display images */}
          {displayImages.map((img, i) => (
            <GlassPanel key={`image-${i}`} style={styles.gridItem} radius={20}>
              <TouchableOpacity 
                style={styles.imageWrapper} 
                activeOpacity={0.8} 
                onPress={() => handleImagePress(img, i)} 
                testID={`result-card-${i}`}
              >
                <Image source={{ uri: img }} style={styles.resultImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
                  style={styles.imageOverlay}
                />
              </TouchableOpacity>
            </GlassPanel>
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
              }
            ]}
          >
            {selectedImage && (
              <>
                <PremiumLiquidGlass style={styles.imageContainer} variant="elevated" borderRadius={24}>
                  <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                </PremiumLiquidGlass>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    onPress={handleDownload} 
                    style={styles.actionButton}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actionButtonContainer}>
                      <LinearGradient
                        colors={['rgba(34, 197, 94, 0.35)', 'rgba(22, 163, 74, 0.25)']}
                        style={styles.actionButtonGradient}
                      >
                        <View style={styles.actionButtonGlass}>
                          <Download size={24} color="#4ade80" strokeWidth={2.5} />
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleShare} 
                    style={styles.actionButton}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actionButtonContainer}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.12)']}
                        style={styles.actionButtonGradient}
                      >
                        <View style={styles.actionButtonGlass}>
                          <Share2 size={24} color="#e6eefc" strokeWidth={2.5} />
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  {generatedImages.includes(selectedImage) && (
                    <TouchableOpacity 
                      onPress={handleDelete} 
                      style={styles.actionButton}
                      activeOpacity={0.8}
                    >
                      <View style={styles.actionButtonContainer}>
                        <LinearGradient
                          colors={['rgba(239, 68, 68, 0.35)', 'rgba(220, 38, 38, 0.25)']}
                          style={styles.actionButtonGradient}
                        >
                          <View style={styles.actionButtonGlass}>
                            <Trash2 size={24} color="#ff5757" strokeWidth={2.5} />
                          </View>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  gridItem: { width: (SCREEN_WIDTH - 56) / 2, aspectRatio: 3 / 4 },
  imageWrapper: { 
    flex: 1, 
    borderRadius: 20, 
    overflow: 'hidden',
    position: 'relative',
  },
  resultImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  loadingPlaceholder: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundElevated,
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  spinnerRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: Colors.dark.primaryLight,
    borderRightColor: Colors.dark.primaryLight,
  },
  spinnerRingInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderTopColor: Colors.dark.accent,
    borderRightColor: Colors.dark.accent,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
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
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 20,
  },
  modalImage: { 
    width: '100%', 
    height: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  actionButton: {
    width: 64,
    height: 64,
  },
  actionButtonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 28,
    elevation: 14,
  },
  actionButtonGradient: {
    flex: 1,
    padding: 2.5,
  },
  actionButtonGlass: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.25)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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