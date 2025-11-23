export const images = {
  // تصاویر پس‌زمینه - فعلاً از Unsplash استفاده میکنه
  // وقتی فایل‌ها رو اضافه کردی، این خطوط رو uncomment کن:

  backgrounds: {
    start: require("../../assets/images/backgrounds/start.jpg"),
    battle: require("../../assets/images/backgrounds/battle.jpg"),
    palace: require("../../assets/images/backgrounds/palace.jpg"),
    desert: require("../../assets/images/backgrounds/desert.jpg"),
    reunion: require("../../assets/images/backgrounds/reunion.jpg"),
    default: { uri: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80" },
  },

  characters: {
    rostam: require("../../assets/images/characters/rostam.png"),
    sohrab: require("../../assets/images/characters/sohrab.png"),
    tahmineh: require("../../assets/images/characters/tahmineh.png"),
    kavoos: require("../../assets/images/characters/kavoos.png"),
    default: { uri: "https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Character" },
  },

  // المان‌های UI
  ui: {
    logoPlaceholder: { uri: "https://via.placeholder.com/400x200/1a1a2e/f39c12?text=Logo" },
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
