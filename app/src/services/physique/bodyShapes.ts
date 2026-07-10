import { MuscleGroup } from '../../models/exercise';

export type ShapeDef =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'path'; d: string }
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx: number };

export interface MuscleZone {
  muscleGroup: MuscleGroup;
  shape: ShapeDef;
}

export const BODY_VIEWBOX = '0 0 240 520';

function capsulePath(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const perp = angle + Math.PI / 2;
  const cos = Math.cos(perp);
  const sin = Math.sin(perp);

  const ax = x1 + r1 * cos, ay = y1 + r1 * sin;
  const bx = x2 + r2 * cos, by = y2 + r2 * sin;
  const cx = x2 - r2 * cos, cy = y2 - r2 * sin;
  const dx = x1 - r1 * cos, dy = y1 - r1 * sin;

  return [
    `M ${ax.toFixed(2)} ${ay.toFixed(2)}`,
    `L ${bx.toFixed(2)} ${by.toFixed(2)}`,
    `A ${r2.toFixed(2)} ${r2.toFixed(2)} 0 0 0 ${cx.toFixed(2)} ${cy.toFixed(2)}`,
    `L ${dx.toFixed(2)} ${dy.toFixed(2)}`,
    `A ${r1.toFixed(2)} ${r1.toFixed(2)} 0 0 0 ${ax.toFixed(2)} ${ay.toFixed(2)}`,
    'Z',
  ].join(' ');
}

// Skeleton landmarks (shared by front/back views — same pose, different muscles visible).
const SHOULDER_L = { x: 50, y: 85 };
const SHOULDER_R = { x: 190, y: 85 };
const ELBOW_L = { x: 40, y: 188 };
const ELBOW_R = { x: 200, y: 188 };
const WRIST_L = { x: 46, y: 283 };
const WRIST_R = { x: 194, y: 283 };

const HIP_Y = 235;
const KNEE_Y = 350;
const ANKLE_Y = 458;
const LEG_L_X = 98;
const LEG_R_X = 142;

const NECK_PATH = capsulePath(120, 54, 15, 120, 74, 17);

const TORSO_PATH = [
  'M 50 85',
  'C 50 85 46 120 60 160',
  'C 70 195 78 210 80 235',
  'L 160 235',
  'C 162 210 170 195 180 160',
  'C 194 120 190 85 190 85',
  'C 170 70 150 62 120 62',
  'C 90 62 70 70 50 85',
  'Z',
].join(' ');

const UPPER_ARM_L = capsulePath(SHOULDER_L.x, SHOULDER_L.y + 5, 19, ELBOW_L.x, ELBOW_L.y, 13);
const UPPER_ARM_R = capsulePath(SHOULDER_R.x, SHOULDER_R.y + 5, 19, ELBOW_R.x, ELBOW_R.y, 13);
const FOREARM_L = capsulePath(ELBOW_L.x, ELBOW_L.y, 13, WRIST_L.x, WRIST_L.y, 9);
const FOREARM_R = capsulePath(ELBOW_R.x, ELBOW_R.y, 13, WRIST_R.x, WRIST_R.y, 9);

const THIGH_BASE_L = capsulePath(LEG_L_X, HIP_Y, 24, LEG_L_X, KNEE_Y, 17);
const THIGH_BASE_R = capsulePath(LEG_R_X, HIP_Y, 24, LEG_R_X, KNEE_Y, 17);
const CALF_BASE_L = capsulePath(LEG_L_X, KNEE_Y, 15, LEG_L_X, ANKLE_Y, 10);
const CALF_BASE_R = capsulePath(LEG_R_X, KNEE_Y, 15, LEG_R_X, ANKLE_Y, 10);

export const BODY_OUTLINE_SHAPES: ShapeDef[] = [
  { type: 'ellipse', cx: 120, cy: 34, rx: 20, ry: 25 }, // head
  { type: 'path', d: NECK_PATH },
  { type: 'path', d: TORSO_PATH },
  { type: 'path', d: UPPER_ARM_L },
  { type: 'path', d: UPPER_ARM_R },
  { type: 'path', d: FOREARM_L },
  { type: 'path', d: FOREARM_R },
  { type: 'ellipse', cx: WRIST_L.x + 2, cy: WRIST_L.y + 14, rx: 8, ry: 12 }, // left hand
  { type: 'ellipse', cx: WRIST_R.x - 2, cy: WRIST_R.y + 14, rx: 8, ry: 12 }, // right hand
  { type: 'path', d: THIGH_BASE_L },
  { type: 'path', d: THIGH_BASE_R },
  { type: 'path', d: CALF_BASE_L },
  { type: 'path', d: CALF_BASE_R },
  { type: 'ellipse', cx: LEG_L_X, cy: ANKLE_Y + 14, rx: 12, ry: 8 }, // left foot
  { type: 'ellipse', cx: LEG_R_X, cy: ANKLE_Y + 14, rx: 12, ry: 8 }, // right foot
];

