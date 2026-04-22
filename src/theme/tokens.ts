/**
 * Design tokens.
 * Значения — placeholder'ы. Заменим на точные после выгрузки из Figma.
 */
export const tokens = {
  color: {
    bg: '#FFFFFF',
    bgMuted: '#F6F7F9',
    surface: '#FFFFFF',
    border: '#E6E8EC',
    text: '#0F1115',
    textMuted: '#6B7280',
    textInverse: '#FFFFFF',
    accent: '#FF5B3A',
    accentPressed: '#E34A2C',
    danger: '#D8413B',
    like: '#F43F5E',
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
    h1: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
    h2: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
    body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
    bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
    small: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  },
} as const;

export type Tokens = typeof tokens;
