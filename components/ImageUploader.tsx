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
    <GlassPanel style={glassStyles.imagePlaceholder} radius={28}>
      <TouchableOpacity
        style={glassStyles.imageContainer}
        onPress={onImageSelect}
        activeOpacity={0.9}
        testID="image-uploader"
      >
        {uploadedImage ? (
          <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContent}>
            <View style={styles.iconRing}>
              <View style={styles.iconRingInner}>
                {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
                <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
              </View>
            </View>
            <Text style={styles.placeholderText}>Tap to upload</Text>
            <Text style={styles.placeholderSubtext}>Your photo here</Text>
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
    borderRadius: 28,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  iconRingInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '60%',
    height: '60%',
    opacity: 0.4,
  },
  placeholderText: {
    color: COLORS.silverLight,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  placeholderSubtext: {
    color: COLORS.silverDark,
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
});