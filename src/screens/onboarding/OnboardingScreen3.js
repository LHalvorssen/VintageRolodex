import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../../constants/theme';

function StackedCard({ rotation, offset }) {
  return (
    <View
      style={[
        styles.stackCard,
        {
          transform: [{ rotate: `${rotation}deg` }, { translateY: offset }],
        },
      ]}
    />
  );
}

export default function OnboardingScreen3({ navigation }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Onboarding4')}
    >
      <View style={styles.content}>
        <Text style={styles.headline}>
          Your Rolodex holds{'\n'}50 people.
        </Text>

        <Text style={styles.body}>
          Not 500. Not everyone you've ever met. The people you actually want
          to keep in your life.
        </Text>

        <View style={styles.stackWrapper}>
          <StackedCard rotation={-3} offset={4} />
          <StackedCard rotation={0} offset={0} />
          <StackedCard rotation={3} offset={2} />
        </View>
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
    marginBottom: SPACING.xxl,
  },
  stackWrapper: {
    width: 200,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackCard: {
    position: 'absolute',
    width: 180,
    height: 100,
    backgroundColor: '#FDFAF3',
    borderRadius: 8,
    shadowColor: '#2C2418',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tapHint: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingBottom: SPACING.xl,
  },
});
