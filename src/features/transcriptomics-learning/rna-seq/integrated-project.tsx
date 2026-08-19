import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FlaskConical,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";
import {
  IntegratedProjectCmsAdmin,
  ProjectMissionMedia,
  useIntegratedProjectCms,
  type ProjectMissionContent,
} from "@/features/learning/cms/IntegratedProjectCms";
import { usePersistentLessonProgress } from "@/features/learning/usePersistentLessonProgress";

const sampleRows = [
  { id: "C1", group: "مرجع", batch: "A", rin: 8.4, stroma: 34 },
  { id: "C2", group: "مرجع", batch: "A", rin: 7.7, stroma: 41 },
  { id: "C3", group: "مرجع", batch: "B", rin: 6.8, stroma: 38 },
  { id: "C4", group: "مرجع", batch: "B", rin: 6.6, stroma: 36 },
  { id: "C5", group: "مرجع", batch: "A", rin: 7.2, stroma: 46 },
  { id: "C6", group: "مرجع", batch: "B", rin: 5.8, stroma: 44 },
  { id: "T1", group: "درمان X", batch: "A", rin: 8.1, stroma: 39 },
  { id: "T2", group: "درمان X", batch: "A", rin: 7.4, stroma: 42 },
  { id: "T3", group: "درمان X", batch: "B", rin: 6.5, stroma: 51 },
  { id: "T4", group: "درمان X", batch: "B", rin: 7.0, stroma: 47 },
  { id: "T5", group: "درمان X", batch: "A", rin: 6.1, stroma: 55 },
  { id: "T6", group: "درمان X", batch: "B", rin: 4.9, stroma: 72 },
];

const deRows = [
  { gene: "MKI67", log2fc: -1.3, padj: "0.004", theme: "چرخه سلولی" },
  { gene: "TOP2A", log2fc: -1.1, padj: "0.008", theme: "چرخه سلولی" },
  { gene: "CXCL9", log2fc: 1.5, padj: "0.020", theme: "پاسخ ایمنی" },
  { gene: "HLA-B", log2fc: 1.0, padj: "0.031", theme: "پاسخ ایمنی" },
  { gene: "COL1A1", log2fc: 0.8, padj: "0.041", theme: "ماتریکس خارج‌سلولی" },
];

type Mission = ProjectMissionContent;

