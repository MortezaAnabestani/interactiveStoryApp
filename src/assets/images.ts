/**
 * مدیریت تصاویر - استفاده از asset های لوکال
 */

export const images = {
  // تصاویر پس‌زمینه
  backgrounds: {
    start: require("../../assets/images/backgrounds/start.jpg"),
    battle: require("../../assets/images/backgrounds/battle.jpg"),
    palace: require("../../assets/images/backgrounds/palace.jpg"),
    desert: require("../../assets/images/backgrounds/desert.jpg"),
    reunion: require("../../assets/images/backgrounds/reunion.jpg"),
    fortress: require("../../assets/images/backgrounds/82.jpeg"),
    throne: require("../../assets/images/backgrounds/palace.jpg"),
    default: require("../../assets/images/backgrounds/start.jpg"),
  },

  // تصاویر شخصیت‌ها
  characters: {
    rostam: require("../../assets/images/characters/rostam.jpg"),
    sohrab: require("../../assets/images/characters/sohrab.jpg"),
    tahmineh: require("../../assets/images/characters/tahmineh.jpg"),
    kavoos: require("../../assets/images/characters/kavoos.jpg"),
    goudarz: require("../../assets/images/characters/rostam.jpg"), // استفاده از rostam به عنوان جایگزین
    human_ford: require("../../assets/images/characters/sohrab.jpg"), // استفاده از sohrab به عنوان جایگزین
    narrator: require("../../assets/images/backgrounds/start.jpg"), // استفاده از پس‌زمینه
    default: require("../../assets/images/characters/rostam.jpg"),
  },

  // المان‌های UI - از آیکون‌های آنلاین استفاده می‌کنیم تا زمانی که local اضافه بشن
  ui: {
    logo: { uri: "https://via.placeholder.com/400x200/1a1a2e/f39c12?text=رستم+و+سهراب" },
    heartFull: { uri: "https://img.icons8.com/fluency/96/like--v1.png" },
    heartEmpty: { uri: "https://img.icons8.com/fluency/96/hearts.png" },
    coin: { uri: "https://img.icons8.com/fluency/96/coin.png" },
    sword: { uri: "https://img.icons8.com/fluency/96/sword.png" },
    shield: { uri: "https://img.icons8.com/fluency/96/security-shield-green.png" },
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
