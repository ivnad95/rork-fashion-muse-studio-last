import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import { glassStyles, COLORS } from '@/constants/glassStyles';
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
      <Animated.Text style={[styles.loadingText, { opacity }]}>Generating...</Animated.Text>
    </View>
  );
}

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { generatedImages, isGenerating, generationCount } = useGeneration();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#030711', '#060d1f', '#0d1736', '#121f4a']} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  gridItem: { width: (SCREEN_WIDTH - 56) / 2, aspectRatio: 3 / 4 },
  imageWrapper: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  resultImage: { width: '100%', height: '100%' },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', height: '80%' },
  modalImage: { width: '100%', height: '100%' },
});