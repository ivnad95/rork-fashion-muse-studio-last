import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import SimpleButton from '@/components/SimpleButton';
import SimpleCard from '@/components/SimpleCard';

export default function GenerateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { selectedImage, setSelectedImage, generationCount, setGenerationCount, isGenerating, generateImages } = useGeneration();
  const [uploading, setUploading] = useState(false);

  const counts = [1, 2, 4, 6, 8];

  const handleImageSelect = async () => {
    try {
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
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      showToast('Please upload an image first', 'warning');
      return;
    }

    if (!user) {
      showToast('Please sign in to generate images', 'warning');
      return;
    }

    if (user.credits < generationCount) {
      showToast(`You need ${generationCount} credits but only have ${user.credits}`, 'warning');
      return;
    }

    router.push('/(tabs)/results');
    generateImages(user.id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0F1C', '#0D1929', '#1A2F4F']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Generate</Text>
          <View style={styles.creditBadge}>
            <Text style={styles.creditText}>{user?.credits || 0}</Text>
          </View>
        </View>

        {/* Image Upload */}
        <SimpleCard style={styles.uploadCard}>
          <TouchableOpacity
            onPress={handleImageSelect}
            style={styles.uploadArea}
            activeOpacity={0.8}
          >
            {uploading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
            ) : (
              <>
                <View style={styles.uploadIcon}>
                  <Text style={styles.uploadIconText}>📷</Text>
                </View>
                <Text style={styles.uploadText}>Tap to upload photo</Text>
              </>
            )}
          </TouchableOpacity>
        </SimpleCard>

        {/* Count Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of variations</Text>
          <View style={styles.countRow}>
            {counts.map((count) => (
              <TouchableOpacity
                key={count}
                onPress={() => setGenerationCount(count)}
                style={[
                  styles.countButton,
                  generationCount === count && styles.countButtonActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.countText,
                    generationCount === count && styles.countTextActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <SimpleButton
          title={isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          onPress={handleGenerate}
          disabled={isGenerating || !selectedImage}
          loading={isGenerating}
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  creditBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  creditText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  uploadCard: {
    padding: 0,
    overflow: 'hidden',
    aspectRatio: 3 / 4,
  },
  uploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIconText: {
    fontSize: 40,
  },
  uploadText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  countRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  countButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  countButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
});
