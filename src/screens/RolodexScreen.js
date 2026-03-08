import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, CARD_STYLE } from '../constants/theme';
import { getContacts } from '../storage/contacts';
import ContactCard from '../components/ContactCard';

export default function RolodexScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getContacts().then(setContacts);
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
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => navigation.navigate('CardDetail', { contactId: item.id })}
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
