import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import GlassyTitle from '@/components/GlassyTitle';
import GlassPanel from '@/components/GlassPanel';
import CountSelector from '@/components/CountSelector';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector from '@/components/StyleSelector';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, glassStyles } from '@/constants/glassStyles';

/**
 * GenerateScreen - Main screen for image upload and generation
 * Matches ManusAI HomeScreen.tsx exactly
 */
export default function GenerateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    selectedImage,
    setSelectedImage,
    generationCount,
    setGenerationCount,
    isGenerating,
    generateImages,
  } = useGeneration();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('casual');

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle image selection
  const handleImageSelect = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        setSelectedImage(result.assets[0].uri);
        setError(null);
        setUploading(false);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      showToast('Failed to upload image', 'error');
      setUploading(false);
    }
  };

  // Handle generate button press
  const handleGenerate = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please upload an image first.');
      return;
    }

    if (!user) {
      showToast('Please sign in to generate images', 'warning');
      return;
    }

    if (user.credits < generationCount) {
      Alert.alert(
        'Insufficient Credits',
        `You need ${generationCount} credits but only have ${user.credits}.`
      );
      return;
    }

    setError(null);

    try {
      // Navigate to results and start generation
      router.push('/(tabs)/results');
      await generateImages(user.id);
      
      Alert.alert('Success', 'Generation started! Check the Results tab.');
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate images. Please try again.');
      showToast('Generation failed', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient 
        colors={[COLORS.lightColor1, COLORS.lightColor2, COLORS.lightColor1]} 
        style={StyleSheet.absoluteFill} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>
          {getGreeting()}, {user?.name || 'Muse'}
        </GlassyTitle>
        
        <CountSelector
          value={generationCount}
          onChange={setGenerationCount}
          disabled={isGenerating}
        />
        
        <ImageUploader
          uploadedImage={selectedImage}
          uploading={uploading}
          onImageSelect={handleImageSelect}
        />
        
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
          activeOpacity={0.7}
        >
          <Text style={styles.advancedToggleText}>Advanced Options</Text>
          {showAdvanced ? (
            <ChevronUp size={20} color={COLORS.silverMid} />
          ) : (
            <ChevronDown size={20} color={COLORS.silverMid} />
          )}
        </TouchableOpacity>
        
        {showAdvanced && (
          <View style={styles.advancedSection}>
            <StyleSelector
              selectedStyleId={selectedStyle}
              onSelectStyle={setSelectedStyle}
            />
          </View>
        )}
        
        <TouchableOpacity
          style={[
            glassStyles.glass3DButton,
            glassStyles.primaryButton,
            styles.generateButton,
            (isGenerating || !selectedImage) && styles.disabledButton,
          ]}
          onPress={handleGenerate}
          disabled={isGenerating || !selectedImage}
          activeOpacity={0.7}
        >
          <Text style={[glassStyles.buttonText, glassStyles.primaryButtonText]}>
            {isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.creditsInfo}>
          Cost: {generationCount} credit{generationCount !== 1 ? 's' : ''} • Available: {user?.credits || 0}
        </Text>
        
        {error && (
          <GlassPanel style={styles.errorPanel} radius={16}>
            <Text style={styles.errorText}>{error}</Text>
          </GlassPanel>
        )}
      </ScrollView>
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
  generateButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  creditsInfo: {
    color: COLORS.silverMid,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  advancedToggleText: {
    color: COLORS.silverLight,
    fontSize: 14,
    fontWeight: '600',
  },
  advancedSection: {
    marginBottom: 16,
  },
  errorPanel: {
    width: '100%',
    marginTop: 12,
    padding: 12,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    fontSize: 12,
  },
});
