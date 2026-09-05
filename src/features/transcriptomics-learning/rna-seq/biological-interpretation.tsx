import { useMemo, useState, type ReactNode } from "react";

import {
  GuidedConceptLesson,
  type GuidedLessonSection,
} from "@/features/learning/components/GuidedConceptLesson";

const pathwayGenes = [
  { gene: "MKI67", score: 3.2, role: "تکثیر" },
  { gene: "TOP2A", score: 2.7, role: "چرخه سلولی" },
  { gene: "CXCL9", score: 2.1, role: "پاسخ ایمنی" },
  { gene: "COL1A1", score: 1.8, role: "ماتریکس خارج‌سلولی" },
  { gene: "KRT19", score: 1.4, role: "اپی‌تلیال" },
  { gene: "ALDOB", score: -1.6, role: "متابولیسم" },
  { gene: "PDK4", score: -2.0, role: "متابولیسم" },
  { gene: "G6PC", score: -2.4, role: "متابولیسم" },
];

const sections: GuidedLessonSection[] = [
  {
    title: "فهرست ژن، نتیجه زیستی نیست",
    eyebrow: "محدودیت درس ۹",
    headline: "حتی یک جدول عالی از ژن‌های بیان افتراقی هنوز به ما نمی‌گوید «چه فرایند زیستی» در حال تغییر است.",
    lead:
      "در درس ۹ یاد گرفتیم برای هر ژن اندازه اثر، عدم‌قطعیت و معنی‌داری آماری را کنار هم ببینیم. حالا فرض کنید ۳۰۰ ژن قابل توجه داریم. خواندن ۳۰۰ نام ژن به‌تنهایی یک داستان زیستی قابل دفاع نمی‌سازد. باید از الگوهای مشترک میان ژن‌ها کمک بگیریم، بدون اینکه از داده بیشتر از آنچه واقعاً نشان می‌دهد نتیجه‌گیری کنیم.",
    connection:
      "درس ۹ به ما ژن‌ها و جهت تغییرشان را داد. درس ۱۰ می‌پرسد چگونه از این خروجی به فرضیه‌ای درباره زیست‌شناسی برسیم.",
    flow: ["نتیجه بیان افتراقی", "ژن‌ها و اندازه اثر", "الگوهای مشترک", "مجموعه ژنی / مسیر", "فرضیه زیستی", "بررسی و اعتبارسنجی"],
    insight: <GeneListLab />,
    question: {
      question: "اگر ۳۰۰ ژن معنی‌دار داشته باشیم، کدام جمله علمی‌تر است؟",
      options: [
        "همین فهرست ژن‌ها به‌تنهایی اثبات می‌کند یک مسیر زیستی فعال شده است.",
        "فهرست ژن‌ها نقطه شروع است و باید ببینیم آیا الگوهای منسجم در مجموعه‌های ژنی یا مسیرهای از پیش تعریف‌شده وجود دارد.",
        "فقط ژنی که کوچک‌ترین مقدار p را دارد برای تفسیر کافی است.",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. هدف تفسیر زیستی، تبدیل خروجی آماری به فرضیه‌ای منسجم و محدود به شواهد داده است.",
      incorrectFeedback:
        "فهرست ژن یا یک ژن منفرد به‌تنهایی برای ادعای یک فرایند زیستی کافی نیست. باید ساختار جمعی شواهد را بررسی کنیم.",
    },
    bridge: {
      openQuestion: "برای دیدن الگوی جمعی ژن‌ها، اصلاً «مجموعه ژنی» چیست و چه فرقی با یک مسیر زیستی دارد؟",
      nextStep:
        "بخش بعد این واحدهای تفسیر را از پایه می‌سازد تا بعداً غنی‌سازی برایتان فقط یک جدول خروجی نباشد.",
    },
  },
  {
    title: "مجموعه ژنی و مسیر",
    eyebrow: "واحد تفسیر",
    headline: "قبل از غنی‌سازی باید بدانیم ژن‌ها را بر اساس چه دانشی گروه‌بندی می‌کنیم.",
    lead:
      "یک مجموعه ژنی، گروهی از ژن‌هاست که بر اساس یک ویژگی مشترک از پیش تعریف شده‌اند؛ مثلاً عضویت در یک فرایند زیستی، یک پاسخ سلولی یا یک امضای تجربی. بعضی مجموعه‌ها نماینده مسیرهای زیستی‌اند، بعضی نه. بنابراین نام یک مجموعه ژنی را نباید خودکار معادل یک مسیر مکانیکی کامل در سلول دانست.",
    terms: [
      {
        term: "gene set",
        persianLabel: "مجموعه ژنی",
        explanation:
          "گروهی از ژن‌ها که بر اساس دانش یا داده قبلی کنار هم قرار گرفته‌اند. این گروه می‌تواند یک فرایند، مسیر، امضای سلولی یا پاسخ تجربی را نمایندگی کند.",
      },
      {
        term: "pathway",
        persianLabel: "مسیر زیستی",
        explanation:
          "مدلی از ارتباط رویدادها یا مولکول‌ها در یک فرایند زیستی. هر مجموعه ژنی لزوماً یک مسیر مکانیکی کامل نیست.",
      },
      {
        term: "gene ontology",
        persianLabel: "هستی‌شناسی ژن",
        explanation:
          "چارچوبی ساختاریافته برای توصیف ویژگی‌ها و فرایندهای مرتبط با ژن‌ها. دسته‌های GO با مسیرهای کلاسیک یکسان نیستند.",
      },
    ],
    insight: <GeneSetLab />,
    question: {
      question: "کدام برداشت درباره مجموعه ژنی درست‌تر است؟",
      options: [
        "هر مجموعه ژنی حتماً یک مسیر خطی و قطعی داخل سلول است.",
        "مجموعه ژنی یک گروه از ژن‌ها با تعریف قبلی است و نوع دانش پشت آن باید هنگام تفسیر در نظر گرفته شود.",
        "نام مجموعه ژنی مهم نیست و فقط مقدار p آن مهم است.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. منبع و تعریف مجموعه ژنی بخشی از شواهد تفسیر است، نه جزئیات تزئینی.",
      incorrectFeedback:
        "مجموعه‌های ژنی انواع مختلف دارند و نام یا پایگاه آن‌ها باید همراه با منطق زیستی تفسیر شود.",
    },
    bridge: {
      openQuestion: "حالا اگر یک فهرست از ژن‌های منتخب داشته باشیم، چطور بفهمیم یک مجموعه ژنی بیش از انتظار در آن دیده می‌شود؟",
      nextStep:
        "این سؤال ما را به تحلیل بیش‌نمایندگی می‌رساند؛ اما یک جزء پنهان به نام «پس‌زمینه» نتیجه را شدیداً تحت تأثیر قرار می‌دهد.",
    },
  },
  {
    title: "تحلیل بیش‌نمایندگی و پس‌زمینه",
    eyebrow: "روش اول غنی‌سازی",
    headline: "در تحلیل بیش‌نمایندگی فقط فهرست ژن‌های منتخب مهم نیست؛ باید بدانیم این ژن‌ها از چه جهان ممکنی انتخاب شده‌اند.",
    lead:
      "تحلیل بیش‌نمایندگی می‌پرسد آیا اعضای یک مجموعه ژنی در فهرست ژن‌های منتخب ما بیشتر از چیزی هستند که با توجه به پس‌زمینه انتظار می‌رود. پس‌زمینه باید تا حد امکان نماینده ژن‌هایی باشد که واقعاً امکان ورود به تحلیل و انتخاب شدن داشته‌اند، نه لزوماً همه ژن‌های شناخته‌شده انسان.",
    terms: [
      {
        term: "over-representation analysis",
        persianLabel: "تحلیل بیش‌نمایندگی",
        explanation:
          "روشی که فراوانی اعضای یک مجموعه ژنی را در فهرست ژن‌های منتخب با فراوانی مورد انتظار در یک پس‌زمینه مقایسه می‌کند. اختصار رایج آن ORA است.",
      },
      {
        term: "background universe",
        persianLabel: "جهان پس‌زمینه",
        explanation:
          "مجموعه ژن‌هایی که در اصل امکان مشاهده یا آزمون شدن داشته‌اند و مرجع مقایسه برای ORA هستند.",
      },
    ],
    insight: <OraUniverseLab />,
    question: {
      question: "برای ORA کدام پس‌زمینه معمولاً منطقی‌تر است؟",
      options: [
        "همه ژن‌هایی که تا امروز در انسان نام‌گذاری شده‌اند، بدون توجه به داده ما.",
        "ژن‌هایی که در تحلیل ما واقعاً قابل آزمون/مشاهده بوده‌اند و با مجموعه ژنی قابل نگاشت‌اند.",
        "فقط همان ژن‌های معنی‌دار.",
      ],
      correctIndex: 1,
      correctFeedback:
        "بله. پس‌زمینه باید فرصت واقعی انتخاب‌شدن ژن‌ها را بازتاب دهد؛ وگرنه انتظار آماری می‌تواند منحرف شود.",
      incorrectFeedback:
        "در ORA، جهان مرجع بخشی از مدل است. پس‌زمینه نامناسب می‌تواند نتیجه غنی‌سازی را تغییر دهد.",
    },
    bridge: {
      openQuestion: "اما ORA یک مشکل دیگر هم دارد: چه کسی تعیین می‌کند کدام ژن وارد فهرست «منتخب» شود؟",
      nextStep:
        "در بخش بعد می‌بینید چگونه تغییر یک آستانه می‌تواند فهرست و نتیجه ORA را عوض کند و چرا روش‌های رتبه‌محور به وجود آمده‌اند.",
    },
  },
  {
    title: "وابستگی به آستانه",
    eyebrow: "محدودیت ORA",
    headline: "مرز «منتخب / غیرمنتخب» یک تصمیم تحلیلی است؛ زیست‌شناسی چنین دیوار تیزی ندارد.",
    lead:
      "اگر ژن‌ها را با آستانه‌ای مثل مقدار p تعدیل‌شده و اندازه اثر انتخاب کنیم، ژنی که کمی دو طرف مرز قرار می‌گیرد می‌تواند سرنوشت متفاوتی پیدا کند. این به معنی بدبودن ORA نیست؛ یعنی باید بدانیم نتیجه آن به تعریف فهرست ورودی وابسته است.",
    insight: <ThresholdLab />,
    question: {
      question: "اگر با تغییر کوچک آستانه، نتیجه ORA عوض شود، بهترین برداشت چیست؟",
      options: [
        "یکی از دو تحلیل حتماً تقلبی است.",
        "نتیجه به تعریف فهرست حساس است؛ باید این حساسیت را بشناسیم و در صورت مناسب بودن روش رتبه‌محور را هم بررسی کنیم.",
        "باید آستانه‌ای را انتخاب کنیم که نتیجه دلخواه را بدهد.",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. آستانه بخشی از تحلیل است و باید از قبل یا با منطق روشن انتخاب و گزارش شود.",
      incorrectFeedback:
        "هدف پیدا کردن آستانه دلخواه نیست؛ هدف فهم حساسیت نتیجه و انتخاب روش متناسب با سؤال است.",
    },
    bridge: {
      openQuestion: "اگر نخواهیم ژن‌ها را به دو گروه منتخب و غیرمنتخب ببریم، چطور می‌توانیم از کل رتبه‌بندی ژن‌ها استفاده کنیم؟",
      nextStep:
        "بخش بعد تحلیل غنی‌سازی مجموعه ژنی را معرفی می‌کند؛ روشی که به جای فهرست بریده‌شده، الگوی یک مجموعه را در امتداد رتبه‌بندی دنبال می‌کند.",
    },
  },
  {
    title: "GSEA و فهرست رتبه‌بندی‌شده",
    eyebrow: "روش دوم غنی‌سازی",
    headline: "گاهی سؤال بهتر این نیست که «چند ژن منتخب داریم؟» بلکه این است که «اعضای یک مجموعه در کجای رتبه‌بندی جمع شده‌اند؟»",
    lead:
      "در تحلیل غنی‌سازی مجموعه ژنی، ژن‌ها بر اساس یک آماره مناسب رتبه‌بندی می‌شوند و بررسی می‌شود اعضای یک مجموعه ژنی در بالا یا پایین فهرست به شکل هماهنگ تجمع دارند یا نه. این رویکرد می‌تواند سیگنال‌های هماهنگی را ببیند که شاید هیچ ژن منفردی از یک آستانه سخت عبور نکرده باشد.",
    terms: [
      {
        term: "gene set enrichment analysis",
        persianLabel: "تحلیل غنی‌سازی مجموعه ژنی",
        explanation:
          "روشی رتبه‌محور که جایگاه اعضای یک مجموعه ژنی را در یک فهرست رتبه‌بندی‌شده بررسی می‌کند. نام شناخته‌شده آن GSEA است.",
      },
      {
        term: "normalized enrichment score",
        persianLabel: "امتیاز غنی‌سازی نرمال‌شده",
        explanation:
          "در GSEA، آماره‌ای برای بیان جهت و شدت نسبی غنی‌سازی پس از نرمال‌سازی امتیاز غنی‌سازی با توجه به ویژگی‌های مجموعه ژنی. اختصار آن NES است.",
      },
      {
        term: "leading edge",
        persianLabel: "زیرمجموعه پیشرو",
        explanation:
          "بخشی از اعضای یک مجموعه ژنی که بیشترین سهم را در سیگنال غنی‌سازی مشاهده‌شده دارند.",
      },
    ],
    insight: <RankedListLab />,
    question: {
      question: "تفاوت مفهومی اصلی ORA و GSEA چیست؟",
      options: [
        "ORA معمولاً از یک فهرست منتخب استفاده می‌کند؛ GSEA از اطلاعات رتبه‌بندی گسترده‌تری از ژن‌ها بهره می‌گیرد.",
        "GSEA فقط روی یک ژن اجرا می‌شود و ORA روی چند ژن.",
        "هر دو دقیقاً یک سؤال و یک ورودی دارند.",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. این دو روش می‌توانند مکمل باشند چون سؤال آماری و نوع ورودی‌شان یکسان نیست.",
      incorrectFeedback:
        "ORA و GSEA هر دو درباره مجموعه ژنی‌اند، اما یکی بیشتر فهرست منتخب را می‌سنجد و دیگری ساختار رتبه‌بندی را.",
    },
    bridge: {
      openQuestion: "حتی اگر روش آماری درست باشد، اگر شناسه ژن‌ها با پایگاه مجموعه ژنی درست تطبیق نکند چه می‌شود؟",
      nextStep:
        "بخش بعد نشان می‌دهد چرا نگاشت شناسه‌ها و نسخه پایگاه بخشی از تفسیر علمی است، نه یک کار اداری قبل از تحلیل.",
    },
  },
  {
    title: "شناسه ژن و نگاشت",
    eyebrow: "کنترل ورودی تفسیر",
    headline: "یک ژن گمشده در نگاشت می‌تواند فقط یک ردیف فنی نباشد؛ ممکن است بخشی از سیگنال زیستی شما را حذف کند.",
    lead:
      "نتایج RNA-seq ممکن است با ENSEMBL، نماد ژن یا شناسه‌های دیگر گزارش شوند؛ در حالی که پایگاه مجموعه ژنی قالب دیگری انتظار دارد. تبدیل شناسه باید با گونه، نسخه و قواعد روشن انجام شود. نگاشت یک‌به‌چند یا شناسه‌های منقضی‌شده باید بررسی شوند، نه اینکه بی‌صدا دور ریخته شوند.",
    terms: [
      {
        term: "gene identifier mapping",
        persianLabel: "نگاشت شناسه ژن",
        explanation:
          "تبدیل کنترل‌شده شناسه‌های ژن از یک نظام نام‌گذاری به نظام دیگر با توجه به گونه و نسخه منبع.",
      },
    ],
    insight: <IdMappingLab />,
    question: {
      question: "اگر ۱۵٪ ژن‌های ورودی به پایگاه مجموعه ژنی نگاشت نشوند، چه کنیم؟",
      options: [
        "نادیده بگیریم؛ چون ابزار بدون خطا اجرا شده است.",
        "علت نگاشت‌نشدن، نوع شناسه، گونه و نسخه را بررسی و نرخ نگاشت را گزارش کنیم.",
        "نام ژن‌ها را دستی و بدون ثبت تغییر دهیم تا تعداد بیشتری نگاشت شوند.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. نرخ و کیفیت نگاشت بخشی از قابلیت بازتولید و تفسیر نتیجه است.",
      incorrectFeedback:
        "اجرای موفق نرم‌افزار به معنی نگاشت زیستی درست نیست. ژن‌های ازدست‌رفته باید قابل توضیح باشند.",
    },
    bridge: {
      openQuestion: "اگر ده‌ها مجموعه ژنی شبیه به هم هم‌زمان معنی‌دار شوند، آیا واقعاً ده فرایند مستقل کشف کرده‌ایم؟",
      nextStep:
        "بخش بعد درباره همپوشانی، آزمون‌های متعدد و افزونگی مجموعه‌های ژنی است.",
    },
  },
  {
    title: "آزمون‌های متعدد و افزونگی",
    eyebrow: "نتیجه غنی‌سازی هم نیازمند کنترل است",
    headline: "جدول غنی‌سازی می‌تواند صدها ردیف داشته باشد؛ معنی‌داربودن چند نام مشابه به معنی چند کشف مستقل نیست.",
    lead:
      "در غنی‌سازی معمولاً مجموعه‌های زیادی آزمون می‌شوند، پس دوباره مسئله آزمون‌های متعدد و نرخ کشف کاذب مطرح است. علاوه بر آن، مجموعه‌های ژنی می‌توانند اعضای مشترک زیادی داشته باشند؛ بنابراین چند نتیجه مشابه ممکن است بازتاب یک سیگنال مشترک باشند.",
    terms: [
      {
        term: "gene set redundancy",
        persianLabel: "افزونگی مجموعه‌های ژنی",
        explanation:
          "وضعیتی که چند مجموعه ژنی به دلیل اعضای مشترک یا تعریف‌های نزدیک، اطلاعات زیستی بسیار مشابهی را گزارش می‌کنند.",
      },
    ],
    insight: <RedundancyLab />,
    question: {
      question: "اگر پنج مجموعه با نام‌های نزدیک و ژن‌های مشترک معنی‌دار شوند، بهترین تفسیر چیست؟",
      options: [
        "پنج مسیر کاملاً مستقل فعال شده‌اند.",
        "ابتدا همپوشانی ژن‌ها و رابطه مفهومی مجموعه‌ها را بررسی کنیم و شاید آن‌ها را به یک تم زیستی مشترک خلاصه کنیم.",
        "چهار مورد را تصادفی حذف کنیم و یکی را نگه داریم.",
      ],
      correctIndex: 1,
      correctFeedback:
        "بله. هدف تفسیر، شمارش ردیف‌های جدول نیست؛ ساختن تصویری منسجم از شواهد مرتبط است.",
      incorrectFeedback:
        "مجموعه‌های ژنی مستقل از هم نیستند. همپوشانی اعضا و تعریف‌ها باید هنگام خلاصه‌سازی نتیجه دیده شود.",
    },
    bridge: {
      openQuestion: "اگر یک مجموعه ژنی غنی شده باشد، آیا می‌توانیم بگوییم آن مسیر حتماً «فعال» شده است؟",
      nextStep:
        "این یکی از مهم‌ترین دام‌های تفسیر است. بخش بعد جهت اثر، نوع روش و محدودیت واژه «فعال‌شدن» را روشن می‌کند.",
    },
  },
  {
    title: "غنی‌شدن یعنی فعال‌شدن؟",
    eyebrow: "مرز ادعای علمی",
    headline: "غنی‌شدن یک مجموعه ژنی شواهد آماری درباره الگوی ژن‌هاست؛ به‌تنهایی اثبات فعالیت مکانیکی یک مسیر نیست.",
    lead:
      "در ORA ممکن است یک مجموعه میان ژن‌های بالا یا پایین‌تنظیم‌شده بیش‌نمایندگی داشته باشد. در GSEA جهت رتبه‌بندی و علامت امتیاز غنی‌سازی اطلاعات بیشتری درباره سمت تجمع ژن‌ها می‌دهد. با این حال، از داده RNA-seq توده‌ای معمولاً نباید بدون شواهد تکمیلی درباره فعالیت پروتئین‌ها، فسفریلاسیون یا علیت مسیر ادعای قطعی کرد.",
    insight: <DirectionLab />,
    question: {
      question: "اگر یک مجموعه مرتبط با پاسخ ایمنی در نمونه درمانی غنی شود، کدام جمله محتاطانه‌تر است؟",
      options: [
        "این دارو قطعاً مسیر ایمنی را در سلول سرطانی فعال کرده است.",
        "الگوی بیان ژن با افزایش سیگنال‌های مرتبط با پاسخ ایمنی سازگار است؛ باید منشأ سلولی و شواهد تکمیلی بررسی شود.",
        "هیچ تفسیر زیستی از RNA-seq ممکن نیست.",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. تفسیر خوب نه بیش‌ادعا می‌کند و نه از داده فرار می‌کند؛ سطح ادعا را با نوع شواهد هماهنگ می‌کند.",
      incorrectFeedback:
        "RNA-seq می‌تواند فرضیه زیستی قوی بسازد، اما معمولاً به‌تنهایی مکانیزم یا علیت را اثبات نمی‌کند.",
    },
    bridge: {
      openQuestion: "در RNA-seq توده‌ای یک مشکل دیگر هم داریم: آیا تغییر مسیر از خود سلول‌های سرطانی آمده یا از تغییر ترکیب سلولی بافت؟",
      nextStep:
        "سناریوی سرطان پانکراس در بخش بعد همین مسئله را به یک تصمیم واقعی تبدیل می‌کند.",
    },
  },
  {
    title: "سناریوی سرطان پانکراس",
    eyebrow: "تفسیر در زمینه زیستی",
    headline: "یک تم ایمنی یا استرومایی در RNA-seq توده‌ای می‌تواند درباره ترکیب بافت به اندازه تنظیم درون‌سلولی اطلاعات داشته باشد.",
    lead:
      "در نمونه توده‌ای سرطان پانکراس، سلول‌های بدخیم، فیبروبلاست‌ها، سلول‌های ایمنی و سایر اجزا با هم اندازه‌گیری می‌شوند. بنابراین افزایش ژن‌های ماتریکس خارج‌سلولی یا ایمنی ممکن است از تغییر سهم این سلول‌ها، تغییر بیان درون همان سلول‌ها یا ترکیبی از هر دو ناشی شود.",
    connection:
      "این محدودیت را در درس ۲ درباره ماهیت نمونه توده‌ای دیدیم؛ حالا همان مفهوم مستقیم روی تفسیر نتایج مسیر اثر می‌گذارد.",
    scenario: {
      title: "درمان X و بافت تومور پانکراس",
      description:
        "بعد از درمان، مجموعه‌های مربوط به پاسخ ایمنی، ماتریکس خارج‌سلولی و چرخه سلولی تغییر نشان می‌دهند. هم‌زمان در فراداده پاتولوژی، برخی نمونه‌ها تفاوت در درصد استروما دارند.",
      items: [
        "تم ایمنی: چندین مجموعه همپوشان با ژن‌های CXCL9 و HLA گزارش شده‌اند.",
        "تم استروما: COL1A1 و COL3A1 در چند مجموعه مشترک‌اند.",
        "چرخه سلولی: ژن‌هایی مثل MKI67 و TOP2A کاهش/افزایش جهت‌دار نشان می‌دهند.",
        "فراداده بافت: درصد استروما بین برخی نمونه‌ها متفاوت است.",
      ],
    },
    insight: <PancreaticStoryLab />,
    question: {
      question: "برای یک نتیجه قابل دفاع درباره تم استروما، چه چیزی را باید همراه غنی‌سازی بررسی کنیم؟",
      options: [
        "فقط نام اولین مسیر جدول.",
        "جهت تغییر ژن‌های اصلی، همپوشانی مجموعه‌ها، فراداده بافت و احتمال تفاوت ترکیب سلولی.",
        "فقط تعداد کل خوانش‌های نمونه.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. تفسیر زیستی یعنی اتصال نتیجه آماری به طراحی، نمونه و شواهد زمینه‌ای.",
      incorrectFeedback:
        "در RNA-seq توده‌ای، زمینه بافت و ترکیب سلولی می‌تواند بخش مهمی از علت الگوهای مسیر باشد.",
    },
    bridge: {
      openQuestion: "حالا چطور تمام این شواهد را به یک ادعای کوتاه، دقیق و قابل بازتولید تبدیل کنیم؟",
      nextStep:
        "بخش آخر یک قالب عملی برای نوشتن نتیجه زیستی می‌دهد و شما را برای پروژه یکپارچه درس ۱۱ آماده می‌کند.",
    },
  },
  {
    title: "از جدول به ادعای قابل دفاع",
    eyebrow: "ایستگاه تسلط",
    headline: "یک تفسیر خوب باید بگوید چه دیدیم، با چه روشی، چه چیزی آن را می‌راند و چه چیزی هنوز نامعلوم است.",
    lead:
      "نتیجه نهایی نباید فقط فهرستی از نام مسیرها باشد. باید روش غنی‌سازی، منبع مجموعه ژنی، جهت اثر، ژن‌های مؤثر، نرخ کشف کاذب، زمینه نمونه و محدودیت‌های تفسیر کنار هم قرار گیرند. این ساختار کمک می‌کند از «داستان‌سازی پس از دیدن داده» فاصله بگیریم.",
    flow: ["نتیجه بیان افتراقی", "روش غنی‌سازی", "مجموعه ژنی و منبع", "جهت و ژن‌های محرک", "زمینه نمونه", "محدودیت", "فرضیه قابل آزمون"],
    insight: <ClaimBuilderLab />,
    question: {
      question: "کدام جمله پایان مناسبی برای این درس است؟",
      options: [
        "مسیرهای معنی‌دار، مکانیزم بیماری را ثابت می‌کنند.",
        "غنی‌سازی ابزاری برای ساختن و اولویت‌بندی فرضیه زیستی است؛ اعتبار ادعا به روش، زمینه و شواهد تکمیلی وابسته است.",
        "بعد از غنی‌سازی دیگر به طراحی مطالعه و فراداده نیازی نداریم.",
      ],
      correctIndex: 1,
      correctFeedback:
        "عالی. حالا می‌توانید از سؤال پژوهشی تا یک فرضیه زیستی قابل دفاع زنجیره استدلال بسازید.",
      incorrectFeedback:
        "تفسیر زیستی پایان تحلیل نیست؛ مرحله‌ای است که تمام تصمیم‌های قبلی باید دوباره در آن دیده شوند.",
    },
    bridge: {
      openQuestion: "آیا می‌توانید تمام تصمیم‌های درس‌های ۱ تا ۱۰ را برای یک پروژه واقعی از ابتدا تا انتها کنار هم بگذارید؟",
      nextStep:
        "درس ۱۱ پروژه یکپارچه سرطان پانکراس است؛ جایی که طراحی مطالعه، RNA، کتابخانه، FASTQ، کنترل کیفیت، کمی‌سازی، ماتریس، PCA، بیان افتراقی و تفسیر زیستی به یک زنجیره واحد تبدیل می‌شوند.",
    },
  },
];

export function RnaSeqBiologicalInterpretationLesson() {
  return (
    <GuidedConceptLesson
      lessonIndex={10}
      title="تفسیر زیستی"
      subtitle="از فهرست ژن‌های بیان افتراقی عبور کنید و یاد بگیرید چگونه مجموعه‌های ژنی، ORA و GSEA را در زمینه طراحی مطالعه و نمونه به یک فرضیه زیستی قابل دفاع تبدیل کنید."
      sectionId="rna-seq-biological-interpretation"
      sections={sections}
    />
  );
}

function GeneListLab() {
  const [mode, setMode] = useState<"table" | "themes">("table");
  return (
    <LabFrame title="زاویه دید را عوض کنید">
      <div className="flex gap-2">
        <ChoiceButton active={mode === "table"} onClick={() => setMode("table")}>فهرست ژن</ChoiceButton>
        <ChoiceButton active={mode === "themes"} onClick={() => setMode("themes")}>تم‌های زیستی</ChoiceButton>
      </div>
      {mode === "table" ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {pathwayGenes.map((item) => (
            <div key={item.gene} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="font-black text-slate-950" dir="ltr">{item.gene}</p>
              <p className="mt-1 text-xs text-slate-500">تغییر در مقیاس log2 = {item.score}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["چرخه سلولی", "پاسخ ایمنی", "متابولیسم"].map((item) => (
            <div key={item} className="rounded-2xl border border-teal-200 bg-teal-50 p-4 font-black text-teal-950">{item}</div>
          ))}
        </div>
      )}
    </LabFrame>
  );
}

function GeneSetLab() {
  const [selected, setSelected] = useState(0);
  const items = [
    ["فرایند زیستی", "گروهی از ژن‌ها که به یک مفهوم مانند پاسخ التهابی مرتبط‌اند."],
    ["مسیر", "مجموعه‌ای با دانش ساختاری یا واکنشی درباره یک فرایند مولکولی."],
    ["امضای تجربی", "ژن‌هایی که در یک آزمایش یا وضعیت خاص به‌طور هماهنگ مشاهده شده‌اند."],
  ];
  return (
    <LabFrame title="همه مجموعه‌های ژنی یک نوع دانش نیستند">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => <ChoiceButton key={item[0]} active={selected === index} onClick={() => setSelected(index)}>{item[0]}</ChoiceButton>)}
      </div>
      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{items[selected]?.[1] ?? ""}</p>
    </LabFrame>
  );
}

function OraUniverseLab() {
  const [universe, setUniverse] = useState<"all" | "tested">("tested");
  const values = universe === "tested" ? { bg: 5000, pathway: 200, selected: 100, hit: 12 } : { bg: 20000, pathway: 300, selected: 100, hit: 12 };
  const expected = (values.selected * values.pathway / values.bg).toFixed(1);
  return (
    <LabFrame title="با تغییر جهان پس‌زمینه، انتظار آماری را تغییر دهید">
      <div className="flex gap-2">
        <ChoiceButton active={universe === "tested"} onClick={() => setUniverse("tested")}>ژن‌های قابل آزمون</ChoiceButton>
        <ChoiceButton active={universe === "all"} onClick={() => setUniverse("all")}>همه ژن‌های شناخته‌شده</ChoiceButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Metric label="پس‌زمینه" value={values.bg.toLocaleString("fa-IR")} />
        <Metric label="اعضای مجموعه" value={values.pathway.toLocaleString("fa-IR")} />
        <Metric label="ژن منتخب" value={values.selected.toLocaleString("fa-IR")} />
        <Metric label="انتظار تقریبی" value={expected} />
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">این محاسبه فقط برای شهود است؛ ORA واقعی از آزمون آماری کامل استفاده می‌کند.</p>
    </LabFrame>
  );
}

function ThresholdLab() {
  const [cutoff, setCutoff] = useState(5);
  const selected = pathwayGenes.filter((_, index) => index < cutoff);
  const immune = selected.filter((item) => item.role === "پاسخ ایمنی").length;
  const cycle = selected.filter((item) => item.role.includes("چرخه") || item.role === "تکثیر").length;
  return (
    <LabFrame title="مرز انتخاب را جابه‌جا کنید">
      <input className="w-full" type="range" min={2} max={8} value={cutoff} onChange={(event) => setCutoff(Number(event.target.value))} />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Metric label="ژن‌های منتخب" value={cutoff.toLocaleString("fa-IR")} />
        <Metric label="عضو تم چرخه سلولی" value={cycle.toLocaleString("fa-IR")} />
        <Metric label="عضو تم ایمنی" value={immune.toLocaleString("fa-IR")} />
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">با تغییر مرز، فهرست ورودی ORA هم تغییر می‌کند. این حساسیت باید بخشی از تفسیر باشد.</p>
    </LabFrame>
  );
}

function RankedListLab() {
  const [method, setMethod] = useState<"ora" | "gsea">("gsea");
  const sorted = useMemo(() => [...pathwayGenes].sort((a, b) => b.score - a.score), []);
  return (
    <LabFrame title="دو سؤال متفاوت را روی یک نتیجه بیان افتراقی ببینید">
      <div className="flex gap-2">
        <ChoiceButton active={method === "ora"} onClick={() => setMethod("ora")}>ORA</ChoiceButton>
        <ChoiceButton active={method === "gsea"} onClick={() => setMethod("gsea")}>GSEA</ChoiceButton>
      </div>
      <div className="mt-4 space-y-2">
        {sorted.map((item, index) => {
          const highlighted = method === "ora" ? index < 4 : item.role === "متابولیسم";
          return (
            <div key={item.gene} className={`flex items-center justify-between rounded-xl border p-3 ${highlighted ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white"}`}>
              <span className="text-xs text-slate-500">رتبه {(index + 1).toLocaleString("fa-IR")}</span>
              <span dir="ltr" className="font-black">{item.gene}</span>
              <span dir="ltr" className="text-xs">{item.score > 0 ? "+" : ""}{item.score}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">در ORA معمولاً فهرستی انتخاب می‌شود؛ در رویکرد رتبه‌محور، جایگاه اعضای مجموعه در کل رتبه‌بندی مهم است.</p>
    </LabFrame>
  );
}

function IdMappingLab() {
  const [fixed, setFixed] = useState(false);
  const rows = fixed
    ? [["ENSG00000111640", "GAPDH", "نگاشت شد"], ["ENSG00000136997", "MYC", "نگاشت شد"], ["ENSG00000299999", "—", "نسخه/شناسه نیازمند بررسی"]]
    : [["ENSG00000111640.15", "—", "ناموفق"], ["ENSG00000136997.14", "—", "ناموفق"], ["ENSG00000299999.1", "—", "ناموفق"]];
  return (
    <LabFrame title="نسخه شناسه را بررسی کنید">
      <ChoiceButton active={fixed} onClick={() => setFixed((current) => !current)}>{fixed ? "نمایش ورودی خام" : "اعمال نگاشت کنترل‌شده"}</ChoiceButton>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead><tr className="text-slate-500"><th className="p-2 text-right">ENSEMBL</th><th className="p-2 text-right">نماد</th><th className="p-2 text-right">وضعیت</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-slate-200"><td className="p-2" dir="ltr">{row[0]}</td><td className="p-2" dir="ltr">{row[1]}</td><td className="p-2">{row[2]}</td></tr>)}</tbody>
        </table>
      </div>
    </LabFrame>
  );
}

function RedundancyLab() {
  const [mode, setMode] = useState<"table" | "themes">("table");
  const rows = [
    ["Interferon response", "CXCL9, STAT1, HLA-B", "0.004"],
    ["IFN-gamma response", "CXCL9, STAT1, HLA-B", "0.006"],
    ["Antigen presentation", "HLA-B, B2M, TAP1", "0.011"],
    ["Immune activation", "STAT1, B2M, CXCL9", "0.014"],
  ];
  return (
    <LabFrame title="از چهار ردیف جدول به یک تم منسجم برسید">
      <div className="flex gap-2"><ChoiceButton active={mode === "table"} onClick={() => setMode("table")}>جدول خام</ChoiceButton><ChoiceButton active={mode === "themes"} onClick={() => setMode("themes")}>خلاصه تم</ChoiceButton></div>
      {mode === "table" ? (
        <div className="mt-4 grid gap-2">{rows.map((row) => <div key={row[0]} className="rounded-xl border border-slate-200 bg-white p-3"><p className="font-black">{row[0]}</p><p className="mt-1 text-xs text-slate-500" dir="ltr">{row[1]} · نرخ کشف کاذب {row[2]}</p></div>)}</div>
      ) : (
        <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-5"><p className="font-black text-teal-950">تم مشترک: پاسخ ایمنی / اینترفرون</p><p className="mt-2 text-sm leading-7 text-teal-900">چند مجموعه با ژن‌های مشترک یک سیگنال زیستی مرتبط را بازتاب می‌دهند؛ ردیف‌های جدول را نباید مستقل شمرد.</p></div>
      )}
    </LabFrame>
  );
}

function DirectionLab() {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const label = direction === "up" ? "اعضای مجموعه در بالای رتبه‌بندی تجمع دارند" : "اعضای مجموعه در پایین رتبه‌بندی تجمع دارند";
  return (
    <LabFrame title="جهت غنی‌سازی را از واژه «فعال‌شدن» جدا کنید">
      <div className="flex gap-2"><ChoiceButton active={direction === "up"} onClick={() => setDirection("up")}>NES مثبت</ChoiceButton><ChoiceButton active={direction === "down"} onClick={() => setDirection("down")}>NES منفی</ChoiceButton></div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-white"><p className="font-black">{label}</p><p className="mt-2 text-sm leading-7 text-slate-300">این جهت درباره رتبه ژن‌هاست؛ برای ادعای فعالیت مکانیکی مسیر باید نوع مجموعه، ژن‌های محرک و شواهد دیگر را هم ببینیم.</p></div>
    </LabFrame>
  );
}

function PancreaticStoryLab() {
  const [focus, setFocus] = useState<"immune" | "stroma" | "cycle">("immune");
  const map = {
    immune: ["پاسخ ایمنی", "CXCL9 / HLA", "بررسی نفوذ سلول‌های ایمنی و فراداده بافت"],
    stroma: ["استروما / ماتریکس خارج‌سلولی", "COL1A1 / COL3A1", "بررسی درصد استروما و ترکیب سلولی"],
    cycle: ["چرخه سلولی", "MKI67 / TOP2A", "بررسی جهت اثر و سازگاری با تکثیر"],
  } as const;
  const current = map[focus];
  return (
    <LabFrame title="تمی را انتخاب کنید و زنجیره شواهدش را ببینید">
      <div className="flex flex-wrap gap-2"><ChoiceButton active={focus === "immune"} onClick={() => setFocus("immune")}>ایمنی</ChoiceButton><ChoiceButton active={focus === "stroma"} onClick={() => setFocus("stroma")}>استروما</ChoiceButton><ChoiceButton active={focus === "cycle"} onClick={() => setFocus("cycle")}>چرخه سلولی</ChoiceButton></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric label="تم" value={current[0]} /><Metric label="ژن‌های محرک" value={current[1]} /><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">سؤال بعدی</p><p className="mt-2 text-sm font-black leading-7">{current[2]}</p></div></div>
    </LabFrame>
  );
}

function ClaimBuilderLab() {
  const [step, setStep] = useState(0);
  const steps = [
    ["مشاهده", "ژن‌های مرتبط با پاسخ ایمنی در رتبه‌بندی درمانی تجمع دارند."],
    ["روش", "نتیجه با یک روش غنی‌سازی رتبه‌محور و مجموعه ژنی از پیش تعریف‌شده به دست آمده است."],
    ["محرک‌ها", "بخشی از سیگنال توسط ژن‌هایی مانند CXCL9 و HLA-B هدایت می‌شود."],
    ["زمینه", "در RNA-seq توده‌ای منشأ این سیگنال می‌تواند تغییر بیان درون‌سلولی، تغییر ترکیب سلولی یا هر دو باشد."],
    ["ادعا", "داده با افزایش سیگنال‌های مرتبط با پاسخ ایمنی سازگار است و یک فرضیه برای بررسی بیشتر ایجاد می‌کند."],
  ];
  return (
    <LabFrame title="ادعای علمی را مرحله‌به‌مرحله بسازید">
      <div className="flex flex-wrap gap-2">{steps.map((item, index) => <ChoiceButton key={item[0]} active={step === index} onClick={() => setStep(index)}>مرحله {(index + 1).toLocaleString("fa-IR")}</ChoiceButton>)}</div>
      <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-5"><p className="font-black text-teal-950">{steps[step]?.[0] ?? ""}</p><p className="mt-2 text-sm leading-7 text-teal-900">{steps[step]?.[1] ?? ""}</p></div>
    </LabFrame>
  );
}

function LabFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <p className="text-xs font-black text-teal-700">آزمایشگاه تعاملی</p>
      <h3 className="mt-2 font-black leading-8 text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${active ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"}`}>
      {children}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-black leading-7 text-slate-950">{value}</p>
    </div>
  );
}
