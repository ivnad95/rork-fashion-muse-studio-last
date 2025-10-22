import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import GlassPanel from '@/components/GlassPanel';
import { glassStyles, COLORS } from '@/constants/glassStyles';

interface ImageUploaderProps {
  uploadedImage: string | null;
  uploading: boolean;
  onImageSelect: () => void;
}

export default function ImageUploader({ uploadedImage, uploading, onImageSelect }: ImageUploaderProps) {
  return (
    <GlassPanel style={glassStyles.imagePlaceholder} radius={24}>
      <TouchableOpacity
        style={glassStyles.imageContainer}
        onPress={onImageSelect}
        activeOpacity={0.85}
        testID="image-uploader"
      >
        {uploadedImage ? (
          <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContent}>
            <View style={styles.logoContainer}>
              {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
              <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.placeholderText}>Tap to upload your photo</Text>
            <Text style={styles.placeholderSubtext}>Start your fashion transformation</Text>
          </View>
        )}
        {uploading && (
          <View style={glassStyles.loadingPulse}>
            <ActivityIndicator size="large" color={COLORS.silverMid} />
          </View>
        )}
      </TouchableOpacity>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,                                   // Spec: 24px border radius for main panels
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    marginBottom: 16,
    opacity: 0.25,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: COLORS.silverLight,                      // Spec: near-white primary text
    fontSize: 15,
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',         // Spec: neon-like glow effect
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  placeholderSubtext: {
    color: COLORS.silverMid,                        // Spec: secondary silver text
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});