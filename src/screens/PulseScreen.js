import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { getContacts } from '../data/storage';
import { getWarmthState, getWarmthColor, getLastContactedText } from '../utils/warmth';

export default function PulseScreen() {
  const [suggestions, setSuggestions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getContacts().then((contacts) => {
        const needsAttention = contacts
          .filter((c) => getWarmthState(c.lastContacted) !== 'warm')
          .sort((a, b) => {
            const aDate = a.lastContacted ? new Date(a.lastContacted).getTime() : 0;
            const bDate = b.lastContacted ? new Date(b.lastContacted).getTime() : 0;
            return aDate - bDate;
          })
          .slice(0, 5);
        setSuggestions(needsAttention);
      });
    }, [])
  );

  const renderPulseCard = ({ item }) => {
    const warmthColor = getWarmthColor(item.lastContacted);
    const isCold = getWarmthState(item.lastContacted) === 'cold';

    return (
      <View style={[styles.pulseCard, { borderLeftColor: warmthColor }]}>
        <View style={styles.glowOverlay} />
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View style={[styles.warmthDot, { backgroundColor: warmthColor }]} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <Text style={styles.nudge}>
            You haven't talked to {item.name.split(' ')[0]} in{' '}
            {getLastContactedText(item.lastContacted).replace(' ago', '')}.
          </Text>
          {item.thingToRemember ? (
            <Text style={styles.remember}>
              Remember: {item.thingToRemember}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Who to reach out to</Text>
      <Text style={styles.subheader}>
        These connections could use some warmth
      </Text>
      {suggestions.length === 0 ? (
        <View style={styles.allGood}>
          <Text style={styles.allGoodText}>All caught up!</Text>
          <Text style={styles.allGoodSubtext}>
            Everyone in your Rolodex is feeling the warmth.
          </Text>
        </View>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={renderPulseCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  header: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subheader: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  list: {
    paddingBottom: SPACING.xxl,
  },
  pulseCard: {
    ...CARD_STYLE,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.pulseGlow,
    opacity: 0.3,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  warmthDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  nudge: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  remember: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  allGood: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allGoodText: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  allGoodSubtext: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