const defaultMissions: Mission[] = [
  {
    title: "سؤال پژوهشی را قفل کنید",
    lessonRef: "بازگشت به درس ۱",
    prompt: "کدام سؤال، پروژه را به یک مقایسه RNA-seq قابل دفاع تبدیل می‌کند؟",
    context:
      "یک گروه پژوهشی می‌خواهد روی نمونه‌های بافتی سرطان پانکراس بررسی کند آیا درمان فرضی X با تغییر الگوی بیان RNA همراه است یا نه. داده‌ها از ۱۲ بیمار مستقل می‌آیند.",
    options: [
      "کدام ژن‌ها در سرطان پانکراس جالب‌اند؟",
      "آیا الگوی بیان ژن در بافت تومور بیماران دریافت‌کننده درمان X در مقایسه با گروه مرجع متفاوت است، در حالی که دسته آزمایشی در طراحی دیده می‌شود؟",
      "کدام نرم‌افزار بیشترین ژن معنی‌دار را تولید می‌کند؟",
    ],
    correctIndex: 1,
    correctFeedback:
      "سؤال، مقایسه زیستی، واحد نمونه و عامل فنی اصلی را روشن می‌کند؛ ابزار هنوز وارد تصمیم نشده است.",
    incorrectFeedback:
      "پروژه باید با مقایسه زیستی شروع شود، نه با نام ابزار یا یک فهرست مبهم از ژن‌ها.",
    deliverable: "سؤال اصلی: درمان X در برابر مرجع، روی نمونه‌های مستقل بیمار.",
  },
  {
    title: "طراحی مطالعه را دفاع‌پذیر کنید",
    lessonRef: "درس ۱: طراحی مطالعه",
    prompt: "کدام طراحی برای این پروژه مناسب‌تر است؟",
    context:
      "۱۲ بیمار مستقل داریم؛ ۶ مرجع و ۶ درمان. آماده‌سازی نمونه‌ها در دو دسته A و B انجام می‌شود.",
    options: [
      "هر بیمار یک تکرار زیستی مستقل است و هر دو گروه در هر دو دسته A و B حضور دارند.",
      "سه کتابخانه از یک بیمار می‌سازیم و آن‌ها را سه تکرار زیستی حساب می‌کنیم.",
      "همه مرجع‌ها را در دسته A و همه درمان‌ها را در دسته B قرار می‌دهیم تا کار ساده‌تر شود.",
    ],
    correctIndex: 0,
    correctFeedback:
      "بیمار واحد مستقل زیستی است و توزیع گروه‌ها میان دسته‌ها مانع درهم‌آمیختگی کامل شرایط زیستی و دسته آزمایشی می‌شود.",
    incorrectFeedback:
      "تکرار فنی جای تکرار زیستی را نمی‌گیرد و جداکردن کامل گروه‌ها بین دسته‌ها اثر زیستی و فنی را غیرقابل تفکیک می‌کند.",
    deliverable: "۶ در برابر ۶ تکرار زیستی؛ دسته‌های A/B در هر دو گروه حضور دارند.",
  },
  {
    title: "از RNA به یک کتابخانه سازگار برسید",
    lessonRef: "درس‌های ۲ و ۳",
    prompt: "با توجه به پرونده نمونه‌ها، کدام تصمیم منطقی‌تر است؟",
    context:
      "نمونه‌ها بافت توموری آرشیوی منجمد هستند، یکپارچگی RNA بین نمونه‌ها یکسان نیست و سؤال پروژه فقط به mRNAهای دارای poly(A) محدود نشده است.",
    options: [
      "برای هر گروه یک روش آماده‌سازی کتابخانه متفاوت انتخاب کنیم تا بهترین خروجی هر گروه را بگیریم.",
      "یک راهبرد حذف rRNA سازگار با نمونه‌ها را برای همه اجرا کنیم و نمونه‌های کم‌کیفیت‌تر را با شاخص‌های کنترل کیفیت در زمینه همان پروتکل ارزیابی کنیم.",
      "هر نمونه با RIN پایین‌تر از یک عدد ثابت را بدون توجه به پروتکل حذف کنیم.",
    ],
    correctIndex: 1,
    correctFeedback:
      "در این سناریوی آموزشی، حذف rRNA با دامنه کیفیت نمونه و سؤال گسترده‌تر RNA سازگار است؛ مهم‌تر از نام روش، یکسان‌بودن راهبرد بین گروه‌ها و ارزیابی زمینه‌ای کیفیت است.",
    incorrectFeedback:
      "تفاوت سیستماتیک روش کتابخانه بین گروه‌ها می‌تواند اثر فنی را با زیست‌شناسی مخلوط کند و یک آستانه RIN هم قانون جهانی نیست.",
    deliverable: "یک راهبرد ثابت حذف rRNA برای همه نمونه‌ها؛ کنترل کیفیت نمونه‌محور، نه حذف با یک عدد جهانی.",
  },
  {
    title: "تحویل FASTQ را ممیزی کنید",
    lessonRef: "درس ۴: توالی‌یابی و FASTQ",
    prompt: "آزمایشگاه ۲۴ فایل FASTQ تحویل داده است. بهترین تفسیر چیست؟",
    context:
      "توالی‌یابی در این مثال به‌صورت جفت‌انتها 2×100 bp انجام شده و برای سادگی هر نمونه یک جفت فایل تحویل گرفته است.",
    options: [
      "۲۴ فایل یعنی ۲۴ بیمار مستقل داریم.",
      "۱۲ نمونه داریم که هرکدام یک خوانش ۱ و یک خوانش ۲ دارند؛ باید شناسه و جفت‌بودن فایل‌ها با فراداده تطبیق داده شود.",
      "R1 و R2 دو تکرار زیستی از یک بیمار هستند.",
    ],
    correctIndex: 1,
    correctFeedback:
      "تعداد فایل با تعداد واحد زیستی یکی نیست. هویت نمونه از طراحی و فراداده می‌آید و R1/R2 دو سوی همان کتابخانه جفت‌انتها هستند.",
    incorrectFeedback:
      "فایل و نمونه زیستی دو سطح متفاوت‌اند. در توالی‌یابی جفت‌انتها معمولاً دو فایل مرتبط برای یک کتابخانه داریم.",
    deliverable: "۱۲ جفت FASTQ با شناسه‌های تأییدشده و تطابق کامل با جدول نمونه‌ها.",
  },
  {
    title: "کنترل کیفیت داده خام را به تصمیم تبدیل کنید",
    lessonRef: "درس ۵: کنترل کیفیت داده خام",
    prompt: "نمونه C4 آداپتور و افت کیفیت انتهای خوانش دارد. قدم بعدی چیست؟",
    context:
      "C4 در انتهای خوانش ۲ حدود ۱۸٪ سیگنال آداپتور نشان می‌دهد و کیفیت انتهای خوانش افت می‌کند؛ بقیه نمونه‌ها این شدت را ندارند.",
    options: [
      "C4 را فوراً از مطالعه حذف کنیم.",
      "پیرایش هدفمند آداپتور/بخش نامناسب را انجام دهیم، کنترل کیفیت را دوباره اجرا کنیم و سپس شواهد مرحله‌های بعد را هم ببینیم.",
      "هشدار را نادیده بگیریم چون هر هشدار بی‌اهمیت است.",
    ],
    correctIndex: 1,
    correctFeedback:
      "کنترل کیفیت برای هدایت اقدام است. یک مشکل قابل اصلاح را اول اصلاح و دوباره ارزیابی می‌کنیم؛ حذف نمونه نیاز به شواهد مستقل بیشتری دارد.",
    incorrectFeedback:
      "نه هر هشدار مجوز حذف است و نه هر هشدار بی‌اهمیت. باید علت، اصلاح ممکن و نتیجه پس از اصلاح را ببینیم.",
    deliverable: "C4 پیرایش و دوباره کنترل کیفیت شد؛ تصمیم خروج هنوز باز است.",
  },
  {
    title: "مرجع و کمی‌سازی را یکپارچه کنید",
    lessonRef: "درس ۶: هم‌ترازی و کمی‌سازی",
    prompt: "کدام تصمیم باعث می‌شود شمارش نمونه‌ها قابل مقایسه بماند؟",
    context:
      "هدف اصلی، بیان در سطح ژن است. تیم یک ژنوم مرجع و حاشیه‌نویسی نسخه‌دار برای کل پروژه انتخاب می‌کند.",
    options: [
      "برای همه نمونه‌ها یک نسخه مرجع و حاشیه‌نویسی و یک مسیر کمی‌سازی ثابت استفاده کنیم و نسخه‌ها را ثبت کنیم.",
      "برای گروه درمان مرجع جدیدتر و برای گروه مرجع نسخه قدیمی‌تر استفاده کنیم.",
      "هر نمونه را با هر روشی که بیشترین نرخ نگاشت می‌دهد پردازش کنیم.",
    ],
    correctIndex: 0,
    correctFeedback:
      "ثبات مرجع، حاشیه‌نویسی و منطق کمی‌سازی برای مقایسه بین نمونه‌ها ضروری است و نسخه‌ها باید بخشی از سابقه تحلیل باشند.",
    incorrectFeedback:
      "تغییر سیستماتیک مرجع یا روش بین گروه‌ها می‌تواند تفاوت فنی بسازد که بعداً شبیه اثر زیستی دیده شود.",
    deliverable: "یک مرجع/حاشیه‌نویسی نسخه‌دار و یک مسیر کمی‌سازی ثابت برای همه نمونه‌ها.",
  },
  {
    title: "ماتریس را به هویت نمونه وصل کنید",
    lessonRef: "درس ۷: ماتریس شمارش",
    prompt: "قبل از تحلیل آماری، مهم‌ترین ممیزی جدول ژن × نمونه چیست؟",
    context:
      "ماتریس شمارش ساخته شده است. ستون‌ها C1 تا T6 هستند و یک فایل فراداده جداگانه گروه، دسته آزمایشی و اطلاعات پاتولوژی را نگه می‌دارد.",
    options: [
      "فقط تعداد ژن‌ها را بررسی کنیم؛ نام ستون‌ها مهم نیست.",
      "شناسه و ترتیب ستون‌های ماتریس را با فراداده تطبیق دهیم و هر عدم تطابق را قبل از مدل‌سازی حل کنیم.",
      "نام ستون‌ها را کوتاه کنیم حتی اگر ارتباط با بیمار از بین برود.",
    ],
    correctIndex: 1,
    correctFeedback:
      "یک ماتریس درست با فراداده اشتباه می‌تواند نتیجه‌ای کاملاً غلط ولی ظاهراً معتبر بسازد. هویت نمونه جزء خود تحلیل است.",
    incorrectFeedback:
      "ژن × نمونه فقط وقتی معنا دارد که بدانیم هر ستون دقیقاً به کدام واحد زیستی و کدام فراداده تعلق دارد.",
    deliverable: "تطابق یک‌به‌یک ستون‌های ماتریس و فراداده تأیید شد.",
  },
  {
    title: "نمونه پرت را مثل یک پرونده بررسی کنید",
    lessonRef: "درس ۸: کنترل کیفیت در سطح نمونه",
    prompt: "با جمع‌بندی شواهد C4 و T6 چه تصمیمی دفاع‌پذیرتر است؟",
    context:
      "پس از پیرایش، C4 هنوز فقط ۳۱٪ نگاشت به مرجع، ۱۸٪ انتساب به ژن و فاصله شدید در PCA دارد؛ دفتر آزمایش هم افت غلظت کتابخانه را ثبت کرده است. T6 با RIN پایین‌تر و استرومای ۷۲٪، ۸۶٪ نگاشت و ۷۲٪ انتساب دارد و در محدوده گروه درمان قرار می‌گیرد.",
    options: [
      "هر دو را حذف کنیم چون هر دو با بقیه فرق دارند.",
      "C4 را با دلیل فنی چندمنبعی و مستند کنار بگذاریم؛ T6 را نگه داریم و ترکیب بافتی آن را در تفسیر لحاظ کنیم.",
      "هیچ نمونه‌ای را هرگز نمی‌توان حذف کرد.",
    ],
    correctIndex: 1,
    correctFeedback:
      "این تفاوت کلیدی است: C4 چند شاهد مستقل از شکست فنی دارد؛ T6 متفاوت است اما داده فنی قابل قبول و زمینه زیستی قابل توضیح دارد.",
    incorrectFeedback:
      "پرت‌بودن به‌تنهایی دلیل حذف نیست؛ تصمیم باید از چند منبع شواهد و یک معیار مستند پشتیبانی شود.",
    deliverable: "C4 با علت فنی مستند خارج شد؛ T6 حفظ و زمینه پاتولوژی آن ثبت شد.",
  },
  {
    title: "مدل بیان افتراقی را از طراحی بسازید",
    lessonRef: "درس ۹: نرمال‌سازی و بیان افتراقی",
    prompt: "بعد از خروج C4، کدام طرح تحلیل به سؤال اصلی نزدیک‌تر است؟",
    context:
      "هر دو گروه هنوز در هر دو دسته A/B نماینده دارند. ورودی شمارشی مناسب برای DESeq2 در دسترس است و سؤال اصلی اثر شرایط زیستی است.",
    options: [
      "داده را از قبل به TPM تبدیل کنیم و بعد همان را به‌عنوان شمارش خام وارد DESeq2 کنیم.",
      "مدل ~ batch + condition را روی شمارش مناسب اجرا کنیم، ضریب مقیاس و پراکندگی را در مدل برآورد کنیم و مقایسه درمان X در برابر مرجع را استخراج کنیم.",
      "دسته آزمایشی را حذف کنیم چون در PCA خیلی بزرگ به نظر نمی‌رسید.",
    ],
    correctIndex: 1,
    correctFeedback:
      "مدل به طراحی واقعی برمی‌گردد: شرایط زیستی سؤال اصلی است و دسته آزمایشی یک عامل فنی اندازه‌گیری‌شده و قابل تفکیک است.",
    incorrectFeedback:
      "ورودی و طراحی مدل باید با فرض‌های روش و طراحی مطالعه سازگار باشند؛ تبدیل‌های نمایشی یا نادیده‌گرفتن عامل فنی جای مدل‌سازی درست را نمی‌گیرند.",
    deliverable: "مدل اصلی: ~ batch + condition؛ خروجی شامل اندازه اثر، مقدار p و مقدار p تعدیل‌شده.",
  },
  {
    title: "از نتیجه آماری به ادعای زیستی برسید",
    lessonRef: "درس ۱۰: تفسیر زیستی",
    prompt: "کدام جمع‌بندی علمی از خروجی پروژه دفاع‌پذیرتر است؟",
    context:
      "ژن‌های چرخه سلولی مثل MKI67/TOP2A کاهش و برخی ژن‌های ایمنی مثل CXCL9/HLA-B افزایش نشان می‌دهند. تحلیل رتبه‌محور نیز کاهش تم چرخه سلولی و افزایش تم ایمنی را نشان می‌دهد. این داده RNA-seq توده‌ای بافت تومور است.",
    options: [
      "درمان X قطعاً سلول‌های سرطانی را متوقف و مسیر ایمنی را در همان سلول‌ها فعال کرده است.",
      "داده با کاهش سیگنال‌های رونویسی مرتبط با چرخه سلولی و افزایش سیگنال‌های مرتبط با پاسخ ایمنی در بافت تومور سازگار است؛ منشأ سلولی و رابطه علّی به بررسی تکمیلی نیاز دارد.",
      "چون چند ژن معنی‌دار داریم، دیگر فراداده پاتولوژی اهمیتی ندارد.",
    ],
    correctIndex: 1,
    correctFeedback:
      "ادعا هم جهت شواهد را بیان می‌کند و هم مرز آن را: RNA-seq توده‌ای ترکیب بافت را هم می‌بیند و علیت را به‌تنهایی اثبات نمی‌کند.",
    incorrectFeedback:
      "تفسیر باید با سطح داده هم‌تراز باشد. معنی‌داری آماری یا غنی‌سازی به‌تنهایی مکانیزم، نوع سلول یا علیت را ثابت نمی‌کند.",
    deliverable: "فرضیه زیستی محتاطانه با اشاره صریح به زمینه توده‌ای و نیاز به اعتبارسنجی.",
  },
  {
    title: "پروژه را قابل بازتولید تحویل دهید",
    lessonRef: "جمع‌بندی درس‌های ۱ تا ۱۰",
    prompt: "کدام بسته تحویل، پروژه را برای بازبینی علمی آماده‌تر می‌کند؟",
    context:
      "تحلیل تمام شده است. حالا یک همکار باید بتواند بفهمد چه داده‌ای وارد شد، چه تصمیم‌هایی گرفته شد و خروجی چگونه تولید شد.",
    options: [
      "فقط شکل نهایی و فهرست ژن‌های برتر را بفرستیم.",
      "سؤال و طراحی، جدول نمونه، معیارها و تصمیم‌های کنترل کیفیت، نمونه خارج‌شده و دلیل آن، نسخه مرجع/حاشیه‌نویسی، نسخه ابزارها و پارامترها، کد/فرمان‌ها، مدل آماری، خروجی کامل، منبع مجموعه‌های ژنی و محدودیت‌ها را ثبت کنیم.",
      "فقط نام ابزارها را بنویسیم؛ نسخه و پارامترها مهم نیستند.",
    ],
    correctIndex: 1,
    correctFeedback:
      "این همان ردپای تصمیم‌هاست: نتیجه فقط یک شکل نیست، بلکه زنجیره‌ای قابل بازسازی از سؤال تا ادعاست.",
    incorrectFeedback:
      "بدون ثبت نسخه‌ها، ورودی‌ها، تصمیم‌ها و پارامترها، حتی یک نتیجه درست هم ممکن است قابل بازسازی و ممیزی نباشد.",
    deliverable: "گزارش نهایی + دفترچه تصمیم‌ها + نسخه‌ها/پارامترها + خروجی کامل + محدودیت‌ها.",
  },
];

