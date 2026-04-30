import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  title: string;
  onBackPress?: () => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppNavBar = ({ title, onBackPress, right, style }: Props) => {
  const t = useTheme();

  return (
    <View style={[styles.nav, { backgroundColor: t.color.bgMuted }, style]}>
      {onBackPress ? (
        <Pressable
          onPress={onBackPress}
          hitSlop={10}
          style={({ pressed }) => [styles.side, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <Text style={[styles.backText, { color: t.color.text }]}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}

      <Text
        style={[styles.title, { color: t.color.text }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.side}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  side: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: fontFamily.regular,
    fontSize: 34,
    lineHeight: 36,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
  },
});
