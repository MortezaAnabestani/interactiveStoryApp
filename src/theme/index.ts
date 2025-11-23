/**
 * تم اصلی اپلیکیشن
 */

import { I18nManager } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

// RTL Utilities
export const rtl = {
  // جهت متن و layout
  textAlign: 'right' as const,
  writingDirection: 'rtl' as const,
  flexDirection: 'row-reverse' as const,

  // Style helpers برای RTL
  text: {
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },

  row: {
    flexDirection: 'row-reverse' as const,
  },

  // برای Input ها
  input: {
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  rtl,
};

export type Theme = typeof theme;
