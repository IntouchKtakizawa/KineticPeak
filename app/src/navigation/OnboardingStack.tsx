import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { BiometricsScreen } from '../screens/onboarding/BiometricsScreen';
import { AthletesCodeScreen } from '../screens/onboarding/AthletesCodeScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Biometrics: undefined;
  AthletesCode: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Biometrics" component={BiometricsScreen} />
      <Stack.Screen name="AthletesCode" component={AthletesCodeScreen} />
    </Stack.Navigator>
  );
}
