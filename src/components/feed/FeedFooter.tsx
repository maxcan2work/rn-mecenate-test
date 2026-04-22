import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export const FeedFooter = () => {
  const t = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={t.color.textMuted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 24, alignItems: 'center' },
});
