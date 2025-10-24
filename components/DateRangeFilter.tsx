import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
import GlowingButton from './GlowingButton';
import * as haptics from '@/utils/haptics';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangeFilterProps {
  onApply: (range: DateRange) => void;
  onClear: () => void;
  currentRange?: DateRange;
}

export default function DateRangeFilter({
  onApply,
  onClear,
  currentRange,
}: DateRangeFilterProps) {
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(currentRange?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(currentRange?.endDate || null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const openModal = () => {
    haptics.light();
    setVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    haptics.light();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const handleApply = () => {
    haptics.medium();
    onApply({ startDate, endDate });
    closeModal();
  };

  const handleClear = () => {
    haptics.medium();
    setStartDate(null);
    setEndDate(null);
    onClear();
    closeModal();
  };

  const handleQuickSelect = (days: number) => {
    haptics.light();
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const hasActiveRange = currentRange?.startDate || currentRange?.endDate;

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity onPress={openModal} activeOpacity={0.8} style={styles.triggerButton}>
        <LinearGradient
          colors={
            hasActiveRange
              ? ['rgba(96, 165, 250, 0.3)', 'rgba(96, 165, 250, 0.15)', 'rgba(96, 165, 250, 0.1)']
              : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.triggerGradient}
        >
          <Calendar size={16} color={hasActiveRange ? '#60A5FA' : COLORS.silverMid} strokeWidth={2.5} />
          <Text style={[styles.triggerText, hasActiveRange && { color: '#60A5FA' }]}>
            {hasActiveRange ? 'Custom Range' : 'Date Range'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeModal}
          />

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalGradient}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date Range</Text>
                <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
                  <View style={styles.closeButton}>
                    <X size={20} color={COLORS.silverLight} strokeWidth={2.5} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Quick Select Buttons */}
              <Text style={styles.sectionLabel}>QUICK SELECT</Text>
              <View style={styles.quickSelectRow}>
                {[
                  { label: 'Last 7 days', days: 7 },
                  { label: 'Last 14 days', days: 14 },
                  { label: 'Last 30 days', days: 30 },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.days}
                    onPress={() => handleQuickSelect(option.days)}
                    activeOpacity={0.8}
                    style={styles.quickButton}
                  >
                    <LinearGradient
                      colors={['rgba(96, 165, 250, 0.2)', 'rgba(96, 165, 250, 0.1)']}
                      style={styles.quickButtonGradient}
                    >
                      <Text style={styles.quickButtonText}>{option.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Display */}
              <Text style={styles.sectionLabel}>SELECTED RANGE</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateDisplay}>
                  <Text style={styles.dateLabel}>Start</Text>
                  <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
                </View>
                <Text style={styles.dateSeparator}>→</Text>
                <View style={styles.dateDisplay}>
                  <Text style={styles.dateLabel}>End</Text>
                  <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
                </View>
              </View>

              {/* Note */}
              {/* TODO: Implement full calendar picker. See ticket #1234 */}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={handleClear} style={styles.clearButton} activeOpacity={0.8}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
                <GlowingButton
                  onPress={handleApply}
                  text="Apply"
                  variant="primary"
                  disabled={!startDate && !endDate}
                  style={{ flex: 1 }}
                />
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    marginBottom: SPACING.md,
  },
  triggerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md + 4,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: SPACING.xs,
  },
  triggerText: {
    ...TEXT_STYLES.labelSecondary,
    color: COLORS.silverMid,
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalGradient: {
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TEXT_STYLES.h3Primary,
    color: COLORS.silverLight,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    ...TEXT_STYLES.overlineSecondary,
    textTransform: 'uppercase',
    color: COLORS.silverDark,
    marginBottom: SPACING.sm,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickButton: {
    flex: 1,
  },
  quickButtonGradient: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    alignItems: 'center',
  },
  quickButtonText: {
    ...TEXT_STYLES.caption,
    color: '#60A5FA',
    fontWeight: '600',
    fontSize: 11,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dateDisplay: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.silverDark,
    marginBottom: SPACING.xxs,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dateValue: {
    ...TEXT_STYLES.bodyRegular,
    color: COLORS.silverLight,
    fontWeight: '600',
    fontSize: 13,
  },
  dateSeparator: {
    ...TEXT_STYLES.h3Primary,
    color: COLORS.silverMid,
  },
  noteText: {
    ...TEXT_STYLES.caption,
    color: COLORS.silverDark,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  clearButtonText: {
    ...TEXT_STYLES.labelPrimary,
    color: COLORS.silverMid,
    fontWeight: '600',
  },
});
