import { StyleSheet, Text, View } from 'react-native';
import type { Comment } from '@/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRelativeDate } from '@/utils/formatDate';

export const CommentItem = ({ comment }: { comment: Comment }) => {
  const t = useTheme();

  return (
    <View style={styles.row}>
      <Avatar
        url={comment.author.avatarUrl}
        name={comment.author.displayName}
        size={36}
      />
      <View style={styles.body}>
        <View style={styles.meta}>
          <Text style={[styles.name, { color: t.color.text }]} numberOfLines={1}>
            {comment.author.displayName}
          </Text>
          <Text style={[styles.date, { color: t.color.textMuted }]}>
            {formatRelativeDate(comment.createdAt)}
          </Text>
        </View>
        <Text style={[styles.text, { color: t.color.text }]}>{comment.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  body: {
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
  date: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
