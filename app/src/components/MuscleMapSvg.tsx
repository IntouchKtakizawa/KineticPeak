import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { View } from 'react-native';
import { MuscleGroup } from '../models/exercise';
import { MuscleFreshness } from '../models/physique';
import { colors } from '../theme/colors';

type ZoneLayout = { muscle: MuscleGroup; x: number; y: number; width: number; height: number; rx?: number };

const FRONT_ZONES: ZoneLayout[] = [
  { muscle: 'front_delts', x: 40, y: 55, width: 22, height: 22, rx: 8 },
  { muscle: 'front_delts', x: 138, y: 55, width: 22, height: 22, rx: 8 },
  { muscle: 'chest', x: 66, y: 58, width: 68, height: 34, rx: 10 },
  { muscle: 'biceps', x: 30, y: 82, width: 18, height: 44, rx: 8 },
  { muscle: 'biceps', x: 152, y: 82, width: 18, height: 44, rx: 8 },
  { muscle: 'forearms', x: 26, y: 130, width: 16, height: 40, rx: 7 },
  { muscle: 'forearms', x: 158, y: 130, width: 16, height: 40, rx: 7 },
  { muscle: 'abs', x: 74, y: 96, width: 52, height: 50, rx: 8 },
  { muscle: 'obliques', x: 58, y: 100, width: 14, height: 44, rx: 7 },
  { muscle: 'obliques', x: 128, y: 100, width: 14, height: 44, rx: 7 },
  { muscle: 'quads', x: 62, y: 152, width: 32, height: 66, rx: 10 },
  { muscle: 'quads', x: 106, y: 152, width: 32, height: 66, rx: 10 },
  { muscle: 'calves', x: 64, y: 224, width: 26, height: 44, rx: 8 },
  { muscle: 'calves', x: 110, y: 224, width: 26, height: 44, rx: 8 },
];

const BACK_ZONES: ZoneLayout[] = [
  { muscle: 'traps', x: 78, y: 48, width: 44, height: 22, rx: 8 },
  { muscle: 'rear_delts', x: 40, y: 55, width: 22, height: 22, rx: 8 },
  { muscle: 'rear_delts', x: 138, y: 55, width: 22, height: 22, rx: 8 },
  { muscle: 'lats', x: 62, y: 74, width: 76, height: 50, rx: 10 },
  { muscle: 'lower_back', x: 78, y: 122, width: 44, height: 28, rx: 8 },
  { muscle: 'triceps', x: 30, y: 82, width: 18, height: 44, rx: 8 },
  { muscle: 'triceps', x: 152, y: 82, width: 18, height: 44, rx: 8 },
  { muscle: 'forearms', x: 26, y: 130, width: 16, height: 40, rx: 7 },
  { muscle: 'forearms', x: 158, y: 130, width: 16, height: 40, rx: 7 },
  { muscle: 'glutes', x: 68, y: 150, width: 64, height: 26, rx: 10 },
  { muscle: 'hamstrings', x: 62, y: 178, width: 32, height: 46, rx: 10 },
  { muscle: 'hamstrings', x: 106, y: 178, width: 32, height: 46, rx: 10 },
  { muscle: 'calves', x: 64, y: 224, width: 26, height: 44, rx: 8 },
  { muscle: 'calves', x: 110, y: 224, width: 26, height: 44, rx: 8 },
];

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

export function colorForFreshness(freshness: number): string {
  const t = Math.max(0, Math.min(100, freshness)) / 100;
  const low = hexToRgb(colors.freshnessLow);
  const mid = hexToRgb(colors.freshnessMid);
  const high = hexToRgb(colors.freshnessHigh);

  const [from, to, localT] = t < 0.5 ? [low, mid, t / 0.5] : [mid, high, (t - 0.5) / 0.5];
  const r = lerp(from.r, to.r, localT);
  const g = lerp(from.g, to.g, localT);
  const b = lerp(from.b, to.b, localT);
  return `rgb(${r}, ${g}, ${b})`;
}

interface MuscleMapSvgProps {
  view: 'front' | 'back';
  freshnessByMuscle: Map<MuscleGroup, number>;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
}

export function MuscleMapSvg({ view, freshnessByMuscle, onSelectMuscle }: MuscleMapSvgProps) {
  const zones = view === 'front' ? FRONT_ZONES : BACK_ZONES;

  return (
    <View>
      <Svg viewBox="0 0 200 280" width="100%" height={320}>
        <Rect x={72} y={12} width={56} height={40} rx={20} fill={colors.surfaceAlt} />
        <Rect x={54} y={50} width={92} height={182} rx={26} fill={colors.surfaceAlt} />
        {zones.map((zone, index) => {
          const freshness = freshnessByMuscle.get(zone.muscle) ?? 0;
          return (
            <Rect
              key={`${zone.muscle}-${index}`}
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              rx={zone.rx ?? 6}
              fill={colorForFreshness(freshness)}
              stroke={colors.border}
              strokeWidth={1}
              onPress={onSelectMuscle ? () => onSelectMuscle(zone.muscle) : undefined}
            />
          );
        })}
      </Svg>
    </View>
  );
}
