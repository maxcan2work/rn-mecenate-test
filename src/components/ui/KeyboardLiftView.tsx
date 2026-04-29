import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  type KeyboardEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const KeyboardLiftView = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();
  const keyboardTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      const windowHeight = Dimensions.get('window').height;
      const keyboardTop = event.endCoordinates.screenY;
      const keyboardHeightFromPosition = Math.max(windowHeight - keyboardTop, 0);
      const keyboardOffset =
        Math.max(event.endCoordinates.height, keyboardHeightFromPosition) -
        insets.bottom;

      Animated.timing(keyboardTranslateY, {
        toValue: -Math.max(keyboardOffset, 0),
        duration: event.duration || 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      Animated.timing(keyboardTranslateY, {
        toValue: 0,
        duration: event.duration || 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      keyboardTranslateY.stopAnimation();
    };
  }, [insets.bottom, keyboardTranslateY]);

  return (
    <Animated.View
      style={[style, { transform: [{ translateY: keyboardTranslateY }] }]}
    >
      {children}
    </Animated.View>
  );
};
