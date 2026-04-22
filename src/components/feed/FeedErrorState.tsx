import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const mascot = require('../../../assets/mascot.png');

interface Props {
  onRetry: () => void;
  isRetrying?: boolean;
  message?: string;
  detail?: string;
}

export const FeedErrorState = ({ onRetry, isRetrying, message, detail }: Props) => {
  const t = useTheme();
  return (
    <View style={styles.container}>
      <Image source={mascot} style={styles.mascot} contentFit="contain" />
      <Text
        style={[t.typography.h2, { color: t.color.text, textAlign: 'center' }]}
      >
        {message ?? 'Не удалось загрузить публикации'}
      </Text>
      {detail ? (
        <Text
          style={[
            t.typography.caption,
            { color: t.color.textMuted, textAlign: 'center' },
          ]}
        >
          {detail}
        </Text>
      ) : null}
      <Pressable
        onPress={onRetry}
        disabled={isRetrying}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? t.color.accentPressed : t.color.accent,
            borderRadius: t.radius.lg,
            opacity: isRetrying ? 0.75 : 1,
          },
        ]}
        accessibilityRole="button"
      >
        {isRetrying ? (
          <ActivityIndicator color={t.color.textInverse} />
        ) : (
          <Text
            style={[t.typography.bodyMedium, { color: t.color.textInverse }]}
          >
            Повторить
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  mascot: { width: 140, height: 140 },
  button: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
});
