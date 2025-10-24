import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import NeumorphicPanel from '@/components/NeumorphicPanel';
import { neumorphicStyles, NEU_COLORS } from '@/constants/neumorphicStyles';

interface ImageUploaderProps {
  uploadedImage: string | null;
  uploading: boolean;
  onImageSelect: () => void;
}

export default function ImageUploader({ uploadedImage, uploading, onImageSelect }: ImageUploaderProps) {
  return (
    <NeumorphicPanel style={styles.container} inset>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onImageSelect}
        activeOpacity={0.9}
        testID="image-uploader"
      >
        {uploadedImage ? (
          <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContent}>
            <View style={styles.iconRing}>
              {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
              <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.placeholderText}>Tap to upload</Text>
            <Text style={styles.placeholderSubtext}>Your photo here</Text>
          </View>
        )}
        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={NEU_COLORS.accentStart} />
          </View>
        )}
      </TouchableOpacity>
    </NeumorphicPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: NEU_COLORS.baseLighter,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: '50%',
    height: '50%',
    opacity: 0.6,
  },
  placeholderText: {
    ...neumorphicStyles.neuTextPrimary,
    fontSize: 16,
    marginBottom: 4,
  },
  placeholderSubtext: {
    ...neumorphicStyles.neuTextMuted,
    fontSize: 13,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});