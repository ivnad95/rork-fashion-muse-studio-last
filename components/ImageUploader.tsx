import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import GlassPanel from '@/components/GlassPanel';
import { COLORS } from '@/constants/glassStyles';

interface ImageUploaderProps {
  uploadedImage: string | null;
  uploading: boolean;
  onImageSelect: () => void;
}

/**
 * ImageUploader – matches the ManusAI Deep Sea glass aesthetic
 */
export default function ImageUploader({ uploadedImage, uploading, onImageSelect }: ImageUploaderProps) {
  return (
    <GlassPanel style={styles.panel} radius={20}>
      <TouchableOpacity
        style={styles.touch}
        onPress={onImageSelect}
        activeOpacity={0.8}
      >
        {uploadedImage ? (
          <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContent}>
            <View style={styles.logoContainer}>
              <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.placeholderText}>Tap to upload your photo</Text>
            <Text style={styles.placeholderSubtext}>Start your fashion transformation</Text>
          </View>
        )}

        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.silverMid} />
          </View>
        )}
      </TouchableOpacity>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginBottom: 16,
  },
  touch: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
    opacity: 0.6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderSubtext: {
    color: '#6B7280',
    fontSize: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)'
  }
});
