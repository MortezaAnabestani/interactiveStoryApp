import { StoryData, Character } from '../types';

/**
 * داستان تعاملی رستم و سهراب - نسخه بازی‌وار
 * الهام‌گرفته از Scriptic
 */

// تعریف شخصیت‌ها
export const characters: { [key: string]: Character } = {
  rostam: {
    id: 'rostam',
    name: 'رستم',
    title: 'پهلوان نامدار ایران',
    avatar: 'rostam',
    description: 'قوی‌ترین پهلوان ایران‌زمین، دارای قدرت و شرافت بی‌همتا',
  },
  sohrab: {
    id: 'sohrab',
    name: 'سهراب',
    title: 'پهلوان جوان توران',
    avatar: 'sohrab',
    description: 'جنگجوی جوان و قدرتمند که به دنبال پدرش می‌گردد',
  },
  tahmineh: {
    id: 'tahmineh',
    name: 'تهمینه',
    title: 'شاهزاده سمنگان',
    avatar: 'tahmineh',
    description: 'مادر دلسوز سهراب و همسر سابق رستم',
  },
  kavoos: {
    id: 'kavoos',
    name: 'کیکاووس',
    title: 'شاه ایران',
    avatar: 'kavoos',
    description: 'پادشاه کینه‌جو و غرورمند ایران',
  },
  goudarz: {
    id: 'goudarz',
    name: 'گودرز',
    title: 'سپهسالار ایران',
    avatar: 'goudarz',
    description: 'سردار با تجربه و مشاور رستم',
  },
  human_ford: {
    id: 'human_ford',
    name: 'هومان',
    title: 'فرستاده توران',
    avatar: 'human_ford',
    description: 'فرستاده‌ای خائن که سهراب را فریب می‌دهد',
  },
  narrator: {
    id: 'narrator',
    name: 'راوی',
    avatar: 'narrator',
    description: 'راوی داستان',
  },
};

