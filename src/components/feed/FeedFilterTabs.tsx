import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Tier } from '@/api/types';
import { useStores } from '@/stores/context';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const tabs: { label: string; value: Tier | null }[] = [
  { label: 'Все', value: null },
  { label: 'Бесплатные', value: 'free' },
  { label: 'Платные', value: 'paid' },
];

const AnimatedTabLabel = ({
  label,
  index,
  progress,
}: {
  label: string;
  index: number;
  progress: SharedValue<number>;
}) => {
  const t = useTheme();
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      Math.min(Math.abs(progress.value - index), 1),
      [0, 1],
      [t.color.text, t.color.textMuted],
    ),
  }));

  return (
    <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
      {label}
    </Animated.Text>
  );
};

export const FeedFilterTabs = observer(() => {
  const t = useTheme();
  const { ui } = useStores();
  const [trackWidth, setTrackWidth] = useState(0);
  const selectedIndex = tabs.findIndex((tab) => tab.value === ui.tierFilter);
  const progress = useSharedValue(selectedIndex === -1 ? 0 : selectedIndex);
  const tabWidth = trackWidth > 0 ? (trackWidth - 8) / tabs.length : 0;

  useEffect(() => {
    progress.value = withTiming(selectedIndex === -1 ? 0 : selectedIndex, {
      duration: 220,
    });
  }, [progress, selectedIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * tabWidth }],
  }), [tabWidth]);

  return (
    <View style={[styles.wrap, { backgroundColor: t.color.bgMuted }]}>
      <View
        style={[styles.track, { backgroundColor: t.color.chipBg }]}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { width: tabWidth },
            { backgroundColor: t.color.surface },
            indicatorStyle,
          ]}
        />
        {tabs.map((tab, index) => {
          const active = ui.tierFilter === tab.value;

          return (
            <Pressable
              key={tab.label}
              onPress={() => ui.setTierFilter(tab.value)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <AnimatedTabLabel
                label={tab.label}
                index={index}
                progress={progress}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  track: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    borderRadius: 12,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    lineHeight: 18,
  },
});
