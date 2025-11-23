/**
 * مدیریت تصاویر اپلیکیشن
 */

// تابع کمکی برای بارگذاری ایمن تصاویر
const safeRequire = (path: any, fallbackUrl: string) => {
  try {
    // اگر فایل وجود داره، استفاده کن
    return path;
  } catch {
    // اگر نه، از placeholder استفاده کن
    return { uri: fallbackUrl };
  }
};

export const images = {
  // تصاویر پس‌زمینه برای هر صحنه
  backgrounds: {
    start: safeRequire(
      require("../../assets/images/backgrounds/start.jpg"),
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200&q=80"
    ),
    battle: safeRequire(
      require("../../assets/images/backgrounds/battle.jpg"),
      "https://images.unsplash.com/photo-1528850647741-de83d6e20068?w=1200&q=80"
    ),
    palace: safeRequire(
      require("../../assets/images/backgrounds/palace.jpg"),
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"
    ),
    desert: safeRequire(
      require("../../assets/images/backgrounds/desert.jpg"),
      "https://images.unsplash.com/photo-1528850647741-de83d6e20068?w=1200&q=80"
    ),
    reunion: safeRequire(
      require("../../assets/images/backgrounds/reunion.jpg"),
      "https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=1200&q=80"
    ),
    default: { uri: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80" },
  },

  // تصاویر شخصیت‌ها
  characters: {
    rostam: safeRequire(
      require("../../assets/images/characters/rostam.jpg"),
      "https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Rostam"
    ),
    sohrab: safeRequire(
      require("../../assets/images/characters/sohrab.jpg"),
      "https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Sohrab"
    ),
    tahmineh: safeRequire(
      require("../../assets/images/characters/tahmineh.jpg"),
      "https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Tahmineh"
    ),
    kavoos: safeRequire(
      require("../../assets/images/characters/kavoos.jpg"),
      "https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Kavoos"
    ),
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
