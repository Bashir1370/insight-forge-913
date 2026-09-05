import { useMemo, useState, type ReactNode } from "react";

import {
  GuidedConceptLesson,
  type GuidedLessonSection,
} from "@/features/learning/components/GuidedConceptLesson";

const samples = [
  { id: "C1", group: "کنترل", batch: "دسته A", total: 24, pc1: 24, pc2: 58, note: "الگوی کلی نزدیک به سایر نمونه‌های کنترل" },
  { id: "C2", group: "کنترل", batch: "دسته A", total: 27, pc1: 31, pc2: 50, note: "الگوی کلی نزدیک به C1" },
  { id: "C3", group: "کنترل", batch: "دسته B", total: 31, pc1: 39, pc2: 63, note: "کنترل از دسته دیگر؛ برای دیدن اثر دسته مفید است" },
  { id: "T1", group: "درمان", batch: "دسته A", total: 26, pc1: 64, pc2: 48, note: "نمونه درمانی با رفتار کلی مشابه T2" },
  { id: "T2", group: "درمان", batch: "دسته B", total: 29, pc1: 70, pc2: 57, note: "نمونه درمانی از دسته دوم" },
  { id: "T3", group: "درمان", batch: "دسته B", total: 15, pc1: 83, pc2: 24, note: "از بقیه دورتر است؛ نیازمند بررسی، نه حذف خودکار" },
];

function getSample(selectedId: string) {
  const sample =
    samples.find((item) => item.id === selectedId) ?? samples[0];

  if (!sample) {
    throw new Error("Sample-level QC requires at least one sample.");
  }

  return sample;
}

