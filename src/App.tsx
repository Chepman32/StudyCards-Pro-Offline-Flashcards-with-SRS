import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeDatabase } from '@/database';
import { useTheme } from '@/hooks/useTheme';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { DecksScreen } from './screens/DecksScreen';
import { DeckDetailScreen } from './screens/DeckDetailScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { CardEditorScreen } from './screens/CardEditorScreen';
import { DeckEditorScreen } from './screens/DeckEditorScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const theme = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize database
        await initializeDatabase();

        // Add any other initialization here
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initialize();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!isReady || showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Stack.Screen name="Main" component={DecksScreen} />
          <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
          <Stack.Screen
            name="Review"
            component={ReviewScreen}
            options={{
              animation: 'fade',
              presentation: 'fullScreenModal',
            }}
          />
          <Stack.Screen name="CardEditor" component={CardEditorScreen} />
          <Stack.Screen name="DeckEditor" component={DeckEditorScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