export const rostamSohrabStory: StoryData = {
  title: 'رستم و سهراب',
  author: 'بر اساس شاهنامه فردوسی',
  description: 'یک تجربه تعاملی دیالوگ-محور از حماسه رستم و سهراب',
  startNodeId: 'prologue',
  characters,

  nodes: {
    // ==================== پرولوگ ====================
    prologue: {
      id: 'prologue',
      title: 'سال‌ها پیش...',
      background: 'palace',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'سال‌ها پیش، رستم پهلوان به سرزمین سمنگان رفت. در آنجا با تهمینه، دختر شاه، آشنا شد...',
          emotion: 'neutral',
        },
        {
          speaker: 'tahmineh',
          text: 'ای پهلوان نامدار! من تهمینه هستم. از شنیدن داستان‌های شجاعت تو، دلم پر از احترام است.',
          emotion: 'happy',
        },
        {
          speaker: 'rostam',
          text: 'شاهزاده‌خانم، افتخار من است. زیبایی و هوشمندی شما در همه جا مشهور است.',
          emotion: 'happy',
        },
      ],
      choices: [
        {
          id: 'c1',
          text: '💕 [با علاقه] "داستان شما دو چیست؟"',
          nextNodeId: 'love_story',
          statChanges: { wisdom: 5 },
        },
        {
          id: 'c2',
          text: '⚡ [بی‌صبرانه] "به داستان اصلی برویم!"',
          nextNodeId: 'years_later',
          statChanges: { courage: 5 },
        },
      ],
    },

    love_story: {
      id: 'love_story',
      title: 'عشق رستم و تهمینه',
      background: 'palace',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'رستم و تهمینه عاشق هم شدند و ازدواج کردند. اما رستم باید به ایران برمی‌گشت...',
          emotion: 'sad',
        },
        {
          speaker: 'rostam',
          text: 'تهمینه، من باید بروم. اما این انگشتر را بگیر. اگر فرزندمان پسر بود، به او بده تا مرا بیابد.',
          emotion: 'sad',
        },
        {
          speaker: 'tahmineh',
          text: 'رستم... تو برمی‌گردی، نه؟',
          emotion: 'worried',
        },
      ],
      autoRelationshipChanges: { rostam: 10, tahmineh: 10 },
      choices: [
        {
          id: 'c3',
          text: '[رستم] "قول می‌دهم برگردم."',
          nextNodeId: 'years_later',
          statChanges: { honor: 10 },
          relationshipChanges: { tahmineh: 15 },
        },
        {
          id: 'c4',
          text: '[رستم] "وظایفم در ایران مهم است..."',
          nextNodeId: 'years_later',
          statChanges: { honor: -5 },
          relationshipChanges: { tahmineh: -10 },
        },
      ],
    },

    // ==================== سال‌ها بعد ====================
    years_later: {
      id: 'years_later',
      title: '۱۶ سال بعد...',
      background: 'fortress',
      dialogue: [
        {
          speaker: 'narrator',
          text: '۱۶ سال گذشت. تهمینه پسری به نام سهراب به دنیا آورد. او جوانی قدرتمند و شجاع شد.',
          emotion: 'neutral',
        },
        {
          speaker: 'sohrab',
          text: 'مادر، چرا هیچ‌وقت از پدرم حرف نمی‌زنی؟ آیا او هنوز زنده است؟',
          emotion: 'worried',
        },
        {
          speaker: 'tahmineh',
          text: 'پسرم... پدرت رستم، بزرگ‌ترین پهلوان ایران است. او در جنگ با دشمنان سرزمینش مشغول است.',
          emotion: 'sad',
        },
        {
          speaker: 'sohrab',
          text: 'پس من باید او را بیابم! می‌خواهم در کنار پدرم بجنگم!',
          emotion: 'angry',
        },
      ],
      autoRelationshipChanges: { sohrab: 10 },
      choices: [
        {
          id: 'c5',
          text: '[تهمینه] "پسرم، صبر کن! بگذار نامه‌ای برای او بفرستم."',
          nextNodeId: 'send_letter',
          statChanges: { wisdom: 10 },
          relationshipChanges: { tahmineh: 10 },
        },
        {
          id: 'c6',
          text: '[سهراب] "نه مادر! خودم او را خواهم یافت!"',
          nextNodeId: 'sohrab_departs',
          statChanges: { courage: 15 },
          relationshipChanges: { sohrab: 15 },
        },
      ],
    },

    // ==================== مسیر نامه ====================
    send_letter: {
      id: 'send_letter',
      title: 'نامه به رستم',
      background: 'desert',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'تهمینه فرستاده‌ای قابل اعتماد می‌یابد و نامه‌ای به رستم می‌فرستد...',
          emotion: 'neutral',
        },
        {
          speaker: 'tahmineh',
          text: 'این نامه را به دست رستم برسان. بگو فرزندش منتظر اوست.',
          emotion: 'worried',
        },
      ],
      choices: [
        {
          id: 'c7',
          text: '📨 نامه به دست رستم می‌رسد',
          nextNodeId: 'rostam_reads_letter',
        },
        {
          id: 'c8',
          text: '⚠️ نامه گم می‌شود...',
          nextNodeId: 'sohrab_departs',
          statChanges: { fate: -10 },
        },
      ],
    },

    rostam_reads_letter: {
      id: 'rostam_reads_letter',
      title: 'رستم نامه را می‌خواند',
      background: 'throne',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'نامه پس از ماه‌ها به دست رستم می‌رسد...',
          emotion: 'neutral',
        },
        {
          speaker: 'rostam',
          text: 'چه می‌گویی؟! من... پدر هستم؟ سهراب... فرزند من!',
          emotion: 'surprised',
        },
        {
          speaker: 'goudarz',
          text: 'رستم، این ممکن است دام دشمنان باشد. توران همیشه به دنبال ضعف تو بوده.',
          emotion: 'worried',
        },
      ],
      choices: [
        {
          id: 'c9',
          text: '❤️ "به دلم می‌گویم این واقعی است! به سمنگان می‌روم!"',
          nextNodeId: 'happy_reunion',
          statChanges: { wisdom: -5, honor: 15 },
          relationshipChanges: { sohrab: 20, tahmineh: 20 },
        },
        {
          id: 'c10',
          text: '🤔 "گودرز حق دارد. باید محتاطانه عمل کنم."',
          nextNodeId: 'cautious_approach',
          statChanges: { wisdom: 10 },
          relationshipChanges: { goudarz: 10 },
        },
      ],
    },

    // ==================== مسیر خروج سهراب ====================
    sohrab_departs: {
      id: 'sohrab_departs',
      title: 'سهراب به راه می‌افتد',
      background: 'desert',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'سهراب تصمیم می‌گیرد خودش پدرش را بیابد. او با سپاه توران همراه می‌شود...',
          emotion: 'neutral',
        },
        {
          speaker: 'human_ford',
          text: 'سهراب جوان! با ما بیا. ما تو را به ایران می‌بریم تا پدرت را بیابی.',
          emotion: 'neutral',
        },
        {
          speaker: 'sohrab',
          text: 'آیا واقعاً کمکم می‌کنید؟ چرا؟',
          emotion: 'worried',
        },
        {
          speaker: 'human_ford',
          text: 'ما از رستم احترام داریم. پسر او هم باید پهلوانی بزرگ باشد!',
          emotion: 'happy',
        },
      ],
      choices: [
        {
          id: 'c11',
          text: '✅ [قبول کردن] "بسیار خوب، با شما می‌آیم!"',
          nextNodeId: 'with_turan_army',
          statChanges: { courage: 10, wisdom: -10 },
          relationshipChanges: { human_ford: 10 },
        },
        {
          id: 'c12',
          text: '⚠️ [مشکوک شدن] "چرا توران به من کمک کند؟"',
          nextNodeId: 'suspicious_sohrab',
          statChanges: { wisdom: 15 },
        },
      ],
    },

    with_turan_army: {
      id: 'with_turan_army',
      title: 'در راه ایران',
      background: 'fortress',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'سهراب با سپاه توران به سوی ایران حرکت می‌کند. او نمی‌داند که هومان او را فریب می‌دهد...',
          emotion: 'worried',
        },
        {
          speaker: 'sohrab',
          text: 'وقتی پدرم را ببینم، چه بگویم؟ شاید او مرا قبول نکند...',
          emotion: 'sad',
        },
      ],
      autoStatChanges: { fame: 10 },
      choices: [
        {
          id: 'c13',
          text: '⚔️ "باید قدرت خود را ثابت کنم!"',
          nextNodeId: 'prove_strength',
          statChanges: { courage: 10 },
        },
        {
          id: 'c14',
          text: '💭 "شاید بهتر است نام خود را مخفی کنم..."',
          nextNodeId: 'hide_identity',
          statChanges: { wisdom: 5 },
        },
      ],
    },

    prove_strength: {
      id: 'prove_strength',
      title: 'اثبات قدرت',
      background: 'battle',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'سهراب در نبرد با جنگاوران ایران، قدرت شگفت‌انگیزی نشان می‌دهد. همه از او می‌ترسند...',
          emotion: 'neutral',
        },
        {
          speaker: 'sohrab',
          text: 'کجاست رستم؟! می‌خواهم او را ببینم!',
          emotion: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'خبر به گوش کاووس می‌رسد. شاه عصبانی است...',
          emotion: 'worried',
        },
        {
          speaker: 'kavoos',
          text: 'رستم! این جوان گستاخ را نابود کن! او به ایران حمله کرده!',
          emotion: 'angry',
        },
      ],
      autoRelationshipChanges: { kavoos: -15 },
      autoStatChanges: { fame: 20 },
      choices: [
        {
          id: 'c15',
          text: '🛡️ رستم به میدان نبرد می‌آید',
          nextNodeId: 'rostam_arrives_battle',
        },
      ],
    },

    rostam_arrives_battle: {
      id: 'rostam_arrives_battle',
      title: 'رستم در میدان نبرد',
      background: 'battle',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'رستم با زره درخشان خود وارد میدان می‌شود. سهراب او را می‌بیند اما نمی‌شناسد...',
          emotion: 'neutral',
        },
        {
          speaker: 'sohrab',
          text: 'تو کیستی، ای پهلوان؟',
          emotion: 'neutral',
        },
        {
          speaker: 'rostam',
          text: 'نام من مهم نیست. تو به ایران حمله کرده‌ای!',
          emotion: 'angry',
        },
      ],
      choices: [
        {
          id: 'c16',
          text: '[سهراب] "من سهراب هستم، فرزند رستم!"',
          nextNodeId: 'truth_revealed_battle',
          statChanges: { honor: 15 },
        },
        {
          id: 'c17',
          text: '[سهراب] "ابتدا بجنگیم، سپس نام‌ها را بگوییم!"',
          nextNodeId: 'tragic_duel',
          statChanges: { courage: 10, wisdom: -15 },
        },
      ],
    },

    truth_revealed_battle: {
      id: 'truth_revealed_battle',
      title: 'حقیقت آشکار می‌شود',
      background: 'battle',
      dialogue: [
        {
          speaker: 'sohrab',
          text: 'من سهراب هستم! پسر رستم! پدر... آیا تو رستمی؟',
          emotion: 'surprised',
        },
        {
          speaker: 'rostam',
          text: 'سهراب...؟ فرزند من؟!',
          emotion: 'surprised',
        },
        {
          speaker: 'narrator',
          text: 'رستم انگشتر را در دست سهراب می‌بیند. همان انگشتری که سال‌ها پیش به تهمینه داده بود...',
          emotion: 'happy',
        },
        {
          speaker: 'rostam',
          text: 'پسرم! چقدر منتظر این لحظه بودم!',
          emotion: 'happy',
        },
      ],
      autoRelationshipChanges: { rostam: 30, sohrab: 30 },
      autoStatChanges: { fame: 25, honor: 20 },
      achievementUnlocked: 'پدر و پسر متحد شدند',
      choices: [
        {
          id: 'c18',
          text: '❤️ آغوش گرفتن یکدیگر',
          nextNodeId: 'battlefield_reunion',
        },
      ],
    },

    battlefield_reunion: {
      id: 'battlefield_reunion',
      title: 'اتحاد پدر و پسر',
      background: 'reunion',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'رستم و سهراب یکدیگر را در آغوش می‌گیرند. تمام سپاهیان شاهد این لحظه تاریخی هستند...',
          emotion: 'happy',
        },
        {
          speaker: 'sohrab',
          text: 'پدر، بیا با هم ایران را قدرتمند‌تر کنیم!',
          emotion: 'happy',
        },
        {
          speaker: 'rostam',
          text: 'پسرم، از این پس همیشه کنار هم خواهیم بود!',
          emotion: 'happy',
        },
        {
          speaker: 'kavoos',
          text: 'چه... چه اتفاقی افتاد؟ این پهلوان توران... پسر تو است؟!',
          emotion: 'surprised',
        },
      ],
      autoRelationshipChanges: { rostam: 40, sohrab: 40, tahmineh: 30 },
      isEnding: true,
      endingType: 'good',
      choices: [],
    },

    // ==================== مسیر تراژدی ====================
    tragic_duel: {
      id: 'tragic_duel',
      title: 'نبرد تراژیک',
      background: 'battle',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'پدر و پسر، بدون اینکه یکدیگر را بشناسند، شروع به جنگ می‌کنند...',
          emotion: 'worried',
        },
        {
          speaker: 'narrator',
          text: 'نبرد سه روز و سه شب طول می‌کشد. هر دو پهلوان زخمی می‌شوند...',
          emotion: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'در آخرین حمله، رستم شمشیر خود را به سینه سهراب فرو می‌برد...',
          emotion: 'sad',
        },
        {
          speaker: 'sohrab',
          text: 'آه... پدر... آیا تویی...؟',
          emotion: 'sad',
        },
      ],
      autoRelationshipChanges: { rostam: -50, sohrab: -50 },
      choices: [
        {
          id: 'c19',
          text: '💔 ادامه...',
          nextNodeId: 'tragic_ending',
        },
      ],
    },

    tragic_ending: {
      id: 'tragic_ending',
      title: 'پایان تلخ',
      background: 'battle',
      dialogue: [
        {
          speaker: 'sohrab',
          text: 'این... انگشتر مادرم است... او گفت پدرم... رستم...',
          emotion: 'sad',
        },
        {
          speaker: 'rostam',
          text: 'نه... نه! سهراب؟! فرزند من؟!',
          emotion: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'رستم با دیدن انگشتر، می‌فهمد که فرزند خود را کشته است...',
          emotion: 'sad',
        },
        {
          speaker: 'rostam',
          text: 'چه کردم...؟ فرزندم... ببخش... ببخش...',
          emotion: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'سهراب در آغوش پدرش جان می‌دهد. این تراژدی برای همیشه در تاریخ باقی ماند...',
          emotion: 'sad',
        },
      ],
      isEnding: true,
      endingType: 'bad',
      choices: [],
    },

    // ==================== پایان خوش ====================
    happy_reunion: {
      id: 'happy_reunion',
      title: 'بازگشت به سمنگان',
      background: 'reunion',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'رستم با عجله به سمنگان می‌رود...',
          emotion: 'happy',
        },
        {
          speaker: 'rostam',
          text: 'تهمینه! کجاست فرزندم؟ کجاست سهراب؟!',
          emotion: 'happy',
        },
        {
          speaker: 'tahmineh',
          text: 'رستم... بعد از این همه سال... برگشتی!',
          emotion: 'happy',
        },
        {
          speaker: 'sohrab',
          text: 'تو... تو رستمی؟ تو پدر منی؟!',
          emotion: 'surprised',
        },
        {
          speaker: 'rostam',
          text: 'پسرم... چقدر بزرگ شده‌ای! ببخش که این همه دیر کردم...',
          emotion: 'happy',
        },
        {
          speaker: 'sohrab',
          text: 'پدر! آخرش پیدات کردم!',
          emotion: 'happy',
        },
      ],
      autoRelationshipChanges: { rostam: 50, sohrab: 50, tahmineh: 40 },
      autoStatChanges: { honor: 30, fame: 30 },
      achievementUnlocked: 'خانواده دوباره متحد شد',
      isEnding: true,
      endingType: 'good',
      choices: [],
    },

    // مسیرهای دیگر...
    suspicious_sohrab: {
      id: 'suspicious_sohrab',
      title: 'تردید سهراب',
      background: 'desert',
      dialogue: [
        {
          speaker: 'sohrab',
          text: 'توران و ایران دشمن هستند. چرا باید به شما اعتماد کنم؟',
          emotion: 'angry',
        },
        {
          speaker: 'human_ford',
          text: 'ما فقط می‌خواهیم کمک کنیم... اما اگر نمی‌خواهی...',
          emotion: 'neutral',
        },
      ],
      choices: [
        {
          id: 'c20',
          text: '🚶 "تنها به ایران می‌روم!"',
          nextNodeId: 'alone_journey',
          statChanges: { wisdom: 15, courage: 10 },
        },
        {
          id: 'c21',
          text: '🤝 "باشه، با شما می‌آیم."',
          nextNodeId: 'with_turan_army',
          statChanges: { wisdom: -5 },
        },
      ],
    },

    alone_journey: {
      id: 'alone_journey',
      title: 'سفر تنهایی',
      background: 'desert',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'سهراب تنها به سوی ایران حرکت می‌کند...',
          emotion: 'neutral',
        },
        {
          speaker: 'sohrab',
          text: 'پدر، منتظرم باش. دارم می‌آیم...',
          emotion: 'neutral',
        },
      ],
      choices: [
        {
          id: 'c22',
          text: '🏰 به دربار ایران می‌رسد',
          nextNodeId: 'peaceful_arrival',
        },
      ],
    },

    peaceful_arrival: {
      id: 'peaceful_arrival',
      title: 'ورود صلح‌آمیز',
      background: 'throne',
      dialogue: [
        {
          speaker: 'sohrab',
          text: 'سلام! من به دنبال رستم، پهلوان ایران می‌گردم. من پسر او هستم!',
          emotion: 'happy',
        },
        {
          speaker: 'goudarz',
          text: 'چه می‌گویی؟! پسر رستم؟',
          emotion: 'surprised',
        },
        {
          speaker: 'narrator',
          text: 'گودرز با عجله رستم را خبر می‌کند...',
          emotion: 'neutral',
        },
      ],
      choices: [
        {
          id: 'c23',
          text: '👨‍👦 رستم می‌آید',
          nextNodeId: 'peaceful_reunion',
        },
      ],
    },

    peaceful_reunion: {
      id: 'peaceful_reunion',
      title: 'دیدار پدر و پسر',
      background: 'reunion',
      dialogue: [
        {
          speaker: 'rostam',
          text: 'سهراب...؟ واقعاً تویی؟',
          emotion: 'surprised',
        },
        {
          speaker: 'sohrab',
          text: 'پدر! نگاه کن، انگشتر تو را دارم!',
          emotion: 'happy',
        },
        {
          speaker: 'rostam',
          text: 'پسرم! چقدر شجاع و قدرتمند شده‌ای!',
          emotion: 'happy',
        },
        {
          speaker: 'sohrab',
          text: 'حالا می‌توانیم با هم باشیم، پدر!',
          emotion: 'happy',
        },
      ],
      autoRelationshipChanges: { rostam: 50, sohrab: 50 },
      autoStatChanges: { honor: 35, wisdom: 25, fame: 30 },
      achievementUnlocked: 'پایان کامل - خرد و شجاعت',
      isEnding: true,
      endingType: 'good',
      choices: [],
    },

    cautious_approach: {
      id: 'cautious_approach',
      title: 'رویکرد محتاطانه',
      background: 'palace',
      dialogue: [
        {
          speaker: 'rostam',
          text: 'ابتدا جاسوسی می‌فرستم تا ببینم این داستان واقعی است یا نه.',
          emotion: 'neutral',
        },
        {
          speaker: 'goudarz',
          text: 'تصمیم عاقلانه‌ای است، رستم.',
          emotion: 'happy',
        },
      ],
      choices: [
        {
          id: 'c24',
          text: '🔍 فرستادن جاسوس',
          nextNodeId: 'spy_confirms',
        },
      ],
    },

    spy_confirms: {
      id: 'spy_confirms',
      title: 'تأیید خبر',
      background: 'fortress',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'جاسوس برمی‌گردد و خبر را تأیید می‌کند...',
          emotion: 'happy',
        },
        {
          speaker: 'rostam',
          text: 'پس حقیقت دارد! باید بروم و فرزندم را ببینم!',
          emotion: 'happy',
        },
      ],
      choices: [
        {
          id: 'c25',
          text: '🏇 عزیمت به سمنگان',
          nextNodeId: 'happy_reunion',
        },
      ],
    },

    hide_identity: {
      id: 'hide_identity',
      title: 'هویت مخفی',
      background: 'battle',
      dialogue: [
        {
          speaker: 'sohrab',
          text: 'بهتر است نام خود را مخفی کنم تا زمان مناسب...',
          emotion: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'سهراب به عنوان یک جنگجوی ناشناس وارد ایران می‌شود...',
          emotion: 'neutral',
        },
      ],
      choices: [
        {
          id: 'c26',
          text: '⚔️ شرکت در مسابقات جنگی',
          nextNodeId: 'tournament',
        },
      ],
    },

    tournament: {
      id: 'tournament',
      title: 'مسابقات جنگی',
      background: 'battle',
      dialogue: [
        {
          speaker: 'narrator',
          text: 'سهراب در مسابقات شرکت می‌کند و همه را شکست می‌دهد...',
          emotion: 'happy',
        },
        {
          speaker: 'kavoos',
          text: 'این جوان بسیار قدرتمند است! رستم، تو هم باید در مسابقه شرکت کنی!',
          emotion: 'neutral',
        },
      ],
      choices: [
        {
          id: 'c27',
          text: '🏆 نبرد نهایی با رستم',
          nextNodeId: 'tournament_final',
        },
      ],
    },

    tournament_final: {
      id: 'tournament_final',
      title: 'نبرد نهایی',
      background: 'battle',
      dialogue: [
        {
          speaker: 'rostam',
          text: 'تو پهلوان باتجربه‌ای هستی، جوان. از کجا آمده‌ای؟',
          emotion: 'neutral',
        },
        {
          speaker: 'sohrab',
          text: 'من... من از سمنگان هستم. و این انگشتر را دارم...',
          emotion: 'neutral',
        },
        {
          speaker: 'rostam',
          text: 'این... این انگشتر من است! تو... سهراب؟!',
          emotion: 'surprised',
        },
      ],
      choices: [
        {
          id: 'c28',
          text: '❤️ "پدر، منم!"',
          nextNodeId: 'tournament_reunion',
        },
      ],
    },

    tournament_reunion: {
      id: 'tournament_reunion',
      title: 'دیدار در مسابقه',
      background: 'reunion',
      dialogue: [
        {
          speaker: 'rostam',
          text: 'پسرم! چه راهی طولانی را طی کرده‌ای!',
          emotion: 'happy',
        },
        {
          speaker: 'sohrab',
          text: 'می‌خواستم ثابت کنم که شایسته پدری مثل تو هستم!',
          emotion: 'happy',
        },
        {
          speaker: 'kavoos',
          text: 'چه دیداری شگفت‌انگیز! حالا ایران دو پهلوان بزرگ دارد!',
          emotion: 'happy',
        },
      ],
      autoRelationshipChanges: { rostam: 45, sohrab: 45, kavoos: 20 },
      autoStatChanges: { honor: 30, courage: 30, fame: 40 },
      achievementUnlocked: 'قهرمان مسابقات',
      isEnding: true,
      endingType: 'good',
      choices: [],
    },
  },
};
