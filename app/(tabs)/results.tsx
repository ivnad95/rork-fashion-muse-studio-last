import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { X, Download, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';

const PLACEHOLDER_IMAGE =
  'https://storage.googleapis.com/static.a-b-c.io/app-assets/uploaded/pmlogo1.jpg-5a2dd41a-457d-454a-8654-878b3f37d728/original.jpeg';

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { generatedImages, isGenerating } = useGeneration();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());
  const [savingImage, setSavingImage] = useState(false);

  const fadeAnims = useRef<Animated.Value[]>([]).current;
  const scaleAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (generatedImages.length > fadeAnims.length) {
      const newFadeAnims = generatedImages.map((_, i) => fadeAnims[i] || new Animated.Value(0));
      const newScaleAnims = generatedImages.map(
        (_, i) => scaleAnims[i] || new Animated.Value(0.8)
      );
      fadeAnims.splice(0, fadeAnims.length, ...newFadeAnims);
      scaleAnims.splice(0, scaleAnims.length, ...newScaleAnims);
    }
  }, [generatedImages.length, fadeAnims, scaleAnims]);

  useEffect(() => {
    if (generatedImages.length > 0) {
      const animations = generatedImages.map((_, index) => {
        return Animated.parallel([
          Animated.timing(fadeAnims[index] || new Animated.Value(0), {
            toValue: 1,
            duration: 600,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnims[index] || new Animated.Value(0.8), {
            toValue: 1,
            delay: index * 100,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
        ]);
      });
      Animated.stagger(50, animations).start();
    }
  }, [generatedImages.length, fadeAnims, scaleAnims]);

  const handleImagePress = (uri: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedImage(uri);
  };

  const handleSave = async (uri: string) => {
    if (savedImages.has(uri)) {
      setSavedImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(uri);
        return newSet;
      });
      return;
    }

    if (uri === PLACEHOLDER_IMAGE || uri.includes('pmlogo1.jpg')) {
      alert('Cannot save placeholder images. Please generate images first.');
      return;
    }

    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = uri;
      link.download = `fashion-ai-${Date.now()}.png`;
      link.click();
      setSavedImages((prev) => new Set(prev).add(uri));
      return;
    }

    try {
      setSavingImage(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `fashion-ai-${Date.now()}.png`;

      if (uri.startsWith('data:')) {
        const base64Data = uri.split(',')[1];
        if (!base64Data) {
          throw new Error('Invalid base64 data');
        }
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else if (uri.startsWith('file://')) {
        await FileSystem.copyAsync({ from: uri, to: fileUri });
      } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
        const downloadResult = await FileSystem.downloadAsync(uri, fileUri);
        if (downloadResult.status !== 200) {
          throw new Error(`Failed to download image (status: ${downloadResult.status})`);
        }
      } else {
        throw new Error('Invalid image URI format. Only base64, file://, and https:// URIs are supported.');
      }

      await MediaLibrary.createAssetAsync(fileUri);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setSavedImages((prev) => new Set(prev).add(uri));
    } catch (error) {
      console.error('Error saving image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save image';
      alert(errorMessage);
    } finally {
      setSavingImage(false);
    }
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Share image');
  };

  const displayImages =
    generatedImages.length > 0 ? generatedImages : Array(6).fill(PLACEHOLDER_IMAGE);

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
        <View style={styles.header}>
          <Text style={styles.title}>Result</Text>
        </View>

        {isGenerating && generatedImages.length === 0 && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingPulse}>
              <LinearGradient
                colors={[
                  'rgba(90, 143, 214, 0.8)',
                  'rgba(61, 107, 184, 0.5)',
                  'rgba(90, 143, 214, 0.8)',
                ]}
                style={styles.pulseGradient}
              />
            </View>
            <Text style={styles.loadingText}>Creating your fashion model poses...</Text>
          </View>
        )}

        <View style={styles.grid}>
          {displayImages.map((uri, index) => (
            <Animated.View
              key={index}
              style={[
                styles.gridItem,
                {
                  opacity: fadeAnims[index] || 1,
                  transform: [{ scale: scaleAnims[index] || 1 }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleImagePress(uri)}
                activeOpacity={0.9}
                style={{ flex: 1 }}
              >
                <PremiumLiquidGlass style={styles.imageShell} variant="elevated" borderRadius={20}>
                  <Image
                    source={{ uri }}
                    style={styles.gridImage}
                    contentFit="cover"
                    cachePolicy="none"
                    testID={`results-image-${index}`}
                  />
                  <View style={styles.imageOverlay}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleSave(uri);
                      }}
                      style={styles.saveButton}
                      testID={`save-btn-${index}`}
                    >
                      {Platform.OS === 'web' ? (
                        <View style={styles.saveBlur}>
                          <Download
                            size={16}
                            color={savedImages.has(uri) ? Colors.dark.success : Colors.dark.text}
                            fill={savedImages.has(uri) ? Colors.dark.success : 'transparent'}
                          />
                        </View>
                      ) : (
                        <BlurView intensity={20} style={styles.saveBlur}>
                          <Download
                            size={16}
                            color={savedImages.has(uri) ? Colors.dark.success : Colors.dark.text}
                            fill={savedImages.has(uri) ? Colors.dark.success : 'transparent'}
                          />
                        </BlurView>
                      )}
                    </TouchableOpacity>
                  </View>
                </PremiumLiquidGlass>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}
          >
            {Platform.OS === 'web' ? (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
            ) : (
              <BlurView intensity={70} style={StyleSheet.absoluteFill} />
            )}
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.modalButton}>
                {Platform.OS === 'web' ? (
                  <View style={styles.modalButtonBlur}>
                    <X size={24} color={Colors.dark.text} />
                  </View>
                ) : (
                  <BlurView intensity={25} style={styles.modalButtonBlur}>
                    <X size={24} color={Colors.dark.text} />
                  </BlurView>
                )}
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => selectedImage && handleSave(selectedImage)}
                  disabled={savingImage}
                  style={styles.modalButton}
                >
                  {Platform.OS === 'web' ? (
                    <View style={styles.modalButtonBlur}>
                      {savingImage ? (
                        <ActivityIndicator size="small" color={Colors.dark.text} />
                      ) : (
                        <Download
                          size={24}
                          color={
                            selectedImage && savedImages.has(selectedImage)
                              ? Colors.dark.success
                              : Colors.dark.text
                          }
                          fill={
                            selectedImage && savedImages.has(selectedImage)
                              ? Colors.dark.success
                              : 'transparent'
                          }
                        />
                      )}
                    </View>
                  ) : (
                    <BlurView intensity={25} style={styles.modalButtonBlur}>
                      {savingImage ? (
                        <ActivityIndicator size="small" color={Colors.dark.text} />
                      ) : (
                        <Download
                          size={24}
                          color={
                            selectedImage && savedImages.has(selectedImage)
                              ? Colors.dark.success
                              : Colors.dark.text
                          }
                          fill={
                            selectedImage && savedImages.has(selectedImage)
                              ? Colors.dark.success
                              : 'transparent'
                          }
                        />
                      )}
                    </BlurView>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShare} style={styles.modalButton}>
                  {Platform.OS === 'web' ? (
                    <View style={styles.modalButtonBlur}>
                      <Share2 size={24} color={Colors.dark.text} />
                    </View>
                  ) : (
                    <BlurView intensity={25} style={styles.modalButtonBlur}>
                      <Share2 size={24} color={Colors.dark.text} />
                    </BlurView>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {selectedImage && (
              <View style={styles.modalImageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.modalImage}
                  contentFit="contain"
                  cachePolicy="none"
                  testID="results-modal-image"
                />
              </View>
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
    backgroundColor: Colors.dark.backgroundDeep,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1.2,
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 20,
  },
  gridItem: {
    width: '47.5%',
  },
  imageShell: {
    aspectRatio: 3 / 4,
    overflow: 'visible',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  saveButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  saveBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.glass,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 20,
  },
  loadingPulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  pulseGradient: {
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    letterSpacing: 0.1,
    fontWeight: '500' as const,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  modalButtonBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.glass,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalImage: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
  },
});
