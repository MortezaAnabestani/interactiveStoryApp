/**
 * سرویس AI - اتصال به مدل‌های زبانی (OpenAI & Gemini)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export type AIProvider = "openai" | "gemini";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  apiUrl: string;
  model: string;
  enabled: boolean;
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

class AIService {
  private config: AIConfig = {
    provider: "gemini",
    apiKey: "AIzaSyDZxpRhxzVYsdB1bJ8HT-nzEoua-CA0v1c",
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    model: "gemini-2.5-flash",
    enabled: false,
  };

  async loadConfig(): Promise<AIConfig> {
    try {
      const saved = await AsyncStorage.getItem("aiConfig");
      if (saved) {
        this.config = JSON.parse(saved);
      }
    } catch (error) {
      console.error("خطا در بارگذاری تنظیمات AI:", error);
    }
    return this.config;
  }

  async saveConfig(config: AIConfig): Promise<void> {
    try {
      this.config = config;
      await AsyncStorage.setItem("aiConfig", JSON.stringify(config));
    } catch (error) {
      console.error("خطا در ذخیره تنظیمات AI:", error);
    }
  }

  getConfig(): AIConfig {
    return this.config;
  }

  isEnabled(): boolean {
    return this.config.enabled && !!this.config.apiKey;
  }

  /**
   * تبدیل پیام‌ها به فرمت Gemini
   */
  private convertToGeminiFormat(messages: AIMessage[]): any {
    // Gemini نیاز به فرمت متفاوتی دارد
    let systemInstruction = "";
    const contents: any[] = [];

    messages.forEach((msg) => {
      if (msg.role === "system") {
        systemInstruction = msg.content;
      } else {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    });

    return {
      system_instruction: systemInstruction
        ? {
            parts: [{ text: systemInstruction }],
          }
        : undefined,
      contents: contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    };
  }

  /**
   * فراخوانی Gemini API
   */
  private async callGemini(messages: AIMessage[]): Promise<string> {
    const requestBody = this.convertToGeminiFormat(messages);

    // حذف system_instruction اگر خالی است
    if (!requestBody.system_instruction) {
      delete requestBody.system_instruction;
    }

    const url = `${this.config.apiUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`خطای Gemini API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // استخراج متن از پاسخ Gemini
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }

    throw new Error("پاسخ نامعتبر از Gemini API");
  }

  /**
   * فراخوانی OpenAI API
   */
  private async callOpenAI(messages: AIMessage[]): Promise<string> {
    const response = await fetch(this.config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`خطای OpenAI API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * فراخوانی API مدل زبانی (پشتیبانی از OpenAI و Gemini)
   */
  async callAI(messages: AIMessage[]): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error("AI فعال نیست یا API Key وارد نشده است");
    }

    try {
      if (this.config.provider === "gemini") {
        return await this.callGemini(messages);
      } else {
        return await this.callOpenAI(messages);
      }
    } catch (error) {
      console.error("خطا در فراخوانی AI:", error);
      throw error;
    }
  }

  /**
   * تولید ادامه داستان بر اساس وضعیت فعلی
   */
  async generateStoryContent(params: {
    currentText: string;
    playerStats: any;
    recentChoices: string[];
    characterName?: string;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: `تو یک نویسنده حرفه‌ای داستان‌های تعاملی فارسی هستی. داستان رستم و سهراب از شاهنامه را می‌شناسی.
        وظیفه‌ات تولید محتوای جذاب و درگیرکننده برای بازی داستانی است.
        از زبان ادبی اما قابل فهم استفاده کن. دیالوگ‌ها باید طبیعی و احساسی باشند.`,
      },
      {
        role: "user",
        content: `وضعیت فعلی:
متن: ${params.currentText}
آمار بازیکن: شرافت ${params.playerStats.honor}، شجاعت ${params.playerStats.courage}، خرد ${
          params.playerStats.wisdom
        }
انتخاب‌های اخیر: ${params.recentChoices.join(", ")}
${params.characterName ? `شخصیت فعلی: ${params.characterName}` : ""}

لطفاً ادامه‌ای مناسب و جذاب برای این داستان بنویس (حداکثر ۳ خط).`,
      },
    ];

    return await this.callAI(messages);
  }

  /**
   * تولید دیالوگ برای شخصیت
   */
  async generateCharacterDialogue(params: {
    characterName: string;
    characterPersonality: string;
    situation: string;
    playerRelationship: number;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: `تو متخصص نوشتن دیالوگ برای شخصیت‌های داستانی هستی.
        دیالوگ‌ها باید با شخصیت کاراکتر هماهنگ باشند و احساسات را منتقل کنند.`,
      },
      {
        role: "user",
        content: `شخصیت: ${params.characterName}
شخصیت: ${params.characterPersonality}
موقعیت: ${params.situation}
رابطه با بازیکن: ${params.playerRelationship}/100

یک دیالوگ مناسب برای این شخصیت در این موقعیت بنویس (یک جمله).`,
      },
    ];

    return await this.callAI(messages);
  }

  /**
   * تحلیل موقعیت و ارائه راهنمایی
   */
  async getHint(params: {
    currentSituation: string;
    availableChoices: string[];
    playerStats: any;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: `تو یک مشاور هوشمند برای بازیکنان هستی.
        وظیفه‌ات کمک به بازیکنان برای انتخاب بهترین تصمیم است، بدون اینکه همه چیز را لو بدهی.`,
      },
      {
        role: "user",
        content: `موقعیت: ${params.currentSituation}
گزینه‌های موجود:
${params.availableChoices.map((c, i) => `${i + 1}. ${c}`).join("\n")}
آمار بازیکن: شرافت ${params.playerStats.honor}، شجاعت ${params.playerStats.courage}، خرد ${
          params.playerStats.wisdom
        }

یک راهنمایی کوتاه و مفید برای انتخاب بده (حداکثر ۲ خط).`,
      },
    ];

    return await this.callAI(messages);
  }

  /**
   * خلاصه داستان تا الان
   */
  async summarizeStory(params: {
    visitedNodes: string[];
    choices: string[];
    currentStats: any;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: "تو یک راوی حرفه‌ای هستی که می‌تواند داستان را به صورت خلاصه و جذاب بیان کنی.",
      },
      {
        role: "user",
        content: `گره‌های بازدید شده: ${params.visitedNodes.length}
تعداد انتخاب‌ها: ${params.choices.length}
آمار فعلی: شرافت ${params.currentStats.honor}، شجاعت ${params.currentStats.courage}، خرد ${params.currentStats.wisdom}

یک خلاصه کوتاه از داستان تا اینجا بنویس (حداکثر ۴ خط).`,
      },
    ];

    return await this.callAI(messages);
  }

  /**
   * پیشنهاد شاخه جدید داستان
   */
  async suggestNewBranch(params: {
    currentNode: string;
    playerStats: any;
    storyTheme: string;
  }): Promise<{ title: string; description: string; choices: string[] }> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: `تو یک نویسنده خلاق داستان‌های تعاملی هستی.
        می‌توانی شاخه‌های جدید و جذاب برای داستان پیشنهاد بدهی.`,
      },
      {
        role: "user",
        content: `گره فعلی: ${params.currentNode}
تم داستان: ${params.storyTheme}
آمار بازیکن: شرافت ${params.playerStats.honor}، شجاعت ${params.playerStats.courage}، خرد ${params.playerStats.wisdom}

یک شاخه جدید برای داستان پیشنهاد بده با فرمت JSON:
{
  "title": "عنوان صحنه",
  "description": "توضیحات صحنه",
  "choices": ["انتخاب ۱", "انتخاب ۲", "انتخاب ۳"]
}`,
      },
    ];

    const response = await this.callAI(messages);
    try {
      // پاک کردن markdown code blocks اگر وجود دارد
      const cleanedResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleanedResponse);
    } catch {
      return {
        title: "صحنه جدید",
        description: response,
        choices: [],
      };
    }
  }

  /**
   * تولید توضیحات بصری برای شخصیت (برای تصویرسازی)
   */
  async generateCharacterDescription(params: {
    characterName: string;
    personalityTraits: string[];
    role: string;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: "تو یک توصیفگر بصری حرفه‌ای هستی که می‌تواند شخصیت‌ها را برای تصویرسازان توصیف کنی.",
      },
      {
        role: "user",
        content: `نام شخصیت: ${params.characterName}
ویژگی‌های شخصیتی: ${params.personalityTraits.join(", ")}
نقش: ${params.role}

یک توضیح بصری دقیق و جزئی از این شخصیت برای یک تصویرساز بنویس (حداکثر ۳ خط).`,
      },
    ];

    return await this.callAI(messages);
  }
}

export const aiService = new AIService();
