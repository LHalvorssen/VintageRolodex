import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { getContacts } from '../storage/contacts';
import RolodexCard from '../components/RolodexCard';

export default function RolodexScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const knownIds = useRef(new Set());
  const [newIds, setNewIds] = useState(new Set());

  useFocusEffect(
    useCallback(() => {
      getContacts().then((loaded) => {
        // Detect newly added contacts (IDs we haven't seen before)
        const freshIds = new Set();
        loaded.forEach((c) => {
          if (!knownIds.current.has(c.id)) {
            freshIds.add(c.id);
          }
        });

        // On first load, all IDs are "known" — no slide-in
        if (knownIds.current.size === 0) {
          loaded.forEach((c) => knownIds.current.add(c.id));
          setNewIds(new Set());
        } else {
          setNewIds(freshIds);
          loaded.forEach((c) => knownIds.current.add(c.id));
        }

        setContacts(loaded);
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Your Rolodex is empty.</Text>
            <Text style={styles.emptySubtext}>
              Add someone who matters.
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('Add')}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RolodexCard
              contact={item}
              onPress={() => navigation.navigate('CardDetail', { contactId: item.id })}
              isNew={newIds.has(item.id)}
              index={index}
            />
          )}
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
  },
  list: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyCard: {
    ...CARD_STYLE,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 32,
  },
});
