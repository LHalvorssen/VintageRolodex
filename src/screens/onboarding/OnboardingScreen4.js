import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../../constants/theme';
import { addContact } from '../../storage/contacts';

const RELATIONSHIP_TYPES = ['Mentor', 'Friend', 'Family', 'Orbit'];

export default function OnboardingScreen4({ onComplete }) {
  const [addedCount, setAddedCount] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['85%'], []);

  // Form state
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [howWeKnow, setHowWeKnow] = useState('');
  const [thingToRemember, setThingToRemember] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Card icon scale animations
  const icon1Scale = useSharedValue(1);
  const icon2Scale = useSharedValue(1);
  const icon3Scale = useSharedValue(1);
  const iconScales = [icon1Scale, icon2Scale, icon3Scale];

  const icon1Style = useAnimatedStyle(() => ({ transform: [{ scale: icon1Scale.value }] }));
  const icon2Style = useAnimatedStyle(() => ({ transform: [{ scale: icon2Scale.value }] }));
  const icon3Style = useAnimatedStyle(() => ({ transform: [{ scale: icon3Scale.value }] }));
  const iconStyles = [icon1Style, icon2Style, icon3Style];

  // Enter button animation
  const enterOpacity = useSharedValue(0);
  const enterStyle = useAnimatedStyle(() => ({ opacity: enterOpacity.value }));

  const resetForm = () => {
    setStep(0);
    setName('');
    setRelationshipType('');
    setHowWeKnow('');
    setThingToRemember('');
    setError('');
    setSaving(false);
  };

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const canAdvance = () => {
    if (step === 0) return name.trim() && relationshipType;
    if (step === 1) return howWeKnow.trim();
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError('');

    try {
      await addContact({
        name: name.trim(),
        relationshipType,
        howWeKnow: howWeKnow.trim(),
        thingToRemember: thingToRemember.trim(),
      });

      const newCount = addedCount + 1;

      // Animate the card icon filling in
      const scaleVal = iconScales[addedCount];
      scaleVal.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setAddedCount(newCount);
      resetForm();
      closeSheet();

      // Show enter button when all 3 are added
      if (newCount >= 3) {
        enterOpacity.value = withTiming(1, { duration: 400 });
      }
    } catch (err) {
      setSaving(false);
      setError(err.message);
    }
  };

  const handleEnter = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headline}>
          Start with 3 people.
        </Text>
        <Text style={styles.body}>
          Who do you most want to stay close to? Add them now.
        </Text>

        {/* Progress card icons */}
        <View style={styles.iconsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.cardIcon,
                addedCount > i && styles.cardIconFilled,
                iconStyles[i],
              ]}
            >
              {addedCount > i && (
                <Text style={styles.cardIconCheck}>✓</Text>
              )}
            </Animated.View>
          ))}
        </View>

        {/* Add Someone button */}
        {addedCount < 3 && (
          <TouchableOpacity style={styles.addBtn} onPress={openSheet}>
            <Text style={styles.addBtnText}>Add Someone</Text>
          </TouchableOpacity>
        )}

        {/* Enter button (appears after 3 added) */}
        <Animated.View style={[styles.enterContainer, enterStyle]}>
          {addedCount >= 3 && (
            <TouchableOpacity style={styles.enterBtn} onPress={handleEnter}>
              <Text style={styles.enterBtnText}>Enter your Rolodex</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Skip link */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Form */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={resetForm}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          {/* Progress dots */}
          <View style={styles.progressRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === step && styles.dotActive,
                  i < step && styles.dotCompleted,
                ]}
              />
            ))}
          </View>

          {/* Step 1: Name + Relationship */}
          {step === 0 && (
            <View style={styles.card}>
              <Text style={styles.stepTitle}>Who are they?</Text>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Marcus Chen"
                placeholderTextColor={COLORS.textMuted}
              />
              <Text style={styles.label}>Relationship</Text>
              <View style={styles.typeRow}>
                {RELATIONSHIP_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeBtn,
                      relationshipType === type && styles.typeBtnActive,
                    ]}
                    onPress={() => {
                      setRelationshipType(type);
                      Haptics.selectionAsync();
                    }}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        relationshipType === type && styles.typeTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: How you know them */}
          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.stepTitle}>How do you know {name}?</Text>
              <Text style={styles.label}>The Story</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={howWeKnow}
                onChangeText={setHowWeKnow}
                placeholder="e.g. Met at a design conference in Portland"
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {/* Step 3: Thing to remember */}
          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.stepTitle}>One thing to remember</Text>
              <Text style={styles.subtitle}>
                What's something about {name} you don't want to forget?
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={thingToRemember}
                onChangeText={setThingToRemember}
                placeholder="e.g. Loves single-origin coffee"
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          )}

          {/* Navigation buttons */}
          <View style={styles.buttonRow}>
            {step > 0 && (
              <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, !canAdvance() && styles.nextBtnDisabled]}
              onPress={handleNext}
              disabled={!canAdvance() || saving}
            >
              <Text style={styles.nextBtnText}>
                {step === 2 ? 'Add to Rolodex' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
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
  iconsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cardIcon: {
    width: 56,
    height: 72,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.accent + '40',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconFilled: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    borderStyle: 'solid',
  },
  cardIconCheck: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  addBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.white,
  },
  enterContainer: {
    width: '100%',
  },
  enterBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  enterBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.white,
  },
  skipBtn: {
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
  // Bottom sheet styles
  sheetBackground: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetHandle: {
    backgroundColor: COLORS.textMuted,
    width: 40,
  },
  sheetContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted + '40',
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: COLORS.accent + '80',
  },
  card: {
    ...CARD_STYLE,
    padding: SPACING.xl,
  },
  stepTitle: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginTop: -SPACING.sm,
  },
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent + '30',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
    backgroundColor: 'transparent',
  },
  typeBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  typeText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.accent,
  },
  typeTextActive: {
    color: COLORS.white,
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.coldRed,
    marginTop: SPACING.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  backBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backBtnText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  nextBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.white,
  },
});
