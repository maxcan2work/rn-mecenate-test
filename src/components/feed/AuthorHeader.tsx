import { StyleSheet, Text, View } from 'react-native';
import type { Author } from '@/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { fontFamily } from '@/theme/tokens';

interface Props {
  author: Author;
}

export const AuthorHeader = ({ author }: Props) => (
  <View style={styles.row}>
    <Avatar url={author.avatarUrl} name={author.displayName} size={40} />
    <Text style={styles.name} numberOfLines={1}>
      {author.displayName}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    color: '#111416',
  },
});
