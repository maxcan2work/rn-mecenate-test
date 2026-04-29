import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export const PaidPostTextPlaceholder = () => {
  const t = useTheme();
  const block = { backgroundColor: t.color.skeleton };

  return (
    <View style={styles.wrap}>
      <View style={[styles.title, block]} />
      <View style={[styles.description, block]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    paddingTop: 16,
  },
  title: {
    width: 164,
    maxWidth: '100%',
    height: 26,
    borderRadius: 22,
  },
  description: {
    width: 361,
    maxWidth: '100%',
    height: 40,
    borderRadius: 22,
  },
});
