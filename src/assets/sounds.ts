/**
 * مدیریت صداها و موسیقی
 */

import { Audio } from 'expo-av';

// فعلاً از placeholder استفاده می‌کنیم
// وقتی فایل‌های صوتی اضافه شد، uncomment کنید:
/*
export const sounds = {
  music: {
    menu: require('../../assets/audio/music/menu.mp3'),
    story: require('../../assets/audio/music/story.mp3'),
    battle: require('../../assets/audio/music/battle.mp3'),
    ending_good: require('../../assets/audio/music/ending_good.mp3'),
    ending_bad: require('../../assets/audio/music/ending_bad.mp3'),
  },
  sfx: {
    click: require('../../assets/audio/sfx/click.mp3'),
    transition: require('../../assets/audio/sfx/transition.mp3'),
    choice: require('../../assets/audio/sfx/choice.mp3'),
    success: require('../../assets/audio/sfx/success.mp3'),
    fail: require('../../assets/audio/sfx/fail.mp3'),
  },
};
*/

export const sounds = {
  music: {},
  sfx: {},
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

  async playMusic(musicKey: string) {
    if (!this.isMusicEnabled) return;
    // TODO: پیاده‌سازی بعد از اضافه کردن فایل‌های موسیقی
    console.log('پخش موسیقی:', musicKey);
  }

  async playSfx(sfxKey: string) {
    if (!this.isSfxEnabled) return;
    // TODO: پیاده‌سازی بعد از اضافه کردن فایل‌های صوتی
    console.log('پخش افکت صوتی:', sfxKey);
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
