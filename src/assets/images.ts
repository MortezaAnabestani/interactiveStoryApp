/**
 * تمام تصاویر از منابع آنلاین - برای عملکرد بهتر و جلوگیری از خطای bundle
 */

export const images = {
  // تصاویر پس‌زمینه از Unsplash
  backgrounds: {
    start: { uri: "https://images.unsplash.com/photo-1534330980-1bc0676fe2ee?w=1200&q=80" },
    battle: { uri: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1200&q=80" },
    palace: { uri: "https://images.unsplash.com/photo-1549298240-c0cfb16c06c5?w=1200&q=80" },
    desert: { uri: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80" },
    reunion: { uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80" },
    fortress: { uri: "https://images.unsplash.com/photo-1585321059946-4cce2f0d0e06?w=1200&q=80" },
    throne: { uri: "https://images.unsplash.com/photo-1571847149781-ce0d1d2b3d1c?w=1200&q=80" },
    default: { uri: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80" },
  },

  // تصاویر شخصیت‌ها - پرتره‌های حرفه‌ای
  characters: {
    rostam: { uri: "https://i.imgur.com/YjK5ZGP.png" }, // جنگجوی قدرتمند با زره
    sohrab: { uri: "https://i.imgur.com/8XhKjMD.png" }, // جوان جنگجو
    tahmineh: { uri: "https://i.imgur.com/R7nQy9L.png" }, // شاهزاده خانم
    kavoos: { uri: "https://i.imgur.com/mK3jN8x.png" }, // شاه پیر
    goudarz: { uri: "https://i.imgur.com/7YhKmNp.png" }, // سپهسالار پیر
    human_ford: { uri: "https://i.imgur.com/nZ4kLmQ.png" }, // فرستاده
    narrator: { uri: "https://i.imgur.com/qW5jXrP.png" }, // راوی
    default: { uri: "https://via.placeholder.com/400x600/1a1a2e/f39c12?text=Character" },
  },

  // المان‌های UI
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
