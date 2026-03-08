import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { getContacts } from '../storage/contacts';
import CategoryTabs from '../components/CategoryTabs';
import RolodexWheel from '../components/RolodexWheel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = 280;
const LEG_INSET = 28;
const LEG_HEIGHT = SCREEN_HEIGHT * 0.55;

export default function RolodexScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [focusedIndex, setFocusedIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getContacts().then(setContacts);
    }, [])
  );

  const filteredContacts = useMemo(() => {
    if (activeTab === 'All') return contacts;
    return contacts.filter((c) => c.relationshipType === activeTab);
  }, [contacts, activeTab]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    setFocusedIndex(0);
  };

  const handleCardPress = (contact, offset) => {
    if (offset === 0) {
      // Center card — navigate
      navigation.navigate('CardDetail', { contactId: contact.id });
    } else {
      // Non-center card — spin it to center first
      const newIdx = focusedIndex + offset;
      if (newIdx >= 0 && newIdx < filteredContacts.length) {
        setFocusedIndex(newIdx);
      }
    }
  };

  const handleFocusChange = (newIndex) => {
    setFocusedIndex(newIndex);
  };

  // Empty state
  if (filteredContacts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.tabsArea}>
          <CategoryTabs activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
        <View style={styles.emptyCenter}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No one here yet.</Text>
            <Text style={styles.emptySubtext}>Add someone who matters.</Text>
          </View>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.emptyAddBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Wire legs — behind everything */}
      <View style={styles.legsContainer} pointerEvents="none">
        <View style={[styles.legWrapper, { left: (Dimensions.get('window').width - CARD_WIDTH) / 2 + LEG_INSET }]}>
          <LinearGradient
            colors={['#AFAFAF', '#6B6B6B']}
            style={styles.leg}
          />
        </View>
        <View style={[styles.legWrapper, { left: (Dimensions.get('window').width + CARD_WIDTH) / 2 - LEG_INSET - 1.5 }]}>
          <LinearGradient
            colors={['#AFAFAF', '#6B6B6B']}
            style={styles.leg}
          />
        </View>
      </View>

      {/* Shadow ellipse at bottom */}
      <View style={styles.shadowEllipse} pointerEvents="none" />

      {/* Category tabs */}
      <View style={styles.tabsArea}>
        <CategoryTabs activeTab={activeTab} onTabPress={handleTabPress} />
      </View>

      {/* Spindle — behind cards */}
      <View style={styles.spindleArea} pointerEvents="none">
        <View style={styles.spindleHighlight} />
        <LinearGradient
          colors={['#C8C8C8', '#787878', '#C8C8C8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.spindle}
        />
        <View style={styles.spindleShadow} />
      </View>

      {/* The wheel */}
      <View style={styles.wheelArea}>
        <RolodexWheel
          contacts={filteredContacts}
          onCardPress={handleCardPress}
          focusedIndex={focusedIndex}
          onFocusChange={handleFocusChange}
        />
      </View>

      {/* FAB + button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Add')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Tabs
  tabsArea: {
    paddingTop: SPACING.md,
    zIndex: 10,
  },

  // Wheel
  wheelArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -SCREEN_HEIGHT * 0.06, // Upward bias: center at ~44%
    zIndex: 5,
  },

  // Spindle
  spindleArea: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.44 - 1.5, // Aligns with card vertical midpoint
    left: (Dimensions.get('window').width - CARD_WIDTH) / 2 - 20,
    width: CARD_WIDTH + 40,
    zIndex: 3,
    alignItems: 'center',
  },
  spindleHighlight: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  spindle: {
    width: '100%',
    height: 3,
  },
  spindleShadow: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },

  // Wire legs
  legsContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.44,
    left: 0,
    right: 0,
    height: LEG_HEIGHT,
    zIndex: 2,
  },
  legWrapper: {
    position: 'absolute',
    top: 0,
    width: 1.5,
    height: LEG_HEIGHT,
  },
  leg: {
    width: 1.5,
    height: '100%',
  },

  // Shadow ellipse
  shadowEllipse: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 120,
    height: 12,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 20,
  },
  fabText: {
    fontSize: 30,
    color: COLORS.white,
    lineHeight: 34,
  },

  // Empty state
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyCard: {
    width: 280,
    height: 160,
    borderRadius: 6,
    backgroundColor: '#FDFAF3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: SPACING.lg,
  },
  emptyText: {
    fontFamily: FONTS.headingRegular,
    fontSize: 18,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  emptyAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAddBtnText: {
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 32,
  },
});
