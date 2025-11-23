/**
 * مدیریت تصاویر اپلیکیشن
 */

// Helper function to safely require images
const safeRequire = (path: string, fallback: any) => {
  try {
    return require(path);
  } catch {
    return fallback;
  }
};

const defaultBackground = { uri: 'https://via.placeholder.com/800x1200/1a1a2e/f39c12?text=Background' };
const defaultCharacter = { uri: 'https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Character' };

export const images = {
  // تصاویر پس‌زمینه برای هر صحنه
  backgrounds: {
    start: defaultBackground,
    battle: defaultBackground,
    palace: defaultBackground,
    desert: defaultBackground,
    reunion: defaultBackground,
    default: defaultBackground,
  },

  // تصاویر شخصیت‌ها
  characters: {
    rostam: defaultCharacter,
    sohrab: defaultCharacter,
    tahmineh: defaultCharacter,
    kavoos: defaultCharacter,
    default: defaultCharacter,
  },

  // المان‌های UI
  ui: {
    logoPlaceholder: { uri: 'https://via.placeholder.com/400x200/1a1a2e/f39c12?text=Logo' },
  },
};

/**
 * تابع کمکی برای دریافت تصویر با fallback
 */
export const getImage = (category: keyof typeof images, name: string) => {
  try {
    // @ts-ignore
    return images[category][name] || images[category].default;
  } catch {
    return images.backgrounds.default;
  }
};
