import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export const PaidPostLock = () => {
  const t = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: t.color.lockBg,
          borderRadius: t.radius.md,
          borderColor: t.color.border,
        },
      ]}
    >
      <Text style={styles.lock}>🔒</Text>
      <View style={styles.text}>
        <Text style={[t.typography.bodyMedium, { color: t.color.text }]}>
          Доступно подписчикам
        </Text>
        <Text style={[t.typography.caption, { color: t.color.textMuted }]}>
          Оформите подписку, чтобы прочитать пост
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  lock: { fontSize: 24 },
  text: { flex: 1, gap: 2 },
});
