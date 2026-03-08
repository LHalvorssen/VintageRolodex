import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import AppNavigator from './src/navigation/AppNavigator';
import { seedIfEmpty } from './src/data/seed';
import { COLORS, FONTS } from './src/constants/theme';

export default function App() {
  const [dataReady, setDataReady] = useState(false);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    seedIfEmpty().then(() => setDataReady(true));
  }, []);

  if (!fontsLoaded || !dataReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading your Rolodex...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
