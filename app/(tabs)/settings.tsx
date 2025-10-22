import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { User, Mail, Trash2, LogOut, CreditCard, ChevronRight, Lock, Eye, EyeOff, Image as ImageIcon, Moon, Zap, Bell, Cloud, Camera, CheckCircle, Star, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import GlowingButton from '@/components/GlowingButton';
import GlassyTitle from '@/components/GlassyTitle';

// Glowing section divider
function GlowingDivider() {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.glowingDividerContainer}>
      <Animated.View style={[styles.glowingDividerGlow, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={['transparent', 'rgba(200, 220, 255, 0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.glowingDividerGradient}
        />
      </Animated.View>
      <View style={styles.glowingDividerLine} />
    </View>
  );
}

// Animated credit display
function AnimatedCreditDisplay({ credits, isGuest }: { credits: number; isGuest?: boolean }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isGuest && credits <= 2) {
      // Pulse animation for low credits
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [credits, isGuest, pulseAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <View style={styles.animatedCreditBadge}>
        <LinearGradient
          colors={
            isGuest && credits <= 2
              ? ['rgba(255, 180, 100, 0.3)', 'rgba(255, 140, 60, 0.2)']
              : ['rgba(74, 222, 128, 0.2)', 'rgba(34, 197, 94, 0.15)']
          }
          style={styles.animatedCreditGradient}
        />
        <Sparkles size={16} color={isGuest && credits <= 2 ? '#ffb464' : '#4ade80'} />
        <Text style={[styles.animatedCreditText, isGuest && credits <= 2 && styles.animatedCreditTextWarning]}>
          {credits}
        </Text>
      </View>
    </Animated.View>
  );
}

// Trial progress bar for guest users
function TrialProgressBar({ used, total }: { used: number; total: number }) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percentage = ((total - used) / total) * 100;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: percentage,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [percentage, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Trial Credits</Text>
        <Text style={styles.progressValue}>
          {total - used} / {total} remaining
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
          <LinearGradient
            colors={
              percentage > 50
                ? ['rgba(74, 222, 128, 0.7)', 'rgba(34, 197, 94, 0.8)']
                : percentage > 20
                ? ['rgba(251, 191, 36, 0.7)', 'rgba(245, 158, 11, 0.8)']
                : ['rgba(239, 68, 68, 0.7)', 'rgba(220, 38, 38, 0.8)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// Benefits list for guest users
function BenefitsList() {
  const benefits = [
    { icon: Star, text: '50 free credits on sign up' },
    { icon: Cloud, text: 'Cloud sync across devices' },
    { icon: Sparkles, text: 'Priority generation queue' },
    { icon: CheckCircle, text: 'Save unlimited history' },
  ];

  return (
    <View style={styles.benefitsContainer}>
      <Text style={styles.benefitsTitle}>Sign up to unlock:</Text>
      {benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitRow}>
          <View style={styles.benefitIconWrapper}>
            <benefit.icon size={16} color="#4ade80" strokeWidth={2.5} />
          </View>
          <Text style={styles.benefitText}>{benefit.text}</Text>
        </View>
      ))}
    </View>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
}) {
  const translateAnim = React.useRef(new Animated.Value(enabled ? 1 : 0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(translateAnim, {
      toValue: enabled ? 1 : 0,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [enabled, translateAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
    onChange();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.toggle, enabled && styles.toggleActive]}
        activeOpacity={1}
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
      >
        <LinearGradient
          colors={
            enabled
              ? ['rgba(74, 222, 128, 0.6)', 'rgba(34, 197, 94, 0.7)', 'rgba(22, 163, 74, 0.6)']
              : ['rgba(220, 235, 255, 0.1)', 'rgba(220, 235, 255, 0.05)', 'rgba(220, 235, 255, 0.08)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.toggleBackground}
        />
        <View style={styles.toggleInnerShadow} />
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [
                {
                  translateX: translateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [3, 42],
                  }),
                },
              ],
            },
          ]}
        >
          {enabled && (
            <View style={styles.thumbGlow}>
              <LinearGradient
                colors={[
                  'rgba(74, 222, 128, 0.6)',
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(74, 222, 128, 0.6)',
                ]}
                style={styles.thumbGlowGradient}
              />
            </View>
          )}
          <LinearGradient
            colors={['#ffffff', '#f5f5f5', '#e8e8e8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.thumbInner}
          />
          <View style={styles.thumbHighlight} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function SettingsRow({
  label,
  icon: Icon,
  children
}: {
  label: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        {Icon && (
          <View style={styles.settingIconWrapper}>
            <Icon size={18} color={Colors.dark.textSecondary} />
          </View>
        )}
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { clearResults, setSelectedImage, aspectRatio, setAspectRatio } = useGeneration();
  const { user, signOut, updateProfile, signIn, signUp, isLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [cloudStorage, setCloudStorage] = useState(false);
  const [name, setName] = useState(user?.name || 'User');
  const [email, setEmail] = useState(user?.email || '');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleDarkMode = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDarkMode(!darkMode);
  };

  const toggleReduceMotion = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setReduceMotion(!reduceMotion);
  };

  const toggleNotifications = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotifications(!notifications);
  };

  const toggleCloudStorage = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCloudStorage(!cloudStorage);
  };

  const handleSaveProfile = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await updateProfile({ name, email });
      if (Platform.OS === 'web') {
        alert('Profile updated successfully!');
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch {
      if (Platform.OS === 'web') {
        alert('Failed to update profile');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    }
  };

  const handleSignOut = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const confirmSignOut = async () => {
      try {
        await signOut();
      } catch {
        if (Platform.OS === 'web') {
          alert('Failed to sign out');
        } else {
          Alert.alert('Error', 'Failed to sign out');
        }
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to sign out?')) {
        await confirmSignOut();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: confirmSignOut },
      ]);
    }
  };

  const handleDeleteData = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const confirmDelete = () => {
      clearResults();
      setSelectedImage(null);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete all data?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete All Data',
        'Are you sure you want to delete all data? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const handleInlineSignIn = async () => {
    if (!authEmail || !authPassword) {
      if (Platform.OS === 'web') {
        alert('Please fill in email and password');
      } else {
        Alert.alert('Error', 'Please fill in email and password');
      }
      return;
    }
    try {
      await signIn(authEmail, authPassword);
    } catch {
      if (Platform.OS === 'web') {
        alert('Sign in failed. Please try again.');
      } else {
        Alert.alert('Error', 'Sign in failed. Please try again.');
      }
    }
  };

  const handleInlineSignUp = async () => {
    if (!authName || !authEmail || !authPassword) {
      if (Platform.OS === 'web') {
        alert('Please fill in all fields');
      } else {
        Alert.alert('Error', 'Please fill in all fields');
      }
      return;
    }
    if (authPassword.length < 6) {
      if (Platform.OS === 'web') {
        alert('Password must be at least 6 characters');
      } else {
        Alert.alert('Error', 'Password must be at least 6 characters');
      }
      return;
    }
    try {
      await signUp(authName, authEmail, authPassword);
    } catch {
      if (Platform.OS === 'web') {
        alert('Sign up failed. Please try again.');
      } else {
        Alert.alert('Error', 'Sign up failed. Please try again.');
      }
    }
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 60, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
        <GlassyTitle><Text>Settings</Text></GlassyTitle>

        {!user ? (
          <PremiumLiquidGlass style={styles.settingsPanel} variant="elevated" borderRadius={24}>
            <View style={styles.panelContent}>
              <Text style={styles.sectionTitle}>Account</Text>

              <PremiumLiquidGlass style={styles.inputContainer} borderRadius={18}>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={authEmail}
                    onChangeText={setAuthEmail}
                    style={styles.input}
                    placeholderTextColor={Colors.dark.textMuted}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus={false}
                  />
                </View>
              </PremiumLiquidGlass>

              <PremiumLiquidGlass style={styles.inputContainer} borderRadius={18}>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={authPassword}
                    onChangeText={setAuthPassword}
                    style={styles.input}
                    placeholderTextColor={Colors.dark.textMuted}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    {showPassword ? (
                      <EyeOff size={18} color={Colors.dark.textSecondary} />
                    ) : (
                      <Eye size={18} color={Colors.dark.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </PremiumLiquidGlass>

              <GlowingButton
                onPress={handleInlineSignIn}
                disabled={isLoading}
                text={isLoading ? 'Signing In...' : 'Sign In'}
                variant="primary"
                style={{ marginBottom: 12 }}
              />

              <PremiumLiquidGlass style={styles.inputContainer} borderRadius={18}>
                <View style={styles.inputWrapper}>
                  <User size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={authName}
                    onChangeText={setAuthName}
                    style={styles.input}
                    placeholderTextColor={Colors.dark.textMuted}
                    placeholder="Full Name"
                    autoCapitalize="words"
                  />
                </View>
              </PremiumLiquidGlass>

              <GlowingButton
                onPress={handleInlineSignUp}
                disabled={isLoading}
                text={isLoading ? 'Creating Account...' : 'Create Account'}
                variant="default"
              />
            </View>
          </PremiumLiquidGlass>
        ) : (
          <>
            <PremiumLiquidGlass style={styles.creditsCard} variant="elevated" borderRadius={20}>
              <View style={styles.creditsContent}>
                <View style={styles.creditsInfo}>
                  <Text style={styles.creditsLabel}>
                    {user.isGuest ? 'Free Trial Credits' : 'Available Credits'}
                  </Text>
                  <View style={styles.creditsValueRow}>
                    <AnimatedCreditDisplay credits={user.credits} isGuest={user.isGuest} />
                  </View>
                  {user.isGuest && user.credits > 0 && (
                    <Text style={styles.guestHint}>
                      Sign in to get more credits!
                    </Text>
                  )}
                  {user.isGuest && user.credits === 0 && (
                    <Text style={styles.guestHintWarning}>
                      Trial credits used. Sign in to continue.
                    </Text>
                  )}
                </View>
                {!user.isGuest && (
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      router.push('/plans');
                    }}
                    style={styles.buyButton}
                  >
                    <CreditCard size={18} color="#d8e9ff" />
                    <Text style={styles.buyButtonText}>Buy More</Text>
                    <ChevronRight size={18} color="#d8e9ff" />
                  </TouchableOpacity>
                )}
              </View>
            </PremiumLiquidGlass>

            {user.isGuest && (
              <>
                <TrialProgressBar used={5 - user.credits} total={5} />
                <BenefitsList />
                <GlowingButton
                  onPress={() => router.push('/auth/login')}
                  text="Sign In to Get 50 Free Credits"
                  variant="primary"
                  style={{ marginBottom: 26 }}
                />
              </>
            )}
          </>
        )}

        {user && !user.isGuest && (
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });
                  if (!result.canceled && result.assets[0]) {
                    await updateProfile({ profileImage: result.assets[0].uri });
                    if (Platform.OS === 'web') {
                      alert('Profile photo updated!');
                    } else {
                      Alert.alert('Success', 'Profile photo updated!');
                    }
                  }
                } catch {
                  if (Platform.OS === 'web') {
                    alert('Failed to update profile photo');
                  } else {
                    Alert.alert('Error', 'Failed to update profile photo');
                  }
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.avatarBorder}>
                <View style={styles.avatarInner}>
                  {user.profileImage ? (
                    <View style={styles.avatarImage}>
                      {/* Image would render here if we had proper image display */}
                      <User size={42} color="#d8e9ff" strokeWidth={1.5} />
                    </View>
                  ) : (
                    <User size={42} color="#d8e9ff" strokeWidth={1.5} />
                  )}
                </View>
                <View style={styles.avatarCameraButton}>
                  <LinearGradient
                    colors={['rgba(74, 222, 128, 0.9)', 'rgba(34, 197, 94, 0.9)']}
                    style={styles.avatarCameraGradient}
                  />
                  <Camera size={14} color="#fff" strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <PremiumLiquidGlass style={styles.inputContainer} borderRadius={18}>
              <View style={styles.inputWrapper}>
                <User size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor={Colors.dark.textMuted}
                  placeholder="Name"
                  autoFocus={false}
                  blurOnSubmit
                />
              </View>
            </PremiumLiquidGlass>

            <PremiumLiquidGlass style={styles.inputContainer} borderRadius={18}>
              <View style={styles.inputWrapper}>
                <Mail size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor={Colors.dark.textMuted}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus={false}
                  blurOnSubmit
                />
              </View>
            </PremiumLiquidGlass>
          </View>
        </View>
        )}

        {user && (
        <GlowingButton
          onPress={handleSaveProfile}
          text="Save Profile"
          variant="primary"
          style={styles.saveButton}
        />
        )}

        <PremiumLiquidGlass style={styles.settingsPanel} variant="elevated" borderRadius={24}>
          <View style={styles.panelContent}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <SettingsRow label="Dark Mode" icon={Moon}>
              <ToggleSwitch enabled={darkMode} onChange={toggleDarkMode} label="Toggle dark mode" />
            </SettingsRow>

            <GlowingDivider />

            <SettingsRow label="Reduce Motion" icon={Zap}>
              <ToggleSwitch
                enabled={reduceMotion}
                onChange={toggleReduceMotion}
                label="Toggle reduce motion"
              />
            </SettingsRow>

            <GlowingDivider />

            <SettingsRow label="Notifications" icon={Bell}>
              <ToggleSwitch
                enabled={notifications}
                onChange={toggleNotifications}
                label="Toggle notifications"
              />
            </SettingsRow>

            <GlowingDivider />

            <SettingsRow label="Cloud Storage" icon={Cloud}>
              <ToggleSwitch
                enabled={cloudStorage}
                onChange={toggleCloudStorage}
                label="Toggle cloud storage"
              />
            </SettingsRow>
          </View>
        </PremiumLiquidGlass>

        <PremiumLiquidGlass style={styles.settingsPanel} variant="elevated" borderRadius={24}>
          <View style={styles.panelContent}>
            <Text style={styles.sectionTitle}>Image Generation</Text>

            <View style={styles.settingSection}>
              <View style={styles.settingHeaderRow}>
                <ImageIcon size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.settingLabel}>Image Format</Text>
              </View>
              <View style={styles.formatSelector}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setAspectRatio('portrait');
                  }}
                  style={[
                    styles.formatOption,
                    aspectRatio === 'portrait' && styles.formatOptionActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      aspectRatio === 'portrait'
                        ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']
                        : ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.formatOptionGradient}
                  />
                  <View style={[styles.formatIcon, styles.formatIconPortrait]} />
                  <Text
                    style={[
                      styles.formatText,
                      aspectRatio === 'portrait' && styles.formatTextActive,
                    ]}
                  >
                    Portrait
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setAspectRatio('square');
                  }}
                  style={[
                    styles.formatOption,
                    aspectRatio === 'square' && styles.formatOptionActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      aspectRatio === 'square'
                        ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']
                        : ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.formatOptionGradient}
                  />
                  <View style={[styles.formatIcon, styles.formatIconSquare]} />
                  <Text
                    style={[
                      styles.formatText,
                      aspectRatio === 'square' && styles.formatTextActive,
                    ]}
                  >
                    Square
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setAspectRatio('landscape');
                  }}
                  style={[
                    styles.formatOption,
                    aspectRatio === 'landscape' && styles.formatOptionActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      aspectRatio === 'landscape'
                        ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']
                        : ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.formatOptionGradient}
                  />
                  <View style={[styles.formatIcon, styles.formatIconLandscape]} />
                  <Text
                    style={[
                      styles.formatText,
                      aspectRatio === 'landscape' && styles.formatTextActive,
                    ]}
                  >
                    Landscape
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </PremiumLiquidGlass>

        <PremiumLiquidGlass style={styles.settingsPanel} variant="elevated" borderRadius={24}>
          <View style={styles.panelContent}>
            <Text style={styles.sectionTitle}>Account</Text>

            {user ? (
              <TouchableOpacity style={styles.accountRow} onPress={handleSignOut} activeOpacity={0.7}>
                <View style={styles.accountLeft}>
                  <View style={styles.iconWrapperLogout}>
                    <LogOut size={20} color={Colors.dark.primaryLight} />
                  </View>
                  <Text style={styles.logoutText}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.settingLabel}>Sign in or create an account above</Text>
            )}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.dangerRow} onPress={handleDeleteData} activeOpacity={0.7}>
              <View style={styles.dangerLeft}>
                <View style={styles.iconWrapperDanger}>
                  <Trash2 size={20} color={Colors.dark.error} />
                </View>
                <Text style={styles.dangerText}>Delete All Data</Text>
              </View>
            </TouchableOpacity>
          </View>
        </PremiumLiquidGlass>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with Liquid Glass</Text>
        </View>
        </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundDeep,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1.2,
    marginBottom: 26,
  },
  creditsCard: {
    marginBottom: 26,
    shadowColor: 'rgba(200, 220, 255, 0.35)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 14,
  },
  creditsContent: {
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  creditsInfo: {
    gap: 6,
  },
  creditsLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  guestHint: {
    fontSize: 13,
    color: 'rgba(200, 220, 255, 0.7)',
    fontWeight: '500' as const,
    marginTop: 4,
  },
  guestHintWarning: {
    fontSize: 13,
    color: 'rgba(255, 180, 100, 0.9)',
    fontWeight: '600' as const,
    marginTop: 4,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(216, 233, 255, 0.12)',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.22)',
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: 'rgba(200, 220, 255, 0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#d8e9ff',
  },
  profileSection: {
    marginBottom: 26,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.28)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(200, 220, 255, 0.65)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 32,
    elevation: 18,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.22)',
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    gap: 12,
  },
  inputContainer: {
    minHeight: 56,
    shadowColor: 'rgba(200, 220, 255, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500' as const,
  },
  eyeButton: {
    padding: 4,
  },
  saveButton: {
    marginBottom: 16,
  },
  settingsPanel: {
    marginBottom: 18,
    shadowColor: 'rgba(200, 220, 255, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  panelContent: {
    padding: 22,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.divider,
    marginVertical: 16,
  },
  toggle: {
    width: 80,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(220, 235, 255, 0.06)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  toggleActive: {
    borderTopColor: 'rgba(74, 222, 128, 0.5)',
    borderLeftColor: 'rgba(74, 222, 128, 0.45)',
    borderRightColor: 'rgba(74, 222, 128, 0.35)',
    borderBottomColor: 'rgba(74, 222, 128, 0.3)',
    shadowColor: 'rgba(74, 222, 128, 0.7)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 28,
    elevation: 14,
  },
  toggleBackground: {
    position: 'absolute',
    inset: 0,
  },
  toggleInnerShadow: {
    position: 'absolute',
    inset: 0,
    borderRadius: 19,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.15)',
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  toggleThumb: {
    position: 'absolute',
    top: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  thumbGlow: {
    position: 'absolute',
    inset: -6,
    borderRadius: 24,
    overflow: 'hidden',
  },
  thumbGlowGradient: {
    flex: 1,
  },
  thumbInner: {
    flex: 1,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  thumbHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: '35%',
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapperLogout: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(216, 233, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(216, 233, 255, 0.35)',
    borderLeftColor: 'rgba(216, 233, 255, 0.3)',
    borderRightColor: 'rgba(216, 233, 255, 0.2)',
    borderBottomColor: 'rgba(216, 233, 255, 0.15)',
    shadowColor: 'rgba(216, 233, 255, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#d8e9ff',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  dangerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapperDanger: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(239, 68, 68, 0.35)',
    borderLeftColor: 'rgba(239, 68, 68, 0.3)',
    borderRightColor: 'rgba(239, 68, 68, 0.2)',
    borderBottomColor: 'rgba(239, 68, 68, 0.15)',
    shadowColor: 'rgba(239, 68, 68, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 7,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.dark.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: 36,
    gap: 10,
  },
  footerText: {
    fontSize: 15,
    color: Colors.dark.textMuted,
    fontWeight: '500' as const,
  },
  footerSubtext: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    opacity: 0.7,
  },
  settingSection: {
    gap: 14,
  },
  settingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  formatSelector: {
    flexDirection: 'row',
    gap: 14,
  },
  formatOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  formatOptionActive: {
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftColor: 'rgba(255, 255, 255, 0.45)',
    borderRightColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(200, 220, 255, 0.5)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 28,
    elevation: 14,
  },
  formatOptionGradient: {
    position: 'absolute',
    inset: 0,
  },
  formatIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(200, 200, 200, 0.5)',
    borderBottomColor: 'rgba(180, 180, 180, 0.6)',
  },
  formatIconPortrait: {
    width: 24,
    height: 34,
  },
  formatIconSquare: {
    width: 32,
    height: 32,
  },
  formatIconLandscape: {
    width: 42,
    height: 28,
  },
  formatText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.dark.textMuted,
  },
  formatTextActive: {
    color: Colors.dark.text,
    fontWeight: '700' as const,
  },
  // Glowing divider styles
  glowingDividerContainer: {
    height: 20,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowingDividerGlow: {
    position: 'absolute',
    width: '100%',
    height: 8,
  },
  glowingDividerGradient: {
    flex: 1,
    borderRadius: 4,
  },
  glowingDividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(200, 220, 255, 0.2)',
  },
  // Animated credit display styles
  animatedCreditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderTopColor: 'rgba(74, 222, 128, 0.4)',
    borderLeftColor: 'rgba(74, 222, 128, 0.35)',
    borderRightColor: 'rgba(74, 222, 128, 0.25)',
    borderBottomColor: 'rgba(74, 222, 128, 0.2)',
    overflow: 'hidden',
  },
  animatedCreditGradient: {
    position: 'absolute',
    inset: 0,
  },
  animatedCreditText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#4ade80',
  },
  animatedCreditTextWarning: {
    color: '#ffb464',
  },
  creditsValueRow: {
    marginTop: 4,
  },
  // Trial progress bar styles
  progressContainer: {
    marginBottom: 24,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
  // Benefits list styles
  benefitsContainer: {
    marginBottom: 24,
    gap: 14,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(74, 222, 128, 0.35)',
    borderLeftColor: 'rgba(74, 222, 128, 0.3)',
    borderRightColor: 'rgba(74, 222, 128, 0.2)',
    borderBottomColor: 'rgba(74, 222, 128, 0.15)',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.dark.text,
  },
  // Avatar camera button styles
  avatarCameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: Colors.dark.backgroundDeep,
    shadowColor: 'rgba(74, 222, 128, 0.6)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarCameraGradient: {
    position: 'absolute',
    inset: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Settings row icon styles
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(200, 220, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
});
