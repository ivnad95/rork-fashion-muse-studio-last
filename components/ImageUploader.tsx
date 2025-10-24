import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlassContainer from '@/components/GlassContainer';
import { COLORS, RADIUS, GRADIENTS, glassStyles } from '@/constants/glassStyles';

interface ImageUploaderProps {
  uploadedImage: string | null;
  uploading: boolean;
  onImageSelect: () => void;
}

export default function ImageUploader({ uploadedImage, uploading, onImageSelect }: ImageUploaderProps) {
  return (
    <GlassContainer variant="card" style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onImageSelect}
        activeOpacity={0.9}
        testID="image-uploader"
      >
        {uploadedImage ? (
          <>
            {/* Uploaded image with glass border effect */}
            <View style={styles.imageGlassBorder}>
              <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} resizeMode="cover" />

              {/* Glass shine overlay on image */}
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.15)',
                  'rgba(255, 255, 255, 0.08)',
                  'transparent',
                  'transparent'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageShine}
                pointerEvents="none"
              />
            </View>
          </>
        ) : (
          <View style={styles.placeholderContent}>
            {/* Glass icon ring with depth */}
            <View style={styles.iconRingOuter}>
              {/* Platform-specific blur */}
              {Platform.OS !== 'web' ? (
                <BlurView intensity={12} tint="light" style={styles.iconRingBlur}>
                  <LinearGradient
                    colors={[GRADIENTS.glassDepth[0], GRADIENTS.glassDepth[1]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconRingInner}
                  >
                    {/* Logo */}
                    <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
                  </LinearGradient>
                </BlurView>
              ) : (
                <LinearGradient
                  colors={[COLORS.glassLight, COLORS.glassMedium]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconRingInner}
                >
                  {/* Logo */}
                  <Image source={require('@/assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
                </LinearGradient>
              )}

              {/* Top shine on ring */}
              <View style={styles.ringShine} />
            </View>

            <Text style={styles.placeholderText}>Tap to upload</Text>
            <Text style={styles.placeholderSubtext}>Your photo here</Text>
          </View>
        )}
        {uploading && (
          <View style={styles.loadingOverlay}>
            {/* Glass loading overlay */}
            {Platform.OS !== 'web' ? (
              <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="large" color={COLORS.accent} />
                </View>
              </BlurView>
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.loadingFallback]}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="large" color={COLORS.accent} />
                </View>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  imageGlassBorder: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
  },
  imageShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.lg,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    position: 'relative',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  iconRingBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
  },
  iconRingInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderTopColor: COLORS.glassHighlight,
    borderLeftColor: COLORS.glassHighlight,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },
  ringShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.glassShine,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    pointerEvents: 'none',
  },
  logo: {
    width: '45%',
    height: '45%',
    opacity: 0.5,
  },
  placeholderText: {
    ...glassStyles.textPrimary,
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '600',
  },
  placeholderSubtext: {
    ...glassStyles.textMuted,
    fontSize: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.lg,
  },
  loadingFallback: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});