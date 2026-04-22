import { StyleSheet, Text, View } from 'react-native';
import type { Author } from '@/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRelativeDate } from '@/utils/formatDate';

interface Props {
  author: Author;
  createdAt: string;
}

export const AuthorHeader = ({ author, createdAt }: Props) => {
  const t = useTheme();
  return (
    <View style={styles.row}>
      <Avatar url={author.avatarUrl} name={author.displayName} size={40} />
      <View style={styles.meta}>
        <View style={styles.nameRow}>
          <Text
            style={[t.typography.bodyMedium, { color: t.color.text }]}
            numberOfLines={1}
          >
            {author.displayName}
          </Text>
          {author.isVerified ? (
            <Text style={[styles.verified, { color: t.color.accent }]}>✓</Text>
          ) : null}
        </View>
        <Text
          style={[t.typography.small, { color: t.color.textMuted }]}
          numberOfLines={1}
        >
          @{author.username} · {formatRelativeDate(createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meta: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verified: { fontSize: 14, fontWeight: '700' },
});
