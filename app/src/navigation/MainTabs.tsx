import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { PhysiqueStack } from './PhysiqueStack';
import { LeagueStack } from './LeagueStack';
import { SettingsStack } from './SettingsStack';
import { colors } from '../theme/colors';

export type MainTabsParamList = {
  Home: undefined;
  Physique: undefined;
  League: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const ICONS: Record<keyof MainTabsParamList, string> = {
  Home: '🏋️',
  Physique: '🫀',
  League: '🏆',
  Settings: '⚙️',
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Physique" component={PhysiqueStack} />
      <Tab.Screen name="League" component={LeagueStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
