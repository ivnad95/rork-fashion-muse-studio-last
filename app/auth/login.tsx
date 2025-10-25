import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import GlowingButton from '@/components/GlowingButton';
import GlassPanel from '@/components/GlassPanel';
import GlassyTitle from '@/components/GlassyTitle';
import { COLORS, GRADIENTS, SPACING } from '@/constants/glassStyles';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      const msg = 'Please fill in all fields';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      await signIn(email, password);
      // Navigation is handled automatically by auth state change
    } catch (error: any) {
      console.error('Sign in error:', error);
      const msg = error.message || 'Failed to sign in';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Sign In Failed', msg);
      }
    }
  };

  const handleSignUpPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <GlassyTitle>Welcome Back</GlassyTitle>
            <Text style={styles.subtitle}>Sign in to continue creating</Text>
          </View>

          <View style={styles.form}>
            <GlassPanel style={styles.inputPanel} radius={20}>
              <View style={styles.inputRow}>
                <Mail size={20} color={COLORS.silverMid} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.silverDark}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </GlassPanel>

            <GlassPanel style={styles.inputPanel} radius={20}>
              <View style={styles.inputRow}>
                <Lock size={20} color={COLORS.silverMid} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.silverDark}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLORS.silverMid} />
                  ) : (
                    <Eye size={20} color={COLORS.silverMid} />
                  )}
                </TouchableOpacity>
              </View>
            </GlassPanel>

            <GlowingButton
              onPress={handleLogin}
              disabled={isLoading}
              text={isLoading ? 'Signing In...' : 'Sign In'}
              variant="primary"
              style={styles.signInButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity onPress={handleSignUpPress} style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>
                {"Don't have an account? "}
                <Text style={styles.signUpButtonTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.silverMid,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  form: {
    gap: SPACING.lg,
  },
  inputPanel: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.silverLight,
    fontWeight: '500',
  },
  eyeButton: {
    padding: SPACING.xs,
  },
  signInButton: {
    marginTop: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    marginHorizontal: SPACING.lg,
    fontSize: 14,
    color: COLORS.silverDark,
    fontWeight: '500',
  },
  signUpButton: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 15,
    color: COLORS.silverMid,
    fontWeight: '500',
  },
  signUpButtonTextBold: {
    fontWeight: '700',
    color: COLORS.silverLight,
  },
});
