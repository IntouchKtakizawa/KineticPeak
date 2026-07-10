import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';

interface RestTimerOverlayProps {
  durationSeconds: number;
  onDone: (elapsedSeconds: number) => void;
  onSkip: (elapsedSeconds: number) => void;
}

export function RestTimerOverlay({ durationSeconds, onDone, onSkip }: RestTimerOverlayProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const notificationIdRef = useRef<string | null>(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();

    Notifications.scheduleNotificationAsync({
      content: { title: 'Rest complete', body: "Time's up — next set." },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: durationSeconds,
      },
    })
      .then((id) => {
        notificationIdRef.current = id;
      })
      .catch(() => {
        // Local notifications may be unavailable (e.g. web) — the in-app timer still works.
      });

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          onDone(Math.round((Date.now() - startedAtRef.current) / 1000));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      if (notificationIdRef.current) {
        Notifications.cancelScheduledNotificationAsync(notificationIdRef.current).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSeconds]);

  const handleSkip = () => {
    if (notificationIdRef.current) {
      Notifications.cancelScheduledNotificationAsync(notificationIdRef.current).catch(() => {});
    }
    onSkip(Math.round((Date.now() - startedAtRef.current) / 1000));
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <View style={styles.overlay}>
      <Text style={styles.label}>REST</Text>
      <Text style={styles.time}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  time: {
    color: colors.accent,
    fontSize: 40,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  skipButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
