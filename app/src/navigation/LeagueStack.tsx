import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeagueHomeScreen } from '../screens/league/LeagueHomeScreen';
import { LeagueTiersScreen } from '../screens/league/LeagueTiersScreen';
import { GroupCreateJoinScreen } from '../screens/league/GroupCreateJoinScreen';
import { GroupLeaderboardScreen } from '../screens/league/GroupLeaderboardScreen';

export type LeagueStackParamList = {
  LeagueHome: undefined;
  LeagueTiers: undefined;
  GroupCreateJoin: undefined;
  GroupLeaderboard: undefined;
};

const Stack = createNativeStackNavigator<LeagueStackParamList>();

export function LeagueStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeagueHome" component={LeagueHomeScreen} />
      <Stack.Screen name="LeagueTiers" component={LeagueTiersScreen} />
      <Stack.Screen name="GroupCreateJoin" component={GroupCreateJoinScreen} />
      <Stack.Screen name="GroupLeaderboard" component={GroupLeaderboardScreen} />
    </Stack.Navigator>
  );
}
