import React from 'react';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';
import { View } from 'react-native';
import { MuscleGroup } from '../models/exercise';
import {
  BACK_MUSCLE_ZONES,
  BODY_OUTLINE_SHAPES,
  BODY_VIEWBOX,
  FRONT_MUSCLE_ZONES,
  ShapeDef,
} from '../services/physique/bodyShapes';
import { colors } from '../theme/colors';

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

function renderShape(
  shape: ShapeDef,
  key: string,
  fill: string,
  onPress?: () => void
) {
  const common = { fill, stroke: colors.border, strokeWidth: 1, onPress };
  switch (shape.type) {
    case 'ellipse':
      return <Ellipse key={key} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} {...common} />;
    case 'rect':
      return (
        <Rect
          key={key}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          {...common}
        />
      );
    case 'path':
      return <Path key={key} d={shape.d} {...common} />;
  }
}

interface MuscleMapSvgProps {
  view: 'front' | 'back';
  freshnessByMuscle: Map<MuscleGroup, number>;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
}

export function MuscleMapSvg({ view, freshnessByMuscle, onSelectMuscle }: MuscleMapSvgProps) {
  const zones = view === 'front' ? FRONT_MUSCLE_ZONES : BACK_MUSCLE_ZONES;

  return (
    <View>
      <Svg viewBox={BODY_VIEWBOX} width="100%" height={420}>
        {BODY_OUTLINE_SHAPES.map((shape, index) =>
          renderShape(shape, `outline-${index}`, colors.surfaceAlt)
        )}
        {zones.map((zone, index) => {
          const freshness = freshnessByMuscle.get(zone.muscleGroup) ?? 0;
          return renderShape(
            zone.shape,
            `${zone.muscleGroup}-${index}`,
            colorForFreshness(freshness),
            onSelectMuscle ? () => onSelectMuscle(zone.muscleGroup) : undefined
          );
        })}
      </Svg>
    </View>
  );
}
