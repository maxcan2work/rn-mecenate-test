import { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { triggerSelectionHaptic } from '@/utils/haptics';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  separatedFromComments?: boolean;
}

const inactiveSendColor = '#D5C9FF';
const paperPlanePath =
  'M2.05266 1.01789C0.778242 0.464912 -0.477861 1.83454 0.181319 3.05769L2.71916 7.77082C2.88029 8.07478 3.18059 8.27619 3.52116 8.32014L9.96647 9.1258C10.091 9.14045 10.1862 9.24665 10.1862 9.37116C10.1862 9.49567 10.091 9.60188 9.96647 9.61652L3.52116 10.4222C3.18059 10.4661 2.88029 10.6712 2.71916 10.9715L0.181319 15.692C-0.477861 16.9151 0.778242 18.2847 2.05266 17.7318L18.2355 10.7188C19.4111 10.2098 19.4111 8.53986 18.2355 8.03083L2.05266 1.01789Z';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedSendIcon = ({
  active,
  activeColor,
}: {
  active: boolean;
  activeColor: string;
}) => {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const animatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveSendColor, activeColor],
    ),
  }));

  return (
    <Svg width={30} height={30} viewBox="0 0 20 19" fill="none">
      <AnimatedPath d={paperPlanePath} animatedProps={animatedProps} />
    </Svg>
  );
};

export const CommentComposer = ({
  value,
  onChangeText,
  onSubmit,
  isPending,
  separatedFromComments,
}: Props) => {
  const t = useTheme();
  const hasText = Boolean(value.trim());
  const isDisabled = !hasText || isPending;
  const handleSubmitPress = () => {
    triggerSelectionHaptic();
    onSubmit();
  };

  return (
    <View
      style={[
        styles.composer,
        separatedFromComments && styles.composerAtCommentsEnd,
        { backgroundColor: t.color.surface },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ваш комментарий"
        placeholderTextColor={t.color.textMuted}
        multiline
        maxLength={500}
        style={[
          styles.input,
          { backgroundColor: t.color.surface, color: t.color.text },
        ]}
      />
      <Pressable
        onPress={handleSubmitPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.send,
          isDisabled && { opacity: 0.45 },
          pressed && { opacity: 0.75 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Отправить комментарий"
      >
        {isPending ? (
          <ActivityIndicator color={t.color.accent} />
        ) : (
          <AnimatedSendIcon active={hasText} activeColor={t.color.accent} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 62,
    paddingHorizontal: 12,
  },
  composerAtCommentsEnd: {
    marginTop: 8,
  },
  input: {
    flex: 1,
    height: 42,
    maxHeight: 110,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EFF2F7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  send: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
