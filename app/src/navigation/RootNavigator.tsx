import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingStack } from './OnboardingStack';
import { MainTabs } from './MainTabs';
import { useProfileStore } from '../store/useProfileStore';
import { colors } from '../theme/colors';

export function RootNavigator() {
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const hasOnboarded = useProfileStore((s) => s.profile.hasOnboarded);

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {hasOnboarded ? <MainTabs /> : <OnboardingStack />}
    </NavigationContainer>
  );
}
