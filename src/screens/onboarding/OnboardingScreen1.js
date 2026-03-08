import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import RolodexCard from '../../components/RolodexCard';

const DEMO_CONTACT = {
  id: 'demo-cold',
  name: 'Sofia A.',
  relationshipType: 'Mentor',
  city: '',
  lastContacted: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
  notes: '',
};

export default function OnboardingScreen1({ navigation }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Onboarding2')}
    >
      <View style={styles.content}>
        <Text style={styles.headline}>
          Some relationships{'\n'}need tending.
        </Text>
        <Text style={styles.body}>
          Rolodex keeps track of the people who matter — and shows you when
          you've been away too long.
        </Text>

        <View style={styles.cardWrapper}>
          <RolodexCard
            contact={DEMO_CONTACT}
            onPress={() => {}}
            isNew={false}
            index={0}
          />
        </View>

        <Text style={styles.cardLabel}>8 months without contact</Text>
      </View>

      <Text style={styles.tapHint}>Tap to continue</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  headline: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: SPACING.lg,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: '#8A7F72',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
    marginBottom: SPACING.xl,
  },
  cardWrapper: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  cardLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.accent,
    fontStyle: 'italic',
  },
  tapHint: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingBottom: SPACING.xl,
  },
});
