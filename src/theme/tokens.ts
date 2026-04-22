export const fontFamily = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const tokens = {
  color: {
    bg: '#FFFFFF',
    bgMuted: '#F4F5F7',
    surface: '#FFFFFF',
    border: '#E6E8EC',
    text: '#111416',
    textMuted: '#57626F',
    textInverse: '#FFFFFF',
    accent: '#6115CD',
    accentPressed: '#4F11A8',
    danger: '#D8413B',
    like: '#F43F5E',
    likeActiveBg: '#FF2B75',
    likeActiveFg: '#FFEAF1',
    iconMuted: '#57626F',
    chipBg: '#EFF2F7',
    overlay: 'rgba(15, 17, 21, 0.65)',
    skeleton: '#EEF0F3',
    lockBg: '#F2F3F6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    pill: 999,
  },
  typography: {
    h1: {
      fontFamily: fontFamily.bold,
      fontSize: 22,
      lineHeight: 28,
    },
    postTitle: {
      fontFamily: fontFamily.bold,
      fontSize: 18,
      lineHeight: 26,
      color: '#111416',
    },
    postBody: {
      fontFamily: fontFamily.medium,
      fontSize: 15,
      lineHeight: 20,
      color: '#111416',
    },
    h2: {
      fontFamily: fontFamily.semibold,
      fontSize: 18,
      lineHeight: 24,
    },
    body: {
      fontFamily: fontFamily.regular,
      fontSize: 15,
      lineHeight: 22,
    },
    bodyMedium: {
      fontFamily: fontFamily.medium,
      fontSize: 15,
      lineHeight: 22,
    },
    caption: {
      fontFamily: fontFamily.regular,
      fontSize: 13,
      lineHeight: 18,
    },
    small: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
    },
  },
} as const;

export type Tokens = typeof tokens;
