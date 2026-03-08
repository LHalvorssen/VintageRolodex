import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { getWarmthColor, getWarmthState } from '../utils/warmth';

export default function ContactCard({ contact, onPress }) {
  const warmthColor = getWarmthColor(contact.lastContacted);
  const warmthState = getWarmthState(contact.lastContacted);
  const isCold = warmthState === 'cold';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        isCold && { backgroundColor: COLORS.cardCold },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <View style={[styles.warmthDot, { backgroundColor: warmthColor }]} />
          <Text style={[styles.name, isCold && { opacity: 0.7 }]}>
            {contact.name}
          </Text>
        </View>
        <Text style={styles.type}>{contact.relationshipType}</Text>
      </View>
      {contact.city ? (
        <Text style={styles.city}>{contact.city}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLE,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  warmthDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  type: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.accent + '18',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: SPACING.sm,
  },
  city: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginLeft: 18,
  },
});
