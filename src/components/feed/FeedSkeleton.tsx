import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const SkeletonCard = () => {
  const t = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.color.surface,
          borderColor: t.color.border,
          borderRadius: t.radius.lg,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[styles.avatar, { backgroundColor: t.color.skeleton }]}
        />
        <View style={{ gap: 6, flex: 1 }}>
          <View
            style={[
              styles.line,
              { backgroundColor: t.color.skeleton, width: '45%' },
            ]}
          />
          <View
            style={[
              styles.line,
              { backgroundColor: t.color.skeleton, width: '30%', height: 10 },
            ]}
          />
        </View>
      </View>
      <View
        style={[
          styles.cover,
          { backgroundColor: t.color.skeleton, borderRadius: t.radius.md },
        ]}
      />
      <View style={{ gap: 8 }}>
        <View
          style={[
            styles.line,
            { backgroundColor: t.color.skeleton, width: '90%' },
          ]}
        />
        <View
          style={[
            styles.line,
            { backgroundColor: t.color.skeleton, width: '70%' },
          ]}
        />
      </View>
    </View>
  );
};

export const FeedSkeleton = () => (
  <View style={{ paddingTop: 8 }}>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  line: { height: 12, borderRadius: 4 },
  cover: { width: '100%', aspectRatio: 16 / 9 },
});
