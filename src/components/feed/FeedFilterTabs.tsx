import { observer } from 'mobx-react-lite';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Tier } from '@/api/types';
import { useStores } from '@/stores/context';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const tabs: { label: string; value: Tier | null }[] = [
  { label: 'Все', value: null },
  { label: 'Бесплатные', value: 'free' },
  { label: 'Платные', value: 'paid' },
];

export const FeedFilterTabs = observer(() => {
  const t = useTheme();
  const { ui } = useStores();

  return (
    <View style={[styles.wrap, { backgroundColor: t.color.bgMuted }]}>
      <View style={[styles.track, { backgroundColor: t.color.chipBg }]}>
        {tabs.map((tab) => {
          const active = ui.tierFilter === tab.value;
          return (
            <Pressable
              key={tab.label}
              onPress={() => ui.setTierFilter(tab.value)}
              style={[
                styles.tab,
                active && { backgroundColor: t.color.surface },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  styles.label,
                  { color: active ? t.color.text : t.color.textMuted },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
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
