import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhysiqueMapScreen } from '../screens/physique/PhysiqueMapScreen';
import { MuscleDetailScreen } from '../screens/physique/MuscleDetailScreen';
import { MuscleGroup } from '../models/exercise';

export type PhysiqueStackParamList = {
  PhysiqueMap: undefined;
  MuscleDetail: { muscleGroup: MuscleGroup };
};

const Stack = createNativeStackNavigator<PhysiqueStackParamList>();

export function PhysiqueStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhysiqueMap" component={PhysiqueMapScreen} />
      <Stack.Screen name="MuscleDetail" component={MuscleDetailScreen} />
    </Stack.Navigator>
  );
}
