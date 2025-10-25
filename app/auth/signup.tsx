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
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import GlowingButton from '@/components/GlowingButton';
import GlassPanel from '@/components/GlassPanel';
import GlassyTitle from '@/components/GlassyTitle';
import { COLORS, GRADIENTS, SPACING } from '@/constants/glassStyles';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      const msg = 'Please fill in all fields';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters';
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
      await signUp(name, email, password);
      // Navigation is handled automatically by auth state change
    } catch (error: any) {
      console.error('Sign up error:', error);
      const msg = error.message || 'Failed to create account';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Sign Up Failed', msg);
      }
    }
  };

  const handleLoginPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
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
            <GlassyTitle>Create Account</GlassyTitle>
            <Text style={styles.subtitle}>Start your creative journey</Text>
          </View>

          <View style={styles.form}>
            <GlassPanel style={styles.inputPanel} radius={20}>
              <View style={styles.inputRow}>
                <User size={20} color={COLORS.silverMid} style={styles.inputIcon} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.silverDark}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </GlassPanel>

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
                  placeholder="Password (min 6 characters)"
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
              onPress={handleSignUp}
              disabled={isLoading}
              text={isLoading ? 'Creating Account...' : 'Sign Up'}
              variant="primary"
              style={styles.signUpButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity onPress={handleLoginPress} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                Already have an account? <Text style={styles.loginButtonTextBold}>Sign In</Text>
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
  signUpButton: {
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
  loginButton: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 15,
    color: COLORS.silverMid,
    fontWeight: '500',
  },
  loginButtonTextBold: {
    fontWeight: '700',
    color: COLORS.silverLight,
  },
});
