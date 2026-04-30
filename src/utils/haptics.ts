import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

const triggerAndroidHaptic = (durationMs: number) => {
  Vibration.cancel();
  Vibration.vibrate(durationMs);
};

export const triggerSelectionHaptic = () => {
  if (Platform.OS === 'android') {
    triggerAndroidHaptic(55);
    return;
  }

  Haptics.selectionAsync().catch(() => {});
};

export const triggerImpactHaptic = () => {
  if (Platform.OS === 'android') {
    triggerAndroidHaptic(70);
    return;
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export const triggerSuccessHaptic = () => {
  if (Platform.OS === 'android') {
    triggerAndroidHaptic(90);
    return;
  }

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
};
