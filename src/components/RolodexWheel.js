import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import RolodexCard from './RolodexCard';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 160;
const MIN_FLICK = 40;

// Position config for visible cards (0 = center)
const POSITIONS = {
  scale:      [0.76, 0.88, 1.0, 0.88, 0.76],    // -2, -1, 0, +1, +2
  opacity:    [0.45, 0.75, 1.0, 0.75, 0.45],
  translateY: [130,  72,   0,   -72,  -130],       // + is down (above center)
  rotateX:    [16,   8,    0,   -8,   -16],
  zIndex:     [0,    1,    2,    1,    0],
};

export default function RolodexWheel({ contacts, onCardPress, focusedIndex, onFocusChange }) {
  const scrollOffset = useSharedValue(0);
  const lastIndex = useSharedValue(focusedIndex);

  const clampIndex = (idx) => {
    'worklet';
    return Math.max(0, Math.min(contacts.length - 1, idx));
  };

  const snapToIndex = (targetIdx) => {
    'worklet';
    const clamped = clampIndex(targetIdx);
    lastIndex.value = clamped;
    scrollOffset.value = withSpring(0, {
      damping: 28,
      stiffness: 180,
      mass: 1,
    });
    runOnJS(onFocusChange)(clamped);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      scrollOffset.value = e.translationY;
    })
    .onEnd((e) => {
      const velocity = e.velocityY;
      const translation = e.translationY;

      if (Math.abs(translation) < MIN_FLICK && Math.abs(velocity) < 300) {
        // Not enough movement — snap back
        scrollOffset.value = withSpring(0, {
          damping: 28,
          stiffness: 180,
          mass: 1,
        });
        return;
      }

      // Phase 1: momentum spring (deceleration)
      // Determine how many cards to advance based on velocity
      const velocityCards = Math.round(velocity / 600);
      const translationCards = translation > 0 ? 1 : -1;
      const cardsToMove = velocityCards !== 0 ? -velocityCards : -translationCards;

      const targetIdx = clampIndex(lastIndex.value + cardsToMove);

      // Phase 1: overshoot with momentum spring
      const overshoot = -cardsToMove * 30;
      scrollOffset.value = withSpring(overshoot, {
        damping: 20,
        stiffness: 90,
        mass: 1.2,
        velocity: velocity * 0.3,
      }, () => {
        // Phase 2: settle snap
        lastIndex.value = targetIdx;
        scrollOffset.value = withSpring(0, {
          damping: 28,
          stiffness: 180,
          mass: 1,
        });
        runOnJS(onFocusChange)(targetIdx);
      });
    });

  // Build animated card views
  const cardViews = useMemo(() => {
    if (contacts.length === 0) return null;

    // We render cards at positions -2 to +2 relative to focused
    const visible = [];
    for (let offset = -2; offset <= 2; offset++) {
      const contactIdx = focusedIndex + offset;
      if (contactIdx < 0 || contactIdx >= contacts.length) continue;
      visible.push({ contact: contacts[contactIdx], offset, contactIdx });
    }
    return visible;
  }, [contacts, focusedIndex]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.container}>
        <View style={styles.perspective}>
          {cardViews && cardViews.map(({ contact, offset, contactIdx }) => (
            <WheelCardWrapper
              key={contact.id}
              contact={contact}
              offset={offset}
              scrollOffset={scrollOffset}
              onPress={() => onCardPress(contact, offset)}
              totalContacts={contacts.length}
              focusedIndex={focusedIndex}
            />
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

function WheelCardWrapper({ contact, offset, scrollOffset, onPress, totalContacts, focusedIndex }) {
  const posIdx = offset + 2; // Map -2..+2 to 0..4

  const animatedStyle = useAnimatedStyle(() => {
    // scrollOffset moves between -CARD_HEIGHT and +CARD_HEIGHT as user drags
    const normalizedScroll = scrollOffset.value / CARD_HEIGHT;

    // Interpolate each property based on the scroll offset
    // When scrolling up (negative), cards shift down visually
    const effectivePos = posIdx - normalizedScroll;

    const scale = interpolate(
      effectivePos,
      [0, 1, 2, 3, 4],
      POSITIONS.scale,
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      effectivePos,
      [0, 1, 2, 3, 4],
      POSITIONS.opacity,
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      effectivePos,
      [0, 1, 2, 3, 4],
      POSITIONS.translateY,
      Extrapolation.CLAMP
    );

    const rotateX = interpolate(
      effectivePos,
      [0, 1, 2, 3, 4],
      POSITIONS.rotateX,
      Extrapolation.CLAMP
    );

    const zIdx = interpolate(
      effectivePos,
      [0, 1, 2, 3, 4],
      POSITIONS.zIndex,
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
        { perspective: 800 },
        { rotateX: `${rotateX}deg` },
      ],
      opacity,
      zIndex: Math.round(zIdx),
    };
  });

  return (
    <Animated.View style={[styles.cardSlot, animatedStyle]}>
      <RolodexCard
        contact={contact}
        onPress={onPress}
        isNew={false}
        index={0}
        wheelMode
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_HEIGHT + 260, // Space for arced cards above/below
  },
  perspective: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT + 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSlot: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});
