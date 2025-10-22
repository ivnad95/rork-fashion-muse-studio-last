import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PremiumLiquidGlass from './PremiumLiquidGlass';
import GlowingButton from './GlowingButton';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]}
            locations={[0, 0.35, 0.7, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.08)']}
                style={styles.iconGradient}
              >
                <AlertTriangle size={48} color={Colors.dark.error} strokeWidth={1.5} />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Something Went Wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>

            {__DEV__ && this.state.error && (
              <PremiumLiquidGlass style={styles.errorCard} borderRadius={16}>
                <View style={styles.errorContent}>
                  <Text style={styles.errorTitle}>Error Details:</Text>
                  <Text style={styles.errorText} numberOfLines={10}>
                    {this.state.error.toString()}
                  </Text>
                </View>
              </PremiumLiquidGlass>
            )}

            <GlowingButton
              onPress={this.handleReset}
              text="Try Again"
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundDeep,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 24,
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  errorCard: {
    width: '100%',
    marginBottom: 24,
    maxHeight: 200,
  },
  errorContent: {
    padding: 16,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  button: {
    width: '100%',
  },
});
