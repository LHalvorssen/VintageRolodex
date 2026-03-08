import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const TABS = [
  { key: 'All', label: 'All' },
  { key: 'Mentor', label: 'Mentors' },
  { key: 'Friend', label: 'Friends' },
  { key: 'Family', label: 'Family' },
];

export default function CategoryTabs({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  tab: {
    width: 52,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#FDFAF3',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  tabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  tabText: {
    fontFamily: FONTS.headingRegular,
    fontSize: 10,
    color: '#8A7F72',
    fontStyle: 'italic',
  },
  tabTextActive: {
    color: '#FDFAF3',
  },
});
