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
    <GlassPanel style={glassStyles.imagePlaceholder} radius={20}>
      <TouchableOpacity
        style={glassStyles.imageContainer}
        onPress={onImageSelect}
        activeOpacity={0.8}
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
    borderRadius: 20,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
    opacity: 0.3,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  placeholderSubtext: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
});