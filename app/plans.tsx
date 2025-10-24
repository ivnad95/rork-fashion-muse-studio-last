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
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
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
      {/* Deep Sea Glass 4-stop gradient background */}
      <LinearGradient
        colors={[COLORS.bgDeepest, COLORS.bgDeep, COLORS.bgMid, COLORS.bgLight]}
        locations={[0, 0.35, 0.70, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: SPACING.lg  // 20px floating margins
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <X size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <PremiumLiquidGlass
            style={styles.iconContainer}
            variant="primary"
            borderRadius={36}
          >
            <View style={styles.iconContent}>
              <Sparkles size={32} color={COLORS.textPrimary} strokeWidth={2} />
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
                style={styles.planCard}
                variant={selectedPlan === plan.id ? 'primary' : 'default'}
                borderRadius={28}
              >
                {plan.popular && (
                  <PremiumLiquidGlass
                    style={styles.popularBadge}
                    variant="primary"
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    // Padding handled by contentContainerStyle
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.lg,                   // 20px
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.glassLight,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,                 // 48px
  },
  iconContainer: {
    width: 72,
    height: 72,
    marginBottom: SPACING.xl,                   // 24px
  },
  iconContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TEXT_STYLES.h1Primary,
    marginBottom: SPACING.sm,                   // 12px
  },
  subtitle: {
    ...TEXT_STYLES.bodyLargeSecondary,
    textAlign: 'center',
  },
  plansContainer: {
    gap: SPACING.xl,                            // 24px
    marginBottom: SPACING.xxl,                  // 32px
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
    ...TEXT_STYLES.overlinePrimary,
    color: COLORS.textPrimary,
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
    ...TEXT_STYLES.h2Primary,
    color: COLORS.textPrimary,
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
    ...TEXT_STYLES.display2Primary,
    color: COLORS.textPrimary,
  },
  credits: {
    ...TEXT_STYLES.bodyRegularSecondary,
    color: COLORS.accent,
    marginTop: 6,
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
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  featureText: {
    ...TEXT_STYLES.bodyRegularPrimary,
    flex: 1,
    color: COLORS.textPrimary,
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
