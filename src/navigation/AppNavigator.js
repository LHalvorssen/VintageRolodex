import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

import RolodexScreen from '../screens/RolodexScreen';
import CardDetailScreen from '../screens/CardDetailScreen';
import AddContactScreen from '../screens/AddContactScreen';
import PulseScreen from '../screens/PulseScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    Rolodex: '📇',
    Pulse: '💛',
    Add: '＋',
  };
  return (
    <View style={{ alignItems: 'center', paddingTop: 8 }}>
      <Text style={{ fontSize: label === 'Add' ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
        {icons[label]}
      </Text>
    </View>
  );
}

function RolodexStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.accent,
        headerTitleStyle: { fontFamily: FONTS.heading, fontSize: 20 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="RolodexHome"
        component={RolodexScreen}
        options={{ title: 'Rolodex' }}
      />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.accentLight + '30',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tab.Screen
        name="Rolodex"
        component={RolodexStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Rolodex" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddContactScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Add" focused={focused} />,
          headerShown: true,
          headerTitle: 'New Contact',
          headerStyle: { backgroundColor: COLORS.background },
          headerTitleStyle: { fontFamily: FONTS.heading, fontSize: 20, color: COLORS.accent },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Pulse"
        component={PulseScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Pulse" focused={focused} />,
          headerShown: true,
          headerTitle: 'Pulse',
          headerStyle: { backgroundColor: COLORS.background },
          headerTitleStyle: { fontFamily: FONTS.heading, fontSize: 20, color: COLORS.accent },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
