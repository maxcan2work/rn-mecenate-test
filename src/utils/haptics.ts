import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

const triggerAndroidHaptic = (
  type: Haptics.AndroidHaptics,
  durationMs: number,
) => {
  Haptics.performAndroidHapticsAsync(type).catch(() => {});
  Vibration.vibrate(durationMs);
};

export const triggerSelectionHaptic = () => {
  if (Platform.OS === 'android') {
    triggerAndroidHaptic(Haptics.AndroidHaptics.Keyboard_Tap, 35);
    return;
  }

  Haptics.selectionAsync().catch(() => {});
};

export const triggerImpactHaptic = () => {
  if (Platform.OS === 'android') {
    triggerAndroidHaptic(Haptics.AndroidHaptics.Context_Click, 45);
    return;
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export const triggerSuccessHaptic = () => {
  if (Platform.OS === 'android') {
    triggerAndroidHaptic(Haptics.AndroidHaptics.Confirm, 55);
    return;
  }

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
};
