import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { X, Check, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import PremiumLiquidGlass from '@/components/PremiumLiquidGlass';
import GlowingButton from '@/components/GlowingButton';

interface Plan {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 4.99,
    features: ['10 Image Generations', 'HD Quality', 'Basic Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    price: 19.99,
    popular: true,
    features: ['50 Image Generations', '4K Quality', 'Priority Support', 'Fast Processing'],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    credits: 150,
    price: 49.99,
    features: [
      '150 Image Generations',
      '8K Quality',
      'VIP Support',
      'Instant Processing',
      'Exclusive Poses',
    ],
  },
];

export default function PlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateCredits } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const handlePurchase = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const plan = PLANS.find((p) => p.id === selectedPlan);
    if (plan) {
      updateCredits(plan.credits);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030711', '#060d1f', '#0d1736', '#121f4a']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <X size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#2a4d8c', '#3d6bb8', '#5a8fd6']}
              style={styles.iconGradient}
            >
              <Sparkles size={32} color={Colors.dark.text} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock unlimited creativity with credits
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSelectedPlan(plan.id);
              }}
              style={styles.planWrapper}
            >
              <PremiumLiquidGlass
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                variant={selectedPlan === plan.id ? 'primary' : 'elevated'}
                borderRadius={24}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <LinearGradient
                      colors={['#2a4d8c', '#3d6bb8', '#5a8fd6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.popularGradient}
                    >
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </LinearGradient>
                  </View>
                )}

                <View style={styles.planContent}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.checkContainer}>
                      {selectedPlan === plan.id && (
                        <View style={styles.checkCircle}>
                          <LinearGradient
                            colors={['#2a4d8c', '#3d6bb8', '#5a8fd6']}
                            style={styles.checkGradient}
                          >
                            <Check size={16} color={Colors.dark.text} strokeWidth={3} />
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${plan.price}</Text>
                    <Text style={styles.credits}>{plan.credits} Credits</Text>
                  </View>

                  <View style={styles.features}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </PremiumLiquidGlass>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(3, 7, 17, 0)',
            'rgba(6, 13, 31, 0.95)',
            'rgba(6, 13, 31, 1)',
          ]}
          locations={[0, 0.3, 1]}
          style={styles.footerGradient}
        />
        <GlowingButton
          onPress={handlePurchase}
          text="Purchase Credits"
          variant="primary"
          style={styles.purchaseButton}
        />
      </View>
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
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundElevated,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  plansContainer: {
    gap: 16,
  },
  planWrapper: {
    marginBottom: 4,
  },
  planCard: {
    minHeight: 200,
    position: 'relative',
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: Colors.dark.primaryLight,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
  },
  popularGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  planContent: {
    padding: 24,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  checkContainer: {
    width: 28,
    height: 28,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  checkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1,
  },
  credits: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.primaryLight,
    marginTop: 4,
  },
  features: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.primaryLight,
  },
  featureText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  footerGradient: {
    position: 'absolute',
    inset: 0,
  },
  purchaseButton: {
    zIndex: 10,
  },
});
