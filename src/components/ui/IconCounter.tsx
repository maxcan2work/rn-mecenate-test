import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { formatCount } from '@/utils/formatDate';

type IconKind = 'heart' | 'comment';

const Glyph = ({ kind, active, color }: { kind: IconKind; active: boolean; color: string }) => {
  const char = kind === 'heart' ? (active ? '♥' : '♡') : '💬';
  return (
    <Text style={[styles.glyph, { color }]} accessibilityElementsHidden>
      {char}
    </Text>
  );
};

interface Props {
  kind: IconKind;
  count: number;
  active?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const IconCounter = ({ kind, count, active = false, onPress, disabled }: Props) => {
  const t = useTheme();
  const activeColor = kind === 'heart' ? t.color.like : t.color.accent;
  const color = active ? activeColor : t.color.textMuted;

  const content = (
    <View style={styles.row}>
      <Glyph kind={kind} active={active} color={color} />
      <Text style={[styles.count, { color }]}>{formatCount(count)}</Text>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={kind === 'heart' ? 'Лайк' : 'Комментарии'}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  glyph: { fontSize: 18, lineHeight: 20 },
  count: { fontSize: 13, fontWeight: '500' },
  pressable: { paddingVertical: 4, paddingHorizontal: 2 },
});
