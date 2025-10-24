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
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import { User, Mail, Trash2, LogOut, CreditCard, ChevronRight, Lock, Eye, EyeOff, Image as ImageIcon, Bell, Cloud, Camera, CheckCircle, Star, Sparkles, FileText, Shield } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { COLORS, SPACING, RADIUS, GRADIENTS, glassStyles } from '@/constants/glassStyles';
import GlassContainer from '@/components/GlassContainer';
import GlassButton from '@/components/GlassButton';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'expo-router';
import NeumorphicPanel from '@/components/NeumorphicPanel';
import NeumorphicButton from '@/components/NeumorphicButton';
import { useScrollNavbar } from '@/hooks/useScrollNavbar';
import * as haptics from '@/utils/haptics';

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
            toValue: 1.08,
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
              ? ['rgba(255, 180, 120, 0.15)', 'rgba(245, 160, 100, 0.12)']
              : ['rgba(180, 210, 255, 0.18)', 'rgba(160, 200, 255, 0.12)']
          }
          style={styles.animatedCreditGradient}
        />
        <Sparkles size={16} color={isGuest && credits <= 2 ? '#f5a064' : '#a0c8ff'} strokeWidth={2} />
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
                ? ['rgba(160, 200, 255, 0.5)', 'rgba(140, 180, 240, 0.6)']
                : percentage > 20
                ? ['rgba(240, 200, 140, 0.5)', 'rgba(220, 180, 120, 0.6)']
                : ['rgba(255, 160, 140, 0.5)', 'rgba(240, 140, 120, 0.6)']
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
            <benefit.icon size={16} color="#a0c8ff" strokeWidth={2.5} />
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
              ? ['rgba(160, 200, 255, 0.35)', 'rgba(140, 180, 240, 0.45)', 'rgba(120, 160, 220, 0.35)']
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
                  'rgba(160, 200, 255, 0.5)',
                  'rgba(140, 180, 240, 0.7)',
                  'rgba(160, 200, 255, 0.5)',
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
  const { showToast } = useToast();
  const { clearResults, setSelectedImage, aspectRatio, setAspectRatio } = useGeneration();
  const { user, signOut, updateProfile, signIn, signUp, isLoading } = useAuth();
  const { handleScroll } = useScrollNavbar();
  const [notifications, setNotifications] = useState(true);
  const [cloudStorage, setCloudStorage] = useState(false);
  const [name, setName] = useState(user?.name || 'User');
  const [email, setEmail] = useState(user?.email || '');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleNotifications = () => {
    haptics.light();
    setNotifications(!notifications);
  };

  const toggleCloudStorage = () => {
    haptics.light();
    setCloudStorage(!cloudStorage);
  };

  const handleSaveProfile = async () => {
    haptics.light();

    try {
      await updateProfile({ name, email });
      haptics.success();
      showToast('Profile updated successfully!', 'success');
    } catch {
      haptics.error();
      showToast('Failed to update profile', 'error');
    }
  };

  const handleSignOut = async () => {
    haptics.medium();

    try {
      showToast('Signing out...', 'info', 1500);
      setTimeout(async () => {
        await signOut();
        haptics.success();
        showToast('Signed out successfully', 'success');
      }, 300);
    } catch {
      haptics.error();
      showToast('Failed to sign out', 'error');
    }
  };

  const handleDeleteData = () => {
    haptics.medium();

    showToast('Deleting all data...', 'warning', 1500);
    setTimeout(() => {
      clearResults();
      setSelectedImage(null);
      haptics.success();
      showToast('All data deleted', 'success');
    }, 300);
  };

  const handleInlineSignIn = async () => {
    if (!authEmail || !authPassword) {
      showToast('Please fill in email and password', 'warning');
      return;
    }
    try {
      await signIn(authEmail, authPassword);
      haptics.success();
      showToast('Signed in successfully!', 'success');
    } catch {
      haptics.error();
      showToast('Sign in failed. Please try again.', 'error');
    }
  };

  const handleInlineSignUp = async () => {
    if (!authName || !authEmail || !authPassword) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    if (authPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }
    try {
      await signUp(authName, authEmail, authPassword);
      haptics.success();
      showToast('Account created successfully!', 'success');
    } catch {
      haptics.error();
      showToast('Sign up failed. Please try again.', 'error');
    }
  };

  const handleOpenPrivacyPolicy = async () => {
    haptics.light();
    const privacyUrl = 'https://fashion-muse-studio-6377.taskade.app/privacy-policy';
    try {
      await WebBrowser.openBrowserAsync(privacyUrl);
    } catch (error) {
      showToast('Unable to open Privacy Policy', 'error');
    }
  };

  const handleOpenTerms = async () => {
    haptics.light();
    const termsUrl = 'https://fashion-muse-studio-6377.taskade.app/terms-of-service';
    try {
      await WebBrowser.openBrowserAsync(termsUrl);
    } catch (error) {
      showToast('Unable to open Terms of Service', 'error');
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-screen gradient background */}
      <LinearGradient
        colors={GRADIENTS.background as any}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: SPACING.lg
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
        <Text style={[glassStyles.titleText, styles.title]}>Settings</Text>

        {!user ? (
          <NeumorphicPanel style={styles.settingsPanel}>
            <View style={styles.panelContent}>
              <Text style={styles.sectionTitle}>Account</Text>

              <NeumorphicPanel style={styles.inputContainer}>
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
              </NeumorphicPanel>

              <NeumorphicPanel style={styles.inputContainer}>
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
              </NeumorphicPanel>

              <NeumorphicButton
                onPress={handleInlineSignIn}
                disabled={isLoading}
                title={isLoading ? 'Signing In...' : 'Sign In'}
                active={true}
                style={{ marginBottom: 12 }}
              />

              <NeumorphicPanel style={styles.inputContainer}>
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
              </NeumorphicPanel>

              <NeumorphicButton
                onPress={handleInlineSignUp}
                disabled={isLoading}
                title={isLoading ? 'Creating Account...' : 'Create Account'}
              />
            </View>
          </NeumorphicPanel>
        ) : (
          <>
            <NeumorphicPanel style={styles.creditsCard}>
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
                      haptics.light();
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
            </NeumorphicPanel>

            {user.isGuest && (
              <>
                <TrialProgressBar used={5 - user.credits} total={5} />
                <BenefitsList />
                <NeumorphicButton
                  onPress={() => router.push('/auth/login')}
                  title="Sign In to Get 50 Free Credits"
                  active={true}
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
                  haptics.light();
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });
                  if (!result.canceled && result.assets[0]) {
                    await updateProfile({ profileImage: result.assets[0].uri });
                    haptics.success();
                    showToast('Profile photo updated!', 'success');
                  }
                } catch {
                  haptics.error();
                  showToast('Failed to update profile photo', 'error');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.avatarBorder}>
                <View style={styles.avatarInner}>
                  {user.profileImage ? (
                    <Image
                      source={{ uri: user.profileImage }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <User size={42} color="#d8e9ff" strokeWidth={1.5} />
                  )}
                </View>
                <View style={styles.avatarCameraButton}>
                  <LinearGradient
                    colors={['rgba(160, 200, 255, 0.9)', 'rgba(140, 180, 240, 0.9)']}
                    style={styles.avatarCameraGradient}
                  />
                  <Camera size={14} color="#fff" strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <NeumorphicPanel style={styles.inputContainer}>
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
            </NeumorphicPanel>

            <NeumorphicPanel style={styles.inputContainer}>
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
            </NeumorphicPanel>
          </View>
        </View>
        )}

        {user && (
        <NeumorphicButton
          onPress={handleSaveProfile}
          title="Save Profile"
          active={true}
          style={styles.saveButton}
        />
        )}

        <NeumorphicPanel style={styles.settingsPanel}>
          <View style={styles.panelContent}>
            <Text style={styles.sectionTitle}>Preferences</Text>

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
        </NeumorphicPanel>

        <NeumorphicPanel style={styles.settingsPanel}>
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
                    haptics.light();
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
                        ? ['rgba(80, 120, 180, 0.25)', 'rgba(60, 100, 160, 0.15)']
                        : ['rgba(60, 100, 160, 0.12)', 'rgba(40, 80, 140, 0.08)']
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
                    haptics.light();
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
                        ? ['rgba(80, 120, 180, 0.25)', 'rgba(60, 100, 160, 0.15)']
                        : ['rgba(60, 100, 160, 0.12)', 'rgba(40, 80, 140, 0.08)']
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
                    haptics.light();
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
                        ? ['rgba(80, 120, 180, 0.25)', 'rgba(60, 100, 160, 0.15)']
                        : ['rgba(60, 100, 160, 0.12)', 'rgba(40, 80, 140, 0.08)']
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
        </NeumorphicPanel>

        <NeumorphicPanel style={styles.settingsPanel}>
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
        </NeumorphicPanel>

        <NeumorphicPanel style={styles.settingsPanel}>
          <View style={styles.panelContent}>
            <Text style={styles.sectionTitle}>Legal & Privacy</Text>

            <TouchableOpacity
              style={styles.legalRow}
              onPress={handleOpenPrivacyPolicy}
              activeOpacity={0.7}
              accessibilityLabel="Privacy Policy"
              accessibilityHint="Opens the privacy policy in your browser"
              accessibilityRole="link"
            >
              <View style={styles.legalLeft}>
                <View style={styles.iconWrapperLegal}>
                  <Shield size={20} color={Colors.dark.textSecondary} />
                </View>
                <Text style={styles.legalText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={Colors.dark.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.legalRow}
              onPress={handleOpenTerms}
              activeOpacity={0.7}
              accessibilityLabel="Terms of Service"
              accessibilityHint="Opens the terms of service in your browser"
              accessibilityRole="link"
            >
              <View style={styles.legalLeft}>
                <View style={styles.iconWrapperLegal}>
                  <FileText size={20} color={Colors.dark.textSecondary} />
                </View>
                <Text style={styles.legalText}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color={Colors.dark.textMuted} />
            </TouchableOpacity>
          </View>
        </NeumorphicPanel>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerSubtext}>Made by Ivan</Text>
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
    // Padding added via paddingTop, paddingBottom, paddingHorizontal in the component
  },
  title: {
    ...glassStyles.titleText,
    fontSize: 36,
    marginBottom: SPACING.xl,
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
    ...glassStyles.textSecondary,
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
    marginBottom: SPACING.sm,               // 12px between inputs
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
    padding: SPACING.xl,                    // 24px
  },
  sectionTitle: {
    ...glassStyles.textPrimary,
    marginBottom: SPACING.lg,               // 20px
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLabel: {
    ...glassStyles.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.divider,
    marginVertical: SPACING.md,             // 16px
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
    borderTopColor: 'rgba(160, 200, 255, 0.45)',
    borderLeftColor: 'rgba(160, 200, 255, 0.4)',
    borderRightColor: 'rgba(160, 200, 255, 0.3)',
    borderBottomColor: 'rgba(160, 200, 255, 0.25)',
    shadowColor: 'rgba(160, 200, 255, 0.5)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
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
    ...glassStyles.textPrimary,
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
    ...glassStyles.textPrimary,
    color: COLORS.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: 36,
    gap: 10,
  },
  footerText: {
    ...glassStyles.textSecondary,
    fontWeight: '500' as const,
  },
  footerSubtext: {
    ...glassStyles.textMuted,
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
    backgroundColor: 'rgba(160, 200, 255, 0.25)',
    borderRadius: 5,
    shadowColor: 'rgba(60, 100, 160, 0.5)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderTopColor: 'rgba(180, 210, 255, 0.4)',
    borderLeftColor: 'rgba(160, 200, 255, 0.35)',
    borderRightColor: 'rgba(120, 170, 230, 0.25)',
    borderBottomColor: 'rgba(100, 150, 210, 0.3)',
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
    borderTopColor: 'rgba(160, 200, 255, 0.35)',
    borderLeftColor: 'rgba(160, 200, 255, 0.3)',
    borderRightColor: 'rgba(160, 200, 255, 0.2)',
    borderBottomColor: 'rgba(160, 200, 255, 0.15)',
    overflow: 'hidden',
  },
  animatedCreditGradient: {
    position: 'absolute',
    inset: 0,
  },
  animatedCreditText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#a0c8ff',
  },
  animatedCreditTextWarning: {
    color: '#f5a064',
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
    backgroundColor: 'rgba(160, 200, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(160, 200, 255, 0.35)',
    borderLeftColor: 'rgba(160, 200, 255, 0.3)',
    borderRightColor: 'rgba(160, 200, 255, 0.2)',
    borderBottomColor: 'rgba(160, 200, 255, 0.15)',
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
    shadowColor: 'rgba(160, 200, 255, 0.6)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
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
  // Legal section styles
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapperLegal: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(200, 220, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(200, 220, 255, 0.3)',
    borderLeftColor: 'rgba(200, 220, 255, 0.25)',
    borderRightColor: 'rgba(200, 220, 255, 0.15)',
    borderBottomColor: 'rgba(200, 220, 255, 0.1)',
    shadowColor: 'rgba(200, 220, 255, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  legalText: {
    ...glassStyles.textPrimary,
  },
});
