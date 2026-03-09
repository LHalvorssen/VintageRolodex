import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { getWarmthColor, getLastContactedText, getWarmthState } from '../utils/warmth';
import { getContacts, updateContact } from '../storage/contacts';

export default function CardDetailScreen({ route }) {
  const { contactId } = route.params;
  const [contact, setContact] = useState(null);
  const [showingFront, setShowingFront] = useState(true);
  const flipProgress = useSharedValue(0);

  // Snap-back animated values
  const snapBg = useSharedValue(0);   // 0 = current state, 1 = flash white, 2 = warm
  const dogEarShrink = useSharedValue(1); // 1 = current size, 0 = gone
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0);

  useEffect(() => {
    getContacts().then((contacts) => {
      const found = contacts.find((c) => c.id === contactId);
      if (found) setContact(found);
    });
  }, [contactId]);

  if (!contact) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const warmthState = getWarmthState(contact.lastContacted);
  const warmthColor = getWarmthColor(contact.lastContacted);
  const isCold = warmthState === 'cold';
  const wasFadingOrCold = warmthState === 'fading' || warmthState === 'cold';

  // Map warmth state to aging bg colors for the card
  const currentCardBg = warmthState === 'cold' ? '#EDE0C4'
    : warmthState === 'fading' ? '#F5EDD8' : '#FDFAF3';

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = showingFront ? 1 : 0;
    flipProgress.value = withTiming(toValue, { duration: 500 });
    setShowingFront(!showingFront);
  };

  const handleLogContact = async () => {
    // Fire snap-back animation BEFORE the state update so we animate from old state
    // 1. Background flash: current → white (150ms) → warm (300ms)
    snapBg.value = 0;
    snapBg.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(2, { duration: 300, easing: Easing.out(Easing.cubic) })
    );

    // 2. Dog-ear shrinks to 0
    dogEarShrink.value = 1;
    dogEarShrink.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    // 3. Ripple from center
    rippleScale.value = 1;
    rippleOpacity.value = 0.15;
    rippleScale.value = withTiming(1.6, { duration: 400, easing: Easing.out(Easing.cubic) });
    rippleOpacity.value = withDelay(50, withTiming(0, { duration: 350 }));

    // 4. Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 5. Persist the update
    const now = new Date().toISOString();
    const updated = await updateContact(contact.id, { lastContacted: now });
    setContact(updated);
  };

  // Snap-back card background animation
  const snapBgStyle = useAnimatedStyle(() => {
    if (snapBg.value === 0) return {};
    const bgColor = interpolateColor(
      snapBg.value,
      [0, 1, 2],
      [currentCardBg, '#FFFEF9', '#FDFAF3']
    );
    return { backgroundColor: bgColor };
  });

  // Snap-back dog-ear animation
  const snapDogEarStyle = useAnimatedStyle(() => {
    const currentSize = warmthState === 'cold' ? 16
      : warmthState === 'fading' ? 10 : 0;
    const size = currentSize * dogEarShrink.value;
    return {
      borderTopWidth: size,
      borderRightWidth: size,
    };
  });

  // Ripple effect
  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.hint}>Tap card to flip</Text>
      <Pressable onPress={handleFlip} style={styles.cardContainer}>
        {/* Front */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: currentCardBg },
            frontStyle,
            snapBgStyle,
          ]}
        >
          {/* Dog-ear */}
          <Animated.View style={[styles.dogEar, snapDogEarStyle]} pointerEvents="none" />

          {/* Ripple overlay */}
          <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />

          <View style={styles.warmthRow}>
            <View style={[styles.warmthDot, { backgroundColor: warmthColor }]} />
            <Text style={styles.warmthLabel}>
              {warmthState}
            </Text>
          </View>
          <Text style={[styles.name, isCold && { color: '#8A7F72' }]}>{contact.name}</Text>
          <Text style={[styles.type, isCold && { opacity: 0.4 }]}>{contact.relationshipType}</Text>
          {contact.city ? <Text style={styles.detail}>{contact.city}</Text> : null}
          <View style={styles.divider} />
          <Text style={styles.lastContacted}>
            Last contacted: {getLastContactedText(contact.lastContacted)}
          </Text>
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { backgroundColor: currentCardBg },
            backStyle,
            snapBgStyle,
          ]}
        >
          <Text style={styles.backTitle}>Notes</Text>
          <Text style={styles.notes}>{contact.notes || 'No notes yet'}</Text>

          {contact.howWeKnow ? (
            <>
              <Text style={styles.backTitle}>How We Know Each Other</Text>
              <Text style={styles.notes}>{contact.howWeKnow}</Text>
            </>
          ) : null}

          {contact.thingToRemember ? (
            <>
              <Text style={styles.backTitle}>Remember</Text>
              <Text style={styles.notes}>{contact.thingToRemember}</Text>
            </>
          ) : null}

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logBtn} onPress={handleLogContact}>
            <Text style={styles.logBtnText}>Log Contact</Text>
          </TouchableOpacity>

          <Text style={styles.actionsLabel}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>✉️</Text>
              <Text style={styles.actionText}>Email</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  hint: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  cardContainer: {
    minHeight: 320,
  },
  card: {
    ...CARD_STYLE,
    padding: SPACING.xl,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 320,
  },
  cardBack: {
    position: 'absolute',
  },
  dogEar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopColor: '#D9C9A3',
    borderRightColor: '#F5F0E8',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderStyle: 'solid',
    zIndex: 1,
  },
  ripple: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    borderRadius: 100,
    backgroundColor: COLORS.accent,
    zIndex: 0,
  },
  warmthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  warmthDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  warmthLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  type: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.accent,
    marginBottom: SPACING.sm,
  },
  detail: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.accent + '20',
    marginVertical: SPACING.lg,
  },
  lastContacted: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  backTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.accent,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  notes: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  logBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  logBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: COLORS.white,
  },
  actionsLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
