import AsyncStorage from '@react-native-async-storage/async-storage';
import { getContacts } from '../storage/contacts';

const DAY_MS = 1000 * 60 * 60 * 24;

function daysAgo(days) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

const SEED_CONTACTS = [
  {
    id: 'seed-1',
    name: 'Marcus Chen',
    relationshipType: 'Mentor',
    howWeKnow: 'Met at a design conference in Portland, 2022',
    thingToRemember: 'Loves single-origin coffee and vintage typewriters',
    city: 'Portland, OR',
    lastContacted: daysAgo(95),
    createdAt: daysAgo(400),
    notes: 'Introduced me to half my professional network. Always gives great book recs.',
  },
  {
    id: 'seed-2',
    name: 'Priya Sharma',
    relationshipType: 'Friend',
    howWeKnow: 'College roommate freshman year',
    thingToRemember: 'Allergic to shellfish, birthday is March 15',
    city: 'Brooklyn, NY',
    lastContacted: daysAgo(14),
    createdAt: daysAgo(600),
    notes: 'Starting her own ceramics studio. Always up for a late-night call.',
  },
  {
    id: 'seed-3',
    name: 'David Okafor',
    relationshipType: 'Orbit',
    howWeKnow: 'Friend of a friend, met at Jamie\'s birthday party',
    thingToRemember: 'Runs ultramarathons, working on a novel',
    city: 'Chicago, IL',
    lastContacted: daysAgo(420),
    createdAt: daysAgo(450),
    notes: 'Really interesting guy. Should get to know him better.',
  },
  {
    id: 'seed-4',
    name: 'Elena Vasquez',
    relationshipType: 'Family',
    howWeKnow: 'Cousin on mom\'s side',
    thingToRemember: 'Just had a baby girl named Sofia',
    city: 'Austin, TX',
    lastContacted: daysAgo(45),
    createdAt: daysAgo(800),
    notes: 'Send a gift for the baby! She loves homemade tamales.',
  },
  {
    id: 'seed-5',
    name: 'James Wright',
    relationshipType: 'Friend',
    howWeKnow: 'Former coworker at the startup',
    thingToRemember: 'Huge jazz fan, plays saxophone on weekends',
    city: 'San Francisco, CA',
    lastContacted: daysAgo(5),
    createdAt: daysAgo(300),
    notes: 'Grab drinks next time I\'m in SF. He knows the best speakeasies.',
  },
];

export async function seedIfEmpty() {
  const existing = await getContacts();
  if (existing.length === 0) {
    await AsyncStorage.setItem('@rolodex_contacts', JSON.stringify(SEED_CONTACTS));
  }
}
