import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { FONTS, SPACING } from '../constants/theme';
import { getWarmthColor, getWarmthState } from '../utils/warmth';

// Aging palette per spec
const AGING = {
  warm: {
    cardBg: '#FDFAF3',
    nameColor: '#2C2418',
    typeOpacity: 1,
    dogEarSize: 0,
    dogEarColor: 'transparent',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fading: {
    cardBg: '#F5EDD8',
    nameColor: '#5C5347',
    typeOpacity: 0.7,
    dogEarSize: 10,
    dogEarColor: '#E8D9B5',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cold: {
    cardBg: '#EDE0C4',
    nameColor: '#8A7F72',
    typeOpacity: 0.4,
    dogEarSize: 16,
    dogEarColor: '#D9C9A3',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
};

// State to numeric index for interpolation
function stateToValue(state) {
  if (state === 'warm') return 0;
  if (state === 'fading') return 1;
  return 2;
}

// SVG noise texture as data URI for grain overlay
const GRAIN_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function RolodexCard({ contact, onPress, isNew, index = 0 }) {
  const warmthState = getWarmthState(contact.lastContacted);
  const warmthColor = getWarmthColor(contact.lastContacted);
  const targetValue = stateToValue(warmthState);

  // Aging interpolation (0 = warm, 1 = fading, 2 = cold)
  const aging = useSharedValue(targetValue);
  // Slide-in for new cards
  const slideX = useSharedValue(isNew ? 300 : 0);
  // Stagger entrance opacity
  const entrance = useSharedValue(0);

  useEffect(() => {
    const newTarget = stateToValue(getWarmthState(contact.lastContacted));

    // Staggered entrance animation
    entrance.value = withDelay(
      index * 80,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // Aging transition
    aging.value = withDelay(
      index * 80,
      withTiming(newTarget, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // New card slide-in
    if (isNew) {
      slideX.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
    }
  }, [contact.lastContacted]);

  // Card background color
  const cardAnimStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      aging.value,
      [0, 1, 2],
      [AGING.warm.cardBg, AGING.fading.cardBg, AGING.cold.cardBg]
    );
    const shadow = interpolate(
      aging.value,
      [0, 1, 2],
      [AGING.warm.shadowOpacity, AGING.fading.shadowOpacity, AGING.cold.shadowOpacity]
    );
    const sRadius = interpolate(
      aging.value,
      [0, 1, 2],
      [AGING.warm.shadowRadius, AGING.fading.shadowRadius, AGING.cold.shadowRadius]
    );

    return {
      backgroundColor: bgColor,
      shadowOpacity: shadow,
      shadowRadius: sRadius,
      opacity: entrance.value,
      transform: [{ translateX: slideX.value }],
    };
  });

  // Name text color
  const nameAnimStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      aging.value,
      [0, 1, 2],
      [AGING.warm.nameColor, AGING.fading.nameColor, AGING.cold.nameColor]
    );
    return { color };
  });

  // Relationship type label opacity
  const typeAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      aging.value,
      [0, 1, 2],
      [AGING.warm.typeOpacity, AGING.fading.typeOpacity, AGING.cold.typeOpacity]
    );
    return { opacity };
  });

  // Dog-ear size
  const dogEarStyle = useAnimatedStyle(() => {
    const size = interpolate(
      aging.value,
      [0, 1, 2],
      [AGING.warm.dogEarSize, AGING.fading.dogEarSize, AGING.cold.dogEarSize]
    );
    return {
      borderTopWidth: size,
      borderRightWidth: size,
    };
  });

  // Grain overlay only visible when cold
  const grainOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(aging.value, [0, 1, 2], [0, 0, 0.04]);
    return { opacity };
  });

  return (
    <AnimatedTouchable
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, cardAnimStyle]}
    >
      {/* Grain texture overlay */}
      <Animated.View style={[styles.grainContainer, grainOpacity]} pointerEvents="none">
        <ImageBackground
          source={{ uri: GRAIN_URI }}
          style={styles.grainImage}
          imageStyle={styles.grainImageStyle}
          resizeMode="repeat"
        />
      </Animated.View>

      {/* Dog-ear */}
      <Animated.View style={[styles.dogEar, dogEarStyle]} pointerEvents="none" />

      {/* Content */}
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <View style={[styles.warmthDot, { backgroundColor: warmthColor }]} />
          <Animated.Text style={[styles.name, nameAnimStyle]}>
            {contact.name}
          </Animated.Text>
        </View>
        <Animated.Text style={[styles.type, typeAnimStyle]}>
          {contact.relationshipType}
        </Animated.Text>
      </View>
      {contact.city ? (
        <Text style={styles.city}>{contact.city}</Text>
      ) : null}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    shadowColor: '#2C2418',
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  grainContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    overflow: 'hidden',
  },
  grainImage: {
    width: '100%',
    height: '100%',
  },
  grainImageStyle: {
    borderRadius: 8,
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
  },
  type: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#7A6E5D',
    backgroundColor: '#C17F3E18',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: SPACING.sm,
  },
  city: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: '#A89E8E',
    marginTop: SPACING.xs,
    marginLeft: 18,
  },
});
