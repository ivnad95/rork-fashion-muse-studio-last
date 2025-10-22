import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import GlowingButton from '@/components/GlowingButton';
import GlassyTitle from '@/components/GlassyTitle';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['rgba(200, 220, 255, 0.3)', 'rgba(150, 180, 230, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <View style={styles.iconInner}>
                <Sparkles size={36} color="rgba(200, 220, 255, 0.95)" strokeWidth={2} />
              </View>
            </LinearGradient>
          </View>
          <GlassyTitle>
            <Text>Welcome Back</Text>
          </GlassyTitle>
          <Text style={styles.subtitle}>Sign in to continue creating</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.inputGradient}
            >
              <View style={styles.inputInner}>
                <Mail size={20} color="rgba(200, 220, 255, 0.7)" style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(200, 220, 255, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.inputGradient}
            >
              <View style={styles.inputInner}>
                <Lock size={20} color="rgba(200, 220, 255, 0.7)" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(200, 220, 255, 0.4)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="rgba(200, 220, 255, 0.7)" />
                  ) : (
                    <Eye size={20} color="rgba(200, 220, 255, 0.7)" />
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

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
              Don't have an account? <Text style={styles.signUpButtonTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    shadowColor: 'rgba(200, 220, 255, 0.5)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 32,
    elevation: 20,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftColor: 'rgba(255, 255, 255, 0.38)',
    borderRightColor: 'rgba(255, 255, 255, 0.22)',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconInner: {
    flex: 1,
    backgroundColor: 'rgba(15, 20, 30, 0.6)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(200, 220, 255, 0.7)',
    textAlign: 'center',
    marginTop: 12,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    minHeight: 60,
  },
  inputGradient: {
    borderRadius: 20,
    padding: 2.5,
    shadowColor: 'rgba(200, 220, 255, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.25)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 18, 28, 0.6)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(255, 255, 255, 0.04)',
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  signInButton: {
    marginTop: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200, 220, 255, 0.15)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: 'rgba(200, 220, 255, 0.5)',
    fontWeight: '500',
  },
  signUpButton: {
    padding: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 15,
    color: 'rgba(200, 220, 255, 0.7)',
    fontWeight: '500',
  },
  signUpButtonTextBold: {
    fontWeight: '700',
    color: 'rgba(200, 220, 255, 0.95)',
  },
});
