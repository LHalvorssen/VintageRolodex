import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { addContact } from '../data/storage';

const RELATIONSHIP_TYPES = ['Mentor', 'Friend', 'Family', 'Orbit'];

export default function AddContactScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [howWeKnow, setHowWeKnow] = useState('');
  const [thingToRemember, setThingToRemember] = useState('');

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
    try {
      await addContact({
        name: name.trim(),
        relationshipType,
        howWeKnow: howWeKnow.trim(),
        thingToRemember: thingToRemember.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Added!', `${name} has been added to your Rolodex.`, [
        {
          text: 'OK',
          onPress: () => {
            setStep(0);
            setName('');
            setRelationshipType('');
            setHowWeKnow('');
            setThingToRemember('');
            navigation.navigate('Rolodex');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              autoFocus
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
              autoFocus
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
              placeholder="e.g. Loves single-origin coffee and vintage typewriters"
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              autoFocus
            />
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
            disabled={!canAdvance()}
          >
            <Text style={styles.nextBtnText}>
              {step === 2 ? 'Add to Rolodex' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    flexGrow: 1,
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
