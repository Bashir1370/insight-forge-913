import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/learn_/rna-seq_/navigator")({
  validateSearch: (search: Record<string, unknown>) => ({
    node:
      typeof search.node === "string"
        ? search.node
        : undefined,
    source:
      typeof search.source === "string"
        ? search.source
        : undefined,
    goal:
      typeof search.goal === "string"
        ? search.goal
        : undefined,
  }),
  component: RnaSeqLearningNavigator,
});

type Confidence = "unclear" | "developing" | "clear";

type ProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_review";

type SaveState =
  | "guest"
  | "loading"
  | "saving"
  | "saved"
  | "error";

type LearningProgressRow = {
  node_id: string;
  status: ProgressStatus;
  confidence: Confidence | null;
  selected_answer: number | null;
  is_correct: boolean | null;
  updated_at: string;
};

type NavigatorNode = {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  category: string;
  shortDescription: string;
  simpleExplanation: string;
  deepExplanation: string;
  example: string;
  keyMessage: string;
  input: string;
  output: string;
  commonMistake: string;
  terms: string[];
  checkpoint: {
    question: string;
    options: string[];
    correctIndex: number;
    correctFeedback: string;
    incorrectFeedback: string;
  };
};

const navigatorNodes: NavigatorNode[] = [
  {
    id: "research-question",
    number: "01",
    title: "سؤال پژوهشی",
    englishTitle: "Research Question",
    category: "طراحی پژوهش",
    shortDescription:
      "قبل از هر نرم‌افزار و هر فایل، باید بدانیم دقیقاً چه چیزی را می‌خواهیم بفهمیم.",
    simpleExplanation:
      "یک پروژه RNA-seq از یک سؤال زیستی روشن شروع می‌شود. مثلاً می‌خواهیم بدانیم یک دارو چه تغییری در الگوی بیان ژن سلول‌های سرطان پستان ایجاد می‌کند.",
    deepExplanation:
      "سؤال زیستی جهت کل مسیر تحلیل را تعیین می‌کند. نوع گروه‌ها، مقایسه آماری، فراداده موردنیاز و حتی اینکه آیا تحلیل بیان افتراقی، تحلیل شبکه یا روش دیگری لازم است، همگی به سؤال اولیه وابسته‌اند. یک سؤال مبهم معمولاً به یک تحلیل مبهم منتهی می‌شود.",
    example:
      "مثال: آیا تیمار با داروی X در مقایسه با گروه کنترل باعث تغییر در الگوی بیان ژن سلول‌های سرطان پستان می‌شود؟",
    keyMessage:
      "تحلیل داده از سؤال شروع می‌شود، نه از انتخاب ابزار.",
    input: "مسئله یا فرضیه زیستی",
    output: "سؤال پژوهشی قابل تحلیل",
    commonMistake:
      "شروع پروژه با جمله‌ای مثل «می‌خواهم DESeq2 انجام دهم» بدون اینکه سؤال زیستی و مقایسه اصلی مشخص باشد.",
    terms: ["سؤال زیستی", "فرضیه", "مقایسه"],
    checkpoint: {
      question:
        "بهترین نقطه شروع برای طراحی یک پروژه RNA-seq کدام است؟",
      options: [
        "انتخاب نرم‌افزار تحلیل",
        "تعریف سؤال زیستی و مقایسه اصلی",
        "رسم نمودار آتشفشانی",
        "انتخاب رنگ نقشه حرارتی",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. ابتدا باید سؤال زیستی و مقایسه اصلی روشن باشد.",
      incorrectFeedback:
        "ابزار و نمودار بعداً وارد می‌شوند. ابتدا باید بدانیم چه سؤال زیستی را می‌خواهیم پاسخ دهیم.",
    },
  },
  {
    id: "study-design",
    number: "02",
    title: "طراحی مطالعه",
    englishTitle: "Experimental Design",
    category: "طراحی پژوهش",
    shortDescription:
      "گروه‌ها، نمونه‌ها، تکرارهای زیستی و عوامل مداخله‌گر ساختار تحلیل را تعیین می‌کنند.",
    simpleExplanation:
      "اگر گروه کنترل و تیمار را مقایسه می‌کنیم، باید نمونه‌های زیستی مستقل مناسبی برای هر گروه داشته باشیم و اطلاعات مربوط به هر نمونه را به‌صورت فراداده ثبت کنیم.",
    deepExplanation:
      "تعداد تکرارهای زیستی، نحوه تخصیص نمونه‌ها، دسته آزمایشی، جنس، سن، زمان نمونه‌گیری و سایر هم‌متغیرها می‌توانند بر نتیجه اثر بگذارند. تحلیل آماری نمی‌تواند تمام مشکلات یک طراحی نامناسب را بعد از تولید داده برطرف کند.",
    example:
      "مثال: چهار نمونه زیستی مستقل در گروه کنترل و چهار نمونه زیستی مستقل در گروه تیمار، با چهار بار اندازه‌گیری یک نمونه یکسان نیست.",
    keyMessage:
      "تعداد فایل‌ها یا خوانش‌ها جای تکرار زیستی را نمی‌گیرد.",
    input: "سؤال پژوهشی + نمونه‌های زیستی",
    output: "طراحی مطالعه + فراداده",
    commonMistake:
      "اشتباه گرفتن تکرار فنی با تکرار زیستی.",
    terms: [
      "تکرار زیستی",
      "فراداده",
      "دسته آزمایشی",
      "هم‌متغیر",
    ],
    checkpoint: {
      question:
        "اگر یک نمونه زیستی را چهار بار توالی‌یابی کنیم، چند تکرار زیستی داریم؟",
      options: ["چهار", "دو", "یک", "به تعداد خوانش‌ها"],
      correctIndex: 2,
      correctFeedback:
        "درست است. تکرار اندازه‌گیری یک نمونه، نمونه زیستی مستقل جدید ایجاد نمی‌کند.",
      incorrectFeedback:
        "تکرار زیستی باید یک واحد زیستی مستقل باشد. تکرار توالی‌یابی همان نمونه، تعداد تکرارهای زیستی را افزایش نمی‌دهد.",
    },
  },
  {
    id: "sequencing",
    number: "03",
    title: "از نمونه تا FASTQ",
    englishTitle: "Sample to Sequencing",
    category: "داده",
    shortDescription:
      "نمونه زیستی چگونه به داده‌ای تبدیل می‌شود که کامپیوتر بتواند آن را تحلیل کند؟",
    simpleExplanation:
      "RNA از نمونه استخراج می‌شود، کتابخانه توالی‌یابی ساخته می‌شود و دستگاه توالی‌یاب قطعات توالی را می‌خواند. یکی از خروجی‌های اصلی این مرحله فایل FASTQ است.",
    deepExplanation:
      "FASTQ علاوه بر توالی هر خوانش، اطلاعاتی درباره کیفیت خوانش بازها نیز دارد. در این مرحله هنوز ماتریس بیان نداریم و هنوز نمی‌توانیم مستقیماً درباره تحلیل بیان افتراقی نتیجه‌گیری کنیم.",
    example:
      "مثال یک فایل داده خام: sample_control_01.fastq.gz",
    keyMessage:
      "FASTQ داده خام توالی‌یابی است؛ ماتریس بیان در مرحله‌ای بعد از مسیر تحلیل ساخته می‌شود.",
    input: "RNA + کتابخانه توالی‌یابی",
    output: "فایل FASTQ",
    commonMistake:
      "تصور اینکه فایل FASTQ همان جدول بیان ژن است.",
    terms: ["FASTQ", "خوانش", "توالی‌یابی"],
    checkpoint: {
      question:
        "کدام گزینه معمولاً به داده خام توالی‌یابی نزدیک‌تر است؟",
      options: [
        "FASTQ",
        "نمودار آتشفشانی",
        "جدول مسیرهای زیستی",
        "نمودار PCA",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. FASTQ یکی از اصلی‌ترین قالب‌های داده خام توالی‌یابی است.",
      incorrectFeedback:
        "نمودارهای PCA و آتشفشانی و نتایج مسیرهای زیستی خروجی مراحل بعدی تحلیل هستند. FASTQ به داده خام توالی‌یابی بسیار نزدیک‌تر است.",
    },
  },
  {
    id: "quality-control",
    number: "04",
    title: "کنترل کیفیت",
    englishTitle: "Quality Control",
    category: "کنترل داده",
    shortDescription:
      "قبل از تحلیل باید بفهمیم داده خام چه کیفیتی دارد و آیا الگوی غیرعادی دیده می‌شود.",
    simpleExplanation:
      "کنترل کیفیت کمک می‌کند کیفیت خوانش‌ها، وجود توالی‌های اضافی مانند Adapterها و برخی ویژگی‌های داده خام را بررسی کنیم.",
    deepExplanation:
      "گزارش کنترل کیفیت باید با توجه به نوع کتابخانه، روش توالی‌یابی و مجموعه‌داده تفسیر شود. وجود یک هشدار الزاماً به معنی غیرقابل استفاده بودن داده نیست و تصمیم درباره حذف یا اصلاح داده نباید فقط بر اساس رنگ قرمز یک گزارش گرفته شود.",
    example:
      "مثال: ممکن است کیفیت بازها در انتهای خوانش‌ها کاهش پیدا کند و نیاز به بررسی بیشتری داشته باشد.",
    keyMessage:
      "کنترل کیفیت برای فهم وضعیت داده است، نه اجرای کورکورانه مجموعه‌ای از فیلترهای ثابت.",
    input: "FASTQ",
    output: "گزارش کنترل کیفیت",
    commonMistake:
      "حذف یک نمونه فقط به دلیل مشاهده یک هشدار در FastQC بدون بررسی شرایط داده.",
    terms: ["FastQC", "MultiQC", "Adapter", "GC Content"],
    checkpoint: {
      question:
        "اگر FastQC برای یک معیار هشدار نشان دهد، بهترین واکنش اولیه چیست؟",
      options: [
        "فوراً نمونه را حذف کنیم",
        "کل پروژه را متوقف کنیم",
        "هشدار را با توجه به شرایط داده بررسی کنیم",
        "بدون توجه ادامه دهیم",
      ],
      correctIndex: 2,
      correctFeedback:
        "دقیقاً. هشدار باید با توجه به نوع داده و طراحی پروژه تفسیر شود.",
      incorrectFeedback:
        "هشدار به‌تنهایی تصمیم نهایی نیست. ابتدا باید علت و اهمیت آن در مجموعه‌داده بررسی شود.",
    },
  },
  {
    id: "quantification",
    number: "05",
    title: "کمی‌سازی بیان",
    englishTitle: "Quantification",
    category: "پردازش داده",
    shortDescription:
      "خوانش‌ها چگونه به اعدادی تبدیل می‌شوند که بتوانیم با آن‌ها بیان ژن را بررسی کنیم؟",
    simpleExplanation:
      "در این مرحله خوانش‌ها به ژن‌ها یا رونوشت‌ها مرتبط می‌شوند تا برای هر ویژگی، مقداری مرتبط با بیان آن به دست آید.",
    deepExplanation:
      "روش‌های مختلفی برای هم‌ترازی و کمی‌سازی وجود دارد. بسته به سؤال پژوهشی، جاندار مورد مطالعه، مرجع ژنومی و نوع تحلیل ممکن است مسیر پردازش متفاوت باشد. نکته اصلی این است که کمی‌سازی پلی بین خوانش‌های توالی‌یابی و ماتریس بیان است.",
    example:
      "مثال ساده: اگر تعداد زیادی خوانش به Gene A مرتبط شوند، برای Gene A یک مقدار کمی‌سازی ثبت می‌شود.",
    keyMessage:
      "کمی‌سازی یعنی تبدیل داده توالی‌یابی به ساختاری قابل استفاده برای تحلیل بیان.",
    input: "خوانش‌های توالی‌یابی",
    output: "مقادیر بیان ژن یا رونوشت",
    commonMistake:
      "حفظ کردن نام‌هایی مثل STAR یا Salmon بدون فهمیدن اینکه این ابزارها در کدام بخش مسیر تحلیل قرار دارند.",
    terms: ["STAR", "Salmon", "HISAT2", "featureCounts"],
    checkpoint: {
      question:
        "نقش اصلی کمی‌سازی در مسیر RNA-seq چیست؟",
      options: [
        "تبدیل خوانش‌ها به اطلاعات قابل استفاده درباره بیان",
        "نوشتن نتیجه مقاله",
        "تعیین قطعی مسیر زیستی",
        "تحلیل بقا",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. کمی‌سازی داده توالی‌یابی را به ساختاری مناسب برای تحلیل بیان تبدیل می‌کند.",
      incorrectFeedback:
        "کمی‌سازی هنوز مرحله تفسیر نهایی نیست؛ هدف آن استخراج اطلاعات مرتبط با بیان از داده توالی‌یابی است.",
    },
  },
  {
    id: "expression-matrix",
    number: "06",
    title: "ماتریس بیان",
    englishTitle: "Expression Matrix",
    category: "ساختار داده",
    shortDescription:
      "یکی از مهم‌ترین نقاط مسیر: ژن‌ها و نمونه‌ها در یک جدول ساختاریافته کنار هم قرار می‌گیرند.",
    simpleExplanation:
      "ماتریس بیان معمولاً جدولی است که سطرهای آن ژن‌ها و ستون‌های آن نمونه‌ها هستند و داخل خانه‌ها مقادیری مرتبط با بیان ژن قرار دارد.",
    deepExplanation:
      "نوع اعداد داخل ماتریس اهمیت زیادی دارد. شمارش خام، TPM، FPKM یا داده‌های تبدیل‌شده یکسان نیستند و کاربرد آن‌ها در تحلیل‌های مختلف متفاوت است. فقط دیدن یک جدول عددی برای تصمیم‌گیری درباره روش تحلیل کافی نیست.",
    example:
      "مثال: Gene A در Control 1 مقدار 120 و در Treatment 1 مقدار 310 دارد.",
    keyMessage:
      "قبل از هر تحلیل باید بدانید اعداد داخل ماتریس بیان دقیقاً چه چیزی را نشان می‌دهند.",
    input: "مقادیر کمی‌سازی‌شده بیان",
    output: "ماتریس ژن × نمونه",
    commonMistake:
      "فرض اینکه هر ماتریس بیان آماده ورود مستقیم به DESeq2 یا WGCNA است.",
    terms: ["شمارش خام", "TPM", "FPKM", "ماتریس بیان"],
    checkpoint: {
      question:
        "قبل از استفاده از یک ماتریس بیان، کدام سؤال مهم‌تر است؟",
      options: [
        "رنگ فایل Excel چیست؟",
        "اعداد داخل ماتریس از چه نوعی هستند؟",
        "نام فایل کوتاه است یا بلند؟",
        "چند نمودار از آن ساخته شده است؟",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. نوع مقادیر ماتریس تعیین می‌کند چه تحلیل‌هایی روی آن مناسب هستند.",
      incorrectFeedback:
        "مهم‌ترین مسئله ماهیت اعداد است: شمارش خام، TPM، FPKM، داده تبدیل‌شده یا انواع دیگر.",
    },
  },
  {
    id: "normalization",
    number: "07",
    title: "نرمال‌سازی داده",
    englishTitle: "Normalization",
    category: "آمار و آماده‌سازی",
    shortDescription:
      "چرا نمی‌توانیم همیشه شمارش‌های خام را مستقیماً با یکدیگر مقایسه کنیم؟",
    simpleExplanation:
      "نمونه‌ها ممکن است عمق توالی‌یابی متفاوتی داشته باشند. نرمال‌سازی کمک می‌کند برخی تفاوت‌های فنی میان نمونه‌ها برای مقایسه مناسب‌تر مدیریت شوند.",
    deepExplanation:
      "نرمال‌سازی یک روش واحد و جهانی ندارد. روش مناسب به نوع داده و تحلیل مراحل بعدی وابسته است. داده‌ای که برای نمایش یا PCA تبدیل شده، الزاماً همان داده‌ای نیست که باید به یک مدل آماری مبتنی بر شمارش داده شود.",
    example:
      "مثال: نمونه A ممکن است در مجموع خوانش‌های بیشتری از نمونه B داشته باشد، بدون اینکه همه ژن‌ها واقعاً از نظر زیستی بیان بیشتری داشته باشند.",
    keyMessage:
      "روش نرمال‌سازی باید متناسب با نوع داده و هدف تحلیل انتخاب شود.",
    input: "ماتریس شمارش یا بیان",
    output: "داده آماده‌تر برای هدف مشخص تحلیل",
    commonMistake:
      "استفاده از یک روش نرمال‌سازی برای تمام تحلیل‌ها فقط به این دلیل که در یک مقاله دیده شده است.",
    terms: ["Size Factors", "TMM", "Transformation"],
    checkpoint: {
      question:
        "چرا نرمال‌سازی در تحلیل RNA-seq مطرح می‌شود؟",
      options: [
        "برای زیباتر شدن نام ژن‌ها",
        "برای مدیریت برخی تفاوت‌های فنی میان نمونه‌ها",
        "برای افزایش مصنوعی تعداد نمونه‌ها",
        "برای حذف نیاز به فراداده",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. یکی از اهداف اصلی نرمال‌سازی، مدیریت تفاوت‌های فنی مرتبط با مقیاس و عمق داده است.",
      incorrectFeedback:
        "نرمال‌سازی نمونه جدید ایجاد نمی‌کند و جای فراداده را نمی‌گیرد؛ هدف آن آماده‌سازی مناسب‌تر داده برای مقایسه است.",
    },
  },
  {
    id: "sample-exploration",
    number: "08",
    title: "بررسی ساختار نمونه‌ها",
    englishTitle: "Sample Exploration",
    category: "اکتشاف داده",
    shortDescription:
      "قبل از رفتن سراغ ژن‌های معنی‌دار، باید رفتار کلی نمونه‌ها را ببینیم.",
    simpleExplanation:
      "PCA، همبستگی و خوشه‌بندی کمک می‌کنند بفهمیم نمونه‌ها چگونه به یکدیگر شبیه یا از هم متفاوت هستند.",
    deepExplanation:
      "در این مرحله می‌توان نمونه پرت، اثر دسته‌ای یا الگوهایی را دید که با طراحی مورد انتظار سازگار نیستند. اما PCA یک ابزار اکتشافی است و به‌تنهایی اثبات نمی‌کند که تیمار علت جدایی دو گروه است.",
    example:
      "مثال: اگر نمونه‌ها به‌جای گروه کنترل و تیمار، بر اساس روز توالی‌یابی از هم جدا شوند، احتمال وجود اثر دسته‌ای باید بررسی شود.",
    keyMessage:
      "اول ساختار نمونه‌ها را بفهمید؛ بعد درباره ژن‌ها نتیجه‌گیری کنید.",
    input: "داده بیان آماده‌شده + فراداده",
    output: "PCA + همبستگی + الگوهای نمونه‌ها",
    commonMistake:
      "نوشتن «دو گروه کاملاً متفاوت هستند» فقط به این دلیل که در PCA از هم فاصله دارند.",
    terms: ["PCA", "همبستگی", "خوشه‌بندی", "نمونه پرت"],
    checkpoint: {
      question:
        "PCA در این مرحله بیشتر چه نقشی دارد؟",
      options: [
        "اثبات قطعی رابطه علّی",
        "بررسی اکتشافی ساختار نمونه‌ها",
        "جایگزینی تمام آزمون‌های آماری",
        "تعیین قطعی نشانگر زیستی",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. PCA ابزار بسیار مفیدی برای بررسی اکتشافی ساختار کلی نمونه‌هاست.",
      incorrectFeedback:
        "PCA به‌تنهایی رابطه علّی یا نشانگر زیستی را اثبات نمی‌کند؛ هدف اصلی آن مشاهده ساختار کلی داده است.",
    },
  },
  {
    id: "differential-expression",
    number: "09",
    title: "تحلیل بیان افتراقی",
    englishTitle: "Differential Expression",
    category: "تحلیل آماری",
    shortDescription:
      "کدام ژن‌ها بین شرایط مورد مطالعه تغییر کرده‌اند و چقدر به این نتیجه اطمینان داریم؟",
    simpleExplanation:
      "تحلیل بیان افتراقی بررسی می‌کند آیا میزان بیان یک ژن میان شرایط مورد مقایسه تفاوت قابل توجهی دارد یا نه.",
    deepExplanation:
      "در خروجی معمولاً اطلاعاتی مثل log2FC، مقدار p و نرخ کشف کاذب یا FDR دیده می‌شود. اندازه اثر و شواهد آماری باید در کنار یکدیگر و با توجه به طراحی مطالعه تفسیر شوند.",
    example:
      "Gene A ممکن است log2FC بزرگی داشته باشد ولی FDR آن بالا باشد؛ در این صورت هنوز شواهد کافی برای نتیجه‌گیری قوی نداریم.",
    keyMessage:
      "بزرگ بودن میزان تغییر بیان به‌تنهایی برای انتخاب یک ژن کافی نیست.",
    input: "داده بیان + فراداده + مقایسه آماری",
    output: "جدول نتایج بیان افتراقی",
    commonMistake:
      "انتخاب ژن صرفاً بر اساس میزان تغییر بیان یا صرفاً بر اساس مقدار p.",
    terms: ["DESeq2", "edgeR", "limma-voom", "FDR", "log2FC"],
    checkpoint: {
      question:
        "Gene X تغییر بسیار بزرگی دارد اما FDR آن بالا است. بهترین برداشت چیست؟",
      options: [
        "حتماً مهم‌ترین ژن پروژه است",
        "اندازه تغییر جالب است ولی شواهد آماری کافی نیست",
        "FDR هیچ اهمیتی ندارد",
        "حتماً باید حذف شود و دیگر بررسی نشود",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. اندازه اثر و شواهد آماری باید با هم دیده شوند.",
      incorrectFeedback:
        "میزان تغییر زیاد به‌تنهایی کافی نیست. باید عدم قطعیت آماری و شرایط مطالعه را هم بررسی کنیم.",
    },
  },
  {
    id: "visualization",
    number: "10",
    title: "نمایش نتایج",
    englishTitle: "Visualization",
    category: "تحلیل و نمایش داده",
    shortDescription:
      "نمودار آتشفشانی و نقشه حرارتی کمک می‌کنند نتیجه را ببینیم؛ اما خود نتیجه نیستند.",
    simpleExplanation:
      "نمایش داده‌ها کمک می‌کند الگوهای نتایج قابل مشاهده شوند و پژوهشگر ساختار داده را بهتر درک کند.",
    deepExplanation:
      "نمودار آتشفشانی معمولاً اندازه اثر و معنی‌داری آماری را کنار هم نمایش می‌دهد. نقشه حرارتی می‌تواند الگوی بیان مجموعه‌ای از ژن‌ها را میان نمونه‌ها نشان دهد. انتخاب داده، مقیاس و روش نمایش بر چیزی که می‌بینیم اثر دارد.",
    example:
      "یک نقشه حرارتی بسیار زیبا ممکن است فقط بر اساس ژن‌هایی ساخته شده باشد که از قبل انتخاب شده‌اند؛ بنابراین ظاهر جدایی گروه‌ها باید با توجه به روش انتخاب ژن‌ها تفسیر شود.",
    keyMessage:
      "نمایش داده ابزار فهم و تفسیر است، نه جایگزین طراحی صحیح و تحلیل آماری.",
    input: "نتایج تحلیل",
    output: "نمودار آتشفشانی + نقشه حرارتی + سایر نمودارها",
    commonMistake:
      "استفاده از یک نمودار جذاب به‌عنوان مدرک مستقل برای یک ادعای زیستی.",
    terms: ["Volcano Plot", "Heatmap", "MA Plot"],
    checkpoint: {
      question:
        "کدام جمله درباره نمایش نتایج درست‌تر است؟",
      options: [
        "نمودار زیبا خودش اعتبار نتیجه را ثابت می‌کند",
        "نمایش نتایج به فهم داده کمک می‌کند ولی جای تحلیل آماری را نمی‌گیرد",
        "نقشه حرارتی همیشه رابطه علّی را نشان می‌دهد",
        "نمودار آتشفشانی برای تعیین تعداد نمونه استفاده می‌شود",
      ],
      correctIndex: 1,
      correctFeedback:
        "کاملاً درست. نمایش داده مکمل تحلیل است، نه جایگزین آن.",
      incorrectFeedback:
        "نمودارها ابزار مشاهده و ارتباط نتایج‌اند. اعتبار نتیجه به طراحی مطالعه، داده و تحلیل آماری وابسته است.",
    },
  },
  {
    id: "functional-analysis",
    number: "11",
    title: "تحلیل عملکردی",
    englishTitle: "Functional Analysis",
    category: "تفسیر زیستی",
    shortDescription:
      "چگونه از صدها ژن به فرآیندها و مسیرهای زیستی قابل فهم برسیم؟",
    simpleExplanation:
      "GO، تحلیل مسیرهای زیستی و GSEA کمک می‌کنند نتایج را از سطح ژن‌های منفرد به فرآیندهای زیستی گسترده‌تر منتقل کنیم.",
    deepExplanation:
      "روش‌های مختلف تحلیل عملکردی سؤال‌های متفاوتی دارند. برخی از یک فهرست ژنی استفاده می‌کنند و برخی مانند GSEA از رتبه‌بندی گسترده‌تری از ژن‌ها بهره می‌برند. معنی‌دار بودن یک اصطلاح یا مسیر الزاماً اثبات نمی‌کند که آن مسیر مستقیماً فعال یا مهار شده است.",
    example:
      "اگر تعداد زیادی ژن مرتبط با چرخه سلولی در میان نتایج دیده شود، ممکن است یک سیگنال مرتبط با این فرآیند وجود داشته باشد که نیازمند تفسیر زیستی است.",
    keyMessage:
      "فهرست ژن‌ها پایان تحلیل نیست؛ باید آن را دوباره به زمینه زیستی برگردانیم.",
    input: "فهرست ژنی یا ژن‌های رتبه‌بندی‌شده",
    output: "فرآیندها و مسیرهای زیستی",
    commonMistake:
      "گزارش تمام مسیرهای معنی‌دار بدون ساختن یک روایت زیستی منسجم.",
    terms: ["GO", "KEGG", "GSEA", "تحلیل غنی‌سازی"],
    checkpoint: {
      question:
        "هدف اصلی تحلیل عملکردی چیست؟",
      options: [
        "تبدیل ژن‌ها به تصویر زیباتر",
        "ارتباط نتایج سطح ژن با فرآیندهای زیستی",
        "افزایش مصنوعی تعداد DEGها",
        "حذف نیاز به تفسیر",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. هدف اصلی حرکت از ژن‌های منفرد به الگوها و فرآیندهای زیستی است.",
      incorrectFeedback:
        "تحلیل عملکردی قرار است به درک زمینه زیستی کمک کند، نه اینکه جای تفسیر علمی را بگیرد.",
    },
  },
  {
    id: "interpretation",
    number: "12",
    title: "تفسیر زیستی",
    englishTitle: "Biological Interpretation",
    category: "جمع‌بندی پژوهش",
    shortDescription:
      "همه چیز باید در پایان دوباره به سؤال پژوهشی اولیه برگردد.",
    simpleExplanation:
      "در این مرحله نتایج تحلیل بیان افتراقی، مسیرهای زیستی، ساختار نمونه‌ها و محدودیت‌های مطالعه کنار هم قرار می‌گیرند تا یک نتیجه‌گیری علمی ساخته شود.",
    deepExplanation:
      "تفسیر زیستی یعنی فراتر رفتن از فهرست خروجی‌ها، بدون فراتر رفتن از توان داده. باید مشخص باشد داده چه چیزی را مستقیماً نشان می‌دهد، چه چیزی فقط یک ارتباط آماری است و برای چه ادعاهایی به اعتبارسنجی مستقل یا آزمایش تجربی نیاز داریم.",
    example:
      "به‌جای «داروی X سرطان را درمان می‌کند» می‌توان گفت «تیمار X در این مطالعه با تغییر بیان ژن‌های مرتبط با چرخه سلولی همراه بوده است.»",
    keyMessage:
      "تفسیر خوب هم معنی زیستی دارد و هم محدودیت داده را رعایت می‌کند.",
    input: "تمام نتایج + زمینه زیستی",
    output: "تفسیر زیستی قابل دفاع",
    commonMistake:
      "تبدیل یک ارتباط آماری به رابطه علّی یا نتیجه‌گیری گسترده‌تر از طراحی مطالعه.",
    terms: ["زمینه زیستی", "منابع علمی", "اعتبارسنجی", "محدودیت‌ها"],
    checkpoint: {
      question:
        "اگر RNA-seq نشان دهد یک مسیر زیستی با تیمار تغییر کرده، کدام نتیجه‌گیری علمی‌تر است؟",
      options: [
        "تیمار قطعاً بیماری را درمان می‌کند",
        "تیمار در این مطالعه با تغییر سیگنال مرتبط با آن مسیر همراه بوده است",
        "آن مسیر علت قطعی فنوتیپ است",
        "دیگر نیازی به اعتبارسنجی نیست",
      ],
      correctIndex: 1,
      correctFeedback:
        "عالی. این نتیجه با سطح شواهد حاصل از مطالعه سازگارتر است.",
      incorrectFeedback:
        "RNA-seq معمولاً الگوها و ارتباط‌های مولکولی را نشان می‌دهد. ادعاهای علّی یا درمانی به شواهد بیشتری نیاز دارند.",
    },
  },
];

const confidenceOptions: {
  id: Confidence;
  title: string;
  description: string;
}[] = [
  {
    id: "unclear",
    title: "هنوز مبهم است",
    description:
      "بهتر است بعداً دوباره این بخش را مرور کنم.",
  },
  {
    id: "developing",
    title: "تقریباً متوجه شدم",
    description:
      "ایده اصلی را گرفتم ولی هنوز جای تمرین دارد.",
  },
  {
    id: "clear",
    title: "کاملاً روشن است",
    description:
      "می‌توانم مفهوم اصلی این مرحله را توضیح بدهم.",
  },
];

function RnaSeqLearningNavigator() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const search = Route.useSearch();

  const requestedNodeId = search.node;
  const requestedSource = search.source;
  const requestedGoal = search.goal;

  const requestedNodeIndex = useMemo(
    () =>
      requestedNodeId
        ? navigatorNodes.findIndex(
            (node) => node.id === requestedNodeId,
          )
        : -1,
    [requestedNodeId],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<
    Record<string, number>
  >({});

  const [confidence, setConfidence] = useState<
    Record<string, Confidence>
  >({});

  const [expanded, setExpanded] = useState<
    Record<string, boolean>
  >({});

  const [showSummary, setShowSummary] = useState(false);

  const [saveState, setSaveState] =
    useState<SaveState>("guest");

  const [saveError, setSaveError] = useState("");

  const currentNode = navigatorNodes[currentIndex];

  const selectedAnswer = answers[currentNode.id];
  const hasAnswered = selectedAnswer !== undefined;

  const answerIsCorrect =
    hasAnswered &&
    selectedAnswer === currentNode.checkpoint.correctIndex;

  const currentConfidence = confidence[currentNode.id];

  const completedNodes = navigatorNodes.filter(
    (node) =>
      answers[node.id] !== undefined &&
      Boolean(confidence[node.id]),
  );

  const completedCount = completedNodes.length;

  const progressPercent = Math.round(
    (completedCount / navigatorNodes.length) * 100,
  );

  const reviewNodes = useMemo(
    () =>
      navigatorNodes.filter((node) => {
        const nodeAnswer = answers[node.id];
        const nodeConfidence = confidence[node.id];

        const incorrect =
          nodeAnswer !== undefined &&
          nodeAnswer !== node.checkpoint.correctIndex;

        return nodeConfidence === "unclear" || incorrect;
      }),
    [answers, confidence],
  );

  const strongNodes = useMemo(
    () =>
      navigatorNodes.filter((node) => {
        return (
          answers[node.id] === node.checkpoint.correctIndex &&
          confidence[node.id] === "clear"
        );
      }),
    [answers, confidence],
  );

  const developingNodes = useMemo(
    () =>
      navigatorNodes.filter((node) => {
        const completed =
          answers[node.id] !== undefined &&
          Boolean(confidence[node.id]);

        if (!completed) return false;

        const isStrong =
          answers[node.id] === node.checkpoint.correctIndex &&
          confidence[node.id] === "clear";

        const needsReview =
          confidence[node.id] === "unclear" ||
          answers[node.id] !== node.checkpoint.correctIndex;

        return !isStrong && !needsReview;
      }),
    [answers, confidence],
  );

  const nodeReady =
    hasAnswered && Boolean(currentConfidence);

  /*
   * Progress loading
   *
   * We cast the Supabase client here so this file can use the newly
   * created table immediately even if generated Database types have
   * not yet been regenerated.
   *
   * RLS remains authoritative in Supabase.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!userId) {
        if (requestedNodeIndex >= 0) {
          setCurrentIndex(requestedNodeIndex);
          setShowSummary(false);
        }

        setSaveState("guest");
        setSaveError("");
        return;
      }

      setSaveState("loading");
      setSaveError("");

      const { data, error } = await (supabase as any)
        .from("learning_progress")
        .select(
          "node_id, status, confidence, selected_answer, is_correct, updated_at",
        )
        .eq("user_id", userId)
        .eq("research_line", "rna-seq");

      if (cancelled) return;

      if (error) {
        console.error(
          "Failed to load learning progress:",
          error,
        );

        setSaveState("error");
        setSaveError(
          "بازیابی پیشرفت قبلی انجام نشد. می‌توانید مسیر را ادامه دهید.",
        );

        return;
      }

      const rows = (data ?? []) as LearningProgressRow[];

      const loadedAnswers: Record<string, number> = {};
      const loadedConfidence: Record<string, Confidence> =
        {};

      for (const row of rows) {
        if (row.selected_answer !== null) {
          loadedAnswers[row.node_id] = row.selected_answer;
        }

        if (row.confidence) {
          loadedConfidence[row.node_id] = row.confidence;
        }
      }

      /*
       * Saved database values are loaded first.
       * Any interaction already made in the current page session
       * takes precedence.
       */
      setAnswers((previous) => ({
        ...loadedAnswers,
        ...previous,
      }));

      setConfidence((previous) => ({
        ...loadedConfidence,
        ...previous,
      }));

      /*
       * A deep link from the researcher dashboard takes priority over
       * normal resume behavior. Without a requested node, continue from
       * the first node that has not been completely answered yet.
       */
      if (requestedNodeIndex >= 0) {
        setCurrentIndex(requestedNodeIndex);
        setShowSummary(false);
      } else if (rows.length > 0) {
        const firstIncompleteIndex =
          navigatorNodes.findIndex((node) => {
            const row = rows.find(
              (item) => item.node_id === node.id,
            );

            return (
              !row ||
              row.selected_answer === null ||
              !row.confidence
            );
          });

        if (firstIncompleteIndex >= 0) {
          setCurrentIndex(firstIncompleteIndex);
        } else {
          setCurrentIndex(navigatorNodes.length - 1);
        }
      }

      setSaveState("saved");
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [userId, requestedNodeIndex]);

  async function saveNodeProgress(
    node: NavigatorNode,
    answer: number,
    nodeConfidence: Confidence,
  ) {
    if (!userId) return;

    const isCorrect =
      answer === node.checkpoint.correctIndex;

    const status: ProgressStatus =
      nodeConfidence === "unclear" || !isCorrect
        ? "needs_review"
        : "completed";

    setSaveState("saving");
    setSaveError("");

    const { error } = await (supabase as any)
      .from("learning_progress")
      .upsert(
        {
          user_id: userId,
          research_line: "rna-seq",
          node_id: node.id,
          status,
          confidence: nodeConfidence,
          selected_answer: answer,
          is_correct: isCorrect,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,research_line,node_id",
        },
      );

    if (error) {
      console.error(
        "Failed to save learning progress:",
        error,
      );

      setSaveState("error");
      setSaveError(
        "ذخیره پیشرفت این مرحله انجام نشد. پاسخ شما فعلاً در همین صفحه باقی می‌ماند.",
      );

      return;
    }

    setSaveState("saved");
  }

  function selectAnswer(index: number) {
    setAnswers((previous) => ({
      ...previous,
      [currentNode.id]: index,
    }));

    /*
     * Save only when both parts of the node are available.
     * This avoids competing partial writes to the database.
     */
    if (currentConfidence) {
      void saveNodeProgress(
        currentNode,
        index,
        currentConfidence,
      );
    }
  }

  function selectConfidence(value: Confidence) {
    setConfidence((previous) => ({
      ...previous,
      [currentNode.id]: value,
    }));

    if (selectedAnswer !== undefined) {
      void saveNodeProgress(
        currentNode,
        selectedAnswer,
        value,
      );
    }
  }

  function goToNode(index: number) {
    setCurrentIndex(index);
    setShowSummary(false);

    window.setTimeout(() => {
      document
        .getElementById("navigator-content")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 20);
  }

  function goNext() {
    if (!nodeReady) return;

    if (currentIndex < navigatorNodes.length - 1) {
      goToNode(currentIndex + 1);
      return;
    }

    setShowSummary(true);

    window.setTimeout(() => {
      document
        .getElementById("learning-summary")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 20);
  }

  function goPrevious() {
    if (currentIndex > 0) {
      goToNode(currentIndex - 1);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-right text-slate-900"
    >
      {/* TOP BAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/learn"
              className="font-semibold text-teal-700 hover:text-teal-900"
            >
              آموزش هاب‌ژن
            </a>

            <span className="text-slate-300">/</span>

            <a
              href="/learn/rna-seq"
              className="font-medium text-slate-500 hover:text-slate-800"
            >
              RNA-seq
            </a>

            <span className="text-slate-300">/</span>

            <span className="font-semibold text-slate-800">
              مسیر یادگیری
            </span>
          </div>

          <a
            href="/learn/rna-seq"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            بازگشت به بخش RNA-seq
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700">
                  راهنمای یادگیری
                </span>

                <span
                  dir="ltr"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500"
                >
                  RNA-seq
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.4] text-slate-950 sm:text-5xl">
                RNA-seq را
                <span className="text-teal-700">
                  {" "}
                  مرحله‌به‌مرحله{" "}
                </span>
                بفهمید.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
                در هر مرحله ابتدا مفهوم را می‌فهمید، سپس یک سؤال کوتاه
                پاسخ می‌دهید و مشخص می‌کنید آن بخش چقدر برایتان روشن
                بوده است. هدف آزمون گرفتن نیست؛ هدف ساختن یک نقشه ذهنی
                درست از تحلیل RNA-seq است.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">
                    پیشرفت مسیر
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {progressPercent}٪
                  </p>
                </div>

                <p className="text-sm text-slate-400">
                  {completedCount} از {navigatorNodes.length} مرحله
                </p>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-teal-400 transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              <ProgressSaveStatus
                userId={userId}
                state={saveState}
                error={saveError}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN NAVIGATOR */}
      <section
        id="navigator-content"
        className="scroll-mt-6"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8 xl:grid-cols-[0.72fr_1.28fr]">
          {/* SIDE MAP */}
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="font-bold text-slate-950">
                  نقشه مسیر
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  همیشه بدانید در کدام بخش از مسیر تحلیل قرار دارید.
                </p>
              </div>

              <div className="space-y-2">
                {navigatorNodes.map((node, index) => {
                  const active = index === currentIndex;

                  const completed =
                    answers[node.id] !== undefined &&
                    Boolean(confidence[node.id]);

                  const needsReview =
                    completed &&
                    (confidence[node.id] === "unclear" ||
                      answers[node.id] !==
                        node.checkpoint.correctIndex);

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => goToNode(index)}
                      className={[
                        "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-right transition",
                        active
                          ? "border-teal-500 bg-teal-50"
                          : "border-transparent hover:border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span
                        dir="ltr"
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                          active
                            ? "bg-teal-700 text-white"
                            : needsReview
                              ? "bg-amber-100 text-amber-800"
                              : completed
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {needsReview
                          ? "!"
                          : completed
                            ? "✓"
                            : node.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "text-sm font-bold",
                            active
                              ? "text-teal-900"
                              : "text-slate-800",
                          ].join(" ")}
                        >
                          {node.title}
                        </p>

                        <p
                          dir="ltr"
                          className="mt-0.5 truncate text-left text-[11px] font-medium text-slate-400"
                        >
                          {node.englishTitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="space-y-2 text-xs">
                  <Legend
                    marker="✓"
                    className="bg-emerald-100 text-emerald-700"
                    text="مرور شده"
                  />

                  <Legend
                    marker="!"
                    className="bg-amber-100 text-amber-800"
                    text="نیاز به مرور بیشتر"
                  />

                  <Legend
                    marker="○"
                    className="bg-slate-100 text-slate-500"
                    text="شروع نشده"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* ACTIVE NODE */}
          <div>
            {!showSummary &&
              requestedSource === "dashboard" &&
              requestedNodeIndex >= 0 &&
              currentNode.id === requestedNodeId && (
                <DashboardRecommendationContext
                  node={currentNode}
                  goal={requestedGoal}
                />
              )}

            {!showSummary ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <div className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                          مرحله {currentNode.number}
                        </span>

                        <span className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                          {currentNode.category}
                        </span>
                      </div>

                      <h2 className="mt-5 text-3xl font-bold text-slate-950">
                        {currentNode.title}
                      </h2>

                      <p
                        dir="ltr"
                        className="mt-1 text-left text-sm font-semibold text-teal-700"
                      >
                        {currentNode.englishTitle}
                      </p>
                    </div>

                    <span className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">
                      {currentIndex + 1} / {navigatorNodes.length}
                    </span>
                  </div>

                  <p className="mt-6 text-lg leading-9 text-slate-700">
                    {currentNode.shortDescription}
                  </p>
                </div>

                <div className="space-y-8 p-6 sm:p-8">
                  <LearningBlock title="این مرحله چیست؟">
                    <p>{currentNode.simpleExplanation}</p>
                  </LearningBlock>

                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                    <p className="text-sm font-bold text-cyan-950">
                      یک مثال ساده
                    </p>

                    <p className="mt-2 text-sm leading-8 text-cyan-900/80">
                      {currentNode.example}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <IOCard
                      label="ورودی این مرحله"
                      value={currentNode.input}
                      type="IN"
                    />

                    <IOCard
                      label="خروجی این مرحله"
                      value={currentNode.output}
                      type="OUT"
                    />
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="text-xs font-bold text-teal-300">
                      چیزی که باید از این مرحله یادتان بماند
                    </p>

                    <p className="mt-3 text-lg font-bold leading-8">
                      {currentNode.keyMessage}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((previous) => ({
                          ...previous,
                          [currentNode.id]:
                            !previous[currentNode.id],
                        }))
                      }
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-right transition hover:border-teal-300 hover:bg-white"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          بیشتر توضیح بده
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          اگر می‌خواهید یک لایه عمیق‌تر وارد مفهوم شوید.
                        </p>
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-teal-700 shadow-sm">
                        {expanded[currentNode.id] ? "−" : "+"}
                      </span>
                    </button>

                    {expanded[currentNode.id] && (
                      <div className="mt-3 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
                        <p className="text-sm leading-8 text-slate-700">
                          {currentNode.deepExplanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm font-bold text-amber-950">
                      اشتباه رایج
                    </p>

                    <p className="mt-2 text-sm leading-8 text-amber-900/80">
                      {currentNode.commonMistake}
                    </p>
                  </div>

                  <LearningBlock title="اصطلاحات، روش‌ها و ابزارهای مرتبط">
                    <div className="flex flex-wrap gap-2">
                      {currentNode.terms.map((term) => (
                        <span
                          key={term}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </LearningBlock>

                  {/* CHECKPOINT */}
                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                        ?
                      </span>

                      <div>
                        <p className="text-sm font-bold text-teal-700">
                          ایستگاه یادگیری
                        </p>

                        <h3 className="mt-1 text-lg font-bold leading-8 text-slate-950">
                          {currentNode.checkpoint.question}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {currentNode.checkpoint.options.map(
                        (option, index) => {
                          const selected =
                            selectedAnswer === index;

                          let classes =
                            "border-slate-200 bg-white hover:border-teal-300";

                          if (selected && hasAnswered) {
                            classes =
                              index ===
                              currentNode.checkpoint.correctIndex
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-rose-400 bg-rose-50";
                          }

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => selectAnswer(index)}
                              className={[
                                "rounded-2xl border px-4 py-4 text-right text-sm font-medium leading-7 text-slate-700 transition",
                                classes,
                              ].join(" ")}
                            >
                              {option}
                            </button>
                          );
                        },
                      )}
                    </div>

                    {hasAnswered && (
                      <div
                        className={[
                          "mt-4 rounded-2xl border p-4",
                          answerIsCorrect
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-amber-200 bg-amber-50",
                        ].join(" ")}
                      >
                        <p
                          className={[
                            "text-sm font-bold",
                            answerIsCorrect
                              ? "text-emerald-800"
                              : "text-amber-900",
                          ].join(" ")}
                        >
                          {answerIsCorrect
                            ? "درست ✓"
                            : "یک بار دیگر مفهوم را مرور کنیم"}
                        </p>

                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          {answerIsCorrect
                            ? currentNode.checkpoint.correctFeedback
                            : currentNode.checkpoint.incorrectFeedback}
                        </p>
                      </div>
                    )}
                  </section>

                  {/* CONFIDENCE */}
                  <section>
                    <div>
                      <p className="font-bold text-slate-950">
                        این بخش چقدر برایتان روشن بود؟
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        پاسخ شما در جمع‌بندی یادگیری استفاده می‌شود.
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {confidenceOptions.map((option) => {
                        const active =
                          currentConfidence === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              selectConfidence(option.id)
                            }
                            className={[
                              "rounded-2xl border p-4 text-right transition",
                              active
                                ? "border-teal-500 bg-teal-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-teal-300",
                            ].join(" ")}
                          >
                            <p className="font-bold text-slate-900">
                              {option.title}
                            </p>

                            <p className="mt-2 text-xs leading-6 text-slate-500">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* SAVE FEEDBACK */}
                  {userId && saveState === "saving" && (
                    <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                      در حال ذخیره پیشرفت این مرحله...
                    </div>
                  )}

                  {userId && saveState === "error" && saveError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-800">
                      {saveError}
                    </div>
                  )}

                  {/* NAVIGATION */}
                  <div className="border-t border-slate-100 pt-7">
                    {!nodeReady && (
                      <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-500">
                        برای رفتن به مرحله بعد، سؤال کوتاه بالا را
                        پاسخ دهید و میزان روشن بودن مفهوم را مشخص کنید.
                      </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={goPrevious}
                        disabled={currentIndex === 0}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        مرحله قبل
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!nodeReady}
                        className="min-h-11 rounded-xl bg-slate-950 px-6 py-2.5 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {currentIndex ===
                        navigatorNodes.length - 1
                          ? "مشاهده جمع‌بندی مسیر"
                          : "رفتن به مرحله بعد"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <LearningSummary
                strongNodes={strongNodes}
                developingNodes={developingNodes}
                reviewNodes={reviewNodes}
                completedCount={completedCount}
                onReturn={() => {
                  setShowSummary(false);
                  goToNode(navigatorNodes.length - 1);
                }}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardRecommendationContext({
  node,
  goal,
}: {
  node: NavigatorNode;
  goal?: string;
}) {
  const goalLabel = navigatorGoalLabel(goal);

  return (
    <section className="mb-5 overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-l from-teal-50 via-white to-cyan-50 p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-lg font-bold text-white">
          ↗
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-teal-700">
            پیشنهاد شخصی از داشبورد پژوهشگر
          </p>

          <h2 className="mt-2 text-lg font-bold leading-8 text-slate-950">
            چرا هاب‌ژن «{node.title}» را به شما پیشنهاد کرده؟
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            هدف فعلی پروژه شما «{goalLabel}» است و این مفهوم یکی از
            بخش‌های مرتبط با تصمیم بعدی شماست. آن را مرور کنید، ایستگاه
            یادگیری را پاسخ دهید و میزان روشن بودن مفهوم را مشخص کنید؛
            داشبورد بعداً از همین پیشرفت برای به‌روزرسانی پیشنهاد شخصی
            شما استفاده می‌کند.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800">
              هدف پروژه: {goalLabel}
            </span>

            <a
              href="/dashboard"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:text-teal-800"
            >
              بازگشت به داشبورد
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function navigatorGoalLabel(value?: string) {
  const labels: Record<string, string> = {
    "differential-expression":
      "تحلیل بیان افتراقی",
    functional:
      "تحلیل عملکردی و مسیرهای زیستی",
    network:
      "تحلیل شبکه و WGCNA",
    biomarker:
      "کشف نشانگر زیستی",
    explore:
      "بررسی اکتشافی داده",
    unsure:
      "تعیین راهبرد تحلیل",
  };

  return value
    ? labels[value] ?? "مسیر فعلی پروژه"
    : "مسیر فعلی پروژه";
}

function ProgressSaveStatus({
  userId,
  state,
  error,
}: {
  userId: string | null;
  state: SaveState;
  error: string;
}) {
  if (!userId) {
    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />

          <div>
            <p className="text-sm font-semibold text-white">
              حالت مهمان
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-400">
              می‌توانید کل مسیر را بدون ثبت‌نام استفاده کنید. پیشرفت
              این نشست پس از بستن صفحه ذخیره دائمی نمی‌شود.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-cyan-400" />

          <div>
            <p className="text-sm font-semibold text-white">
              در حال بازیابی پیشرفت...
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-400">
              مراحل قبلی شما از حساب هاب‌ژن دریافت می‌شوند.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-400" />

          <div>
            <p className="text-sm font-semibold text-white">
              مشکل در همگام‌سازی
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-300">
              {error ||
                "پیشرفت فعلاً با حساب کاربری همگام نشده است."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "saving") {
    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-cyan-400" />

          <div>
            <p className="text-sm font-semibold text-white">
              در حال ذخیره...
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-400">
              پیشرفت این مرحله با حساب شما همگام می‌شود.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />

        <div>
          <p className="text-sm font-semibold text-white">
            پیشرفت در حساب شما ذخیره می‌شود
          </p>

          <p className="mt-1 text-xs leading-6 text-slate-300">
            بعد از تکمیل هر مرحله، پاسخ و وضعیت یادگیری شما به‌صورت
            خودکار ذخیره می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}

function LearningSummary({
  strongNodes,
  developingNodes,
  reviewNodes,
  completedCount,
  onReturn,
}: {
  strongNodes: NavigatorNode[];
  developingNodes: NavigatorNode[];
  reviewNodes: NavigatorNode[];
  completedCount: number;
  onReturn: () => void;
}) {
  const allCompleted =
    completedCount === navigatorNodes.length;

  return (
    <article
      id="learning-summary"
      className="scroll-mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg"
    >
      <div className="bg-slate-950 p-7 text-white sm:p-9">
        <span className="inline-flex rounded-full bg-teal-400/10 px-3 py-1.5 text-sm font-semibold text-teal-300">
          جمع‌بندی یادگیری
        </span>

        <h2 className="mt-5 text-3xl font-bold leading-tight">
          نقشه یادگیری RNA-seq شما
        </h2>

        <p className="mt-4 max-w-2xl leading-8 text-slate-300">
          این جمع‌بندی نمره یا ارزیابی رسمی دانش شما نیست. فقط کمک
          می‌کند ببینید کدام مفاهیم روشن‌تر شده‌اند و کدام بخش‌ها ارزش
          مرور دوباره دارند.
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {!allCompleted && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-bold text-amber-950">
              مسیر هنوز کامل نشده است.
            </p>

            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {completedCount} از {navigatorNodes.length} مرحله تکمیل
              شده است. می‌توانید به نقشه مسیر برگردید و بخش‌های
              باقی‌مانده را ادامه دهید.
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryMetric
            value={strongNodes.length}
            label="مفاهیم روشن"
            description="پاسخ درست و اطمینان بالا"
          />

          <SummaryMetric
            value={developingNodes.length}
            label="در حال شکل‌گیری"
            description="ایده اصلی را گرفته‌اید"
          />

          <SummaryMetric
            value={reviewNodes.length}
            label="پیشنهاد برای مرور"
            description="نیاز به توضیح یا تمرین بیشتر"
          />
        </div>

        <SummaryGroup
          title="مفاهیمی که برایتان روشن‌تر هستند"
          emptyText="هنوز مفهومی در این گروه قرار نگرفته است."
          nodes={strongNodes}
          type="strong"
        />

        <SummaryGroup
          title="مفاهیمی که در حال شکل‌گیری هستند"
          emptyText="در حال حاضر موردی در این گروه نیست."
          nodes={developingNodes}
          type="developing"
        />

        <SummaryGroup
          title="پیشنهاد هاب‌ژن برای مرور بیشتر"
          emptyText="عالی؛ در مسیر تکمیل‌شده مورد مشخصی برای مرور فوری دیده نمی‌شود."
          nodes={reviewNodes}
          type="review"
        />

        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6 sm:p-8">
          <p className="text-sm font-bold text-teal-700">
            قدم بعدی
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            حالا می‌توانید این نقشه ذهنی را به پروژه واقعی خودتان
            متصل کنید.
          </h3>

          <p className="mt-3 leading-8 text-slate-600">
            اگر فقط برای یادگیری آمده‌اید، مرور مفاهیم علامت‌خورده
            بهترین قدم بعدی است. اگر پروژه واقعی دارید، در مرحله بعد
            می‌توانیم سؤال پژوهشی، نمونه‌ها و نوع داده شما را روی همین
            مسیر تحلیل بررسی کنیم.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/learn/rna-seq/project"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-bold text-white transition hover:bg-slate-800"
            >
              برای پروژه من چطور؟
            </a>

            <a
              href="/learn/rna-seq"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-teal-300"
            >
              بازگشت به بخش RNA-seq
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          بازگشت به آخرین مرحله
        </button>
      </div>
    </article>
  );
}

function LearningBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="font-bold text-slate-950">
        {title}
      </h3>

      <div className="mt-3 text-sm leading-8 text-slate-600">
        {children}
      </div>
    </section>
  );
}

function IOCard({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "IN" | "OUT";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">
          {label}
        </p>

        <span
          className={[
            "rounded-lg px-2 py-1 text-[10px] font-black",
            type === "IN"
              ? "bg-cyan-100 text-cyan-800"
              : "bg-teal-100 text-teal-800",
          ].join(" ")}
        >
          {type === "IN" ? "ورودی" : "خروجی"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {value}
      </p>
    </div>
  );
}

function Legend({
  marker,
  className,
  text,
}: {
  marker: string;
  className: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-lg font-bold",
          className,
        ].join(" ")}
      >
        {marker}
      </span>

      <span className="text-slate-500">
        {text}
      </span>
    </div>
  );
}

function SummaryMetric({
  value,
  label,
  description,
}: {
  value: number;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-2 font-bold text-slate-800">
        {label}
      </p>

      <p className="mt-1 text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SummaryGroup({
  title,
  emptyText,
  nodes,
  type,
}: {
  title: string;
  emptyText: string;
  nodes: NavigatorNode[];
  type: "strong" | "developing" | "review";
}) {
  const style =
    type === "strong"
      ? "border-emerald-200 bg-emerald-50"
      : type === "review"
        ? "border-amber-200 bg-amber-50"
        : "border-slate-200 bg-slate-50";

  return (
    <section>
      <h3 className="font-bold text-slate-950">
        {title}
      </h3>

      {nodes.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {nodes.map((node) => (
            <span
              key={node.id}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold text-slate-700",
                style,
              ].join(" ")}
            >
              {node.title}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
