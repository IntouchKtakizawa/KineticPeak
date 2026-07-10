import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { SessionActiveScreen } from '../screens/home/SessionActiveScreen';
import { ExercisePickerScreen } from '../screens/home/ExercisePickerScreen';
import { SessionSummaryScreen } from '../screens/home/SessionSummaryScreen';

export type HomeStackParamList = {
  Dashboard: undefined;
  SessionActive: undefined;
  ExercisePicker: undefined;
  SessionSummary: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="SessionActive" component={SessionActiveScreen} />
      <Stack.Screen name="ExercisePicker" component={ExercisePickerScreen} />
      <Stack.Screen name="SessionSummary" component={SessionSummaryScreen} />
    </Stack.Navigator>
  );
}
