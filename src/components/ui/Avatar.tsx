import { Image } from 'expo-image';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  url: string | null;
  name: string;
  size?: number;
}

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
};

export const Avatar = ({ url, name, size = 40 }: Props) => {
  const t = useTheme();
  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: t.color.bgMuted,
  };

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={style}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <View style={[style, styles.fallback]}>
      <Text style={{ color: t.color.textMuted, fontSize: size * 0.38, fontWeight: '600' }}>
        {initialsOf(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
