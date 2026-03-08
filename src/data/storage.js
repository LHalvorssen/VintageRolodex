import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = '@rolodex_contacts';
const MAX_CONTACTS = 50;

export async function getContacts() {
  const json = await AsyncStorage.getItem(CONTACTS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveContacts(contacts) {
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export async function addContact(contact) {
  const contacts = await getContacts();
  if (contacts.length >= MAX_CONTACTS) {
    throw new Error(`Contact limit reached. Maximum ${MAX_CONTACTS} contacts allowed.`);
  }
  const newContact = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    lastContacted: null,
    notes: '',
    city: '',
    ...contact,
  };
  const updated = [newContact, ...contacts];
  await saveContacts(updated);
  return newContact;
}

export async function updateContact(id, updates) {
  const contacts = await getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Contact not found');
  contacts[index] = { ...contacts[index], ...updates };
  await saveContacts(contacts);
  return contacts[index];
}

export async function deleteContact(id) {
  const contacts = await getContacts();
  const updated = contacts.filter((c) => c.id !== id);
  await saveContacts(updated);
}

export async function clearContacts() {
  await AsyncStorage.removeItem(CONTACTS_KEY);
}
