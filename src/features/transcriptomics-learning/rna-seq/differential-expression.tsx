import { useMemo, useState, type ReactNode } from "react";

import {
  GuidedConceptLesson,
  type GuidedLessonSection,
} from "@/features/learning/components/GuidedConceptLesson";

const sections: GuidedLessonSection[] = [
  {
    title: "چرا شمارش خام را مستقیم مقایسه نمی‌کنیم؟",
    eyebrow: "محدودیت درس ۸",
    headline:
      "دو نمونه می‌توانند زیست‌شناسی مشابهی داشته باشند اما فقط به دلیل مقیاس متفاوت، شمارش‌های متفاوتی نشان دهند.",
    lead:
      "در درس ۸ دیدیم اندازه کتابخانه بین نمونه‌ها یکسان نیست. اگر یک نمونه تقریباً دو برابر شواهد شمارشی داشته باشد، بسیاری از ژن‌ها ممکن است فقط به همین دلیل عدد بزرگ‌تری بگیرند. پیش از پرسیدن اینکه «کدام ژن تغییر کرده؟» باید اثر مقیاس نمونه را مدیریت کنیم.",
    connection:
      "کنترل کیفیت در سطح نمونه به ما گفت کدام تفاوت‌های کلی قابل توضیح‌اند. حالا باید مقایسه ژن‌به‌ژن را طوری انجام دهیم که تفاوت فنی مقیاس با تغییر زیستی اشتباه نشود.",
    flow: [
      "ماتریس شمارش",
      "تفاوت مقیاس نمونه‌ها",
      "نرمال‌سازی",
      "مقایسه ژن‌به‌ژن",
      "بیان افتراقی",
    ],
    terms: [
      {
        term: "normalization",
        persianLabel: "نرمال‌سازی",
        explanation:
          "فرایندی برای مدیریت تفاوت‌های سیستماتیک و غیرزیستی بین نمونه‌ها تا مقایسه بیان ژن‌ها منصفانه‌تر شود. نرمال‌سازی قرار نیست همه تفاوت‌های واقعی زیستی را حذف کند.",
      },
      {
        term: "differential expression",
        persianLabel: "بیان افتراقی",
        explanation:
          "بررسی آماری این سؤال که آیا فراوانی RNA مربوط به یک ژن بین شرایط مورد مقایسه به‌طور قابل اتکا متفاوت است یا نه.",
      },
    ],
    insight: <NormalizationNeedLab />,
    question: {
      question:
        "اگر نمونه B تقریباً دو برابر نمونه A داده شمارشی داشته باشد، آیا شمارش دوبرابری یک ژن به‌تنهایی ثابت می‌کند آن ژن از نظر زیستی دو برابر بیان شده است؟",
      options: [
        "بله؛ شمارش خام مستقیماً همان مقدار زیستی است.",
        "خیر؛ ابتدا باید تفاوت مقیاس نمونه‌ها را در مدل یا نرمال‌سازی مدیریت کنیم.",
        "فقط کافی است همه شمارش‌های بزرگ‌تر را حذف کنیم.",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. شمارش مشاهده‌شده ترکیبی از سیگنال زیستی و مقیاس اندازه‌گیری است؛ تحلیل باید این دو را از هم تفکیک کند.",
      incorrectFeedback:
        "شمارش خام به عمق و ترکیب کتابخانه وابسته است. قبل از نتیجه‌گیری زیستی، تفاوت مقیاس باید وارد محاسبه شود.",
    },
    bridge: {
      openQuestion:
        "آیا ساده‌ترین راه این است که شمارش هر نمونه را فقط بر مجموع کل همان ستون تقسیم کنیم؟",
      nextStep:
        "نه همیشه. بخش بعد نشان می‌دهد چرا یک ژن بسیار پرفراوان می‌تواند کل ستون را تغییر دهد و نرمال‌سازی ساده بر اساس مجموع کل را گمراه کند.",
    },
  },
  {
    title: "چرا مجموع کل همیشه کافی نیست؟",
    eyebrow: "سوگیری ترکیب کتابخانه",
    headline:
      "اگر چند ژن سهم بزرگی از کتابخانه را بگیرند، مجموع شمارش می‌تواند تصویری گمراه‌کننده از مقیاس نمونه بسازد.",
    lead:
      "فرض کنید در یک نمونه فقط یک ژن به‌شدت افزایش پیدا کند. چون ظرفیت توالی‌یابی محدود است، همان ژن می‌تواند سهم بزرگی از خوانش‌ها را به خود اختصاص دهد و سهم نسبی ژن‌های دیگر کوچک‌تر به نظر برسد، حتی اگر مقدار واقعی آن‌ها تغییر نکرده باشد. به این مسئله سوگیری ترکیب کتابخانه می‌گوییم.",
    connection:
      "در بخش قبل فهمیدیم مقیاس نمونه مهم است. حالا می‌بینیم که «مجموع کل» همیشه برآورد بی‌طرفی از این مقیاس نیست.",
    terms: [
      {
        term: "composition bias",
        persianLabel: "سوگیری ترکیب کتابخانه",
        explanation:
          "وضعیتی که تغییر شدید در بخشی از ژن‌ها، سهم نسبی سایر ژن‌ها را در داده توالی‌یابی جابه‌جا می‌کند و مقایسه ساده بر اساس مجموع کل را منحرف می‌کند.",
      },
      {
        term: "size factor",
        persianLabel: "ضریب مقیاس نمونه",
        explanation:
          "عددی برای برآورد مقیاس نسبی هر نمونه در مدل شمارشی. در DESeq2 این ضریب با منطق میانه نسبت‌ها برآورد می‌شود تا نسبت به تغییر شدید تعداد محدودی از ژن‌ها مقاوم‌تر باشد.",
      },
    ],
    insight: <CompositionBiasLab />,
    concepts: [
      {
        title: "ایده DESeq2",
        text: "به‌جای تکیه بر مجموع خام هر ستون، برای تعداد زیادی ژن یک مرجع نسبی ساخته می‌شود و نسبت‌های هر نمونه به آن مرجع بررسی می‌شوند. میانه این نسبت‌ها مقیاس نمونه را تخمین می‌زند.",
        emphasized: true,
      },
      {
        title: "فرض پنهان",
        text: "این منطق نیاز دارد مجموعه بزرگی از ژن‌ها نقش مرجع نسبی را حفظ کنند؛ اگر تقریباً همه ژن‌ها در یک جهت شدید تغییر کنند، باید این فرض را دوباره بررسی کرد.",
      },
    ],
    question: {
      question:
        "چرا تقسیم ساده همه ژن‌ها بر مجموع شمارش نمونه می‌تواند در حضور یک ژن بسیار پرفراوان مشکل‌ساز شود؟",
      options: [
        "چون ژن پرفراوان می‌تواند مجموع ستون را بالا ببرد و ژن‌های بدون تغییر را ظاهراً کوچک‌تر نشان دهد.",
        "چون مجموع شمارش هیچ ارتباطی با داده توالی‌یابی ندارد.",
        "چون بعد از نرمال‌سازی باید همه نمونه‌ها دقیقاً شمارش کل یکسان داشته باشند.",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. همین سوگیری ترکیب یکی از دلایلی است که روش‌های شمارش‌محور از ضریب‌های مقیاس مقاوم‌تر استفاده می‌کنند.",
      incorrectFeedback:
        "مشکل اصلی تغییر ترکیب کتابخانه است: یک جزء بسیار بزرگ می‌تواند نسبت سایر اجزا را عوض کند بدون اینکه زیست‌شناسی آن‌ها تغییر کرده باشد.",
    },
    bridge: {
      openQuestion:
        "بعد از مدیریت مقیاس، چرا هنوز نمی‌توانیم فقط میانگین گروه کنترل و درمان را از هم کم کنیم؟",
      nextStep:
        "چون نمونه‌های زیستی یکسان نیستند. بخش بعد نشان می‌دهد چرا پراکندگی بین تکرارهای زیستی باید بخشی از مدل باشد.",
    },
  },
  {
    title: "تفاوت زیستی را چطور وارد مدل می‌کنیم؟",
    eyebrow: "بازگشت به تکرار زیستی",
    headline:
      "دو گروه ممکن است میانگین متفاوتی داشته باشند، اما میزان نوسان بین تکرارهای زیستی تعیین می‌کند این تفاوت چقدر قابل اتکاست.",
    lead:
      "در درس ۱ یاد گرفتیم هر بیمار یا نمونه مستقل یک تکرار زیستی است. اکنون همان مفهوم وارد آمار می‌شود: اگر شمارش یک ژن در تکرارهای هر گروه بسیار متغیر باشد، درباره تفاوت میانگین دو گروه عدم‌قطعیت بیشتری داریم.",
    connection:
      "نرمال‌سازی اثر مقیاس را مدیریت کرد، اما داده RNA-seq هنوز از موجودات و نمونه‌های زیستی متفاوت می‌آید. مدل باید این تغییرپذیری را هم ببیند.",
    terms: [
      {
        term: "dispersion",
        persianLabel: "پراکندگی",
        explanation:
          "پارامتری در مدل شمارشی که نشان می‌دهد شمارش یک ژن بین تکرارهای زیستی بیش از چیزی که فقط از تصادف شمارش انتظار داریم، چقدر تغییر می‌کند.",
      },
      {
        term: "negative binomial",
        persianLabel: "توزیع دوجمله‌ای منفی",
        explanation:
          "یک مدل احتمالاتی مناسب برای داده شمارشی که علاوه بر میانگین، پراکندگی اضافی بین نمونه‌های زیستی را هم در نظر می‌گیرد. DESeq2 از این خانواده مدل‌ها استفاده می‌کند.",
      },
    ],
    insight: <DispersionLab />,
    question: {
      question:
        "دو ژن هر دو میانگین کنترل ۱۰۰ و درمان ۲۰۰ دارند. کدام ژن معمولاً شواهد آماری قوی‌تری برای تفاوت خواهد داشت؟",
      options: [
        "ژنی که تکرارهای زیستی آن در هر گروه منسجم‌تر و پراکندگی کمتری دارند.",
        "همیشه هر دو دقیقاً یک نتیجه می‌دهند چون میانگین‌ها برابرند.",
        "ژنی که فقط یک نمونه بسیار بزرگ دارد.",
      ],
      correctIndex: 0,
      correctFeedback:
        "دقیقاً. اندازه تفاوت مهم است، اما میزان نوسان بین تکرارهای زیستی تعیین می‌کند چقدر به آن تفاوت اطمینان داریم.",
      incorrectFeedback:
        "آزمون آماری فقط اختلاف میانگین را نمی‌بیند؛ عدم‌قطعیت ناشی از تغییرپذیری نمونه‌ها هم وارد نتیجه می‌شود.",
    },
    bridge: {
      openQuestion:
        "اگر علاوه بر شرایط زیستی، دسته آزمایشی هم روی نمونه‌ها اثر داشته باشد، مدل از کجا می‌فهمد کدام تغییر مربوط به درمان است؟",
      nextStep:
        "بخش بعد طراحی آماری را به درس ۱ و PCA درس ۸ وصل می‌کند: متغیرهای توضیحی باید صریحاً در مدل تعریف شوند.",
    },
  },
  {
    title: "مدل دقیقاً چه چیزی را مقایسه می‌کند؟",
    eyebrow: "طراحی مطالعه وارد مدل می‌شود",
    headline:
      "بیان افتراقی فقط یک آزمون روی دو ستون نیست؛ باید بدانیم اثر کدام متغیر را می‌خواهیم جدا کنیم.",
    lead:
      "اگر پروژه در دو دسته آزمایشی انجام شده باشد و در درس ۸ اثر دسته‌ای دیده باشیم، می‌توانیم در صورت امکان طراحی، آن را به‌عنوان متغیر همراه وارد مدل کنیم. اما اگر همه کنترل‌ها در دسته A و همه درمان‌ها در دسته B باشند، اثر دسته و درمان از هم قابل تفکیک نیستند.",
    connection:
      "پراکندگی تغییرپذیری بین تکرارها را مدل می‌کند. حالا باید مشخص کنیم این تکرارها بر اساس چه عوامل زیستی و فنی گروه‌بندی شده‌اند.",
    terms: [
      {
        term: "design formula",
        persianLabel: "فرمول طراحی",
        explanation:
          "تعریف ریاضی متغیرهایی که مدل باید اثرشان را در نظر بگیرد؛ برای مثال شرایط زیستی و دسته آزمایشی. این فرمول باید بازتاب طراحی واقعی مطالعه باشد.",
      },
      {
        term: "covariate",
        persianLabel: "هم‌متغیر",
        explanation:
          "متغیری همراه با شرایط اصلی که می‌تواند بخشی از تغییر داده را توضیح دهد، مانند دسته آزمایشی یا جنسیت؛ البته فقط وقتی طراحی اجازه تفکیک اثرها را بدهد.",
      },
    ],
    insight: <DesignModelLab />,
    question: {
      question:
        "اگر همه نمونه‌های کنترل در دسته A و همه نمونه‌های درمان در دسته B باشند، افزودن هر دو متغیر به مدل چه مشکلی را حل می‌کند؟",
      options: [
        "همه چیز را حل می‌کند و مدل همیشه اثرها را جدا می‌کند.",
        "هیچ تضمینی ندارد؛ چون شرایط و دسته کاملاً درهم‌آمیخته‌اند و اطلاعات کافی برای تفکیکشان وجود ندارد.",
        "فقط کافی است تعداد ژن‌ها را بیشتر کنیم.",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. آمار نمی‌تواند اطلاعاتی را که در طراحی جمع‌آوری نشده بسازد؛ این همان درهم‌آمیختگی اثرها از درس ۱ است.",
      incorrectFeedback:
        "وقتی دو عامل دقیقاً هم‌جهت باشند، مدل مشاهده مستقلی برای جداکردن اثرشان ندارد. مشکل باید در طراحی پیشگیری شود.",
    },
    bridge: {
      openQuestion:
        "وقتی مدل اثر شرایط را تخمین زد، چگونه اندازه و جهت تغییر هر ژن را به زبان قابل فهم گزارش می‌کنیم؟",
      nextStep:
        "بخش بعد مفهوم اندازه اثر و تغییر چندبرابری در مقیاس log2 را از پایه می‌سازد.",
    },
  },
  {
    title: "اندازه تغییر را چگونه می‌خوانیم؟",
    eyebrow: "اثر زیستی قبل از معنی‌داری",
    headline:
      "log2 fold change می‌گوید جهت و بزرگی تغییر برآوردشده چقدر است؛ هنوز درباره قطعیت آماری حرف نمی‌زند.",
    lead:
      "اگر بیان یک ژن در درمان دو برابر کنترل برآورد شود، fold change برابر ۲ است و log2 fold change برابر ۱. اگر نصف شود، log2 fold change برابر منفی ۱ است. صفر یعنی برآورد مرکزی تغییری نشان نمی‌دهد.",
    connection:
      "مدل اکنون می‌داند کدام اثر را تخمین بزند. خروجی بعدی باید بگوید این اثر چقدر بزرگ و در چه جهتی است.",
    terms: [
      {
        term: "effect size",
        persianLabel: "اندازه اثر",
        explanation:
          "مقداری که بزرگی تفاوت برآوردشده را بیان می‌کند. در RNA-seq یکی از رایج‌ترین نمایش‌ها تغییر چندبرابری در مقیاس log2 است.",
      },
      {
        term: "log2 fold change",
        persianLabel: "تغییر چندبرابری در مقیاس log2",
        explanation:
          "نمایش لگاریتمی نسبت بیان بین دو شرایط. مقدار +۱ تقریباً یعنی دو برابر، −۱ یعنی نصف، و +۲ یعنی چهار برابر.",
      },
    ],
    insight: <FoldChangeLab />,
    question: {
      question:
        "اگر log2 fold change یک ژن برابر −۱ باشد، تفسیر ساده آن چیست؟",
      options: [
        "بیان در گروه صورت کسر تقریباً نصف گروه مرجع برآورد شده است.",
        "بیان دقیقاً صفر شده است.",
        "مقدار p حتماً کمتر از ۰٫۰۵ است.",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. log2 fold change اندازه و جهت اثر را می‌گوید، نه معنی‌داری آماری را.",
      incorrectFeedback:
        "منفی یک در مقیاس log2 یعنی نسبت حدود ۱/۲. این عدد به‌تنهایی چیزی درباره مقدار p یا قطعیت نتیجه نمی‌گوید.",
    },
    bridge: {
      openQuestion:
        "دو ژن می‌توانند log2 fold change یکسان داشته باشند؛ پس چرا یکی شواهد آماری قوی‌تری از دیگری دارد؟",
      nextStep:
        "چون اندازه اثر بدون عدم‌قطعیت کافی نیست. بخش بعد خطای استاندارد، فرض صفر و مقدار p را به همین سؤال وصل می‌کند.",
    },
  },
  {
    title: "عدم‌قطعیت و مقدار p",
    eyebrow: "اثر یکسان، اطمینان متفاوت",
    headline:
      "مقدار p احتمال درست‌بودن فرض صفر نیست؛ نشان می‌دهد داده مشاهده‌شده زیر فرض نبود اثر چقدر غیرمنتظره است.",
    lead:
      "وقتی مدل یک تغییر را برآورد می‌کند، آن برآورد عدم‌قطعیت دارد. خطای استاندارد خلاصه‌ای از این عدم‌قطعیت است. آزمون آماری می‌پرسد اگر در واقع اثر موردنظر وجود نداشت، دیدن آماره‌ای به این شدت یا شدیدتر چقدر سازگار با آن فرض بود؟",
    connection:
      "log2 fold change بزرگی اثر را داد. حالا باید بدانیم آیا داده و تکرارهای زیستی از این برآورد به اندازه کافی پشتیبانی می‌کنند یا نه.",
    terms: [
      {
        term: "standard error",
        persianLabel: "خطای استاندارد",
        explanation:
          "خلاصه‌ای از عدم‌قطعیت برآورد اثر. هرچه داده منسجم‌تر و اطلاعات بیشتر باشد، معمولاً برآورد اثر دقیق‌تر می‌شود.",
      },
      {
        term: "null hypothesis",
        persianLabel: "فرض صفر",
        explanation:
          "فرض مرجعی که در آزمون بررسی می‌شود؛ در ساده‌ترین مقایسه می‌تواند این باشد که اثر شرایط بر بیان ژن برابر صفر است.",
      },
      {
        term: "p-value",
        persianLabel: "مقدار p",
        explanation:
          "اگر فرض صفر درست باشد، احتمال مشاهده آماره‌ای به اندازه داده فعلی یا شدیدتر را بیان می‌کند. مقدار p احتمال درست‌بودن فرض صفر نیست.",
      },
    ],
    insight: <UncertaintyLab />,
    question: {
      question:
        "کدام تعریف برای مقدار p دقیق‌تر است؟",
      options: [
        "احتمال اینکه فرض صفر درست باشد.",
        "احتمال اینکه نتیجه مطالعه کاملاً تصادفی باشد.",
        "احتمال مشاهده آماره‌ای به این شدت یا شدیدتر، در صورتی که فرض صفر درست باشد.",
      ],
      correctIndex: 2,
      correctFeedback:
        "دقیقاً. این تفاوت ظریف اما بنیادی است و جلوی تفسیرهای اغراق‌آمیز را می‌گیرد.",
      incorrectFeedback:
        "مقدار p مستقیماً احتمال درست‌بودن فرض صفر یا «تصادفی بودن نتیجه» را نمی‌دهد؛ شرط آن این است که فرض صفر را موقتاً درست فرض کنیم.",
    },
    bridge: {
      openQuestion:
        "اگر برای ۲۰هزار ژن جداگانه آزمون انجام دهیم، آیا آستانه ۰٫۰۵ برای هر ژن به‌تنهایی هنوز کافی است؟",
      nextStep:
        "نه. با آزمون‌های متعدد، کشف‌های کاذب تجمع پیدا می‌کنند؛ بخش بعد نرخ کشف کاذب و مقدار p تعدیل‌شده را معرفی می‌کند.",
    },
  },
  {
    title: "چرا مقدار p را تعدیل می‌کنیم؟",
    eyebrow: "هزاران آزمون هم‌زمان",
    headline:
      "وقتی هزاران ژن را می‌آزماییم، حتی بدون اثر واقعی هم بخشی از آزمون‌ها به‌طور اتفاقی مقدار p کوچک می‌گیرند.",
    lead:
      "در RNA-seq معمولاً هزاران ژن هم‌زمان بررسی می‌شوند. بنابراین مسئله فقط یک آزمون نیست. روش‌هایی مانند Benjamini–Hochberg مقدارهای p را با توجه به تعداد و رتبه آزمون‌ها تعدیل می‌کنند تا نرخ کشف کاذب در مجموعه ژن‌های اعلام‌شده کنترل شود.",
    connection:
      "در بخش قبل یک ژن را بررسی کردیم. حالا مقیاس واقعی RNA-seq را وارد مسئله می‌کنیم: هزاران فرضیه هم‌زمان.",
    terms: [
      {
        term: "multiple testing",
        persianLabel: "آزمون‌های متعدد",
        explanation:
          "حالتی که تعداد زیادی فرضیه آماری به‌طور هم‌زمان بررسی می‌شوند. هرچه تعداد آزمون‌ها بیشتر شود، احتمال دیدن نتیجه‌های ظاهراً کوچک به‌صورت اتفاقی بیشتر می‌شود.",
      },
      {
        term: "adjusted p-value",
        persianLabel: "مقدار p تعدیل‌شده",
        explanation:
          "مقداری که اثر انجام آزمون‌های متعدد را در تصمیم‌گیری وارد می‌کند. در خروجی DESeq2 ستون padj معمولاً با روش Benjamini–Hochberg محاسبه می‌شود.",
      },
      {
        term: "false discovery rate",
        persianLabel: "نرخ کشف کاذب",
        explanation:
          "معیاری در سطح مجموعه کشف‌ها. به‌طور مفهومی می‌خواهیم سهم مورد انتظار کشف‌های کاذب در بین ژن‌هایی که مثبت اعلام می‌کنیم کنترل شود؛ این مقدار احتمال کاذب‌بودن تک‌تک ژن‌ها نیست.",
      },
    ],
    insight: <FdrLab />,
    question: {
      question:
        "اگر padj یک ژن ۰٫۰۳ باشد، کدام برداشت دقیق‌تر است؟",
      options: [
        "احتمال کاذب‌بودن همین ژن دقیقاً ۳٪ است.",
        "این مقدار برای تصمیم‌گیری در زمینه آزمون‌های متعدد محاسبه شده و باید در چارچوب آستانه FDR مطالعه تفسیر شود.",
        "ژن حتماً از نظر زیستی مهم است.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. padj ابزار کنترل خطا در مجموعه آزمون‌هاست؛ نه احتمال شخصی کاذب‌بودن یک ژن و نه معیار اهمیت زیستی.",
      incorrectFeedback:
        "مقدار p تعدیل‌شده و FDR درباره رفتار مجموعه آزمون‌ها هستند. اهمیت زیستی همچنان نیاز به اندازه اثر و زمینه پژوهش دارد.",
    },
    bridge: {
      openQuestion:
        "اگر یک ژن padj بسیار کوچک اما تغییر بسیار ناچیز داشته باشد، آیا باید آن را مهم‌ترین یافته زیستی بدانیم؟",
      nextStep:
        "نه الزاماً. بخش بعد معنی‌داری آماری را از اهمیت زیستی جدا می‌کند و اندازه اثر را دوباره وارد تصمیم می‌کند.",
    },
  },
  {
    title: "معنی‌داری آماری ≠ اهمیت زیستی",
    eyebrow: "دو محور برای تصمیم",
    headline:
      "برای تفسیر نتیجه باید هم اندازه اثر را ببینیم و هم عدم‌قطعیت آماری را؛ هیچ آستانه واحدی برای همه پروژه‌ها وجود ندارد.",
    lead:
      "یک ژن با تغییر بسیار کوچک می‌تواند در مطالعه بزرگ از نظر آماری معنی‌دار شود، و یک ژن با تغییر بزرگ ممکن است به دلیل پراکندگی بالا هنوز عدم‌قطعیت زیادی داشته باشد. تصمیم پژوهشی باید به سؤال، اندازه اثر، کیفیت داده، تعداد نمونه‌ها و خطای چندآزمونی توجه کند.",
    connection:
      "FDR کمک کرد فهرست کشف‌ها را کنترل کنیم. حالا باید از اشتباه رایج «padj کوچک = اهمیت زیستی زیاد» عبور کنیم.",
    terms: [
      {
        term: "statistical significance",
        persianLabel: "معنی‌داری آماری",
        explanation:
          "بیان می‌کند داده تا چه حد با یک فرض صفر مشخص ناسازگار است، با توجه به مدل و آستانه تصمیم. این مفهوم به‌تنهایی اندازه یا اهمیت زیستی اثر را تعیین نمی‌کند.",
      },
      {
        term: "biological relevance",
        persianLabel: "اهمیت زیستی",
        explanation:
          "میزان ارتباط یک تغییر با سازوکار، فنوتیپ یا سؤال پژوهشی. برای قضاوت درباره آن باید از اندازه اثر و دانش زمینه‌ای استفاده کرد، نه فقط مقدار p.",
      },
    ],
    insight: <DecisionThresholdLab />,
    question: {
      question:
        "کدام ژن لزوماً مهم‌تر نیست: ژنی با padj بسیار کوچک اما log2 fold change نزدیک صفر، یا ژنی با اثر بزرگ‌تر و عدم‌قطعیت بیشتر؟",
      options: [
        "فقط ژن با padj کوچک همیشه مهم‌تر است.",
        "هیچ‌کدام را فقط با یک عدد نمی‌توان مهم‌تر دانست؛ باید اندازه اثر، عدم‌قطعیت و سؤال زیستی را کنار هم دید.",
        "فقط ژن با شمارش خام بیشتر مهم است.",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. نتیجه قابل دفاع از ترکیب اندازه اثر، شواهد آماری و زمینه زیستی ساخته می‌شود.",
      incorrectFeedback:
        "یک عدد منفرد کافی نیست. padj، اندازه اثر و زمینه زیستی هرکدام بخش متفاوتی از داستان را می‌گویند.",
    },
    bridge: {
      openQuestion:
        "همه این مفاهیم در یک پروژه واقعی چگونه به یک مسیر تحلیل منسجم تبدیل می‌شوند؟",
      nextStep:
        "بخش بعد آن‌ها را در پروژه سرطان پانکراس کنار هم می‌گذارد و نشان می‌دهد DESeq2 در هر مرحله دقیقاً کدام مفهوم را پیاده می‌کند.",
    },
  },
  {
    title: "پروژه سرطان پانکراس",
    eyebrow: "از طراحی تا جدول نتایج",
    headline:
      "ابزار فقط زمانی معنا دارد که بدانیم هر مرحله چه مسئله‌ای را حل می‌کند.",
    lead:
      "فرض کنید شش نمونه سرطان پانکراس داریم: سه کنترل و سه درمان، که در دو دسته آزمایشی توزیع شده‌اند. کنترل کیفیت درس ۸ الگوی شدیدی از نمونه پرت نشان نداده و طراحی اجازه می‌دهد اثر دسته و شرایط از هم جدا شوند. اکنون می‌توانیم مدل شمارشی را اجرا کنیم.",
    connection:
      "اکنون نرمال‌سازی، پراکندگی، طراحی مدل، اندازه اثر و FDR را جداگانه فهمیده‌ایم. وقت آن است آن‌ها را به یک زنجیره واقعی وصل کنیم.",
    flow: [
      "ماتریس شمارش",
      "فراداده",
      "ضریب مقیاس نمونه",
      "برآورد پراکندگی",
      "مدل شرایط + دسته",
      "log2 fold change",
      "مقدار p",
      "padj",
      "فهرست نتایج",
    ],
    terms: [
      {
        term: "DESeq2",
        explanation:
          "یک بسته Bioconductor برای تحلیل بیان افتراقی داده‌های شمارشی RNA-seq. اینجا نام ابزار بعد از ساختن مفاهیم وارد می‌شود: ضریب مقیاس، پراکندگی، مدل شمارشی و آزمون آماری.",
      },
      {
        term: "Wald test",
        persianLabel: "آزمون والد",
        explanation:
          "یکی از آزمون‌هایی که DESeq2 برای بررسی ضرایب مدل به کار می‌برد. در این درس مهم‌تر از نام آزمون، فهم این است که اثر برآوردشده نسبت به عدم‌قطعیتش سنجیده می‌شود.",
      },
    ],
    insight: <PancreasModelLab />,
    question: {
      question:
        "در این پروژه، اگر دسته آزمایشی قابل تفکیک از شرایط باشد و در PCA اثر آن دیده شده باشد، کدام فرمول مفهومی مناسب‌تر است؟",
      options: [
        "فقط شرایط، چون عوامل فنی هیچ‌وقت وارد مدل نمی‌شوند.",
        "دسته آزمایشی + شرایط، تا اثر شرایط با درنظرگرفتن دسته برآورد شود.",
        "فقط شناسه ژن.",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. مدل باید طراحی واقعی را منعکس کند، به شرط اینکه عوامل در داده قابل تفکیک باشند.",
      incorrectFeedback:
        "درس ۱ و ۸ اینجا دوباره مصرف می‌شوند: اگر عامل فنی قابل تفکیک باشد و بر ساختار داده اثر داشته باشد، می‌تواند در طراحی مدل وارد شود.",
    },
    bridge: {
      openQuestion:
        "بعد از این تحلیل ممکن است صدها ژن با اندازه اثر و padj متفاوت داشته باشیم؛ چگونه از این فهرست به یک داستان زیستی قابل دفاع می‌رسیم؟",
      nextStep:
        "این دقیقاً محدودیت درس ۹ و نقطه شروع درس ۱۰ است: تفسیر زیستی، غنی‌سازی و حرکت از ژن‌های منفرد به سازوکارها و مسیرها.",
    },
  },
  {
    title: "ایستگاه تسلط",
    eyebrow: "جمع‌بندی فعال",
    headline:
      "بیان افتراقی یک دکمه نیست؛ زنجیره‌ای از تصمیم‌های آماری است که از طراحی مطالعه شروع می‌شود.",
    lead:
      "اگر بتوانید توضیح دهید چرا شمارش خام مستقیم مقایسه نمی‌شود، ضریب مقیاس چه می‌کند، پراکندگی چرا به تکرار زیستی وابسته است، log2 fold change چه می‌گوید و چرا padj با اهمیت زیستی یکی نیست، آماده ورود به تفسیر زیستی هستید.",
    connection:
      "این بخش بررسی می‌کند آیا حلقه‌های اصلی درس به یک مدل ذهنی واحد تبدیل شده‌اند یا نه.",
    flow: [
      "طراحی معتبر",
      "نرمال‌سازی",
      "پراکندگی",
      "مدل شمارشی",
      "اندازه اثر",
      "عدم‌قطعیت",
      "آزمون‌های متعدد",
      "فهرست ژن‌ها",
      "تفسیر زیستی",
    ],
    insight: <MasteryMap />,
    question: {
      question:
        "کدام جمله دقیق‌ترین خلاصه درس ۹ است؟",
      options: [
        "نرمال‌سازی همه تفاوت‌های بین نمونه‌ها را حذف می‌کند و هر ژن با padj کوچک مهم است.",
        "بیان افتراقی اثر شرایط را با درنظرگرفتن مقیاس، تغییرپذیری و طراحی مدل برآورد می‌کند و نتیجه باید با اندازه اثر و کنترل آزمون‌های متعدد تفسیر شود.",
        "اگر log2 fold change بزرگ باشد دیگر به تکرار زیستی نیاز نداریم.",
      ],
      correctIndex: 1,
      correctFeedback:
        "عالی. حالا آماده‌اید از «کدام ژن‌ها تغییر کرده‌اند؟» به سؤال سخت‌تر «این تغییرها چه معنی زیستی دارند؟» بروید.",
      incorrectFeedback:
        "به زنجیره برگردید: طراحی ← مقیاس ← تغییرپذیری ← اثر ← عدم‌قطعیت ← آزمون‌های متعدد. حذف هر حلقه می‌تواند نتیجه را گمراه کند.",
    },
    bridge: {
      openQuestion:
        "یک فهرست ۳۰۰ ژنی چگونه به پاسخ درباره سازوکار سرطان پانکراس تبدیل می‌شود؟",
      nextStep:
        "درس ۱۰ از همین سؤال شروع می‌شود: تفسیر زیستی، مسیرهای زیستی، غنی‌سازی و ساختن نتیجه‌ای که فراتر از فهرست ژن‌ها باشد.",
    },
  },
];

export function RnaSeqDifferentialExpressionLesson() {
  return (
    <GuidedConceptLesson
      lessonIndex={9}
      title="نرمال‌سازی و بیان افتراقی"
      subtitle="از مشکل مقیاس نمونه‌ها تا اندازه اثر، عدم‌قطعیت، مقدار p و نرخ کشف کاذب؛ بدون شروع ابزارمحور و با اتصال مستقیم به طراحی مطالعه."
      sectionId="rna-seq-differential-expression"
      sections={sections}
    />
  );
}

function LabFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black text-teal-700">آزمایشگاه تعاملی</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function NormalizationNeedLab() {
  const [mode, setMode] = useState<"raw" | "scaled">("raw");
  const genes = [
    { gene: "G1", a: 100, b: 200 },
    { gene: "G2", a: 80, b: 160 },
    { gene: "G3", a: 120, b: 240 },
  ];

  return (
    <LabFrame title="یک زیست‌شناسی، دو مقیاس اندازه‌گیری">
      <div className="flex flex-wrap gap-2">
        <ChoiceButton active={mode === "raw"} onClick={() => setMode("raw")}>شمارش خام</ChoiceButton>
        <ChoiceButton active={mode === "scaled"} onClick={() => setMode("scaled")}>پس از مدیریت مقیاس</ChoiceButton>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead><tr className="text-slate-500"><th className="p-2 text-right">ژن</th><th className="p-2">نمونه A</th><th className="p-2">نمونه B</th></tr></thead>
          <tbody>
            {genes.map((row) => (
              <tr key={row.gene} className="border-t border-slate-100">
                <td className="p-2 font-bold">{row.gene}</td>
                <td className="p-2 text-center">{row.a}</td>
                <td className="p-2 text-center">{mode === "raw" ? row.b : row.b / 2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {mode === "raw"
          ? "در ظاهر همه ژن‌ها در B دو برابر شده‌اند؛ اما این مثال عمداً فقط یک تفاوت مقیاس ۲ برابری دارد."
          : "بعد از درنظرگرفتن مقیاس نسبی ۲ برای B، الگوی سه ژن دوباره با A هم‌خوان می‌شود. این نمایش فقط برای فهم مفهوم است؛ روش واقعی ضریب مقیاس را از کل داده برآورد می‌کند."}
      </p>
    </LabFrame>
  );
}

function CompositionBiasLab() {
  const [spike, setSpike] = useState(false);
  const a = [100, 100, 100, 100];
  const b = spike ? [1000, 100, 100, 100] : [100, 100, 100, 100];
  const totalB = b.reduce((sum, value) => sum + value, 0);

  return (
    <LabFrame title="یک ژن را بسیار پرفراوان کنید">
      <ChoiceButton active={spike} onClick={() => setSpike((value) => !value)}>
        {spike ? "بازگرداندن ژن G1" : "افزایش شدید G1 در نمونه B"}
      </ChoiceButton>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {b.map((value, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">G{index + 1}</p>
            <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-xs text-slate-500">سهم از B: {Math.round((value / totalB) * 100)}٪</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {spike
          ? "G2 تا G4 عدد خامشان تغییر نکرده، اما سهم نسبی‌شان از کل کتابخانه B شدیداً کم شده است. پس نرمال‌سازی صرفاً بر مجموع کل می‌تواند آن‌ها را به اشتباه پایین‌تر نشان دهد."
          : "فعلاً دو نمونه ترکیب مشابه دارند. با افزایش شدید فقط یک ژن ببینید چگونه مجموع و سهم نسبی همه ژن‌ها تغییر می‌کند."}
      </p>
    </LabFrame>
  );
}

function DispersionLab() {
  const [pattern, setPattern] = useState<"stable" | "variable">("stable");
  const values = pattern === "stable" ? [190, 205, 198, 210] : [80, 330, 140, 250];
  const mean = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <LabFrame title="میانگین مشابه، پراکندگی متفاوت">
      <div className="flex flex-wrap gap-2">
        <ChoiceButton active={pattern === "stable"} onClick={() => setPattern("stable")}>تکرارهای منسجم</ChoiceButton>
        <ChoiceButton active={pattern === "variable"} onClick={() => setPattern("variable")}>تکرارهای متغیر</ChoiceButton>
      </div>
      <div className="mt-5 flex items-end gap-3 rounded-2xl bg-slate-50 p-4" style={{ minHeight: 170 }}>
        {values.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-xl bg-teal-600/80" style={{ height: `${Math.max(20, value / 2)}px` }} />
            <span className="text-xs font-bold text-slate-600">R{index + 1}: {value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">میانگین تقریبی: {mean}. {pattern === "stable" ? "نمونه‌ها نزدیک هم‌اند و عدم‌قطعیت کمتر است." : "همان مرتبه میانگین با نوسان بسیار بیشتر؛ مدل باید این پراکندگی را در اطمینان به اثر لحاظ کند."}</p>
    </LabFrame>
  );
}

function DesignModelLab() {
  const [confounded, setConfounded] = useState(false);
  const rows = confounded
    ? [
        ["C1", "کنترل", "A"], ["C2", "کنترل", "A"], ["C3", "کنترل", "A"],
        ["T1", "درمان", "B"], ["T2", "درمان", "B"], ["T3", "درمان", "B"],
      ]
    : [
        ["C1", "کنترل", "A"], ["C2", "کنترل", "B"], ["C3", "کنترل", "A"],
        ["T1", "درمان", "A"], ["T2", "درمان", "B"], ["T3", "درمان", "B"],
      ];

  return (
    <LabFrame title="آیا شرایط و دسته آزمایشی قابل تفکیک‌اند؟">
      <ChoiceButton active={confounded} onClick={() => setConfounded((v) => !v)}>
        {confounded ? "نمایش طراحی متوازن‌تر" : "ساخت طراحی کاملاً درهم‌آمیخته"}
      </ChoiceButton>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {rows.map(([id, group, batch]) => (
          <div key={id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <b>{id}</b> · {group} · دسته {batch}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {confounded
          ? "اینجا هر کنترل=A و هر درمان=B است. داده هیچ مقایسه مستقلی برای جداکردن اثر شرایط از دسته ندارد."
          : "هر دو شرایط در بیش از یک دسته دیده می‌شوند؛ بنابراین در اصل امکان برآورد اثر شرایط با درنظرگرفتن دسته وجود دارد."}
      </p>
    </LabFrame>
  );
}

function FoldChangeLab() {
  const [lfc, setLfc] = useState(1);
  const fold = 2 ** lfc;
  const label = lfc === 0 ? "بدون تغییر مرکزی" : lfc > 0 ? `${fold.toFixed(2)} برابر بیشتر` : `${(1 / fold).toFixed(2)} برابر کمتر`;

  return (
    <LabFrame title="مقیاس log2 را با دست حرکت دهید">
      <input
        type="range"
        min={-2}
        max={2}
        step={0.5}
        value={lfc}
        onChange={(event) => setLfc(Number(event.target.value))}
        className="w-full accent-teal-600"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="log2 fold change" value={lfc.toFixed(1)} />
        <Metric label="نسبت درمان / کنترل" value={fold.toFixed(2)} />
        <Metric label="تفسیر" value={label} />
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">این اسلایدر فقط اندازه اثر را نشان می‌دهد. هنوز هیچ اطلاعاتی درباره پراکندگی، خطای استاندارد یا مقدار p وارد نکرده‌ایم.</p>
    </LabFrame>
  );
}

function UncertaintyLab() {
  const [gene, setGene] = useState<"A" | "B">("A");
  const data = gene === "A"
    ? { lfc: 1.2, se: 0.18, p: "۰٫۰۰۰۲", note: "اثر با عدم‌قطعیت کم" }
    : { lfc: 1.2, se: 0.72, p: "۰٫۱۲", note: "همان اثر مرکزی، اما عدم‌قطعیت بیشتر" };

  return (
    <LabFrame title="دو ژن با log2 fold change یکسان">
      <div className="flex gap-2">
        <ChoiceButton active={gene === "A"} onClick={() => setGene("A")}>ژن A</ChoiceButton>
        <ChoiceButton active={gene === "B"} onClick={() => setGene("B")}>ژن B</ChoiceButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="log2 fold change" value={String(data.lfc)} />
        <Metric label="خطای استاندارد" value={String(data.se)} />
        <Metric label="مقدار p آموزشی" value={data.p} />
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{data.note}. مقادیر این آزمایشگاه صرفاً برای نشان‌دادن رابطه اثر و عدم‌قطعیت ساخته شده‌اند.</p>
    </LabFrame>
  );
}

function FdrLab() {
  const [adjusted, setAdjusted] = useState(false);
  const genes = [
    { id: "G1", p: 0.001, padj: 0.01 },
    { id: "G2", p: 0.008, padj: 0.04 },
    { id: "G3", p: 0.018, padj: 0.07 },
    { id: "G4", p: 0.031, padj: 0.09 },
    { id: "G5", p: 0.049, padj: 0.12 },
  ];

  return (
    <LabFrame title="خام یا تعدیل‌شده؟">
      <ChoiceButton active={adjusted} onClick={() => setAdjusted((v) => !v)}>
        {adjusted ? "نمایش مقدار p خام" : "نمایش مقدار p تعدیل‌شده"}
      </ChoiceButton>
      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {genes.map((item) => {
          const value = adjusted ? item.padj : item.p;
          const pass = value < 0.05;
          return (
            <div key={item.id} className={`rounded-2xl border p-3 text-center ${pass ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
              <p className="font-black">{item.id}</p>
              <p className="mt-1 text-sm">{value}</p>
              <p className="mt-1 text-[11px] text-slate-500">{pass ? "زیر ۰٫۰۵" : "بالای ۰٫۰۵"}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">همان ژن‌ها بعد از درنظرگرفتن آزمون‌های متعدد ممکن است تصمیم متفاوتی بگیرند. هدف، کنترل خطا در مجموعه کشف‌هاست.</p>
    </LabFrame>
  );
}

function DecisionThresholdLab() {
  const [effectCutoff, setEffectCutoff] = useState(1);
  const genes = [
    { id: "KRAS-pathway-A", lfc: 0.25, padj: 0.0001 },
    { id: "Stroma-B", lfc: 1.6, padj: 0.012 },
    { id: "Immune-C", lfc: -1.3, padj: 0.031 },
    { id: "Stress-D", lfc: 2.1, padj: 0.18 },
  ];

  const selected = useMemo(
    () => genes.filter((g) => g.padj < 0.05 && Math.abs(g.lfc) >= effectCutoff),
    [effectCutoff],
  );

  return (
    <LabFrame title="آستانه اثر را تغییر دهید">
      <input type="range" min={0} max={2} step={0.25} value={effectCutoff} onChange={(e) => setEffectCutoff(Number(e.target.value))} className="w-full accent-teal-600" />
      <p className="mt-2 text-sm font-bold text-slate-700">آستانه آموزشی |log2FC| ≥ {effectCutoff.toFixed(2)} و padj &lt; 0.05</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {genes.map((g) => {
          const pass = g.padj < 0.05 && Math.abs(g.lfc) >= effectCutoff;
          return <div key={g.id} className={`rounded-2xl border p-3 ${pass ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"}`}><b>{g.id}</b><div className="mt-1 text-xs text-slate-600">log2FC={g.lfc} · padj={g.padj}</div></div>;
        })}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">انتخاب فعلی: {selected.length.toLocaleString("fa-IR")} ژن. این آستانه صرفاً برای آزمایش مفهوم است؛ آستانه اندازه اثر باید بر اساس سؤال و زمینه پژوهش تعیین شود، نه یک قانون جهانی.</p>
    </LabFrame>
  );
}

function PancreasModelLab() {
  const [step, setStep] = useState(0);
  const steps: Array<readonly [string, string, string]> = [
    ["۱", "ماتریس + فراداده", "شناسه ستون‌ها با نمونه‌ها تطبیق داده می‌شود."],
    ["۲", "ضریب مقیاس", "DESeq2 مقیاس نسبی نمونه‌ها را برآورد می‌کند."],
    ["۳", "پراکندگی", "تغییرپذیری ژن‌ها با استفاده از تکرارهای زیستی برآورد می‌شود."],
    ["۴", "مدل", "اثر شرایط با درنظرگرفتن دسته آزمایشی برآورد می‌شود."],
    ["۵", "نتیجه", "log2 fold change، مقدار p و padj برای مقایسه استخراج می‌شوند."],
  ];
  const currentStep = steps[step] ?? steps[0];

  if (!currentStep) {
    return null;
  }

  return (
    <LabFrame title="مسیر مفهومی DESeq2 را مرحله‌به‌مرحله باز کنید">
      <div className="flex flex-wrap gap-2">
        {steps.map((item, index) => <ChoiceButton key={item[0]} active={step === index} onClick={() => setStep(index)}>مرحله {item[0]}</ChoiceButton>)}
      </div>
      <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5">
        <p className="font-black text-teal-950">{currentStep[1]}</p>
        <p className="mt-2 text-sm leading-7 text-teal-900">{currentStep[2]}</p>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-left text-xs leading-7 text-slate-200" dir="ltr">{`design = ~ batch + condition\nDESeq()  # size factors → dispersion → model/test\nresults() # log2FoldChange, pvalue, padj`}</pre>
      <p className="mt-3 text-xs leading-6 text-slate-500">کد فقط نقشه ابزار است؛ منطق هر خط را در بخش‌های قبل ساخته‌ایم.</p>
    </LabFrame>
  );
}

function MasteryMap() {
  const [open, setOpen] = useState<number | null>(0);
  const items: Array<readonly [string, string]> = [
    ["نرمال‌سازی", "مدیریت تفاوت مقیاس و ترکیب نمونه‌ها"],
    ["پراکندگی", "مدل‌کردن تغییرپذیری بین تکرارهای زیستی"],
    ["اندازه اثر", "جهت و بزرگی تغییر با log2 fold change"],
    ["عدم‌قطعیت", "خطای استاندارد و آزمون فرض"],
    ["FDR", "کنترل آزمون‌های متعدد در مجموعه کشف‌ها"],
  ];

  return (
    <LabFrame title="روی هر حلقه بزنید و نقش آن را بازخوانی کنید">
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <button key={item[0]} type="button" onClick={() => setOpen(open === index ? null : index)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right">
            <p className="font-black text-slate-950">{item[0]}</p>
            {open === index && <p className="mt-2 text-sm leading-7 text-slate-600">{item[1]}</p>}
          </button>
        ))}
      </div>
    </LabFrame>
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}
