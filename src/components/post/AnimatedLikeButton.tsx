import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { useLikePost } from '@/hooks/useLikePost';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { formatCount } from '@/utils/formatDate';

interface Props {
  postId: string;
  count: number;
  active: boolean;
}

export const AnimatedLikeButton = ({ postId, count, active }: Props) => {
  const t = useTheme();
  const like = useLikePost(postId);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(1.14), withSpring(1));
    like.mutate();
  };

  const fg = active ? t.color.likeActiveFg : t.color.iconMuted;

  return (
    <Pressable
      onPress={handlePress}
      disabled={like.isPending}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: active ? t.color.likeActiveBg : t.color.chipBg },
        pressed && { opacity: 0.7 },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Лайк"
    >
      <Animated.View style={[styles.inner, animatedStyle]}>
        <HeartIcon size={22} color={fg} filled={active} />
        <Text style={[styles.count, { color: fg }]}>{formatCount(count)}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
    borderRadius: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 20,
  },
});
