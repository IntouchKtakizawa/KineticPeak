import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { AthletesCodeViewScreen } from '../screens/settings/AthletesCodeViewScreen';

export type SettingsStackParamList = {
  Settings: undefined;
  AthletesCodeView: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AthletesCodeView" component={AthletesCodeViewScreen} />
    </Stack.Navigator>
  );
}
