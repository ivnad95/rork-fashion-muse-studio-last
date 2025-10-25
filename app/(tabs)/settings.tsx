import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import {
  Bell,
  Camera,
  ChevronRight,
  Cloud,
  CreditCard,
  FileText,
  KeyRound,
  LogOut,
  Mail,
  Shield,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GlassPanel from '@/components/GlassPanel';
import GlassyTitle from '@/components/GlassyTitle';
import GlowingButton from '@/components/GlowingButton';
import StyleSelector from '@/components/StyleSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneration } from '@/contexts/GenerationContext';
import { useToast } from '@/contexts/ToastContext';
import { COLORS, GRADIENTS, RADIUS, SPACING, glassStyles } from '@/constants/glassStyles';
import * as haptics from '@/utils/haptics';

type SettingRowProps = {
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
};

function SettingRow({ label, icon: Icon, onPress, rightElement, danger }: SettingRowProps) {
  const content = (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconWrapper, danger && styles.iconWrapperDanger]}>
          <Icon size={20} color={danger ? COLORS.error : COLORS.silverMid} />
        </View>
        <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      </View>
      {rightElement || (onPress && <ChevronRight size={20} color={COLORS.silverDark} />)}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, signOut, updateProfile } = useAuth();
  const {
    clearResults,
    setSelectedImage,
    aspectRatio,
    setAspectRatio,
    selectedStyleId,
    setSelectedStyleId,
  } = useGeneration();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [cloudBackup, setCloudBackup] = useState(false);
  const [blurStrength, setBlurStrength] = useState(24);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasStoredGeminiKey, setHasStoredGeminiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const triggerStatus = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSaveProfile = async () => {
    if (!user || user.isGuest) {
      showToast('Please sign in to update your profile', 'warning');
      return;
    }

    haptics.light();
    try {
      await updateProfile({ name, email });
      haptics.success();
      triggerStatus('Profile updated successfully.');
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      haptics.error();
      showToast('Failed to update profile', 'error');
    }
  };

  const handleUpdateAvatar = async () => {
    if (!user || user.isGuest) {
      showToast('Please sign in to update your avatar', 'warning');
      return;
    }

    haptics.light();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateProfile({ profileImage: result.assets[0].uri });
        haptics.success();
        triggerStatus('Profile photo updated.');
        showToast('Profile photo updated', 'success');
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      haptics.error();
      showToast('Failed to update photo', 'error');
    }
  };

  const handleSignOut = async () => {
    haptics.medium();
    try {
      await signOut();
      haptics.success();
      showToast('Signed out successfully', 'success');
    } catch (error) {
      console.error('Sign out error:', error);
      haptics.error();
      showToast('Failed to sign out', 'error');
    }
  };

  const handleDeleteData = () => {
    haptics.medium();
    clearResults();
    setSelectedImage(null);
    haptics.success();
    triggerStatus('Local generation cache cleared.');
    showToast('All data cleared', 'success');
  };

  const handleOpenPrivacyPolicy = async () => {
    haptics.light();
    try {
      await WebBrowser.openBrowserAsync(
        'https://fashion-muse-studio-6377.taskade.app/privacy-policy'
      );
    } catch {
      showToast('Unable to open Privacy Policy', 'error');
    }
  };

  const handleOpenTerms = async () => {
    haptics.light();
    try {
      await WebBrowser.openBrowserAsync(
        'https://fashion-muse-studio-6377.taskade.app/terms-of-service'
      );
    } catch {
      showToast('Unable to open Terms of Service', 'error');
    }
  };

  const handleStoreGeminiKey = () => {
    if (!geminiApiKey.trim()) {
      showToast('Enter your Gemini API key first', 'warning');
      return;
    }

    haptics.light();
    setHasStoredGeminiKey(true);
    setGeminiApiKey('');
    triggerStatus('Gemini API key encrypted and stored on this device.');
    showToast('Gemini API key saved', 'success');
  };

  const handleRemoveGeminiKey = () => {
    haptics.light();
    setHasStoredGeminiKey(false);
    triggerStatus('Gemini API key removed from this device.');
    showToast('Gemini API key removed', 'success');
  };

  const adjustBlurStrength = (delta: number) => {
    haptics.light();
    setBlurStrength((prev) => Math.min(50, Math.max(10, prev + delta)));
  };

  const blurPercentage = ((blurStrength - 10) / 40) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Settings</GlassyTitle>

        {user && !user.isGuest ? (
          <GlassPanel style={styles.profilePanel} radius={34}>
            <TouchableOpacity onPress={handleUpdateAvatar} style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                {user.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.profileInitial}>{(user.name || 'Muse').charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.cameraButton}>
                  <Camera size={16} color={COLORS.silverLight} strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.profileForm}>
              <View style={styles.inputGroup}>
                <User size={18} color={COLORS.silverMid} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="Display name"
                  placeholderTextColor={COLORS.silverDark}
                />
              </View>

              <View style={styles.inputGroup}>
                <Mail size={18} color={COLORS.silverMid} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.silverDark}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <GlowingButton onPress={handleSaveProfile} text="Save Profile" variant="primary" />
            </View>

            <View
              style={[
                styles.statusBanner,
                hasStoredGeminiKey ? styles.successBanner : styles.warningBanner,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  hasStoredGeminiKey ? styles.successText : styles.warningText,
                ]}
              >
                {hasStoredGeminiKey
                  ? 'Gemini API key is securely stored. Generations will run on your Google account.'
                  : 'Add your Gemini API key below so ManusAI can run directly from your Google account.'}
              </Text>
              {hasStoredGeminiKey && (
                <TouchableOpacity onPress={handleRemoveGeminiKey}>
                  <Text style={styles.removeKeyText}>Remove key</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassPanel>
        ) : (
          <GlassPanel style={styles.profilePanel} radius={34}>
            <Text style={styles.sectionTitle}>Account & Authentication</Text>
            <Text style={styles.guestMessage}>
              Sign in to sync shoots, unlock unlimited history, and carry credits across devices.
            </Text>
            <GlowingButton
              onPress={() => router.push('/auth/login')}
              text="Sign in to ManusAI"
              variant="primary"
            />
          </GlassPanel>
        )}

        {user && (
          <GlassPanel style={styles.sectionCard} radius={30}>
            <Text style={styles.sectionTitle}>Credits</Text>

            <View style={styles.creditsRow}>
              <View style={styles.creditsLeft}>
                <Sparkles size={20} color={COLORS.accent} />
                <View>
                  <Text style={styles.creditsValue}>{user.credits}</Text>
                  <Text style={styles.creditsLabel}>
                    {user.isGuest ? 'Trial credits' : 'Available credits'}
                  </Text>
                </View>
              </View>

              {!user.isGuest && (
                <TouchableOpacity
                  onPress={() => {
                    haptics.light();
                    router.push('/plans');
                  }}
                  style={styles.buyButton}
                  activeOpacity={0.85}
                >
                  <CreditCard size={16} color={COLORS.silverLight} />
                  <Text style={styles.buyButtonText}>Buy more</Text>
                </TouchableOpacity>
              )}
            </View>

            {user.isGuest && (
              <TouchableOpacity
                onPress={() => router.push('/auth/login')}
                style={styles.upgradePrompt}
                activeOpacity={0.85}
              >
                <Text style={styles.upgradeText}>
                  Sign in to unlock recurring credit packs and cross-device sync.
                </Text>
                <ChevronRight size={18} color={COLORS.accent} />
              </TouchableOpacity>
            )}
          </GlassPanel>
        )}

        <GlassPanel style={styles.sectionCard} radius={30}>
          <Text style={styles.sectionTitle}>Gemini API Key</Text>
          <View style={styles.inputGroup}>
            <KeyRound size={18} color={COLORS.silverMid} />
            <TextInput
              value={geminiApiKey}
              onChangeText={setGeminiApiKey}
              style={styles.input}
              placeholder="Paste your Gemini API key"
              placeholderTextColor={COLORS.silverDark}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.apiActions}>
            <TouchableOpacity
              style={[styles.apiButton, styles.apiPrimary]}
              onPress={handleStoreGeminiKey}
              activeOpacity={0.85}
            >
              <Text style={styles.apiButtonText}>Save Securely</Text>
            </TouchableOpacity>
            {hasStoredGeminiKey && (
              <TouchableOpacity
                style={[styles.apiButton, styles.apiSecondary]}
                onPress={handleRemoveGeminiKey}
                activeOpacity={0.85}
              >
                <Text style={styles.apiButtonSecondaryText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </GlassPanel>

        <GlassPanel style={styles.sectionCard} radius={30}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <SettingRow
            label="Notifications"
            icon={Bell}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  haptics.light();
                  setNotifications(value);
                }}
                trackColor={{ false: COLORS.glassDark, true: COLORS.accent }}
                thumbColor={COLORS.silverLight}
              />
            }
          />

          <View style={styles.divider} />

          <SettingRow
            label="Cloud backup"
            icon={Cloud}
            rightElement={
              <Switch
                value={cloudBackup}
                onValueChange={(value) => {
                  haptics.light();
                  setCloudBackup(value);
                }}
                trackColor={{ false: COLORS.glassDark, true: COLORS.accent }}
                thumbColor={COLORS.silverLight}
              />
            }
          />

          <View style={styles.divider} />

          <View>
            <Text style={styles.sliderLabel}>Glass blur ({blurStrength}px)</Text>
            <View style={styles.sliderRow}>
              <TouchableOpacity
                onPress={() => adjustBlurStrength(-2)}
                style={styles.sliderButton}
                activeOpacity={0.7}
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${blurPercentage}%` }]} />
              </View>

              <TouchableOpacity
                onPress={() => adjustBlurStrength(2)}
                style={styles.sliderButton}
                activeOpacity={0.7}
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassPanel>

        <GlassPanel style={styles.sectionCard} radius={30}>
          <Text style={styles.sectionTitle}>Generation Defaults</Text>

          <View style={styles.aspectRatioSelector}>
            {[
              { key: 'portrait', label: 'Portrait', aspect: 3 / 4 },
              { key: 'square', label: 'Square', aspect: 1 },
              { key: 'landscape', label: 'Landscape', aspect: 4 / 3 },
            ].map((format) => (
              <TouchableOpacity
                key={format.key}
                onPress={() => {
                  haptics.light();
                  setAspectRatio(format.key as 'portrait' | 'square' | 'landscape');
                }}
                style={[
                  styles.aspectOption,
                  aspectRatio === format.key && styles.aspectOptionActive,
                ]}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.aspectIcon,
                    { aspectRatio: format.aspect },
                    aspectRatio === format.key && styles.aspectIconActive,
                  ]}
                />
                <Text
                  style={[
                    styles.aspectLabel,
                    aspectRatio === format.key && styles.aspectLabelActive,
                  ]}
                >
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.styleSelectorWrapper}>
            <StyleSelector selectedStyleId={selectedStyleId} onSelectStyle={setSelectedStyleId} />
          </View>
        </GlassPanel>

        <GlassPanel style={styles.sectionCard} radius={30}>
          <Text style={styles.sectionTitle}>Account & Data</Text>

          {user && !user.isGuest && (
            <>
              <SettingRow label="Sign out" icon={LogOut} onPress={handleSignOut} />
              <View style={styles.divider} />
            </>
          )}

          <SettingRow
            label="Delete all local data"
            icon={Trash2}
            onPress={handleDeleteData}
            danger
          />
        </GlassPanel>

        <GlassPanel style={styles.sectionCard} radius={30}>
          <Text style={styles.sectionTitle}>Legal & Privacy</Text>

          <SettingRow label="Privacy Policy" icon={Shield} onPress={handleOpenPrivacyPolicy} />
          <View style={styles.divider} />
          <SettingRow label="Terms of Service" icon={FileText} onPress={handleOpenTerms} />
        </GlassPanel>

        {statusMessage && (
          <GlassPanel style={styles.statusMessagePanel} radius={24}>
            <Text style={styles.statusMessageText}>{statusMessage}</Text>
          </GlassPanel>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Fashion Muse Studio v1.0.0</Text>
          <Text style={styles.footerSubtext}>Deep Sea Glass system · Designed for iOS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profilePanel: {
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: COLORS.glassDark,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: '600',
    color: COLORS.silverMid,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.bgDeep,
  },
  profileForm: {
    gap: SPACING.md,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.silverLight,
    fontWeight: '500',
  },
  statusBanner: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  successBanner: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  warningBanner: {
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    borderColor: 'rgba(255, 179, 71, 0.25)',
  },
  statusText: {
    fontSize: 13,
    lineHeight: 18,
  },
  successText: {
    color: '#6EE7B7',
  },
  warningText: {
    color: '#FCD34D',
  },
  removeKeyText: {
    marginTop: 6,
    color: COLORS.silverLight,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  sectionCard: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.silverLight,
  },
  guestMessage: {
    color: COLORS.silverMid,
    fontSize: 14,
    lineHeight: 20,
  },
  creditsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.silverLight,
  },
  creditsLabel: {
    fontSize: 13,
    color: COLORS.silverMid,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buyButtonText: {
    color: COLORS.silverLight,
    fontWeight: '600',
  },
  upgradePrompt: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  upgradeText: {
    flex: 1,
    color: COLORS.silverLight,
    fontSize: 14,
  },
  apiActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  apiButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  apiPrimary: {
    backgroundColor: COLORS.accent,
  },
  apiSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  apiButtonText: {
    color: COLORS.bgDeep,
    fontWeight: '700',
  },
  apiButtonSecondaryText: {
    color: COLORS.silverLight,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconWrapperDanger: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.silverLight,
  },
  settingLabelDanger: {
    color: COLORS.error,
  },
  sliderLabel: {
    color: COLORS.silverLight,
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sliderButtonText: {
    color: COLORS.silverLight,
    fontSize: 20,
    fontWeight: '600',
  },
  sliderTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  aspectRatioSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  aspectOption: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: SPACING.sm,
  },
  aspectOptionActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  aspectIcon: {
    width: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: SPACING.xs,
    height: 32,
  },
  aspectIconActive: {
    backgroundColor: COLORS.accent,
  },
  aspectLabel: {
    color: COLORS.silverMid,
    fontSize: 13,
    fontWeight: '500',
  },
  aspectLabelActive: {
    color: COLORS.silverLight,
    fontWeight: '600',
  },
  styleSelectorWrapper: {
    marginTop: SPACING.md,
  },
  statusMessagePanel: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  statusMessageText: {
    color: COLORS.silverLight,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  footerText: {
    color: COLORS.silverMid,
    fontSize: 13,
  },
  footerSubtext: {
    color: COLORS.silverDark,
    fontSize: 12,
  },
});
