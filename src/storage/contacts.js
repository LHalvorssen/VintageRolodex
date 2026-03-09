import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const CONTACTS_KEY = '@rolodex_contacts';
const MAX_CONTACTS = 50;

export async function getContacts() {
  const json = await AsyncStorage.getItem(CONTACTS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addContact(contactData) {
  const contacts = await getContacts();
  if (contacts.length >= MAX_CONTACTS) {
    throw new Error('Rolodex is full');
  }

  const newContact = {
    id: Crypto.randomUUID(),
    name: contactData.name,
    relationshipType: contactData.relationshipType,
    howWeKnow: contactData.howWeKnow || '',
    thingToRemember: contactData.thingToRemember || '',
    city: '',
    notes: '',
    lastContacted: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newContact, ...contacts];
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
  return newContact;
}

export async function updateContact(id, fields) {
  const contacts = await getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Contact not found');

  contacts[index] = { ...contacts[index], ...fields };
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return contacts[index];
}

export async function deleteContact(id) {
  const contacts = await getContacts();
  const updated = contacts.filter((c) => c.id !== id);
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
}
