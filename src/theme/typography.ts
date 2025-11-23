/**
 * سیستم تایپوگرافی حرفه‌ای با پشتیبانی فارسی
 */

export const typography = {
  // اندازه‌های فونت
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },

  // وزن فونت
  weight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line height
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
    loose: 2,
  },

  // فونت‌های فارسی
  family: {
    primary: 'System', // React Native از فونت سیستم استفاده می‌کند
    secondary: 'System',
  },
};
