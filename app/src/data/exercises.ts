import { Exercise } from '../models/exercise';

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'barbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'incline-barbell-bench-press', name: 'Incline Barbell Bench Press', category: 'barbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', category: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', category: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', category: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'cable-crossover', name: 'Cable Crossover', category: 'cable', primaryMuscles: ['chest'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'chest-press-machine', name: 'Chest Press Machine', category: 'machine', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], isCompound: false, defaultRestSeconds: 90 },
  { id: 'push-up', name: 'Push-Up', category: 'bodyweight', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], isCompound: true, defaultRestSeconds: 60 },
  { id: 'dip', name: 'Dip', category: 'bodyweight', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'], isCompound: true, defaultRestSeconds: 120 },

  // Back
  { id: 'deadlift', name: 'Deadlift', category: 'barbell', primaryMuscles: ['lower_back', 'lats'], secondaryMuscles: ['glutes', 'hamstrings', 'traps', 'forearms'], isCompound: true, defaultRestSeconds: 210 },
  { id: 'barbell-row', name: 'Barbell Row', category: 'barbell', primaryMuscles: ['lats'], secondaryMuscles: ['rear_delts', 'biceps', 'traps'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'pull-up', name: 'Pull-Up', category: 'bodyweight', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'rear_delts'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'cable', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'rear_delts'], isCompound: true, defaultRestSeconds: 100 },
  { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'cable', primaryMuscles: ['lats'], secondaryMuscles: ['rear_delts', 'biceps', 'traps'], isCompound: true, defaultRestSeconds: 100 },
  { id: 'single-arm-dumbbell-row', name: 'Single-Arm Dumbbell Row', category: 'dumbbell', primaryMuscles: ['lats'], secondaryMuscles: ['rear_delts', 'biceps'], isCompound: true, defaultRestSeconds: 100 },
  { id: 't-bar-row', name: 'T-Bar Row', category: 'barbell', primaryMuscles: ['lats'], secondaryMuscles: ['rear_delts', 'biceps', 'traps'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'barbell-shrug', name: 'Barbell Shrug', category: 'barbell', primaryMuscles: ['traps'], secondaryMuscles: ['forearms'], isCompound: false, defaultRestSeconds: 75 },
  { id: 'back-extension', name: 'Back Extension', category: 'bodyweight', primaryMuscles: ['lower_back'], secondaryMuscles: ['glutes', 'hamstrings'], isCompound: false, defaultRestSeconds: 75 },

  // Shoulders
  { id: 'overhead-press', name: 'Barbell Overhead Press', category: 'barbell', primaryMuscles: ['front_delts'], secondaryMuscles: ['side_delts', 'triceps'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'dumbbell', primaryMuscles: ['front_delts'], secondaryMuscles: ['side_delts', 'triceps'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'dumbbell', primaryMuscles: ['side_delts'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'cable', primaryMuscles: ['side_delts'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', category: 'dumbbell', primaryMuscles: ['rear_delts'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },
  { id: 'face-pull', name: 'Face Pull', category: 'cable', primaryMuscles: ['rear_delts'], secondaryMuscles: ['traps'], isCompound: false, defaultRestSeconds: 60 },
  { id: 'front-raise', name: 'Dumbbell Front Raise', category: 'dumbbell', primaryMuscles: ['front_delts'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', category: 'barbell', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], isCompound: false, defaultRestSeconds: 75 },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', category: 'dumbbell', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], isCompound: false, defaultRestSeconds: 75 },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'dumbbell', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], isCompound: false, defaultRestSeconds: 75 },
  { id: 'preacher-curl', name: 'Preacher Curl', category: 'barbell', primaryMuscles: ['biceps'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'cable-curl', name: 'Cable Curl', category: 'cable', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], isCompound: false, defaultRestSeconds: 75 },
  { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', category: 'barbell', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'front_delts'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', category: 'cable', primaryMuscles: ['triceps'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'overhead-triceps-extension', name: 'Overhead Triceps Extension', category: 'dumbbell', primaryMuscles: ['triceps'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'skull-crusher', name: 'Skull Crusher', category: 'barbell', primaryMuscles: ['triceps'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'wrist-curl', name: 'Wrist Curl', category: 'dumbbell', primaryMuscles: ['forearms'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 45 },

  // Legs
  { id: 'back-squat', name: 'Barbell Back Squat', category: 'barbell', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'hamstrings', 'lower_back'], isCompound: true, defaultRestSeconds: 210 },
  { id: 'front-squat', name: 'Barbell Front Squat', category: 'barbell', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'abs'], isCompound: true, defaultRestSeconds: 180 },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'barbell', primaryMuscles: ['hamstrings'], secondaryMuscles: ['glutes', 'lower_back'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'leg-press', name: 'Leg Press', category: 'machine', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'hamstrings'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'walking-lunge', name: 'Walking Lunge', category: 'dumbbell', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'hamstrings'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'dumbbell', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'hamstrings'], isCompound: true, defaultRestSeconds: 120 },
  { id: 'leg-extension', name: 'Leg Extension', category: 'machine', primaryMuscles: ['quads'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'leg-curl', name: 'Leg Curl', category: 'machine', primaryMuscles: ['hamstrings'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 75 },
  { id: 'hip-thrust', name: 'Barbell Hip Thrust', category: 'barbell', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'], isCompound: true, defaultRestSeconds: 150 },
  { id: 'glute-bridge', name: 'Glute Bridge', category: 'bodyweight', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'], isCompound: false, defaultRestSeconds: 60 },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', category: 'machine', primaryMuscles: ['calves'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'machine', primaryMuscles: ['calves'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },
  { id: 'hip-abduction-machine', name: 'Hip Abduction Machine', category: 'machine', primaryMuscles: ['glutes'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'], isCompound: false, defaultRestSeconds: 60 },
  { id: 'cable-crunch', name: 'Cable Crunch', category: 'cable', primaryMuscles: ['abs'], secondaryMuscles: [], isCompound: false, defaultRestSeconds: 60 },
  { id: 'plank', name: 'Plank', category: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'], isCompound: false, defaultRestSeconds: 45 },
  { id: 'russian-twist', name: 'Russian Twist', category: 'bodyweight', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'], isCompound: false, defaultRestSeconds: 45 },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', category: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['obliques', 'lower_back'], isCompound: false, defaultRestSeconds: 75 },
];

export function findExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
