import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import GlowingButton from '@/components/GlowingButton';

const PLACEHOLDER_IMAGE =
  'https://storage.googleapis.com/static.a-b-c.io/app-assets/uploaded/pmlogo1.jpg-5a2dd41a-457d-454a-8654-878b3f37d728/original.jpeg';

function CountButton({
  count,
  selected,
  onPress,
}: {
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.countButtonWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.countButton}
      >
        <PremiumLiquidGlass
          style={styles.countGlass}
          variant={selected ? 'primary' : 'default'}
          borderRadius={18}
        >
          <View style={styles.countContent}>
            <Text style={[styles.countText, selected && styles.countTextActive]}>{count}</Text>
          </View>
        </PremiumLiquidGlass>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    selectedImage,
    setSelectedImage,
    generationCount,
    setGenerationCount,
    isGenerating,
    generateImages,
    error,
  } = useGeneration();

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    await generateImages();

    if (!error) {
      router.push('/(tabs)/results');
    } else {
      if (Platform.OS === 'web') {
        alert(error);
      } else {
        Alert.alert('Generation Error', error);
      }
    }
  };

  const displayImage = selectedImage || PLACEHOLDER_IMAGE;

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
          styles.content,
          { paddingTop: insets.top + 60, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Generate{"\n"}
          <Text style={styles.titleAccent}>Images</Text>
        </Text>

        <View style={styles.countSelector}>
          {[1, 2, 4, 6, 8].map((count) => (
            <CountButton
              key={count}
              count={count}
              selected={generationCount === count}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setGenerationCount(count);
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={pickImage}
          style={styles.imageContainer}
          activeOpacity={0.95}
        >
          <PremiumLiquidGlass style={styles.imageShell} variant="elevated" borderRadius={28}>
            <Image
              source={{ uri: displayImage }}
              style={styles.imagePreview}
              contentFit="cover"
              cachePolicy="none"
              testID="home-image-preview"
            />
            {isGenerating && (
              <View style={styles.loadingOverlay}>
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
              </View>
            )}
          </PremiumLiquidGlass>
        </TouchableOpacity>

        <GlowingButton
          onPress={selectedImage ? handleGenerate : pickImage}
          disabled={isGenerating}
          text={isGenerating ? 'Generating...' : selectedImage ? 'Generate' : 'Upload Image'}
          variant="primary"
          style={styles.uploadButton}
        />
      </ScrollView>
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
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1.5,
    lineHeight: 54,
    marginBottom: 28,
  },
  titleAccent: {
    color: Colors.dark.primaryLight,
  },
  countSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  countButtonWrapper: {
    flex: 1,
    height: 42,
  },
  countButton: {
    flex: 1,
  },
  countGlass: {
    flex: 1,
    height: 42,
  },
  countContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  countTextActive: {
    color: Colors.dark.text,
    fontWeight: '700' as const,
  },
  imageContainer: {
    marginBottom: 28,
  },
  imageShell: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'visible',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 7, 17, 0.4)',
    borderRadius: 28,
  },
  loadingPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  pulseGradient: {
    flex: 1,
  },
  uploadButton: {
    marginBottom: 20,
  },
});