const sections: GuidedLessonSection[] = [
  {
    title: "چرا از ژن به نمونه برمی‌گردیم؟",
    eyebrow: "محدودیت درس ۷",
    headline: "ماتریس شمارش ساخته شد؛ حالا باید ببینیم نمونه‌ها به‌عنوان یک کل چگونه رفتار می‌کنند.",
    lead:
      "در درس ۷ هر ستون یک نمونه و هر سطر یک ژن بود. قبل از اینکه برای هزاران ژن آزمون آماری انجام دهیم، باید یک سؤال ساده‌تر بپرسیم: آیا نمونه‌های مطالعه از نظر الگوی کلی بیان رفتاری دارند که با طراحی آزمایش و فراداده قابل توضیح باشد؟",
    connection:
      "درس ۷ به ما یک ماتریس ژن × نمونه داد. درس ۸ همان ماتریس را از زاویه ستون‌ها می‌خواند: هر ستون به‌عنوان یک نمونه کامل.",
    flow: ["ماتریس شمارش", "هر ستون = یک نمونه", "مقایسه کلی نمونه‌ها", "تشخیص الگوهای غیرمنتظره", "تصمیم برای ادامه تحلیل"],
    terms: [
      {
        term: "sample-level QC",
        persianLabel: "کنترل کیفیت در سطح نمونه",
        explanation:
          "بررسی رفتار کلی هر نمونه نسبت به سایر نمونه‌های مطالعه. در این سطح به جای یک خوانش یا یک ژن، کل پروفایل بیان یک نمونه را بررسی می‌کنیم.",
      },
    ],
    insight: <StudyViewLab />,
    question: {
      question: "چرا قبل از بیان افتراقی باید رفتار کلی نمونه‌ها را بررسی کنیم؟",
      options: [
        "چون اگر یک نمونه یا عامل فنی رفتار کل داده را تغییر داده باشد، می‌تواند تفسیر مقایسه ژن‌ها را گمراه کند.",
        "چون باید هر نمونه‌ای که با بقیه فرق دارد حذف شود.",
        "چون کنترل کیفیت در سطح نمونه جایگزین همه تحلیل‌های آماری است.",
      ],
      correctIndex: 0,
      correctFeedback:
        "دقیقاً. هدف حذف تفاوت نیست؛ هدف فهمیدن منشأ تفاوت و تطبیق آن با طراحی مطالعه است.",
      incorrectFeedback:
        "تفاوت بین نمونه‌ها می‌تواند زیستی و کاملاً واقعی باشد. کنترل کیفیت کمک می‌کند تفاوت قابل انتظار را از الگوی مشکوک جدا کنیم.",
    },
    bridge: {
      openQuestion: "اولین سرنخ ساده درباره تفاوت نمونه‌ها چیست؟ آیا همه ستون‌ها تقریباً حجم مشابهی از شواهد شمارشی دارند؟",
      nextStep:
        "بخش بعد از اندازه کتابخانه شروع می‌کند؛ شاخصی ساده که مهم است، اما به‌تنهایی کیفیت نمونه را تعیین نمی‌کند.",
    },
  },
  {
    title: "اندازه کتابخانه",
    eyebrow: "اولین نگاه به ستون‌ها",
    headline: "مجموع شمارش‌های یک نمونه یک سرنخ است، نه یک حکم کیفیت.",
    lead:
      "اگر شمارش‌های هر ستون را جمع کنیم، یک نمای ساده از مقدار شواهد شمارشی در آن نمونه به دست می‌آوریم. این مقدار می‌تواند بین نمونه‌ها متفاوت باشد؛ مثلاً به دلیل عمق توالی‌یابی، نرخ نگاشت یا ترکیب RNA. اما بیشتر بودن این عدد همیشه به معنی بهتر بودن نمونه نیست.",
    connection:
      "حالا می‌خواهیم هر ستون ماتریس را به‌صورت یک نمونه کامل ببینیم. ساده‌ترین خلاصه ستون، مجموع شمارش‌های آن است.",
    terms: [
      {
        term: "library size",
        persianLabel: "اندازه کتابخانه",
        explanation:
          "در زمینه ماتریس شمارش، معمولاً به کل شواهد شمارشی منتسب به یک نمونه اشاره می‌کند. این مفهوم با غلظت فیزیکی کتابخانه آزمایشگاهی یکسان نیست.",
      },
      {
        term: "sequencing depth",
        persianLabel: "عمق توالی‌یابی",
        explanation:
          "مقدار داده توالی‌یابی تولیدشده برای یک نمونه. عمق بیشتر می‌تواند شمارش‌های بیشتری ایجاد کند، اما اثر آن با نگاشت، ترکیب RNA و قواعد کمی‌سازی درهم می‌آمیزد.",
      },
    ],
    insight: <LibrarySizeLab />,
    question: {
      question: "نمونه T3 مجموع شمارش کمتری از بقیه دارد. بهترین واکنش چیست؟",
      options: [
        "فوراً آن را حذف کنیم.",
        "آن را یک سرنخ بدانیم و همراه با کیفیت داده خام، نگاشت، فراداده و رفتار کلی نمونه بررسی کنیم.",
        "چون مقدارش کمتر است، همه شمارش‌هایش را در یک عدد ثابت ضرب کنیم و مسئله تمام است.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. تفاوت اندازه کتابخانه مهم است، اما باید علت و پیامدش را در کنار سایر شواهد دید.",
      incorrectFeedback:
        "یک عدد کل نمی‌تواند به‌تنهایی درباره حذف نمونه تصمیم بگیرد. باید بدانیم چرا نمونه متفاوت است و آیا الگوی دیگری هم آن را تأیید می‌کند.",
    },
    bridge: {
      openQuestion: "اگر یک نمونه فقط به دلیل شمارش کل بیشتر، در همه ژن‌ها عددهای بزرگ‌تری داشته باشد، مقایسه مستقیم ستون‌ها چه مشکلی پیدا می‌کند؟",
      nextStep:
        "برای مقایسه الگوهای کلی نمونه‌ها باید اثر مقیاس و وابستگی واریانس به میانگین را مدیریت کنیم؛ اینجا مفهوم تبدیل برای نمایش وارد می‌شود.",
    },
  },
  {
    title: "چرا داده را برای نمایش تبدیل می‌کنیم؟",
    eyebrow: "خام برای آزمون؛ تبدیل‌شده برای دیدن الگو",
    headline: "ماتریس شمارش خام برای مدل آماری ارزشمند است، اما برای فاصله و PCA معمولاً مستقیم بهترین نمایش نیست.",
    lead:
      "در داده شمارشی، ژن‌های با شمارش زیاد معمولاً پراکندگی بزرگ‌تری هم دارند و تفاوت اندازه کتابخانه می‌تواند فاصله نمونه‌ها را تحت تأثیر قرار دهد. برای دیدن شباهت کلی نمونه‌ها، از تبدیل‌هایی استفاده می‌شود که رابطه میانگین و واریانس را تا حدی آرام‌تر می‌کنند.",
    connection:
      "اندازه کتابخانه نشان داد مقیاس ستون‌ها یکسان نیست. حالا می‌خواهیم نمونه‌ها را بر اساس الگوی بیان مقایسه کنیم، نه فقط بزرگی عددهای خام.",
    terms: [
      {
        term: "variance stabilizing transformation",
        persianLabel: "تبدیل پایدارساز واریانس",
        explanation:
          "تبدیلی برای داده شمارشی که وابستگی شدید واریانس به میانگین را کاهش می‌دهد تا مقایسه فاصله نمونه‌ها و نمایش‌هایی مثل PCA قابل تفسیرتر شوند. اختصار رایج آن VST است.",
      },
      {
        term: "rlog",
        explanation:
          "یک تبدیل منظم‌شده لگاریتمی در DESeq2 برای نمایش و مقایسه نمونه‌ها. مانند VST، هدف اصلی آن اکتشاف و کنترل کیفیت است، نه جایگزین‌کردن مدل شمارشی بیان افتراقی.",
      },
    ],
    concepts: [
      {
        title: "برای اکتشاف و نمایش",
        text: "فاصله نمونه‌ها، خوشه‌بندی و PCA معمولاً روی داده‌ای با تبدیل مناسب دیده می‌شوند تا ژن‌های پرشمارش صرفاً به دلیل مقیاس غالب نشوند.",
        emphasized: true,
      },
      {
        title: "برای آزمون بیان افتراقی",
        text: "در روش‌هایی مثل DESeq2، مدل آماری اصلی از شمارش‌ها و عامل‌های مقیاس داخلی استفاده می‌کند؛ VST یا rlog ورودی جایگزین آزمون بیان افتراقی نیستند.",
      },
    ],
    question: {
      question: "چرا VST یا rlog را در این درس معرفی می‌کنیم؟",
      options: [
        "برای اینکه داده را برای اکتشاف، فاصله نمونه‌ها و PCA قابل تفسیرتر کنیم.",
        "برای اینکه شمارش خام را برای همیشه دور بریزیم.",
        "برای اینکه بدون مدل آماری مستقیماً ژن‌های معنی‌دار را انتخاب کنیم.",
      ],
      correctIndex: 0,
      correctFeedback:
        "دقیقاً. این تبدیل‌ها به دیدن ساختار بین نمونه‌ها کمک می‌کنند؛ نقش آزمون آماری را بازی نمی‌کنند.",
      incorrectFeedback:
        "اینجا هدف ما دیدن رابطه نمونه‌هاست. تحلیل بیان افتراقی هنوز مرحله بعدی و مسئله‌ای جداست.",
    },
    bridge: {
      openQuestion: "حالا که نمونه‌ها را روی مقیاس مناسب‌تری می‌بینیم، چگونه می‌توانیم شباهت دو نمونه را با یک عدد خلاصه کنیم؟",
      nextStep:
        "بخش بعد فاصله بین نمونه‌ها و همبستگی را معرفی می‌کند؛ دو نگاه متفاوت به شباهت کلی ستون‌ها.",
    },
  },
  {
    title: "فاصله و همبستگی بین نمونه‌ها",
    eyebrow: "یک عدد برای شباهت کلی",
    headline: "نمونه‌های مشابه باید در هزاران ژن، الگوهای کلی نزدیک‌تری نشان دهند.",
    lead:
      "برای هر دو نمونه می‌توان بر اساس مقدار هزاران ژن یک معیار شباهت ساخت. فاصله معمولاً هرچه کوچک‌تر باشد یعنی نمونه‌ها نزدیک‌ترند؛ همبستگی معمولاً هرچه به ۱ نزدیک‌تر باشد یعنی الگوی تغییرات مشابه‌تر است. این دو معیار دقیقاً یک چیز نیستند.",
    connection:
      "داده را برای اکتشاف آماده کردیم. حالا می‌توانیم به جای نگاه‌کردن به هزاران سطر، رابطه هر جفت نمونه را خلاصه کنیم.",
    terms: [
      {
        term: "sample-to-sample distance",
        persianLabel: "فاصله بین نمونه‌ها",
        explanation:
          "یک عدد که میزان دوری دو پروفایل بیان را خلاصه می‌کند. نوع فاصله و داده‌ای که فاصله روی آن محاسبه می‌شود باید مشخص باشد.",
      },
      {
        term: "correlation",
        persianLabel: "همبستگی",
        explanation:
          "معیاری برای سنجش هماهنگی الگوی تغییر مقادیر بین دو نمونه. همبستگی بالا می‌تواند نشان دهد الگوی کلی مشابه است، حتی اگر مقیاس عددها دقیقاً یکسان نباشد.",
      },
    ],
    insight: <SimilarityLab />,
    question: {
      question: "اگر دو تکرار زیستی یک گروه فاصله کمی داشته باشند، چه برداشتی منطقی‌تر است؟",
      options: [
        "پروفایل کلی آن‌ها نسبتاً شبیه است؛ این با انتظار طراحی سازگار است، اما کیفیت را به‌تنهایی ثابت نمی‌کند.",
        "آن دو نمونه حتماً از یک بیمار هستند.",
        "همه ژن‌های آن‌ها دقیقاً برابرند.",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. فاصله یک خلاصه از کل پروفایل است و باید در کنار فراداده و سایر نمودارها تفسیر شود.",
      incorrectFeedback:
        "فاصله کم یعنی شباهت کلی، نه یکسان‌بودن کامل یا اثبات هویت نمونه.",
    },
    bridge: {
      openQuestion: "اگر فاصله همه جفت‌های نمونه را داشته باشیم، چگونه الگوی کل مطالعه را یکجا ببینیم؟",
      nextStep:
        "با ماتریس فاصله و خوشه‌بندی می‌توانیم ببینیم کدام نمونه‌ها به‌طور طبیعی نزدیک‌تر قرار می‌گیرند.",
    },
  },
  {
    title: "ماتریس فاصله و خوشه‌بندی",
    eyebrow: "نقشه رابطه همه نمونه‌ها",
    headline: "خوشه‌بندی می‌پرسد نمونه‌ها بدون اجبار به برچسب‌های از قبل تعیین‌شده چگونه گروه‌بندی می‌شوند.",
    lead:
      "اگر فاصله هر نمونه با همه نمونه‌های دیگر را در یک جدول قرار دهیم، می‌توانیم آن را به‌صورت نقشه حرارتی و خوشه‌بندی سلسله‌مراتبی نمایش دهیم. این نمایش کمک می‌کند تکرارهای نزدیک، زیرگروه‌ها و نمونه‌های دورافتاده را ببینیم.",
    connection:
      "در بخش قبل فاصله یک جفت نمونه را فهمیدیم. حالا همان ایده را برای تمام جفت‌های مطالعه همزمان می‌بینیم.",
    terms: [
      {
        term: "hierarchical clustering",
        persianLabel: "خوشه‌بندی سلسله‌مراتبی",
        explanation:
          "روشی که نمونه‌های نزدیک‌تر را مرحله‌به‌مرحله به گروه‌های بزرگ‌تر متصل می‌کند و ساختاری شبیه شاخه‌های درخت می‌سازد.",
      },
      {
        term: "dendrogram",
        persianLabel: "دندروگرام",
        explanation:
          "نمایش شاخه‌ای خروجی خوشه‌بندی سلسله‌مراتبی. طول و ساختار شاخه‌ها رابطه نمونه‌ها را در چارچوب معیار فاصله انتخاب‌شده خلاصه می‌کند.",
      },
    ],
    scenario: {
      title: "سه سؤال قبل از قضاوت خوشه‌ها",
      description: "وقتی نقشه فاصله را می‌بینید، اول دنبال توضیح باشید، نه حذف.",
      items: [
        "آیا تکرارهای یک شرایط زیستی معمولاً به هم نزدیک‌اند؟",
        "آیا نمونه‌ها بیشتر بر اساس دسته آزمایشی جدا شده‌اند تا شرایط زیستی؟",
        "آیا یک نمونه از همه دور است و آیا شواهد مستقل فنی یا زیستی برای این رفتار داریم؟",
      ],
    },
    question: {
      question: "اگر نمونه‌ها به‌جای گروه درمان، بیشتر بر اساس دسته آزمایشی خوشه‌بندی شوند، چه چیزی باید بررسی شود؟",
      options: [
        "احتمال وجود اثر دسته‌ای و رابطه آن با طراحی مطالعه و فراداده.",
        "اینکه نام فایل‌ها به ترتیب حروف الفباست یا نه.",
        "حذف فوری همه نمونه‌های دسته دوم.",
      ],
      correctIndex: 0,
      correctFeedback:
        "دقیقاً. خوشه‌بندی می‌تواند یک عامل فنی غالب را آشکار کند، اما علت و راه برخورد باید با طراحی مطالعه بررسی شود.",
      incorrectFeedback:
        "اگر دسته آزمایشی ساختار اصلی داده را توضیح می‌دهد، باید آن را در فراداده و طراحی مدل جدی بگیریم؛ حذف خودکار پاسخ نیست.",
    },
    bridge: {
      openQuestion: "خوشه‌بندی برای تعداد زیاد نمونه شلوغ می‌شود. آیا راهی هست که بیشترین تفاوت‌های مطالعه را در دو محور خلاصه کنیم؟",
      nextStep:
        "این نیاز ما را به PCA می‌رساند؛ روشی برای فشرده‌کردن ساختار چند هزار ژن به چند مؤلفه اصلی.",
    },
  },
  {
    title: "PCA از پایه",
    eyebrow: "فشرده‌سازی هزاران ژن به چند محور",
    headline: "PCA نمونه‌ها را روی محورهایی قرار می‌دهد که بیشترین تغییر کلی داده را توضیح می‌دهند.",
    lead:
      "هر نمونه در اصل نقطه‌ای در فضایی با هزاران بُعد است؛ هر ژن یک بُعد. PCA جهت‌هایی را پیدا می‌کند که نمونه‌ها در آن‌ها بیشترین تغییر را دارند. مؤلفه اول بیشترین واریانس را توضیح می‌دهد و مؤلفه دوم، مستقل از اول، بخش بعدی تغییر را خلاصه می‌کند.",
    connection:
      "ماتریس فاصله رابطه همه نمونه‌ها را نشان می‌داد، اما با افزایش تعداد نمونه‌ها تفسیر آن سخت می‌شود. PCA یک نمای فشرده از ساختار اصلی می‌دهد.",
    terms: [
      {
        term: "PCA",
        explanation:
          "اختصار Principal Component Analysis یا تحلیل مؤلفه‌های اصلی است. روشی برای کاهش بُعد که نمونه‌ها را روی محورهای جدیدی نمایش می‌دهد که بیشترین واریانس داده را توضیح می‌دهند.",
      },
      {
        term: "principal component",
        persianLabel: "مؤلفه اصلی",
        explanation:
          "یک محور جدید ساخته‌شده از ترکیب اطلاعات ژن‌ها. PC1 بیشترین واریانس و PC2 بیشترین بخش بعدیِ مستقل از PC1 را توضیح می‌دهد.",
      },
      {
        term: "variance explained",
        persianLabel: "واریانس توضیح‌داده‌شده",
        explanation:
          "درصدی از تغییر کلی داده که یک مؤلفه اصلی خلاصه می‌کند. مجموع درصد PC1 و PC2 معمولاً ۱۰۰٪ نیست، چون مؤلفه‌های بیشتری هم وجود دارند.",
      },
    ],
    insight: <PcaLab />,
    question: {
      question: "اگر PC1 و PC2 روی هم ۶۰٪ واریانس را توضیح دهند، چه نتیجه‌ای درست است؟",
      options: [
        "این نمودار بخش بزرگی از ساختار را نشان می‌دهد، اما ۴۰٪ واریانس در مؤلفه‌های دیگر باقی مانده است.",
        "۴۰٪ داده حذف یا خراب شده است.",
        "PC1 و PC2 باید همیشه دقیقاً ۱۰۰٪ شوند.",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. PCA دوبعدی یک خلاصه است، نه تصویر کامل همه تفاوت‌های داده.",
      incorrectFeedback:
        "مؤلفه‌های سوم، چهارم و بعدی هنوز بخشی از واریانس را حمل می‌کنند؛ نمودار دوبعدی همه اطلاعات را نشان نمی‌دهد.",
    },
    bridge: {
      openQuestion: "نقاط PCA بدون فراداده فقط نقطه‌اند. از کجا بفهمیم جدایی آن‌ها با درمان، دسته آزمایشی یا عامل دیگری مرتبط است؟",
      nextStep:
        "بخش بعد فراداده را روی PCA سوار می‌کند تا الگوی زیستی و فنی را از هم تفکیک کنیم.",
    },
  },
  {
    title: "فراداده را روی PCA بگذارید",
    eyebrow: "نمودار بدون زمینه کافی نیست",
    headline: "رنگ و شکل نقاط باید سؤال پژوهشی و عوامل فنی را همزمان قابل بررسی کنند.",
    lead:
      "یک PCA خوب فقط نقاط رنگی زیبا نیست. باید بتوانیم همان نقاط را بر اساس گروه زیستی، دسته آزمایشی، بیمار، جنس، زمان یا هر عامل مرتبط در فراداده بررسی کنیم. اگر همان جدایی با یک عامل فنی بهتر توضیح داده شود، تفسیر زیستی باید محتاط‌تر شود.",
    connection:
      "PCA ساختار اصلی را فشرده کرد. حالا برای فهمیدن علت این ساختار به اطلاعاتی خارج از ماتریس شمارش نیاز داریم: فراداده.",
    concepts: [
      {
        title: "رنگ بر اساس شرایط زیستی",
        text: "می‌پرسد آیا نمونه‌های کنترل و درمان در الگوی کلی بیان از هم متمایز می‌شوند یا نه.",
        emphasized: true,
      },
      {
        title: "رنگ بر اساس دسته آزمایشی",
        text: "می‌پرسد آیا فرایند فنی مانند روز استخراج یا اجرای توالی‌یابی با ساختار اصلی داده هم‌راستا است یا نه.",
      },
    ],
    insight: <MetadataOverlayLab />,
    question: {
      question: "اگر جدایی PCA همزمان با درمان و دسته آزمایشی کاملاً یکسان باشد، مشکل اصلی چیست؟",
      options: [
        "اثر درمان و دسته آزمایشی با هم درهم‌آمیخته‌اند و جداکردن علت آن‌ها از داده دشوار یا ناممکن می‌شود.",
        "PCA اشتباه محاسبه شده است.",
        "این یعنی اثر درمان حتماً واقعی است.",
      ],
      correctIndex: 0,
      correctFeedback:
        "دقیقاً. این همان اصل طراحی مطالعه در درس ۱ است: نرم‌افزار نمی‌تواند اطلاعاتی را که طراحی آزمایش تفکیک نکرده، بعداً از هیچ بسازد.",
      incorrectFeedback:
        "اگر درمان و دسته آزمایشی همیشه با هم تغییر کنند، داده به‌تنهایی نمی‌تواند بگوید جدایی از کدام عامل آمده است.",
    },
    bridge: {
      openQuestion: "اگر فقط یک نمونه از خوشه خودش دور باشد، آیا باید آن را حذف کنیم؟",
      nextStep:
        "بخش بعد درباره نمونه پرت است و یک قانون مهم می‌سازد: فاصله زیاد شروع بررسی است، نه پایان تصمیم.",
    },
  },
  {
    title: "نمونه پرت؛ سرنخ نه حکم",
    eyebrow: "خطر حذف عجولانه",
    headline: "یک نمونه دورافتاده در PCA یا خوشه‌بندی به‌تنهایی دلیل کافی برای حذف نیست.",
    lead:
      "نمونه‌ای که از بقیه دور است می‌تواند خطای فنی داشته باشد، اما می‌تواند یک تفاوت زیستی واقعی هم باشد. تصمیم حذف باید با شواهد مستقل پشتیبانی شود: کیفیت داده خام، اندازه کتابخانه، نرخ نگاشت، آلودگی احتمالی، فراداده، خطای برچسب‌گذاری یا مستندات آزمایشگاهی.",
    connection:
      "فراداده کمک کرد علت الگوهای گروهی را بررسی کنیم. حالا باید برای یک نقطه غیرعادی هم همین منطق چندشاهدی را به کار ببریم.",
    terms: [
      {
        term: "outlier sample",
        persianLabel: "نمونه پرت",
        explanation:
          "نمونه‌ای که بر اساس یک یا چند معیار از الگوی سایر نمونه‌ها فاصله قابل توجهی دارد. پرت‌بودن یک توصیف است، نه اثبات خطا یا مجوز خودکار حذف.",
      },
    ],
    insight: <OutlierTriageLab />,
    question: {
      question: "کدام وضعیت دلیل قوی‌تری برای کنارگذاشتن یک نمونه از تحلیل اصلی است؟",
      options: [
        "فقط اینکه در PCA دورتر از بقیه است.",
        "ترکیبی مستند از رفتار پرت، مشکل جدی در QC خام یا نگاشت، و شواهد آزمایشگاهی/فراداده‌ای که شکست فنی نمونه را پشتیبانی می‌کند.",
        "اینکه نتیجه مورد انتظار پژوهشگر را تغییر می‌دهد.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. حذف نمونه باید دلیل علمی و قابل گزارش داشته باشد، نه فقط یک تصویر یا نتیجه نامطلوب.",
      incorrectFeedback:
        "PCA ابزار اکتشافی است. تصمیم حذف باید با شواهد مستقل و مستند پشتیبانی شود.",
    },
    bridge: {
      openQuestion: "اگر نمونه پرت را حذف نمی‌کنیم مگر با دلیل، پس یک گزارش کنترل کیفیت خوب دقیقاً چه تصمیم‌هایی باید ثبت کند؟",
      nextStep:
        "بخش بعد همه شاخص‌ها را در یک داشبورد پروژه کنار هم می‌گذارد تا از مشاهده به تصمیم قابل دفاع برسیم.",
    },
  },
  {
    title: "داشبورد پروژه سرطان پانکراس",
    eyebrow: "همه شواهد روی یک میز",
    headline: "کنترل کیفیت در سطح نمونه یعنی ساختن یک داستان سازگار از شمارش، فاصله، PCA و فراداده.",
    lead:
      "برای هر نمونه باید بتوانیم بگوییم چه چیزی طبیعی است، چه چیزی نیاز به بررسی دارد و کدام تفاوت با طراحی مطالعه توضیح داده می‌شود. هیچ نمودار واحدی جای این جمع‌بندی را نمی‌گیرد.",
    connection:
      "تا اینجا شاخص‌ها را جداگانه شناختیم. اکنون باید آن‌ها را برای یک پروژه واقعی‌تر کنار هم بگذاریم.",
    scenario: {
      title: "مطالعه کنترل در برابر درمان در سرطان پانکراس",
      description: "سه کنترل و سه نمونه درمان داریم که در دو دسته آزمایشی پردازش شده‌اند.",
      items: [
        "C1، C2 و C3 در پروفایل کلی نزدیک‌اند، هرچند C3 در دسته B پردازش شده است.",
        "T1 و T2 رفتار مشابهی دارند و جدایی آن‌ها از کنترل‌ها با شرایط زیستی سازگار است.",
        "T3 هم اندازه کتابخانه کمتری دارد و هم در PCA دورتر است؛ بنابراین باید QC خام، نگاشت، فراداده و مستندات نمونه دوباره بررسی شوند.",
        "وجود T3 به‌تنهایی دلیل حذف نیست؛ نتیجه بررسی باید ثبت شود.",
      ],
    },
    insight: <ProjectDashboardLab />,
    question: {
      question: "برای T3 بهترین اقدام اولیه چیست؟",
      options: [
        "بررسی چندمنبعی و مستندسازی علت احتمالی تفاوت، سپس تصمیم درباره ادامه یا کنارگذاشتن.",
        "حذف فوری چون در PCA دور است.",
        "تغییر برچسب آن به کنترل تا به خوشه نزدیک‌تر شود.",
      ],
      correctIndex: 0,
      correctFeedback:
        "دقیقاً. هدف کنترل کیفیت حفظ زنجیره استدلال است: مشاهده ← شواهد تکمیلی ← علت محتمل ← تصمیم مستند.",
      incorrectFeedback:
        "برچسب و نمونه نباید برای زیباترشدن نمودار تغییر کنند. تصمیم باید از شواهد بیاید.",
    },
    bridge: {
      openQuestion: "فرض کنیم ساختار نمونه‌ها قابل دفاع است. حالا چگونه شمارش ژن‌ها را بین نمونه‌هایی با اندازه کتابخانه و ترکیب RNA متفاوت منصفانه مقایسه کنیم؟",
      nextStep:
        "این سؤال نیاز به درس ۹ را می‌سازد: نرمال‌سازی و سپس مدل‌کردن بیان افتراقی.",
    },
  },
  {
    title: "جمع‌بندی فعال",
    eyebrow: "ایستگاه تسلط",
    headline: "قبل از پرسیدن «کدام ژن تغییر کرده؟» باید بپرسیم «نمونه‌ها چگونه با هم رابطه دارند و آیا این رابطه قابل توضیح است؟»",
    lead:
      "کنترل کیفیت در سطح نمونه یک مرحله حذف نمونه نیست؛ مرحله فهم ساختار مطالعه است. اندازه کتابخانه، تبدیل برای نمایش، فاصله و همبستگی، خوشه‌بندی، PCA، فراداده و بررسی نمونه پرت باید یکدیگر را تکمیل کنند.",
    connection:
      "این بخش زنجیره درس را می‌بندد و مشخص می‌کند کدام اطلاعات باید پیش از تحلیل بیان افتراقی در گزارش پروژه ثبت شده باشند.",
    flow: ["ماتریس شمارش", "اندازه کتابخانه", "تبدیل اکتشافی", "فاصله/خوشه‌بندی", "PCA + فراداده", "بررسی نمونه پرت", "تصمیم مستند"],
    concepts: [
      {
        title: "چیزی که باید گزارش شود",
        text: "نسخه داده، تبدیل مورد استفاده برای اکتشاف، معیارهای شباهت، نمودارهای نمونه‌محور، عوامل فراداده‌ای بررسی‌شده و دلیل هر تصمیم درباره نمونه‌ها.",
        emphasized: true,
      },
      {
        title: "چیزی که نباید انجام شود",
        text: "حذف نمونه صرفاً برای بهترشدن خوشه‌بندی یا رسیدن به نتیجه مورد انتظار، بدون شواهد مستقل و مستند.",
      },
    ],
    question: {
      question: "کدام جمله بهترین خلاصه درس ۸ است؟",
      options: [
        "PCA ابزار حذف خودکار نمونه‌های دور است.",
        "کنترل کیفیت در سطح نمونه مجموعه‌ای از شواهد برای فهم ساختار مطالعه و تصمیم‌گیری مستند پیش از تحلیل ژن‌به‌ژن است.",
        "اگر تکرارها دقیقاً روی هم نیفتند، مطالعه شکست خورده است.",
      ],
      correctIndex: 1,
      correctFeedback:
        "عالی. حالا آماده‌اید از «آیا نمونه‌ها قابل دفاع‌اند؟» به سؤال بعدی بروید: «چگونه شمارش‌ها را برای مقایسه آماری منصفانه آماده کنیم؟»",
      incorrectFeedback:
        "هدف این درس فهمیدن و توضیح‌دادن ساختار نمونه‌ها بود، نه وادارکردن داده به یک الگوی از پیش انتظاررفته.",
    },
    bridge: {
      openQuestion: "دو نمونه ممکن است تعداد کل شواهد متفاوتی داشته باشند؛ چگونه بدون پاک‌کردن سیگنال زیستی، این تفاوت مقیاس را برای مقایسه ژن‌ها مدیریت کنیم؟",
      nextStep:
        "درس ۹ از همین مسئله شروع می‌شود: نرمال‌سازی، مدل شمارشی، تغییر بیان و عدم‌قطعیت آماری.",
    },
  },
];

export function RnaSeqSampleLevelQcLesson() {
  return (
    <GuidedConceptLesson
      lessonIndex={8}
      title="کنترل کیفیت در سطح نمونه"
      subtitle="بعد از ساخت ماتریس شمارش، رفتار کلی نمونه‌ها را با اندازه کتابخانه، فاصله، خوشه‌بندی، PCA و فراداده بررسی می‌کنیم تا پیش از تحلیل بیان افتراقی بدانیم ساختار مطالعه تا چه حد قابل توضیح است."
      sectionId="rna-seq-sample-level-qc"
      sections={sections}
    />
  );
}

function StudyViewLab() {
  const [mode, setMode] = useState<"gene" | "sample">("sample");

  return (
    <LabFrame title="زاویه دید ماتریس را عوض کنید">
      <div className="flex flex-wrap gap-2">
        <LabButton active={mode === "gene"} onClick={() => setMode("gene")}>نگاه ژن‌محور</LabButton>
        <LabButton active={mode === "sample"} onClick={() => setMode("sample")}>نگاه نمونه‌محور</LabButton>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["C1", "C2", "T1"].map((sample, columnIndex) => (
          <div key={sample} className={[
            "rounded-2xl border p-4 transition",
            mode === "sample" && columnIndex === 1 ? "border-teal-400 bg-teal-50" : "border-slate-200 bg-white",
          ].join(" ")}>
            <p className="text-xs font-black text-slate-500">نمونه {sample}</p>
            <div className="mt-3 space-y-2">
              {[18, 42, 9, 31].map((value, rowIndex) => (
                <div key={`${sample}-${rowIndex}`} className={[
                  "rounded-lg px-3 py-2 text-xs font-bold",
                  mode === "gene" && rowIndex === 1 ? "bg-violet-100 text-violet-900" : "bg-slate-100 text-slate-600",
                ].join(" ")}>
                  ژن {rowIndex + 1}: {value + columnIndex * 3}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {mode === "sample"
          ? "در این درس هر ستون را یک پروفایل کامل می‌بینیم و می‌پرسیم این نمونه نسبت به بقیه چه رفتاری دارد."
          : "در درس‌های بعد دوباره می‌توانیم روی هر سطر تمرکز کنیم و درباره تغییر بیان ژن‌ها سؤال بپرسیم."}
      </p>
    </LabFrame>
  );
}

function LibrarySizeLab() {
  const [selected, setSelected] = useState("T3");
  const max = Math.max(...samples.map((sample) => sample.total));
  const current = getSample(selected);

  return (
    <LabFrame title="آزمایشگاه اندازه کتابخانه">
      <div className="grid gap-3 sm:grid-cols-6">
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => setSelected(sample.id)}
            className={[
              "rounded-2xl border p-3 text-center transition",
              sample.id === selected ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-200",
            ].join(" ")}
          >
            <p className="text-xs font-black text-slate-900">{sample.id}</p>
            <div className="mt-3 flex h-24 items-end justify-center rounded-xl bg-slate-100 p-2">
              <span className="w-7 rounded-t bg-teal-500" style={{ height: `${Math.max(16, (sample.total / max) * 100)}%` }} />
            </div>
            <p className="mt-2 text-[11px] font-bold text-slate-500">{sample.total} میلیون</p>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black text-teal-700">نمونه انتخاب‌شده: {current.id}</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{current.note}</p>
        <p className="mt-2 text-xs leading-6 text-slate-500">این اعداد آموزشی‌اند و فقط مفهوم تفاوت اندازه کتابخانه را نشان می‌دهند.</p>
      </div>
    </LabFrame>
  );
}

function SimilarityLab() {
  const [metric, setMetric] = useState<"distance" | "correlation">("distance");
  const [pair, setPair] = useState<"C1-C2" | "C1-T2" | "T2-T3">("C1-C2");

  const values = {
    distance: { "C1-C2": "کم", "C1-T2": "زیاد", "T2-T3": "متوسط تا زیاد" },
    correlation: { "C1-C2": "بالا", "C1-T2": "کمتر", "T2-T3": "متوسط" },
  } as const;

  return (
    <LabFrame title="دو نگاه به شباهت نمونه‌ها">
      <div className="flex flex-wrap gap-2">
        <LabButton active={metric === "distance"} onClick={() => setMetric("distance")}>فاصله</LabButton>
        <LabButton active={metric === "correlation"} onClick={() => setMetric("correlation")}>همبستگی</LabButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {(["C1-C2", "C1-T2", "T2-T3"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPair(item)}
            className={[
              "rounded-2xl border p-4 text-right transition",
              pair === item ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <p className="text-xs font-black text-slate-500">جفت نمونه</p>
            <p className="mt-1 font-black text-slate-950">{item.replace("-", " ↔ ")}</p>
            <p className="mt-3 text-sm font-bold text-teal-700">{values[metric][item]}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {metric === "distance"
          ? "در فاصله، عدد کمتر معمولاً به معنی نزدیکی بیشتر پروفایل‌هاست."
          : "در همبستگی، مقدار بالاتر معمولاً به معنی هماهنگی بیشتر الگوی بیان است. این دو معیار یکسان نیستند."}
      </p>
    </LabFrame>
  );
}

function PcaLab() {
  const [selected, setSelected] = useState("T3");
  const current = getSample(selected);

  return (
    <LabFrame title="روی نقاط PCA کلیک کنید">
      <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="absolute bottom-8 left-10 right-5 border-t border-slate-300" />
        <div className="absolute bottom-8 left-10 top-5 border-l border-slate-300" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-500">PC1 — ۴۲٪</span>
        <span className="absolute left-1 top-1/2 -rotate-90 text-[11px] font-bold text-slate-500">PC2 — ۱۸٪</span>
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => setSelected(sample.id)}
            title={sample.id}
            className={[
              "absolute flex size-9 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 text-[10px] font-black shadow-sm transition",
              sample.id === selected ? "z-10 scale-125 border-slate-950 bg-teal-300 text-slate-950" : "border-white bg-slate-800 text-white hover:scale-110",
            ].join(" ")}
            style={{ left: `${sample.pc1}%`, bottom: `${sample.pc2}%` }}
          >
            {sample.id}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-xs font-black text-teal-300">{current.id} — {current.group} — {current.batch}</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">{current.note}</p>
      </div>
    </LabFrame>
  );
}

function MetadataOverlayLab() {
  const [mode, setMode] = useState<"group" | "batch">("group");

  return (
    <LabFrame title="همان PCA، دو نوع برچسب">
      <div className="flex flex-wrap gap-2">
        <LabButton active={mode === "group"} onClick={() => setMode("group")}>شرایط زیستی</LabButton>
        <LabButton active={mode === "batch"} onClick={() => setMode("batch")}>دسته آزمایشی</LabButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {samples.map((sample) => (
          <div key={sample.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-black text-slate-950">{sample.id}</span>
              <span className={[
                "rounded-full px-2.5 py-1 text-[10px] font-black",
                mode === "group"
                  ? sample.group === "کنترل" ? "bg-sky-100 text-sky-800" : "bg-rose-100 text-rose-800"
                  : sample.batch === "دسته A" ? "bg-amber-100 text-amber-900" : "bg-violet-100 text-violet-900",
              ].join(" ")}>
                {mode === "group" ? sample.group : sample.batch}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${sample.pc1}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        با عوض‌کردن برچسب، همان ساختار را از دو زاویه می‌بینید. هدف پیدا کردن توضیح برای جدایی نقاط است، نه انتخاب برچسبی که نمودار را زیباتر کند.
      </p>
    </LabFrame>
  );
}

function OutlierTriageLab() {
  const [checks, setChecks] = useState({ rawQc: false, mapping: false, metadata: false, labNote: false });
  const checked = Object.values(checks).filter(Boolean).length;

  const toggle = (key: keyof typeof checks) => {
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <LabFrame title="پرونده T3 را قبل از تصمیم کامل کنید">
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckTile checked={checks.rawQc} onClick={() => toggle("rawQc")} title="QC داده خام" text="آیا افت کیفیت یا آداپتور غیرعادی دارد؟" />
        <CheckTile checked={checks.mapping} onClick={() => toggle("mapping")} title="نگاشت و کمی‌سازی" text="آیا نرخ نگاشت یا شواهد منتسب‌شده غیرعادی است؟" />
        <CheckTile checked={checks.metadata} onClick={() => toggle("metadata")} title="فراداده" text="آیا برچسب، بیمار، دسته یا زمان پردازش متفاوت است؟" />
        <CheckTile checked={checks.labNote} onClick={() => toggle("labNote")} title="مستندات آزمایشگاهی" text="آیا گزارشی از تخریب RNA، خطای نمونه یا شکست کتابخانه وجود دارد؟" />
      </div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-xs font-black text-teal-300">شواهد بررسی‌شده: {checked.toLocaleString("fa-IR")} از ۴</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          {checked < 3
            ? "هنوز برای تصمیم حذف عجله نکنید. چند منبع مستقل دیگر را بررسی کنید."
            : "اکنون می‌توانید یک تصمیم مستند بسازید؛ نتیجه می‌تواند حفظ نمونه، تحلیل حساسیت یا کنارگذاشتن با دلیل فنی روشن باشد."}
        </p>
      </div>
    </LabFrame>
  );
}

function ProjectDashboardLab() {
  const [selected, setSelected] = useState("T3");
  const current = getSample(selected);

  const status = useMemo(() => {
    if (current.id === "T3") return "نیازمند بررسی چندمنبعی";
    if (current.id === "C3" || current.id === "T2") return "مناسب؛ اثر دسته را هم دنبال کنید";
    return "الگوی کلی قابل انتظار";
  }, [current]);

  return (
    <LabFrame title="داشبورد شش نمونه">
      <div className="flex flex-wrap gap-2">
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => setSelected(sample.id)}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-black transition",
              sample.id === selected ? "border-teal-500 bg-teal-50 text-teal-900" : "border-slate-200 bg-white text-slate-600",
            ].join(" ")}
          >
            {sample.id}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="گروه" value={current.group} />
        <MetricCard label="دسته" value={current.batch} />
        <MetricCard label="اندازه کتابخانه" value={`${current.total} میلیون`} />
        <MetricCard label="جمع‌بندی" value={status} />
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{current.note}</p>
    </LabFrame>
  );
}

function LabFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50/60 p-5 sm:p-6">
      <p className="text-xs font-black text-cyan-800">آزمایشگاه تعاملی</p>
      <h3 className="mt-1 text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function LabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2 text-xs font-black transition",
        active ? "border-teal-500 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CheckTile({ checked, onClick, title, text }: { checked: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-right transition",
        checked ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white hover:border-teal-300",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">{title}</p>
        <span className={[
          "flex size-6 items-center justify-center rounded-full text-xs font-black",
          checked ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400",
        ].join(" ")}>{checked ? "✓" : "○"}</span>
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </button>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-black leading-7 text-slate-900">{value}</p>
    </div>
  );
}
