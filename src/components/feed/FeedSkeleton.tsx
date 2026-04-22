import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const SkeletonCard = () => {
  const t = useTheme();
  const block = { backgroundColor: t.color.skeleton };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.color.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, block]} />
        <View style={[styles.nameBar, block]} />
      </View>

      <View style={[styles.cover, block]} />

      <View style={styles.body}>
        <View style={[styles.line, block, { width: '45%' }]} />
        <View style={[styles.line, block, { width: '100%' }]} />
      </View>

      <View style={styles.footer}>
        <View style={[styles.chip, block, { width: 68 }]} />
        <View style={[styles.chip, block, { width: 68 }]} />
      </View>
    </View>
  );
};

export const FeedSkeleton = () => (
  <View>
    <SkeletonCard />
    <SkeletonCard />
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameBar: {
    flex: 1,
    height: 14,
    maxWidth: 180,
    borderRadius: 999,
  },
  cover: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  body: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  line: {
    height: 14,
    borderRadius: 999,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  chip: {
    height: 28,
    borderRadius: 16,
  },
});
