import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import GlassyTitle from '@/components/GlassyTitle';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import GlowingButton from '@/components/GlowingButton';
import { useScrollNavbar } from '@/hooks/useScrollNavbar';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { selectedImage, setSelectedImage, generationCount, setGenerationCount, isGenerating, generateImages } = useGeneration();
  const { handleScroll } = useScrollNavbar();
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageSelect = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      const msg = 'Failed to upload image. Please try again.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Upload Error', msg);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      const msg = 'Please upload an image first.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('No Image', msg);
      return;
    }

    if (!user) {
      const msg = 'Please sign in to generate images.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Authentication Required', msg);
      return;
    }

    // Check if user has enough credits
    if (user.credits < generationCount) {
      if (user.isGuest) {
        // Guest user out of credits - prompt to sign in
        const msg = `You need ${generationCount} credits but only have ${user.credits}. Sign in to get more credits and save your progress!`;
        if (Platform.OS === 'web') {
          if (confirm(msg + '\n\nGo to Sign In now?')) {
            router.push('/auth/login');
          }
        } else {
          Alert.alert(
            'Credits Required',
            msg,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign In', onPress: () => router.push('/auth/login') },
            ]
          );
        }
      } else {
        // Authenticated user out of credits - go to plans
        const msg = `You need ${generationCount} credits but only have ${user.credits}. Purchase more credits to continue.`;
        if (Platform.OS === 'web') {
          if (confirm(msg + '\n\nGo to Plans now?')) {
            router.push('/plans');
          }
        } else {
          Alert.alert(
            'Insufficient Credits',
            msg,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Buy Credits', onPress: () => router.push('/plans') },
            ]
          );
        }
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    // Redirect to results immediately so user can see loading placeholders
    router.push('/(tabs)/results');
    // Start generation in background
    generateImages(user.id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40, paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <GlassyTitle><Text>Generate</Text></GlassyTitle>

        {/* Count Selector with enhanced spacing */}
        <View style={styles.selectorSection}>
          <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
        </View>

        {/* Image Uploader with prominent spacing */}
        <View style={styles.uploaderSection}>
          <ImageUploader uploadedImage={selectedImage} uploading={uploading} onImageSelect={handleImageSelect} />
        </View>

        {/* Generate Button with emphasis */}
        <View style={styles.buttonSection}>
          <GlowingButton
            onPress={handleGenerate}
            disabled={isGenerating}
            text={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundDeep },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 24,
  },
  selectorSection: {
    marginBottom: 32,
  },
  uploaderSection: {
    marginBottom: 32,
  },
  buttonSection: {
    marginBottom: 24,
  },
});
