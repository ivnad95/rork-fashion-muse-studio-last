import React, { useState } from 'react';
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
  Image as ImageIcon,
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
import { COLORS, GRADIENTS, SPACING, glassStyles } from '@/constants/glassStyles';
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
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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
  const [cloudStorage, setCloudStorage] = useState(false);

  const handleSaveProfile = async () => {
    if (!user || user.isGuest) {
      showToast('Please sign in to update your profile', 'warning');
      return;
    }

    haptics.light();
    try {
      await updateProfile({ name, email });
      haptics.success();
      showToast('Profile updated successfully', 'success');
    } catch (error) {
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
        showToast('Profile photo updated', 'success');
      }
    } catch (error) {
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
      haptics.error();
      showToast('Failed to sign out', 'error');
    }
  };

  const handleDeleteData = () => {
    haptics.medium();
    clearResults();
    setSelectedImage(null);
    haptics.success();
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Settings</GlassyTitle>

        {user && !user.isGuest && (
          <GlassPanel style={styles.profileCard} radius={28}>
            <TouchableOpacity onPress={handleUpdateAvatar} style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                {user.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={48} color={COLORS.silverMid} strokeWidth={1.5} />
                  </View>
                )}
                <View style={styles.cameraButton}>
                  <Camera size={16} color={COLORS.silverLight} strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.profileInputs}>
              <View style={styles.inputGroup}>
                <View style={styles.inputIconWrapper}>
                  <User size={18} color={COLORS.silverMid} />
                </View>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor={COLORS.silverDark}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIconWrapper}>
                  <Mail size={18} color={COLORS.silverMid} />
                </View>
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
            </View>

            <GlowingButton onPress={handleSaveProfile} text="Save Profile" variant="primary" />
          </GlassPanel>
        )}

        {user && (
          <GlassPanel style={styles.section} radius={28}>
            <Text style={styles.sectionTitle}>Credits</Text>

            <View style={styles.creditsRow}>
              <View style={styles.creditsLeft}>
                <Sparkles size={20} color={COLORS.accent} />
                <View>
                  <Text style={styles.creditsValue}>{user.credits}</Text>
                  <Text style={styles.creditsLabel}>
                    {user.isGuest ? 'Trial credits' : 'Available'}
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
                  <CreditCard size={18} color={COLORS.silverLight} />
                  <Text style={styles.buyButtonText}>Buy More</Text>
                </TouchableOpacity>
              )}
            </View>

            {user.isGuest && (
              <TouchableOpacity
                onPress={() => router.push('/auth/login')}
                style={styles.upgradePrompt}
                activeOpacity={0.9}
              >
                <Text style={styles.upgradeText}>
                  Sign in to get 50 free credits and unlock all features
                </Text>
                <ChevronRight size={18} color={COLORS.accent} />
              </TouchableOpacity>
            )}
          </GlassPanel>
        )}

        {!user && (
          <GlassPanel style={styles.section} radius={28}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Text style={styles.guestMessage}>
              Sign in to sync your work across devices and unlock premium features.
            </Text>
            <GlowingButton
              onPress={() => router.push('/auth/login')}
              text="Sign In"
              variant="primary"
            />
          </GlassPanel>
        )}

        <GlassPanel style={styles.section} radius={28}>
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
            label="Cloud Storage"
            icon={Cloud}
            rightElement={
              <Switch
                value={cloudStorage}
                onValueChange={(value) => {
                  haptics.light();
                  setCloudStorage(value);
                }}
                trackColor={{ false: COLORS.glassDark, true: COLORS.accent }}
                thumbColor={COLORS.silverLight}
              />
            }
          />
        </GlassPanel>

        <GlassPanel style={styles.section} radius={28}>
          <Text style={styles.sectionTitle}>Image Generation</Text>

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
                activeOpacity={0.8}
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
        </GlassPanel>

        <GlassPanel style={styles.section} radius={28}>
          <Text style={styles.sectionTitle}>Default Style</Text>
          <StyleSelector selectedStyleId={selectedStyleId} onSelectStyle={setSelectedStyleId} />
        </GlassPanel>

        <GlassPanel style={styles.section} radius={28}>
          <Text style={styles.sectionTitle}>Account</Text>

          {user && !user.isGuest && (
            <>
              <SettingRow label="Sign Out" icon={LogOut} onPress={handleSignOut} />
              <View style={styles.divider} />
            </>
          )}

          <SettingRow
            label="Delete All Data"
            icon={Trash2}
            onPress={handleDeleteData}
            danger
          />
        </GlassPanel>

        <GlassPanel style={styles.section} radius={28}>
          <Text style={styles.sectionTitle}>Legal & Privacy</Text>

          <SettingRow label="Privacy Policy" icon={Shield} onPress={handleOpenPrivacyPolicy} />

          <View style={styles.divider} />

          <SettingRow label="Terms of Service" icon={FileText} onPress={handleOpenTerms} />
        </GlassPanel>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Fashion Muse Studio v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ✨ by Ivan</Text>
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
  profileCard: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatarContainer: {
    marginTop: SPACING.sm,
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
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.bgDeep,
  },
  profileInputs: {
    width: '100%',
    gap: SPACING.md,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: SPACING.sm,
  },
  inputIconWrapper: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.silverLight,
    fontWeight: '500',
  },
  section: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.silverLight,
    marginBottom: SPACING.xs,
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
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.silverLight,
  },
  creditsLabel: {
    fontSize: 13,
    color: COLORS.silverMid,
    marginTop: 2,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.silverLight,
  },
  upgradePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: 'rgba(100, 170, 255, 0.1)',
    borderRadius: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(100, 170, 255, 0.2)',
    gap: SPACING.sm,
  },
  upgradeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.silverLight,
    lineHeight: 20,
  },
  guestMessage: {
    fontSize: 14,
    color: COLORS.silverMid,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: SPACING.xs,
  },
  aspectRatioSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  aspectOption: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: SPACING.sm,
  },
  aspectOptionActive: {
    backgroundColor: 'rgba(100, 170, 255, 0.15)',
    borderColor: COLORS.accent,
  },
  aspectIcon: {
    width: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SPACING.xs,
  },
  aspectIconActive: {
    backgroundColor: COLORS.accent,
  },
  aspectLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.silverMid,
  },
  aspectLabelActive: {
    color: COLORS.silverLight,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.silverMid,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.silverDark,
  },
});
