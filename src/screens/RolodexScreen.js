import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { getContacts } from '../data/storage';
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
          <Text style={styles.emptyText}>Your Rolodex is empty</Text>
          <Text style={styles.emptySubtext}>Add your first contact to get started</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => navigation.navigate('CardDetail', { contact: item })}
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
  emptyText: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
