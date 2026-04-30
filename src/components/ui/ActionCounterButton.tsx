import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { triggerSelectionHaptic } from '@/utils/haptics';
import { formatCount } from '@/utils/formatDate';

interface Props {
  count: number;
  renderIcon: (color: string) => ReactNode;
  active?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ActionCounterButton = ({
  count,
  renderIcon,
  active = false,
  onPress,
  disabled,
  accessibilityLabel,
}: Props) => {
  const t = useTheme();
  const pressOpacity = useRef(new Animated.Value(1)).current;

  const bg = active ? t.color.likeActiveBg : t.color.chipBg;
  const fg = active ? t.color.likeActiveFg : t.color.iconMuted;

  const inner = (
    <>
      {renderIcon(fg)}
      <Text style={[styles.count, { color: fg }]}>
        {formatCount(count)}
      </Text>
    </>
  );

  const baseStyle = [
    styles.chip,
    {
      backgroundColor: bg,
      borderRadius: 16,
    },
  ];

  const animateOpacity = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(pressOpacity, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [pressOpacity],
  );

  if (!onPress) {
    return <View style={baseStyle}>{inner}</View>;
  }

  const handlePress = () => {
    triggerSelectionHaptic();
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => animateOpacity(0.6, 80)}
      onPressOut={() => animateOpacity(1, 140)}
      disabled={disabled}
      hitSlop={8}
      style={[baseStyle, { opacity: pressOpacity }]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {inner}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
    paddingRight: 4,
  },
});
