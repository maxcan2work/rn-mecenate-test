import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MoneyIcon } from '@/components/icons/MoneyIcon';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { triggerImpactHaptic } from '@/utils/haptics';

export const PaidPostCoverOverlay = () => {
  const t = useTheme();
  const handleDonatePressIn = (event: GestureResponderEvent) => {
    event.stopPropagation();
    triggerImpactHaptic();
  };

  const handleDonatePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <BlurView
        intensity={10}
        tint="default"
        experimentalBlurMethod="dimezisBlurView"
        blurReductionFactor={1}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.blackout]} />
      <View style={[styles.iconWrap, { backgroundColor: t.color.accent }]}>
        <MoneyIcon size={20} />
      </View>
      <Text style={styles.title}>Контент скрыт пользователем</Text>
      <Text style={styles.description}>Доступ откроется после доната</Text>
      <Pressable
        onPress={handleDonatePress}
        onPressIn={handleDonatePressIn}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: t.color.accent },
          pressed && { opacity: 0.76 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Отправить донат"
      >
        <Text style={styles.buttonText}>Отправить донат</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    overflow: 'hidden',
  },
  blackout: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 11,
    marginBottom: 14,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    marginTop: 4,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
  },
  button: {
    width: 239,
    minHeight: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 18,
  },
  buttonText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 26,
    color: '#FFFFFF',
  },
});
