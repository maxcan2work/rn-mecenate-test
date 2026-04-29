import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  width: number;
  height: number;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
}

export const ShimmerPlaceholder = ({
  width,
  height,
  borderRadius,
  style,
}: Props) => {
  const t = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState(width);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1800 }), -1, false);
  }, [progress]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setMeasuredWidth(event.nativeEvent.layout.width);
  };

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -120 + progress.value * (measuredWidth + 240) },
      { skewX: '-18deg' },
    ],
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          backgroundColor: t.color.skeleton,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <View style={styles.shimmerEdge} />
        <View style={styles.shimmerCore} />
        <View style={styles.shimmerEdge} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 112,
    flexDirection: 'row',
  },
  shimmerEdge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  shimmerCore: {
    flex: 1.2,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
});
