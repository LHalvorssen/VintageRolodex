import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
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

  const warmthColor = getWarmthColor(contact.lastContacted);
  const isCold = getWarmthState(contact.lastContacted) === 'cold';

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = showingFront ? 1 : 0;
    flipProgress.value = withTiming(toValue, { duration: 500 });
    setShowingFront(!showingFront);
  };

  const handleLogContact = async () => {
    const now = new Date().toISOString();
    const updated = await updateContact(contact.id, { lastContacted: now });
    setContact(updated);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

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
            isCold && { backgroundColor: COLORS.cardCold },
            frontStyle,
          ]}
        >
          <View style={styles.warmthRow}>
            <View style={[styles.warmthDot, { backgroundColor: warmthColor }]} />
            <Text style={styles.warmthLabel}>
              {getWarmthState(contact.lastContacted)}
            </Text>
          </View>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.type}>{contact.relationshipType}</Text>
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
            isCold && { backgroundColor: COLORS.cardCold },
            backStyle,
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
