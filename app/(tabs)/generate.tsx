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
import { glassStyles } from '@/constants/glassStyles';
import GlowingButton from '@/components/GlowingButton';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { selectedImage, setSelectedImage, generationCount, setGenerationCount, isGenerating, generateImages } = useGeneration();
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
        contentContainerStyle={[glassStyles.screenContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle><Text>Generate</Text></GlassyTitle>
        <CountSelector value={generationCount} onChange={setGenerationCount} disabled={isGenerating} />
        <ImageUploader uploadedImage={selectedImage} uploading={uploading} onImageSelect={handleImageSelect} />
        <GlowingButton
          onPress={handleGenerate}
          disabled={isGenerating}
          text={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          variant="primary"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundDeep },
  scrollView: { flex: 1 },
});
