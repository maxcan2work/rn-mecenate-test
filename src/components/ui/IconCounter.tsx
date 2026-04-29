import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CommentIcon } from '@/components/icons/CommentIcon';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { useTheme } from '@/theme/ThemeProvider';
import { formatCount } from '@/utils/formatDate';

type IconKind = 'heart' | 'comment';

interface Props {
  kind: IconKind;
  count: number;
  active?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const IconCounter = ({ kind, count, active = false, onPress, disabled }: Props) => {
  const t = useTheme();

  const isLikedHeart = kind === 'heart' && active;
  const bg = isLikedHeart ? t.color.likeActiveBg : t.color.chipBg;
  const fg = isLikedHeart ? t.color.likeActiveFg : t.color.iconMuted;

  const icon =
    kind === 'heart' ? (
      <HeartIcon size={22} color={fg} filled={active} />
    ) : (
      <CommentIcon size={22} color={fg} />
    );

  const inner = (
    <>
      {icon}
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

  if (!onPress) {
    return <View style={baseStyle}>{inner}</View>;
  }

  const handlePress = () => {
    if (kind === 'heart') {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [baseStyle, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={kind === 'heart' ? 'Лайк' : 'Комментарии'}
    >
      {inner}
    </Pressable>
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
