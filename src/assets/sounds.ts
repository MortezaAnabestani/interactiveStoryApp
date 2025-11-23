/**
 * مدیریت صداها و موسیقی
 */

import { Audio } from 'expo-av';

// تابع کمکی برای بارگذاری ایمن صداها
const safeRequireSound = (requireFunc: any) => {
  try {
    return requireFunc;
  } catch (error) {
    console.log('فایل صوتی پیدا نشد:', error);
    return null;
  }
};

export const sounds = {
  music: {
    menu: safeRequireSound(require('../../assets/audio/music/menu.mp3')),
    story: safeRequireSound(require('../../assets/audio/music/story.mp3')),
    battle: safeRequireSound(require('../../assets/audio/music/battle.mp3')),
    ending_good: safeRequireSound(require('../../assets/audio/music/ending_good.mp3')),
    ending_bad: safeRequireSound(require('../../assets/audio/music/ending_bad.mp3')),
  },
  sfx: {
    click: safeRequireSound(require('../../assets/audio/sfx/click.mp3')),
    transition: safeRequireSound(require('../../assets/audio/sfx/transition.mp3')),
    choice: safeRequireSound(require('../../assets/audio/sfx/choice.mp3')),
    success: safeRequireSound(require('../../assets/audio/sfx/success.mp3')),
    fail: safeRequireSound(require('../../assets/audio/sfx/fail.mp3')),
  },
};

/**
 * کلاس مدیریت صدا
 */
class SoundManager {
  private musicSound: Audio.Sound | null = null;
  private sfxSounds: Map<string, Audio.Sound> = new Map();
  private isMusicEnabled = true;
  private isSfxEnabled = true;
  private musicVolume = 0.5;
  private sfxVolume = 0.7;

  async initialize() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  async playMusic(musicKey: keyof typeof sounds.music) {
    if (!this.isMusicEnabled) return;

    try {
      const soundFile = sounds.music[musicKey];
      if (!soundFile) {
        console.log('فایل موسیقی موجود نیست:', musicKey);
        return;
      }

      // توقف موسیقی قبلی
      if (this.musicSound) {
        await this.musicSound.stopAsync();
        await this.musicSound.unloadAsync();
      }

      // پخش موسیقی جدید
      const { sound } = await Audio.Sound.createAsync(
        soundFile,
        {
          shouldPlay: true,
          isLooping: true,
          volume: this.musicVolume,
        }
      );

      this.musicSound = sound;
      console.log('✅ موسیقی پخش شد:', musicKey);
    } catch (error) {
      console.log('❌ خطا در پخش موسیقی:', error);
    }
  }

  async playSfx(sfxKey: keyof typeof sounds.sfx) {
    if (!this.isSfxEnabled) return;

    try {
      const soundFile = sounds.sfx[sfxKey];
      if (!soundFile) {
        console.log('فایل افکت صوتی موجود نیست:', sfxKey);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        soundFile,
        {
          shouldPlay: true,
          volume: this.sfxVolume,
        }
      );

      // پخش و بعد از اتمام، آزاد کردن حافظه
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      console.log('✅ افکت صوتی پخش شد:', sfxKey);
    } catch (error) {
      console.log('❌ خطا در پخش افکت صوتی:', error);
    }
  }

  async stopMusic() {
    if (this.musicSound) {
      await this.musicSound.stopAsync();
    }
  }

  async pauseMusic() {
    if (this.musicSound) {
      await this.musicSound.pauseAsync();
    }
  }

  async resumeMusic() {
    if (this.musicSound && this.isMusicEnabled) {
      await this.musicSound.playAsync();
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicSound) {
      this.musicSound.setVolumeAsync(this.musicVolume);
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMusic() {
    this.isMusicEnabled = !this.isMusicEnabled;
    if (!this.isMusicEnabled && this.musicSound) {
      this.musicSound.pauseAsync();
    } else if (this.isMusicEnabled && this.musicSound) {
      this.musicSound.playAsync();
    }
    return this.isMusicEnabled;
  }

  toggleSfx() {
    this.isSfxEnabled = !this.isSfxEnabled;
    return this.isSfxEnabled;
  }

  getMusicStatus() {
    return this.isMusicEnabled;
  }

  getSfxStatus() {
    return this.isSfxEnabled;
  }

  async cleanup() {
    if (this.musicSound) {
      await this.musicSound.stopAsync();
      await this.musicSound.unloadAsync();
    }

    for (const sound of this.sfxSounds.values()) {
      await sound.unloadAsync();
    }

    this.sfxSounds.clear();
  }
}

export const soundManager = new SoundManager();
