import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  onRetry: () => void;
  message?: string;
}

export const FeedErrorState = ({ onRetry, message }: Props) => {
  const t = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text
        style={[t.typography.h2, { color: t.color.text, textAlign: 'center' }]}
      >
        {message ?? 'Не удалось загрузить публикации'}
      </Text>
      <Text
        style={[
          t.typography.body,
          { color: t.color.textMuted, textAlign: 'center' },
        ]}
      >
        Проверьте соединение и попробуйте снова
      </Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? t.color.accentPressed : t.color.accent,
            borderRadius: t.radius.md,
          },
        ]}
        accessibilityRole="button"
      >
        <Text
          style={[
            t.typography.bodyMedium,
            { color: t.color.textInverse },
          ]}
        >
          Повторить
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  button: { paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
});
