import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import type { Comment } from '@/api/types';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { Avatar } from '@/components/ui/Avatar';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { triggerSelectionHaptic } from '@/utils/haptics';

const CommentItemInner = ({ comment }: { comment: Comment }) => {
  const t = useTheme();
  const [liked, setLiked] = useState(Boolean(comment.isLiked));
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLike = () => {
    scale.value = withSequence(withSpring(1.14), withSpring(1));
    setLiked((current) => !current);
    triggerSelectionHaptic();
  };

  const likeColor = liked ? t.color.like : t.color.iconMuted;
  const likesCount = (comment.likesCount ?? 0) + (liked && !comment.isLiked ? 1 : 0);

  return (
    <View style={styles.row}>
      <Avatar
        url={comment.author.avatarUrl}
        name={comment.author.displayName}
        size={36}
      />
      <View style={styles.body}>
        <View style={styles.content}>
          <View style={styles.meta}>
            <Text style={[styles.name, { color: t.color.text }]} numberOfLines={1}>
              {comment.author.displayName}
            </Text>
          </View>
          <Text style={[styles.text, { color: t.color.text }]}>{comment.text}</Text>
        </View>
        <Pressable
          onPress={handleLike}
          hitSlop={8}
          style={({ pressed }) => [styles.like, pressed && { opacity: 0.65 }]}
          accessibilityRole="button"
          accessibilityLabel="Лайк комментария"
        >
          <Animated.View style={[styles.likeInner, animatedStyle]}>
            <HeartIcon size={18} color={likeColor} filled={liked} />
            <Text style={[styles.likeCount, { color: likeColor }]}>
              {likesCount}
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export const CommentItem = memo(CommentItemInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
  },
  like: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  likeInner: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  likeCount: {
    width: 14,
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