const BICEP_L = capsulePath(SHOULDER_L.x + 2, SHOULDER_L.y + 12, 14, ELBOW_L.x + 2, ELBOW_L.y - 6, 11);
const BICEP_R = capsulePath(SHOULDER_R.x - 2, SHOULDER_R.y + 12, 14, ELBOW_R.x - 2, ELBOW_R.y - 6, 11);
const TRICEP_L = BICEP_L;
const TRICEP_R = BICEP_R;
const QUAD_L = capsulePath(LEG_L_X, HIP_Y + 3, 22, LEG_L_X, KNEE_Y - 5, 16);
const QUAD_R = capsulePath(LEG_R_X, HIP_Y + 3, 22, LEG_R_X, KNEE_Y - 5, 16);
const HAMSTRING_L = QUAD_L;
const HAMSTRING_R = QUAD_R;
const CALF_FRONT_L = capsulePath(LEG_L_X, KNEE_Y + 5, 14, LEG_L_X, ANKLE_Y - 5, 9);
const CALF_FRONT_R = capsulePath(LEG_R_X, KNEE_Y + 5, 14, LEG_R_X, ANKLE_Y - 5, 9);

const LAT_L = [
  'M 82 95', 'C 68 120 62 150 78 185', 'C 88 200 96 205 100 200', 'C 92 160 92 125 100 95', 'Z',
].join(' ');
const LAT_R = [
  'M 158 95', 'C 172 120 178 150 162 185', 'C 152 200 144 205 140 200', 'C 148 160 148 125 140 95', 'Z',
].join(' ');

export const FRONT_MUSCLE_ZONES: MuscleZone[] = [
  { muscleGroup: 'front_delts', shape: { type: 'ellipse', cx: SHOULDER_L.x, cy: SHOULDER_L.y, rx: 19, ry: 17 } },
  { muscleGroup: 'front_delts', shape: { type: 'ellipse', cx: SHOULDER_R.x, cy: SHOULDER_R.y, rx: 19, ry: 17 } },
  { muscleGroup: 'chest', shape: { type: 'ellipse', cx: 96, cy: 108, rx: 28, ry: 23 } },
  { muscleGroup: 'chest', shape: { type: 'ellipse', cx: 144, cy: 108, rx: 28, ry: 23 } },
  { muscleGroup: 'biceps', shape: { type: 'path', d: BICEP_L } },
  { muscleGroup: 'biceps', shape: { type: 'path', d: BICEP_R } },
  { muscleGroup: 'forearms', shape: { type: 'path', d: FOREARM_L } },
  { muscleGroup: 'forearms', shape: { type: 'path', d: FOREARM_R } },
  { muscleGroup: 'abs', shape: { type: 'rect', x: 100, y: 132, width: 40, height: 66, rx: 12 } },
  { muscleGroup: 'obliques', shape: { type: 'ellipse', cx: 86, cy: 165, rx: 11, ry: 34 } },
  { muscleGroup: 'obliques', shape: { type: 'ellipse', cx: 154, cy: 165, rx: 11, ry: 34 } },
  { muscleGroup: 'quads', shape: { type: 'path', d: QUAD_L } },
  { muscleGroup: 'quads', shape: { type: 'path', d: QUAD_R } },
  { muscleGroup: 'calves', shape: { type: 'path', d: CALF_FRONT_L } },
  { muscleGroup: 'calves', shape: { type: 'path', d: CALF_FRONT_R } },
];

export const BACK_MUSCLE_ZONES: MuscleZone[] = [
  { muscleGroup: 'traps', shape: { type: 'path', d: 'M 120 58 L 168 88 L 120 128 L 72 88 Z' } },
  { muscleGroup: 'rear_delts', shape: { type: 'ellipse', cx: SHOULDER_L.x, cy: SHOULDER_L.y, rx: 19, ry: 17 } },
  { muscleGroup: 'rear_delts', shape: { type: 'ellipse', cx: SHOULDER_R.x, cy: SHOULDER_R.y, rx: 19, ry: 17 } },
  { muscleGroup: 'lats', shape: { type: 'path', d: LAT_L } },
  { muscleGroup: 'lats', shape: { type: 'path', d: LAT_R } },
  { muscleGroup: 'lower_back', shape: { type: 'rect', x: 104, y: 198, width: 32, height: 34, rx: 10 } },
  { muscleGroup: 'triceps', shape: { type: 'path', d: TRICEP_L } },
  { muscleGroup: 'triceps', shape: { type: 'path', d: TRICEP_R } },
  { muscleGroup: 'forearms', shape: { type: 'path', d: FOREARM_L } },
  { muscleGroup: 'forearms', shape: { type: 'path', d: FOREARM_R } },
  { muscleGroup: 'glutes', shape: { type: 'ellipse', cx: 97, cy: 222, rx: 26, ry: 21 } },
  { muscleGroup: 'glutes', shape: { type: 'ellipse', cx: 143, cy: 222, rx: 26, ry: 21 } },
  { muscleGroup: 'hamstrings', shape: { type: 'path', d: HAMSTRING_L } },
  { muscleGroup: 'hamstrings', shape: { type: 'path', d: HAMSTRING_R } },
  { muscleGroup: 'calves', shape: { type: 'path', d: CALF_FRONT_L } },
  { muscleGroup: 'calves', shape: { type: 'path', d: CALF_FRONT_R } },
];
