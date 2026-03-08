import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import RolodexCard from '../../components/RolodexCard';

const DAY_MS = 24 * 60 * 60 * 1000;

export default function OnboardingScreen2({ navigation }) {
  const [demoContact, setDemoContact] = useState({
    id: 'demo-snap',
    name: 'Sofia A.',
    relationshipType: 'Mentor',
    city: '',
    lastContacted: new Date(Date.now() - 240 * DAY_MS).toISOString(),
    notes: '',
  });

  const [snappedBack, setSnappedBack] = useState(false);
  const labelOpacity = useSharedValue(1);
  const newLabelOpacity = useSharedValue(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      // Snap the card back to warm by changing its lastContacted to now
      setDemoContact((prev) => ({
        ...prev,
        lastContacted: new Date().toISOString(),
      }));

      // Cross-fade the labels
      labelOpacity.value = withTiming(0, { duration: 400 });
      newLabelOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      setSnappedBack(true);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const oldLabelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const newLabelStyle = useAnimatedStyle(() => ({
    opacity: newLabelOpacity.value,
  }));

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Onboarding3')}
    >
      <View style={styles.content}>
        <Text style={styles.headline}>
          Cards age when{'\n'}you go quiet.
        </Text>

        <View style={styles.cardWrapper}>
          <RolodexCard
            contact={demoContact}
            onPress={() => {}}
            isNew={false}
            index={0}
          />
        </View>

        <View style={styles.labelContainer}>
          <Animated.Text style={[styles.coldLabel, oldLabelStyle]}>
            8 months without contact
          </Animated.Text>
          <Animated.Text style={[styles.warmLabel, newLabelStyle]}>
            Just reconnected
          </Animated.Text>
        </View>

        <Text style={styles.body}>
          Log a conversation and the card comes back to life. That's the whole game.
        </Text>
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
    marginBottom: SPACING.xl,
  },
  cardWrapper: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  labelContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  coldLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.accent,
    fontStyle: 'italic',
    position: 'absolute',
  },
  warmLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: '#6A8F6A',
    fontStyle: 'italic',
    position: 'absolute',
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: '#8A7F72',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  tapHint: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingBottom: SPACING.xl,
  },
});
