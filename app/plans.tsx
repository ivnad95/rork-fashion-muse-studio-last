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
        colors={Colors.dark.backgroundGradient as unknown as [string, string, string, string]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 100 },
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
          <PremiumLiquidGlass
            style={styles.iconContainer}
            variant="primary"
            borderRadius={36}
          >
            <View style={styles.iconContent}>
              <Sparkles size={32} color={Colors.dark.text} strokeWidth={2} />
            </View>
          </PremiumLiquidGlass>
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
                ]}
                variant={selectedPlan === plan.id ? 'luxury' : 'elevated'}
                colorTint={selectedPlan === plan.id ? 'blue' : 'none'}
                borderRadius={28}
              >
                {plan.popular && (
                  <PremiumLiquidGlass
                    style={styles.popularBadge}
                    variant="accent"
                    colorTint="purple"
                    borderRadius={16}
                  >
                    <View style={styles.popularContent}>
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  </PremiumLiquidGlass>
                )}

                <View style={styles.planContent}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {selectedPlan === plan.id && (
                      <PremiumLiquidGlass
                        style={styles.checkContainer}
                        variant="primary"
                        borderRadius={14}
                      >
                        <View style={styles.checkContent}>
                          <Check size={16} color={Colors.dark.text} strokeWidth={3} />
                        </View>
                      </PremiumLiquidGlass>
                    )}
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${plan.price}</Text>
                    <Text style={styles.credits}>{plan.credits} Credits</Text>
                  </View>

                  <View style={styles.featuresSection}>
                    <View style={styles.featuresDivider} />
                    <View style={styles.features}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <View style={styles.featureDot} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
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
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    marginBottom: 24,
  },
  iconContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  plansContainer: {
    gap: 24,
    marginBottom: 32,
  },
  planWrapper: {
    marginBottom: 0,
  },
  planCard: {
    minHeight: 200,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  popularContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  planContent: {
    padding: 28,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  checkContainer: {
    width: 28,
    height: 28,
  },
  checkContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  credits: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.primaryLight,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  featuresSection: {
    gap: 16,
  },
  featuresDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.dark.primaryLight,
    shadowColor: Colors.dark.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  footerGradient: {
    position: 'absolute',
    inset: 0,
  },
  purchaseButton: {
    zIndex: 10,
  },
});