export function RnaSeqIntegratedProjectLesson() {
  const cms = useIntegratedProjectCms({
    pageKey: "project:rna-seq-integrated-project",
    title: "پروژه یکپارچه سرطان پانکراس",
    subtitle:
      "این بار مفهوم تازه‌ای حفظ نمی‌کنید؛ یک پرونده RNA-seq را از سؤال پژوهشی تا ادعای زیستی و گزارش قابل بازتولید هدایت می‌کنید. هر تصمیم باید با چیزی که در درس‌های ۱ تا ۱۰ ساخته‌اید دفاع شود.",
    missions: defaultMissions,
  });
  const missions = cms.missions;

  const {
    currentIndex: missionIndex,
    setCurrentIndex: setMissionIndex,
    answers,
    setAnswers,
    maxUnlocked,
    setMaxUnlocked,
    resetProgress,
    syncMode,
    syncing,
  } = usePersistentLessonProgress({
    storageId: "integrated:rna-seq:pancreatic-cancer-project",
    itemCount: missions.length,
  });
  const [dossierOpen, setDossierOpen] = useState(true);

  const mission = missions[missionIndex];
  const selected = answers[missionIndex];
  const solved = selected === mission.correctIndex;
  const completed = missions.filter(
    (item, index) => answers[index] === item.correctIndex,
  ).length;
  const score = Math.round((completed / missions.length) * 100);

  const decisionLog = useMemo(
    () =>
      missions
        .map((item, index) => ({ item, index, solved: answers[index] === item.correctIndex }))
        .filter((entry) => entry.solved),
    [answers, missions],
  );

  function answer(optionIndex: number) {
    setAnswers((current) => ({ ...current, [missionIndex]: optionIndex }));
    if (optionIndex === mission.correctIndex) {
      setMaxUnlocked((current) =>
        Math.max(current, Math.min(missionIndex + 1, missions.length - 1)),
      );
    }
  }

  function goTo(index: number) {
    if (index < 0 || index >= missions.length || index > maxUnlocked) return;
    setMissionIndex(index);
    window.setTimeout(
      () =>
        document
          .getElementById("integrated-project")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      20,
    );
  }

  function resetProject() {
    resetProgress();
    setDossierOpen(true);
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={11}
      title={cms.title}
      subtitle={cms.subtitle}
      currentScene={missionIndex}
      sceneCount={missions.length}
      sceneLabel={mission.title}
    >
      <section id="integrated-project" className="scroll-mt-6" dir="rtl">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {cms.isAdmin && (
            <IntegratedProjectCmsAdmin
              pageKey={cms.pageKey}
              document={cms.document}
              currentMissionIndex={missionIndex}
              onPreview={cms.setPreviewDocument}
              onPublished={cms.reloadPublished}
            />
          )}

          <ProjectHeader
            score={score}
            completed={completed}
            total={missions.length}
            title={cms.title}
            description={cms.subtitle}
            syncMode={syncMode}
            syncing={syncing}
            onReset={resetProject}
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <main>
              <MissionNavigator
                missions={missions}
                current={missionIndex}
                maxUnlocked={maxUnlocked}
                answers={answers}
                onSelect={goTo}
              />

              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                <header className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-teal-700">
                        ماموریت {(missionIndex + 1).toLocaleString("fa-IR")} از {missions.length.toLocaleString("fa-IR")}
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                        {mission.title}
                      </h2>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-800">
                      {mission.lessonRef}
                    </span>
                  </div>
                  <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600">
                    {mission.context}
                  </p>
                </header>

                <div className="p-6 sm:p-8">
                  <MissionLab missionIndex={missionIndex} />

                  <ProjectMissionMedia mission={mission} />

                  <DecisionPanel
                    mission={mission}
                    selected={selected}
                    onSelect={answer}
                  />

                  {selected !== undefined && (
                    <div
                      className={`mt-5 rounded-2xl border p-4 text-sm leading-7 ${
                        solved
                          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                          : "border-rose-200 bg-rose-50 text-rose-950"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {solved ? (
                          <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-700" />
                        ) : (
                          <ShieldCheck className="mt-1 size-5 shrink-0 text-rose-700" />
                        )}
                        <p>{solved ? mission.correctFeedback : mission.incorrectFeedback}</p>
                      </div>
                    </div>
                  )}

                  {solved && (
                    <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                      <p className="text-xs font-black text-violet-700">ثبت در دفترچه تصمیم‌ها</p>
                      <p className="mt-2 text-sm leading-7 text-violet-950">
                        {mission.deliverable}
                      </p>
                    </div>
                  )}
                </div>
              </article>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={missionIndex === 0}
                  onClick={() => goTo(missionIndex - 1)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-40"
                >
                  <ArrowRight className="size-4" /> ماموریت قبل
                </button>
                {missionIndex < missions.length - 1 && (
                  <button
                    type="button"
                    disabled={!solved}
                    onClick={() => goTo(missionIndex + 1)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {solved ? "ثبت تصمیم و ادامه پروژه" : "اول تصمیم قابل دفاع را پیدا کنید"}
                    <ArrowLeft className="size-4" />
                  </button>
                )}
              </div>

              {completed === missions.length && (
                <FinalProjectReport decisionLog={decisionLog} />
              )}
            </main>

            <aside className="xl:sticky xl:top-6 xl:self-start">
              <ProjectDossier
                open={dossierOpen}
                onToggle={() => setDossierOpen((current) => !current)}
                decisionLog={decisionLog}
              />
            </aside>
          </div>
        </div>
      </section>
    </SpecialistLessonShell>
  );
}

function ProjectHeader({
  score,
  completed,
  total,
  title,
  description,
  syncMode,
  syncing,
  onReset,
}: {
  score: number;
  completed: number;
  total: number;
  title: string;
  description: string;
  syncMode: "account" | "device";
  syncing: boolean;
  onReset: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal-300">
            <FlaskConical className="size-5" />
            <span className="text-xs font-black">شبیه‌ساز پروژه RNA-seq</span>
          </div>
          <h1 className="mt-3 text-2xl font-black sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-300">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
            <p className="text-xs text-slate-400">دفاع‌پذیری پروژه</p>
            <p className="mt-1 text-2xl font-black text-teal-300">
              {score.toLocaleString("fa-IR")}٪
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-white/10"
          >
            <RotateCcw className="size-4" /> شروع دوباره
          </button>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-400 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <p>
          {completed.toLocaleString("fa-IR")} تصمیم از {total.toLocaleString("fa-IR")} تصمیم ثبت شده است.
        </p>
        <p className="font-bold text-emerald-300">
          {syncMode === "account"
            ? syncing
              ? "در حال همگام‌سازی پیشرفت…"
              : "پیشرفت پروژه با حساب کاربری همگام است"
            : "پیشرفت پروژه روی همین دستگاه ذخیره می‌شود"}
        </p>
      </div>
    </section>
  );
}

function MissionNavigator({
  missions,
  current,
  maxUnlocked,
  answers,
  onSelect,
}: {
  missions: Mission[];
  current: number;
  maxUnlocked: number;
  answers: Record<number, number>;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
      {missions.map((mission, index) => {
        const locked = index > maxUnlocked;
        const complete = answers[index] === mission.correctIndex;
        return (
          <button
            key={mission.title}
            type="button"
            disabled={locked}
            onClick={() => onSelect(index)}
            className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold ${
              index === current
                ? "border-teal-600 bg-teal-600 text-white"
                : complete
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : locked
                    ? "border-slate-200 bg-slate-50 text-slate-400"
                    : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {locked ? (
                <LockKeyhole className="size-3.5" />
              ) : complete ? (
                <CheckCircle2 className="size-3.5" />
              ) : null}
              {(index + 1).toLocaleString("fa-IR")}. {mission.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DecisionPanel({
  mission,
  selected,
  onSelect,
}: {
  mission: Mission;
  selected: number | undefined;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <p className="text-xs font-black text-slate-500">ایستگاه تصمیم</p>
      <h3 className="mt-2 text-lg font-black leading-8 text-slate-950">
        {mission.prompt}
      </h3>
      <div className="mt-4 grid gap-3">
        {mission.options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(index)}
            className={`rounded-2xl border p-4 text-right text-sm font-semibold leading-7 transition ${
              selected === index
                ? "border-teal-500 bg-teal-50 text-teal-950"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
            }`}
          >
            <span className="ml-2 inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black">
              {(index + 1).toLocaleString("fa-IR")}
            </span>
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function MissionLab({ missionIndex }: { missionIndex: number }) {
  switch (missionIndex) {
    case 0:
      return <ResearchQuestionLab />;
    case 1:
      return <StudyDesignLab />;
    case 2:
      return <SampleLibraryLab />;
    case 3:
      return <FastqAuditLab />;
    case 4:
      return <RawQcLab />;
    case 5:
      return <QuantificationLab />;
    case 6:
      return <MatrixMetadataLab />;
    case 7:
      return <SampleQcLab />;
    case 8:
      return <DifferentialExpressionLab />;
    case 9:
      return <InterpretationLab />;
    default:
      return <ReproducibilityLab />;
  }
}

function ResearchQuestionLab() {
  return (
    <LabFrame title="سؤال را به اجزای قابل آزمون بشکنید">
      <div className="grid gap-3 sm:grid-cols-4">
        <Metric label="بیماری" value="سرطان پانکراس" />
        <Metric label="مقایسه" value="درمان X / مرجع" />
        <Metric label="واحد زیستی" value="بیمار" />
        <Metric label="خروجی" value="بیان RNA" />
      </div>
    </LabFrame>
  );
}

function StudyDesignLab() {
  return (
    <LabFrame title="تعادل گروه و دسته آزمایشی را ببینید">
      <div className="grid gap-3 md:grid-cols-2">
        {["A", "B"].map((batch) => (
          <div
            key={batch}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="font-black">دسته {batch}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sampleRows
                .filter((sample) => sample.batch === batch)
                .map((sample) => (
                  <span
                    key={sample.id}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      sample.group === "مرجع"
                        ? "bg-sky-50 text-sky-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {sample.id} · {sample.group}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

function SampleLibraryLab() {
  const [sort, setSort] = useState<"id" | "rin">("id");
  const rows = useMemo(
    () =>
      [...sampleRows].sort((a, b) =>
        sort === "rin" ? a.rin - b.rin : a.id.localeCompare(b.id),
      ),
    [sort],
  );

  return (
    <LabFrame title="RIN را ببینید، اما به یک آستانه جهانی تبدیلش نکنید">
      <div className="flex gap-2">
        <ChoiceButton active={sort === "id"} onClick={() => setSort("id")}>
          ترتیب نمونه
        </ChoiceButton>
        <ChoiceButton active={sort === "rin"} onClick={() => setSort("rin")}>
          مرتب‌سازی بر اساس RIN
        </ChoiceButton>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <b>{row.id}</b>
              <span className="text-xs text-slate-500">{row.group}</span>
            </div>
            <p className="mt-2 text-sm">
              RIN: <b>{row.rin}</b>
            </p>
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

function FastqAuditLab() {
  const [sample, setSample] = useState("C1");
  return (
    <LabFrame title="یک نمونه را انتخاب کنید و جفت فایلش را پیدا کنید">
      <div className="flex flex-wrap gap-2">
        {["C1", "C4", "T2", "T6"].map((id) => (
          <ChoiceButton key={id} active={sample === id} onClick={() => setSample(id)}>
            {id}
          </ChoiceButton>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2" dir="ltr">
        <FilePill>{sample}_R1.fastq.gz</FilePill>
        <FilePill>{sample}_R2.fastq.gz</FilePill>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">
        این نام‌گذاری یک مثال است، نه قانون جهانی نام فایل.
      </p>
    </LabFrame>
  );
}

function RawQcLab() {
  const [after, setAfter] = useState(false);
  return (
    <LabFrame title="C4 را قبل و بعد از پیرایش مقایسه کنید">
      <div className="flex gap-2">
        <ChoiceButton active={!after} onClick={() => setAfter(false)}>
          قبل از پیرایش
        </ChoiceButton>
        <ChoiceButton active={after} onClick={() => setAfter(true)}>
          بعد از پیرایش
        </ChoiceButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="آداپتور انتهای خوانش ۲" value={after ? "۲٪" : "۱۸٪"} />
        <Metric label="کیفیت انتهای خوانش ۲" value={after ? "بهبود یافته" : "افت محسوس"} />
        <Metric label="وضعیت" value={after ? "نیازمند مرحله بعد" : "قابل اصلاح"} />
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        بهبود کنترل کیفیت داده خام مشکل آداپتور را حل می‌کند، اما هنوز نمی‌دانیم C4 از نظر نگاشت و رفتار کل نمونه چگونه است.
      </p>
    </LabFrame>
  );
}

function QuantificationLab() {
  const [sample, setSample] = useState<"typical" | "c4">("typical");
  return (
    <LabFrame title="بعد از کنترل کیفیت داده خام، شواهد نگاشت را هم ببینید">
      <div className="flex gap-2">
        <ChoiceButton
          active={sample === "typical"}
          onClick={() => setSample("typical")}
        >
          نمونه معمولی
        </ChoiceButton>
        <ChoiceButton active={sample === "c4"} onClick={() => setSample("c4")}>
          C4
        </ChoiceButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="نگاشت به مرجع" value={sample === "c4" ? "۳۱٪" : "۸۷٪"} />
        <Metric label="انتساب به ژن" value={sample === "c4" ? "۱۸٪" : "۷۴٪"} />
        <Metric label="مرجع/حاشیه‌نویسی" value="یکسان" />
      </div>
    </LabFrame>
  );
}

function MatrixMetadataLab() {
  const [aligned, setAligned] = useState(false);
  const matrix = aligned
    ? ["C1", "C2", "C3", "C4", "C5", "C6", "T1", "T2", "T3", "T4", "T5", "T6"]
    : ["C1", "C2", "T1", "C3", "C4", "T2", "C5", "T3", "C6", "T4", "T5", "T6"];
  return (
    <LabFrame title="ترتیب ستون‌های ماتریس و فراداده را ممیزی کنید">
      <ChoiceButton active={aligned} onClick={() => setAligned((current) => !current)}>
        {aligned ? "نمایش ترتیب اولیه" : "تطبیق با فراداده"}
      </ChoiceButton>
      <div className="mt-4 overflow-x-auto">
        <div className="flex min-w-max gap-2" dir="ltr">
          {matrix.map((id) => (
            <span
              key={id}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black"
            >
              {id}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        نرم‌افزار ممکن است جدول را بدون خطا بخواند؛ اما این پژوهشگر است که باید هویت ستون‌ها را با فراداده تأیید کند.
      </p>
    </LabFrame>
  );
}

function SampleQcLab() {
  const [sample, setSample] = useState<"C4" | "T6">("C4");
  const data =
    sample === "C4"
      ? {
          mapping: "۳۱٪",
          assigned: "۱۸٪",
          pca: "بسیار دور",
          lab: "افت غلظت/پیچیدگی",
          tissue: "استروما ۳۶٪",
        }
      : {
          mapping: "۸۶٪",
          assigned: "۷۲٪",
          pca: "در محدوده درمان",
          lab: "بدون هشدار فنی عمده",
          tissue: "استروما ۷۲٪",
        };
  return (
    <LabFrame title="پرونده شواهد را برای دو نمونه باز کنید">
      <div className="flex gap-2">
        <ChoiceButton active={sample === "C4"} onClick={() => setSample("C4")}>
          C4
        </ChoiceButton>
        <ChoiceButton active={sample === "T6"} onClick={() => setSample("T6")}>
          T6
        </ChoiceButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="نگاشت" value={data.mapping} />
        <Metric label="انتساب" value={data.assigned} />
        <Metric label="PCA" value={data.pca} />
        <Metric label="دفتر آزمایش" value={data.lab} />
        <Metric label="پاتولوژی" value={data.tissue} />
      </div>
    </LabFrame>
  );
}

function DifferentialExpressionLab() {
  const [view, setView] = useState<"design" | "results">("design");
  return (
    <LabFrame title="از طراحی به نتیجه بروید">
      <div className="flex gap-2">
        <ChoiceButton active={view === "design"} onClick={() => setView("design")}>
          مدل
        </ChoiceButton>
        <ChoiceButton active={view === "results"} onClick={() => setView("results")}>
          نتایج نمونه
        </ChoiceButton>
      </div>
      {view === "design" ? (
        <pre
          className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-left text-xs leading-7 text-slate-200"
          dir="ltr"
        >{`design = ~ batch + condition
contrast = treatment_X vs reference`}</pre>
      ) : (
        <ResultsTable />
      )}
    </LabFrame>
  );
}

function InterpretationLab() {
  const [theme, setTheme] = useState<"cycle" | "immune" | "stroma">("cycle");
  const map = {
    cycle: ["چرخه سلولی", "NES منفی", "MKI67 / TOP2A", "کاهش سیگنال رونویسی مرتبط با تکثیر"],
    immune: ["پاسخ ایمنی", "NES مثبت", "CXCL9 / HLA-B", "افزایش سیگنال رونویسی مرتبط با ایمنی"],
    stroma: ["ماتریکس خارج‌سلولی", "سیگنال متوسط", "COL1A1", "نیازمند توجه به درصد استروما و ترکیب بافت"],
  } as const;
  const row = map[theme];
  return (
    <LabFrame title="تم زیستی را به ژن و محدودیتش وصل کنید">
      <div className="flex flex-wrap gap-2">
        <ChoiceButton active={theme === "cycle"} onClick={() => setTheme("cycle")}>
          چرخه سلولی
        </ChoiceButton>
        <ChoiceButton active={theme === "immune"} onClick={() => setTheme("immune")}>
          ایمنی
        </ChoiceButton>
        <ChoiceButton active={theme === "stroma"} onClick={() => setTheme("stroma")}>
          استروما
        </ChoiceButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Metric label="تم" value={row[0]} />
        <Metric label="جهت" value={row[1]} />
        <Metric label="ژن‌های محرک" value={row[2]} />
        <Metric label="برداشت" value={row[3]} />
      </div>
    </LabFrame>
  );
}

function ReproducibilityLab() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const items = [
    "جدول نمونه و فراداده",
    "تصمیم‌ها و معیارهای کنترل کیفیت",
    "نسخه مرجع و حاشیه‌نویسی",
    "نسخه ابزارها و پارامترها",
    "کد/فرمان‌های اجرا",
    "مدل آماری و مقایسه",
    "خروجی کامل و نه فقط ژن‌های منتخب",
    "منبع/نسخه مجموعه‌های ژنی",
    "محدودیت‌ها و تصمیم خروج C4",
  ];
  const count = Object.values(checked).filter(Boolean).length;
  return (
    <LabFrame title="بسته تحویل پروژه را کامل کنید">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700">
          {count.toLocaleString("fa-IR")} از {items.length.toLocaleString("fa-IR")} جزء آماده
        </p>
        <span className="text-xs text-teal-700">هر مورد بخشی از قابلیت بازتولید است</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setChecked((current) => ({ ...current, [item]: !current[item] }))
            }
            className={`flex items-center gap-3 rounded-xl border p-3 text-right text-sm font-bold ${
              checked[item]
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <span
              className={`inline-flex size-6 items-center justify-center rounded-full ${
                checked[item] ? "bg-emerald-600 text-white" : "bg-slate-100"
              }`}
            >
              {checked[item] ? "✓" : ""}
            </span>
            {item}
          </button>
        ))}
      </div>
    </LabFrame>
  );
}

function ResultsTable() {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="text-slate-500">
            <th className="p-2 text-right">ژن</th>
            <th className="p-2 text-right">تغییر چندبرابری (log2)</th>
            <th className="p-2 text-right">مقدار p تعدیل‌شده</th>
            <th className="p-2 text-right">تم</th>
          </tr>
        </thead>
        <tbody>
          {deRows.map((row) => (
            <tr key={row.gene} className="border-t border-slate-200">
              <td className="p-2 font-black" dir="ltr">
                {row.gene}
              </td>
              <td className="p-2" dir="ltr">
                {row.log2fc > 0 ? "+" : ""}
                {row.log2fc}
              </td>
              <td className="p-2" dir="ltr">
                {row.padj}
              </td>
              <td className="p-2">{row.theme}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-500">
        اعداد این جدول برای سناریوی آموزشی شبیه‌سازی شده‌اند و نتیجه یک مجموعه‌داده واقعی نیستند.
      </p>
    </div>
  );
}

function ProjectDossier({
  open,
  onToggle,
  decisionLog,
}: {
  open: boolean;
  onToggle: () => void;
  decisionLog: { item: Mission; index: number; solved: boolean }[];
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-right"
      >
        <div>
          <p className="text-xs font-black text-teal-700">پرونده پروژه</p>
          <p className="mt-1 font-black text-slate-950">شواهد و تصمیم‌های ثبت‌شده</p>
        </div>
        <ClipboardCheck className="size-5 text-teal-700" />
      </button>
      {open && (
        <div className="border-t border-slate-200 p-5">
          <div className="grid gap-2 text-sm">
            <InfoRow label="بیماری" value="سرطان پانکراس" />
            <InfoRow label="نمونه اولیه" value="۱۲ بیمار مستقل" />
            <InfoRow label="مقایسه" value="درمان X / مرجع" />
            <InfoRow label="دسته‌ها" value="A و B" />
            <InfoRow label="نوع داده" value="RNA-seq توده‌ای" />
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-xs font-black text-slate-500">دفترچه تصمیم‌ها</p>
            <div className="mt-3 space-y-3">
              {decisionLog.length === 0 ? (
                <p className="text-xs leading-6 text-slate-400">هنوز تصمیمی ثبت نشده است.</p>
              ) : (
                decisionLog.map(({ item, index }) => (
                  <div key={item.title} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-black text-slate-700">
                      {(index + 1).toLocaleString("fa-IR")}. {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      {item.deliverable}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FinalProjectReport({
  decisionLog,
}: {
  decisionLog: { item: Mission; index: number; solved: boolean }[];
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-200 bg-emerald-50 shadow-lg shadow-emerald-100/70">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-emerald-600 p-3 text-white">
            <FileCheck2 className="size-6" />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-700">پروژه تکمیل شد</p>
            <h2 className="mt-1 text-2xl font-black text-emerald-950">
              گزارش تصمیم‌محور شما آماده است
            </h2>
            <p className="mt-2 text-sm leading-8 text-emerald-950/80">
              شما یک «جواب نهایی» حفظ نکردید؛ نشان دادید چگونه هر حلقه از سؤال تا تفسیر روی حلقه قبلی سوار می‌شود.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {decisionLog.map(({ item, index }) => (
            <div
              key={item.title}
              className="rounded-2xl border border-emerald-200 bg-white p-4"
            >
              <p className="text-xs font-black text-emerald-700">
                تصمیم {(index + 1).toLocaleString("fa-IR")}
              </p>
              <p className="mt-1 font-black text-slate-950">{item.title}</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                {item.deliverable}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
          <div className="flex items-center gap-2 text-teal-300">
            <Sparkles className="size-5" />
            <p className="text-xs font-black">جمع‌بندی پژوهشی</p>
          </div>
          <p className="mt-3 text-sm leading-8 text-slate-200">
            در این سناریوی آموزشی، پس از کنترل طراحی، کیفیت، هویت نمونه و مدل آماری، داده با کاهش سیگنال‌های مرتبط با چرخه سلولی و افزایش سیگنال‌های مرتبط با پاسخ ایمنی در بافت تومور گروه درمان سازگار بود. این نتیجه یک فرضیه قابل آزمون است؛ منشأ سلولی و علیت نیازمند شواهد تکمیلی‌اند.
          </p>
        </div>
      </div>
    </section>
  );
}

function LabFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-teal-700" />
        <p className="text-xs font-black text-teal-700">میز کار پروژه</p>
      </div>
      <h3 className="mt-2 font-black leading-8 text-teal-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-teal-600 bg-teal-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
      }`}
    >
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

function FilePill({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-teal-300">
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-black text-slate-800">{value}</span>
    </div>
  );
}
