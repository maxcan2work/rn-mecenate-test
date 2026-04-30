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
import { triggerSelectionHaptic } from '@/utils/haptics';

const tabs: { label: string; value: Tier | null }[] = [
  { label: 'Все', value: null },
  { label: 'Бесплатные', value: 'free' },
  { label: 'Платные', value: 'paid' },
];

const AnimatedTabLabel = ({
  label,
  index,
  active,
  progress,
}: {
  label: string;
  index: number;
  active: boolean;
  progress: SharedValue<number>;
}) => {
  const t = useTheme();
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      Math.min(Math.abs(progress.value - index), 1),
      [0, 1],
      [t.color.textInverse, '#57626F'],
    ),
  }));

  return (
    <Animated.Text
      style={[styles.label, active ? styles.labelActive : null, labelStyle]}
      numberOfLines={1}
    >
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
  const tabWidth = trackWidth > 0 ? trackWidth / tabs.length : 0;

  useEffect(() => {
    progress.value = withTiming(selectedIndex === -1 ? 0 : selectedIndex, {
      duration: 220,
    });
  }, [progress, selectedIndex]);

  const indicatorStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: progress.value * tabWidth }],
    }),
    [tabWidth],
  );

  return (
    <View style={[styles.wrap, { backgroundColor: t.color.bgMuted }]}>
      <View
        style={[
          styles.track,
          { backgroundColor: t.color.surface, borderColor: '#E8ECEF' },
        ]}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { width: tabWidth },
            { backgroundColor: t.color.accent },
            indicatorStyle,
          ]}
        />
        {tabs.map((tab, index) => {
          const active = ui.tierFilter === tab.value;

          return (
            <Pressable
              key={tab.label}
              onPress={() => {
                if (active) return;

                triggerSelectionHaptic();
                ui.setTierFilter(tab.value);
              }}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <AnimatedTabLabel
                label={tab.label}
                index={index}
                active={active}
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
    height: 38,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 22,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  labelActive: {
    fontFamily: fontFamily.bold,
  },
});
