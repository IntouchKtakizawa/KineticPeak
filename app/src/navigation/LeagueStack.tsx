import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeagueHomeScreen } from '../screens/league/LeagueHomeScreen';
import { GroupCreateJoinScreen } from '../screens/league/GroupCreateJoinScreen';
import { GroupLeaderboardScreen } from '../screens/league/GroupLeaderboardScreen';

export type LeagueStackParamList = {
  LeagueHome: undefined;
  GroupCreateJoin: undefined;
  GroupLeaderboard: undefined;
};

const Stack = createNativeStackNavigator<LeagueStackParamList>();

export function LeagueStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeagueHome" component={LeagueHomeScreen} />
      <Stack.Screen name="GroupCreateJoin" component={GroupCreateJoinScreen} />
      <Stack.Screen name="GroupLeaderboard" component={GroupLeaderboardScreen} />
    </Stack.Navigator>
  );
}
