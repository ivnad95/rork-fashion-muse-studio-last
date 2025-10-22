import React, { useState } from 'react';
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
import { User, Mail, Trash2, LogOut, CreditCard, ChevronRight, Lock, Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useGeneration } from '@/contexts/GenerationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import GlowingButton from '@/components/GlowingButton';
import GlassyTitle from '@/components/GlassyTitle';

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

  React.useEffect(() => {
    Animated.spring(translateAnim, {
      toValue: enabled ? 1 : 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [enabled, translateAnim]);

  return (
    <TouchableOpacity
      onPress={onChange}
      style={[styles.toggle, enabled && styles.toggleActive]}
      activeOpacity={0.9}
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
    >
      <LinearGradient
        colors={
          enabled
            ? ['#4a7ed6', '#6ba0ff', '#8ec5ff', '#6ba0ff']
            : ['rgba(220, 235, 255, 0.08)', 'rgba(220, 235, 255, 0.04)']
        }
        style={styles.toggleBackground}
      />
      <Animated.View
        style={[
          styles.toggleThumb,
          {
            transform: [
              {
                translateX: translateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 40],
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
                'rgba(107, 160, 255, 0.4)',
                'rgba(74, 126, 214, 0.6)',
                'rgba(107, 160, 255, 0.4)',
              ]}
              style={styles.thumbGlowGradient}
            />
          </View>
        )}
        <View style={styles.thumbInner} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { clearResults, setSelectedImage } = useGeneration();
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
        colors={['#050b16', '#0a1428', '#11213f', '#1a2f58']}
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
          <PremiumLiquidGlass style={styles.creditsCard} variant="primary" borderRadius={20}>
            <LinearGradient
              colors={['rgba(107, 160, 255, 0.18)', 'rgba(74, 126, 214, 0.12)']}
              style={styles.creditsContent}
            >
              <View style={styles.creditsInfo}>
                <Text style={styles.creditsLabel}>Available Credits</Text>
                <Text style={styles.creditsValue}>{user.credits}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  router.push('/plans');
                }}
                style={styles.buyButton}
              >
                <CreditCard size={18} color={Colors.dark.primaryLight} />
                <Text style={styles.buyButtonText}>Buy More</Text>
                <ChevronRight size={18} color={Colors.dark.primaryLight} />
              </TouchableOpacity>
            </LinearGradient>
          </PremiumLiquidGlass>
        )}

        {user && (
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#335ba8', '#4a7ed6', '#6ba0ff', '#4a7ed6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarBorder}
            >
              <View style={styles.avatarInner}>
                <User size={42} color={Colors.dark.primaryLight} strokeWidth={1.5} />
              </View>
            </LinearGradient>
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

            <SettingsRow label="Dark Mode">
              <ToggleSwitch enabled={darkMode} onChange={toggleDarkMode} label="Toggle dark mode" />
            </SettingsRow>

            <View style={styles.divider} />

            <SettingsRow label="Reduce Motion">
              <ToggleSwitch
                enabled={reduceMotion}
                onChange={toggleReduceMotion}
                label="Toggle reduce motion"
              />
            </SettingsRow>

            <View style={styles.divider} />

            <SettingsRow label="Notifications">
              <ToggleSwitch
                enabled={notifications}
                onChange={toggleNotifications}
                label="Toggle notifications"
              />
            </SettingsRow>

            <View style={styles.divider} />

            <SettingsRow label="Cloud Storage">
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
  },
  creditsContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(107, 160, 255, 0.18)',
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.primaryLight,
  },
  profileSection: {
    marginBottom: 26,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  avatarBorder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 4,
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 28,
    elevation: 15,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: Colors.dark.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    gap: 12,
  },
  inputContainer: {
    minHeight: 54,
    shadowColor: Colors.dark.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    marginBottom: 16,
  },
  panelContent: {
    padding: 20,
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
    width: 76,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: Colors.dark.glassBorder,
    backgroundColor: 'rgba(220, 235, 255, 0.05)',
  },
  toggleActive: {
    borderColor: Colors.dark.primaryLight,
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 24,
    elevation: 12,
  },
  toggleBackground: {
    position: 'absolute',
    inset: 0,
  },
  toggleThumb: {
    position: 'absolute',
    top: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  thumbGlow: {
    position: 'absolute',
    inset: -5,
    borderRadius: 22,
    overflow: 'hidden',
  },
  thumbGlowGradient: {
    flex: 1,
  },
  thumbInner: {
    flex: 1,
    backgroundColor: Colors.dark.silverLight,
    borderRadius: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(107, 160, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 160, 255, 0.4)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.dark.primaryLight,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
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
});
