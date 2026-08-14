import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/learn_/rna-seq_/navigator")({
  component: RnaSeqLearningNavigator,
});

type Confidence = "unclear" | "developing" | "clear";

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
  tools: string[];
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
      "پروژه RNA-seq از یک سؤال زیستی شروع می‌شود. مثلاً می‌خواهیم بدانیم یک دارو چه تغییری در الگوی بیان ژن سلول‌های سرطان پستان ایجاد می‌کند.",
    deepExplanation:
      "سؤال زیستی جهت کل Workflow را تعیین می‌کند. نوع گروه‌ها، Contrast آماری، Metadata موردنیاز و حتی اینکه آیا Differential Expression، Network Analysis یا روش دیگری لازم است، همگی به سؤال اولیه وابسته‌اند. یک سؤال مبهم معمولاً به یک تحلیل مبهم منتهی می‌شود.",
    example:
      "مثال: آیا Treatment X در مقایسه با Control باعث تغییر در الگوی بیان ژن سلول‌های سرطان پستان می‌شود؟",
    keyMessage: "تحلیل داده از سؤال شروع می‌شود، نه از انتخاب ابزار.",
    input: "مسئله یا فرضیه زیستی",
    output: "سؤال پژوهشی قابل تحلیل",
    commonMistake:
      "شروع پروژه با جمله‌ای مثل «می‌خواهم DESeq2 انجام دهم» بدون اینکه Comparison و سؤال زیستی مشخص باشد.",
    tools: ["Biological Question", "Hypothesis", "Comparison"],
    checkpoint: {
      question:
        "بهترین نقطه شروع برای طراحی یک پروژه RNA-seq کدام است؟",
      options: [
        "انتخاب نرم‌افزار تحلیل",
        "تعریف سؤال زیستی و Comparison",
        "رسم Volcano Plot",
        "انتخاب رنگ Heatmap",
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
      "گروه‌ها، Sampleها، Biological Replicateها و عوامل مداخله‌گر ساختار تحلیل را تعیین می‌کنند.",
    simpleExplanation:
      "اگر Control و Treatment را مقایسه می‌کنیم، باید نمونه‌های مستقل زیستی مناسبی برای هر گروه داشته باشیم و اطلاعات مربوط به هر Sample را ثبت کنیم.",
    deepExplanation:
      "تعداد Biological Replicateها، نحوه تخصیص نمونه‌ها، Batch، جنس، سن، زمان نمونه‌گیری و سایر Covariateها می‌توانند بر نتیجه اثر بگذارند. تحلیل آماری نمی‌تواند تمام مشکلات یک طراحی نامناسب را بعد از تولید داده برطرف کند.",
    example:
      "مثال: ۴ نمونه مستقل Control و ۴ نمونه مستقل Treatment بسیار متفاوت از این است که یک نمونه را چهار بار اندازه‌گیری کنیم.",
    keyMessage:
      "تعداد فایل‌ها یا Readها جای Biological Replication را نمی‌گیرد.",
    input: "سؤال پژوهشی + نمونه‌های زیستی",
    output: "Study Design + Metadata",
    commonMistake:
      "اشتباه گرفتن Technical Replicate با Biological Replicate.",
    tools: ["Metadata", "Biological Replicate", "Batch", "Covariate"],
    checkpoint: {
      question:
        "اگر یک Sample زیستی را چهار بار Sequence کنیم، چند Biological Replicate داریم؟",
      options: ["چهار", "دو", "یک", "به تعداد Readها"],
      correctIndex: 2,
      correctFeedback:
        "درست است. تکرار اندازه‌گیری یک Sample، Sample زیستی مستقل جدید ایجاد نمی‌کند.",
      incorrectFeedback:
        "Biological Replicate باید یک واحد زیستی مستقل باشد. تکرار Sequencing همان Sample تعداد Biological Replicate را افزایش نمی‌دهد.",
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
      "RNA از نمونه استخراج می‌شود، Library ساخته می‌شود و Sequencer قطعات توالی را می‌خواند. یکی از خروجی‌های اصلی این مرحله فایل FASTQ است.",
    deepExplanation:
      "FASTQ علاوه بر Sequence هر Read، اطلاعاتی درباره کیفیت خوانش Baseها نیز دارد. در این مرحله هنوز Expression Matrix نداریم و هنوز نمی‌توانیم مستقیماً درباره Differential Expression نتیجه‌گیری کنیم.",
    example:
      "مثال فایل: sample_control_01.fastq.gz",
    keyMessage:
      "FASTQ داده خام Sequencing است؛ Expression Matrix مرحله بعدی Workflow است.",
    input: "RNA / Sequencing Library",
    output: "FASTQ",
    commonMistake:
      "تصور اینکه فایل FASTQ همان جدول بیان ژن است.",
    tools: ["FASTQ", "Reads", "Sequencing"],
    checkpoint: {
      question:
        "کدام گزینه معمولاً به داده خام Sequencing نزدیک‌تر است؟",
      options: ["FASTQ", "Volcano Plot", "Pathway Table", "PCA Plot"],
      correctIndex: 0,
      correctFeedback:
        "درست است. FASTQ یکی از اصلی‌ترین قالب‌های داده خام Sequencing است.",
      incorrectFeedback:
        "Volcano، PCA و Pathway خروجی مراحل پایین‌دستی هستند. FASTQ بسیار نزدیک‌تر به خروجی خام Sequencing است.",
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
      "QC کمک می‌کند کیفیت Reads، وجود Adapterها و برخی ویژگی‌های داده خام را بررسی کنیم.",
    deepExplanation:
      "گزارش QC باید در Context نوع Library، Sequencing و Dataset تفسیر شود. وجود یک Warning الزاماً به معنی غیرقابل استفاده بودن داده نیست و تصمیم درباره حذف یا اصلاح داده نباید فقط بر اساس رنگ قرمز یک گزارش گرفته شود.",
    example:
      "مثال: ممکن است کیفیت Baseها در انتهای Reads کاهش پیدا کند و نیاز به بررسی بیشتری داشته باشد.",
    keyMessage:
      "QC برای فهمیدن وضعیت داده است، نه اجرای کورکورانه یک سری Filter ثابت.",
    input: "FASTQ",
    output: "QC Report",
    commonMistake:
      "حذف Sample فقط به دلیل مشاهده یک Warning در FastQC بدون بررسی Context.",
    tools: ["FastQC", "MultiQC", "Adapter", "GC Content"],
    checkpoint: {
      question:
        "اگر FastQC برای یک معیار Warning نشان دهد، بهترین واکنش اولیه چیست؟",
      options: [
        "فوراً Sample را حذف کنیم",
        "کل پروژه را متوقف کنیم",
        "Warning را در Context داده بررسی کنیم",
        "بدون توجه ادامه دهیم",
      ],
      correctIndex: 2,
      correctFeedback:
        "دقیقاً. Warning باید در Context داده و طراحی پروژه تفسیر شود.",
      incorrectFeedback:
        "Warning به‌تنهایی تصمیم نهایی نیست. ابتدا باید علت و اهمیت آن در Context Dataset بررسی شود.",
    },
  },
  {
    id: "quantification",
    number: "05",
    title: "Quantification",
    englishTitle: "Quantification",
    category: "پردازش",
    shortDescription:
      "Reads چگونه به اعدادی تبدیل می‌شوند که بیان ژن‌ها را نشان می‌دهند؟",
    simpleExplanation:
      "در این مرحله Reads به Gene یا Transcript مرتبط می‌شوند تا بتوان برای هر Feature مقدار بیان به دست آورد.",
    deepExplanation:
      "روش‌های مختلفی برای Alignment و Quantification وجود دارد. بسته به سؤال، Organism، Reference و نوع تحلیل ممکن است Workflow متفاوت باشد. نکته اصلی برای Beginner این است که بفهمد Quantification پلی بین Reads و Expression Matrix است.",
    example:
      "مثال ساده: اگر تعداد زیادی Read به Gene A مرتبط شوند، برای Gene A مقدار Quantification ثبت می‌شود.",
    keyMessage:
      "Quantification یعنی تبدیل داده Sequencing به ساختاری قابل استفاده برای تحلیل بیان.",
    input: "Sequencing Reads",
    output: "Gene / Transcript Quantification",
    commonMistake:
      "حفظ کردن STAR یا Salmon بدون فهمیدن اینکه این ابزارها در کدام بخش Workflow قرار دارند.",
    tools: ["STAR", "Salmon", "HISAT2", "featureCounts"],
    checkpoint: {
      question:
        "نقش اصلی Quantification در Workflow چیست؟",
      options: [
        "تبدیل Reads به اطلاعات قابل استفاده درباره Expression",
        "نوشتن نتیجه مقاله",
        "تعیین قطعی Pathway",
        "محاسبه Survival",
      ],
      correctIndex: 0,
      correctFeedback:
        "درست است. Quantification داده Sequencing را به ساختاری مناسب تحلیل بیان تبدیل می‌کند.",
      incorrectFeedback:
        "Quantification هنوز مرحله تفسیر نهایی نیست؛ هدف آن استخراج اطلاعات Expression از داده Sequencing است.",
    },
  },
  {
    id: "expression-matrix",
    number: "06",
    title: "ماتریس بیان ژن",
    englishTitle: "Expression Matrix",
    category: "ساختار داده",
    shortDescription:
      "یکی از مهم‌ترین Aha Momentها: ژن‌ها و Sampleها بالاخره در یک جدول کنار هم قرار می‌گیرند.",
    simpleExplanation:
      "Expression Matrix معمولاً جدولی است که سطرهای آن Geneها و ستون‌های آن Sampleها هستند و داخل خانه‌ها مقداری مربوط به Expression قرار دارد.",
    deepExplanation:
      "نوع اعداد داخل Matrix مهم است. Raw Counts، TPM، FPKM یا داده‌های Transform‌شده یک چیز نیستند و کاربرد آن‌ها در تحلیل‌های مختلف متفاوت است. فقط دیدن یک جدول عددی برای تصمیم‌گیری درباره روش تحلیل کافی نیست.",
    example:
      "Gene A: Control1=120، Control2=135، Treatment1=310، Treatment2=295",
    keyMessage:
      "قبل از هر تحلیل باید بدانید اعداد داخل Expression Matrix دقیقاً چه چیزی هستند.",
    input: "Quantified Expression",
    output: "Gene × Sample Matrix",
    commonMistake:
      "فرض اینکه هر Expression Matrix آماده ورود مستقیم به DESeq2 یا WGCNA است.",
    tools: ["Raw Counts", "TPM", "FPKM", "Expression Matrix"],
    checkpoint: {
      question:
        "قبل از استفاده از یک Expression Matrix، کدام سؤال مهم‌تر است؟",
      options: [
        "رنگ فایل Excel چیست؟",
        "اعداد داخل Matrix از چه نوعی هستند؟",
        "نام فایل کوتاه است یا بلند؟",
        "چند نمودار از آن ساخته شده؟",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. نوع مقادیر Matrix تعیین می‌کند چه تحلیل‌هایی روی آن مناسب هستند.",
      incorrectFeedback:
        "مهم‌ترین مسئله ماهیت اعداد است: Raw Count، TPM، FPKM، Transform شده و غیره.",
    },
  },
  {
    id: "normalization",
    number: "07",
    title: "Normalization",
    englishTitle: "Normalization",
    category: "آمار و آماده‌سازی",
    shortDescription:
      "چرا نمی‌توانیم همیشه Raw Countها را مستقیماً با یکدیگر مقایسه کنیم؟",
    simpleExplanation:
      "Sampleها ممکن است عمق Sequencing متفاوتی داشته باشند. Normalization کمک می‌کند برخی تفاوت‌های فنی برای مقایسه مناسب‌تر مدیریت شوند.",
    deepExplanation:
      "Normalization یک مفهوم واحد با یک روش جهانی نیست. روش مناسب به نوع داده و تحلیل Downstream بستگی دارد. داده‌ای که برای Visualization مناسب Transform شده، الزاماً همان داده‌ای نیست که باید به یک مدل Count-based داده شود.",
    example:
      "مثال: Sample A ممکن است در مجموع Reads بیشتری از Sample B داشته باشد، بدون اینکه همه Geneها واقعاً از نظر زیستی بیشتر بیان شده باشند.",
    keyMessage:
      "Normalization باید متناسب با نوع داده و سؤال تحلیل انتخاب شود.",
    input: "Count / Expression Matrix",
    output: "Data suitable for a specific downstream purpose",
    commonMistake:
      "استفاده از یک نوع Normalization برای تمام تحلیل‌ها چون در یک مقاله دیده شده است.",
    tools: ["Size Factors", "TMM", "Transformation"],
    checkpoint: {
      question:
        "چرا Normalization در RNA-seq مطرح می‌شود؟",
      options: [
        "برای زیباتر شدن نام Geneها",
        "برای مدیریت برخی تفاوت‌های فنی میان Sampleها",
        "برای افزایش مصنوعی Sample Size",
        "برای حذف نیاز به Metadata",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. یکی از اهداف اصلی، مدیریت تفاوت‌های فنی مرتبط با مقیاس و عمق داده است.",
      incorrectFeedback:
        "Normalization Sample جدید ایجاد نمی‌کند و جای Metadata را نمی‌گیرد؛ هدف آن آماده‌سازی مناسب‌تر داده برای مقایسه است.",
    },
  },
  {
    id: "sample-exploration",
    number: "08",
    title: "بررسی Sampleها",
    englishTitle: "Sample Exploration",
    category: "اکتشاف داده",
    shortDescription:
      "قبل از رفتن سراغ Geneهای Significant، باید رفتار کلی Sampleها را ببینیم.",
    simpleExplanation:
      "PCA، Correlation و Clustering کمک می‌کنند بفهمیم Sampleها چگونه به یکدیگر شبیه یا از هم متفاوت هستند.",
    deepExplanation:
      "در این مرحله می‌توان Outlier احتمالی، Batch Effect یا الگوهایی را دید که با طراحی مورد انتظار سازگار نیستند. اما PCA یک ابزار Exploratory است و به‌تنهایی اثبات نمی‌کند که Treatment علت جدایی دو گروه است.",
    example:
      "مثال: اگر Sampleها به‌جای Treatment بر اساس روز Sequencing جدا شوند، احتمال اثر Batch باید بررسی شود.",
    keyMessage:
      "اول Sampleها را بفهمید؛ بعد درباره Geneها نتیجه‌گیری کنید.",
    input: "Prepared Expression Data + Metadata",
    output: "PCA / Correlation / Sample Patterns",
    commonMistake:
      "نوشتن «دو گروه کاملاً متفاوت هستند» فقط چون در PCA از هم فاصله دارند.",
    tools: ["PCA", "Correlation", "Clustering", "Outlier"],
    checkpoint: {
      question:
        "PCA در این مرحله بیشتر چه نقشی دارد؟",
      options: [
        "اثبات قطعی Causality",
        "Exploration ساختار Sampleها",
        "جایگزینی تمام تست‌های آماری",
        "تعیین قطعی Biomarker",
      ],
      correctIndex: 1,
      correctFeedback:
        "درست است. PCA ابزار بسیار مفیدی برای Exploration ساختار کلی Sampleهاست.",
      incorrectFeedback:
        "PCA به‌تنهایی Causality یا Biomarker را اثبات نمی‌کند؛ هدف اصلی آن مشاهده ساختار کلی داده است.",
    },
  },
  {
    id: "differential-expression",
    number: "09",
    title: "بیان افتراقی",
    englishTitle: "Differential Expression",
    category: "تحلیل",
    shortDescription:
      "کدام Geneها بین شرایط مورد مطالعه تغییر کرده‌اند و چقدر به این نتیجه اطمینان داریم؟",
    simpleExplanation:
      "Differential Expression بررسی می‌کند آیا Expression یک Gene میان شرایط مورد مقایسه تفاوت قابل توجهی دارد یا نه.",
    deepExplanation:
      "در خروجی معمولاً اطلاعاتی مثل log2 Fold Change، p-value و adjusted p-value/FDR دیده می‌شود. اندازه Effect و شواهد آماری باید در کنار یکدیگر و در Context طراحی مطالعه تفسیر شوند.",
    example:
      "Gene A ممکن است log2FC بزرگی داشته باشد ولی FDR آن بالا باشد؛ در این صورت هنوز شواهد کافی برای نتیجه‌گیری قوی نداریم.",
    keyMessage:
      "بزرگ بودن Fold Change به‌تنهایی برای انتخاب Gene کافی نیست.",
    input: "Expression Data + Metadata + Contrast",
    output: "Differential Expression Table",
    commonMistake:
      "انتخاب Gene صرفاً بر اساس Fold Change یا صرفاً بر اساس p-value.",
    tools: ["DESeq2", "edgeR", "limma-voom", "FDR", "log2FC"],
    checkpoint: {
      question:
        "Gene X تغییر بسیار بزرگی دارد اما FDR آن بالا است. بهترین برداشت چیست؟",
      options: [
        "حتماً مهم‌ترین Gene پروژه است",
        "اندازه تغییر جالب است ولی شواهد آماری کافی نیست",
        "FDR هیچ اهمیتی ندارد",
        "حتماً باید حذف شود و دیگر بررسی نشود",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. Effect Size و شواهد آماری باید با هم دیده شوند.",
      incorrectFeedback:
        "Fold Change بزرگ به‌تنهایی کافی نیست. باید عدم قطعیت آماری و Context مطالعه را هم بررسی کنیم.",
    },
  },
  {
    id: "visualization",
    number: "10",
    title: "نمایش نتایج",
    englishTitle: "Visualization",
    category: "تحلیل",
    shortDescription:
      "Volcano Plot و Heatmap کمک می‌کنند نتیجه را ببینیم؛ اما خود نتیجه نیستند.",
    simpleExplanation:
      "Visualization الگوهای داده را قابل مشاهده می‌کند و به پژوهشگر کمک می‌کند ساختار نتایج را بهتر بفهمد.",
    deepExplanation:
      "Volcano Plot معمولاً اندازه Effect و Significance را کنار هم نمایش می‌دهد. Heatmap می‌تواند Pattern بیان مجموعه‌ای از Geneها را میان Sampleها نشان دهد. انتخاب داده، Scale و روش نمایش روی چیزی که می‌بینیم اثر دارد.",
    example:
      "یک Heatmap بسیار زیبا ممکن است فقط روی Geneهای از قبل انتخاب‌شده ساخته شده باشد؛ بنابراین ظاهر جدایی گروه‌ها باید در Context انتخاب Features تفسیر شود.",
    keyMessage:
      "Visualization ابزار تفسیر است، نه جایگزین طراحی و آمار.",
    input: "Analysis Results",
    output: "Volcano / Heatmap / MA Plot",
    commonMistake:
      "استفاده از Plot جذاب به‌عنوان مدرک مستقل برای یک ادعای زیستی.",
    tools: ["Volcano Plot", "Heatmap", "MA Plot"],
    checkpoint: {
      question:
        "کدام جمله درباره Visualization درست‌تر است؟",
      options: [
        "نمودار زیبا خودش اعتبار نتیجه را ثابت می‌کند",
        "Visualization به فهم نتیجه کمک می‌کند ولی جای تحلیل آماری را نمی‌گیرد",
        "Heatmap همیشه Causality را نشان می‌دهد",
        "Volcano Plot برای طراحی Sample Size استفاده می‌شود",
      ],
      correctIndex: 1,
      correctFeedback:
        "کاملاً درست. Visualization مکمل تحلیل است، نه جایگزین آن.",
      incorrectFeedback:
        "نمودارها ابزار مشاهده و ارتباط نتایج‌اند. اعتبار نتیجه به طراحی، داده و تحلیل آماری وابسته است.",
    },
  },
  {
    id: "functional-analysis",
    number: "11",
    title: "تحلیل عملکردی",
    englishTitle: "Functional Analysis",
    category: "تفسیر",
    shortDescription:
      "چگونه از صدها Gene به فرآیندها و Pathwayهای قابل فهم برسیم؟",
    simpleExplanation:
      "GO، Pathway Analysis و GSEA کمک می‌کنند نتایج را از سطح Geneهای منفرد به فرآیندهای زیستی گسترده‌تر منتقل کنیم.",
    deepExplanation:
      "روش‌های مختلف Functional Analysis سؤال‌های متفاوتی دارند. برخی از یک Gene List استفاده می‌کنند و برخی مثل GSEA از Ranking گسترده‌تری از Geneها بهره می‌برند. معنی‌دار بودن یک Term لزوماً اثبات نمی‌کند که Pathway به‌صورت مستقیم فعال یا مهار شده است.",
    example:
      "اگر تعداد زیادی Gene مرتبط با Cell Cycle در میان نتایج دیده شود، ممکن است یک Signal مرتبط با این فرآیند وجود داشته باشد که نیاز به تفسیر زیستی دارد.",
    keyMessage:
      "Gene List پایان تحلیل نیست؛ باید آن را به Context زیستی برگردانیم.",
    input: "Gene List / Ranked Genes",
    output: "Processes / Pathways / Enrichment Results",
    commonMistake:
      "گزارش تمام Pathwayهای Significant بدون ساختن یک داستان زیستی منسجم.",
    tools: ["GO", "KEGG", "GSEA", "Enrichment"],
    checkpoint: {
      question:
        "هدف اصلی Functional Analysis چیست؟",
      options: [
        "تبدیل Geneها به تصویر زیباتر",
        "ارتباط نتایج Gene-level با فرآیندهای زیستی",
        "افزایش مصنوعی تعداد DEG",
        "حذف نیاز به تفسیر",
      ],
      correctIndex: 1,
      correctFeedback:
        "دقیقاً. هدف اصلی حرکت از Geneهای منفرد به الگوها و فرآیندهای زیستی است.",
      incorrectFeedback:
        "Functional Analysis قرار است به تفسیر Biological Context کمک کند، نه اینکه جای آن را بگیرد.",
    },
  },
  {
    id: "interpretation",
    number: "12",
    title: "تفسیر زیستی",
    englishTitle: "Biological Interpretation",
    category: "تفسیر",
    shortDescription:
      "همه چیز باید در پایان دوباره به سؤال پژوهشی اولیه برگردد.",
    simpleExplanation:
      "در این مرحله نتایج DEG، Pathwayها، ساختار Sampleها و محدودیت‌های Study کنار هم قرار می‌گیرند تا یک نتیجه‌گیری علمی ساخته شود.",
    deepExplanation:
      "Biological Interpretation یعنی فراتر رفتن از لیست خروجی‌ها، بدون فراتر رفتن از توان داده. باید مشخص باشد داده چه چیزی را مستقیماً نشان می‌دهد، چه چیزی فقط Association است و برای چه ادعاهایی به Validation مستقل یا آزمایش تجربی نیاز داریم.",
    example:
      "به‌جای «داروی X سرطان را درمان می‌کند» می‌توان گفت «Treatment X در این مدل با تغییر در Expression Geneهای مرتبط با Cell Cycle همراه بوده است.»",
    keyMessage:
      "تفسیر خوب هم معنی زیستی دارد و هم محدودیت داده را رعایت می‌کند.",
    input: "تمام نتایج + Biological Context",
    output: "Biological Story قابل دفاع",
    commonMistake:
      "تبدیل Association به Causation یا نتیجه‌گیری گسترده‌تر از طراحی Study.",
    tools: ["Biological Context", "Literature", "Validation", "Limitations"],
    checkpoint: {
      question:
        "اگر RNA-seq نشان دهد یک Pathway با Treatment تغییر کرده، کدام نتیجه‌گیری علمی‌تر است؟",
      options: [
        "Treatment قطعاً بیماری را درمان می‌کند",
        "Treatment در این Study با تغییر Signal مرتبط با آن Pathway همراه بوده است",
        "Pathway علت قطعی Phenotype است",
        "دیگر نیازی به Validation نیست",
      ],
      correctIndex: 1,
      correctFeedback:
        "عالی. این نتیجه با سطح شواهد حاصل از Study سازگارتر است.",
      incorrectFeedback:
        "RNA-seq معمولاً Association و Patternهای مولکولی را نشان می‌دهد. ادعاهای علّی یا درمانی نیاز به شواهد بیشتری دارند.",
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
    description: "بهتر است بعداً دوباره این بخش را مرور کنم.",
  },
  {
    id: "developing",
    title: "تقریباً متوجه شدم",
    description: "ایده اصلی را گرفتم ولی هنوز جای تمرین دارد.",
  },
  {
    id: "clear",
    title: "کاملاً روشن است",
    description: "می‌توانم مفهوم اصلی این مرحله را توضیح بدهم.",
  },
];

function RnaSeqLearningNavigator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confidence, setConfidence] = useState<
    Record<string, Confidence>
  >({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

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

        return (
          nodeConfidence === "unclear" ||
          incorrect
        );
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

  function selectAnswer(index: number) {
    setAnswers((previous) => ({
      ...previous,
      [currentNode.id]: index,
    }));
  }

  function selectConfidence(value: Confidence) {
    setConfidence((previous) => ({
      ...previous,
      [currentNode.id]: value,
    }));
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
          <div>
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
          </div>

          <a
            href="/learn/rna-seq"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            بازگشت به RNA-seq Hub
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
                  Learning Navigator
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
                بوده است. هدف آزمون گرفتن نیست؛ هدف ساختن نقشه ذهنی
                تحلیل است.
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

              <p className="mt-5 text-sm leading-7 text-slate-300">
                پیشرفت این نسخه فعلاً فقط تا زمانی که صفحه باز است
                نگهداری می‌شود. ذخیره دائمی در حساب کاربری را در فاز
                Progress System اضافه می‌کنیم.
              </p>
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
                  همیشه بدانید در کدام بخش Workflow هستید.
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

                      <div className="min-w-0">
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
                          className="mt-0.5 truncate text-left text-[11px] text-slate-400"
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
            {!showSummary ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                {/* NODE HEADER */}
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
                      {currentIndex + 1} /{" "}
                      {navigatorNodes.length}
                    </span>
                  </div>

                  <p className="mt-6 text-lg leading-9 text-slate-700">
                    {currentNode.shortDescription}
                  </p>
                </div>

                <div className="space-y-8 p-6 sm:p-8">
                  {/* SIMPLE EXPLANATION */}
                  <LearningBlock title="این مرحله چیست؟">
                    <p>
                      {currentNode.simpleExplanation}
                    </p>
                  </LearningBlock>

                  {/* EXAMPLE */}
                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                    <p className="text-sm font-bold text-cyan-950">
                      یک مثال ساده
                    </p>

                    <p className="mt-2 text-sm leading-8 text-cyan-900/80">
                      {currentNode.example}
                    </p>
                  </div>

                  {/* INPUT OUTPUT */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <IOCard
                      label="ورودی این مرحله"
                      value={currentNode.input}
                      badge="IN"
                    />

                    <IOCard
                      label="خروجی این مرحله"
                      value={currentNode.output}
                      badge="OUT"
                    />
                  </div>

                  {/* KEY MESSAGE */}
                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="text-xs font-bold text-teal-300">
                      چیزی که باید از این مرحله یادتان بماند
                    </p>

                    <p className="mt-3 text-lg font-bold leading-8">
                      {currentNode.keyMessage}
                    </p>
                  </div>

                  {/* MORE */}
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
                        {expanded[currentNode.id]
                          ? "−"
                          : "+"}
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

                  {/* COMMON MISTAKE */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm font-bold text-amber-950">
                      اشتباه رایج
                    </p>

                    <p className="mt-2 text-sm leading-8 text-amber-900/80">
                      {currentNode.commonMistake}
                    </p>
                  </div>

                  {/* TOOLS */}
                  <LearningBlock title="اصطلاحات و ابزارهای مرتبط">
                    <div className="flex flex-wrap gap-2">
                      {currentNode.tools.map((tool) => (
                        <span
                          key={tool}
                          dir="ltr"
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600"
                        >
                          {tool}
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
                          Checkpoint
                        </p>

                        <h3 className="mt-1 text-lg font-bold leading-8 text-slate-950">
                          {
                            currentNode.checkpoint
                              .question
                          }
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
                              currentNode.checkpoint
                                .correctIndex
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-rose-400 bg-rose-50";
                          }

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                selectAnswer(index)
                              }
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
                            ? currentNode.checkpoint
                                .correctFeedback
                            : currentNode.checkpoint
                                .incorrectFeedback}
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
                        پاسخ شما در Learning Summary استفاده
                        می‌شود.
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

                  {/* NAVIGATION */}
                  <div className="border-t border-slate-100 pt-7">
                    {!nodeReady && (
                      <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-500">
                        برای رفتن به مرحله بعد، سؤال کوتاه بالا را
                        پاسخ دهید و میزان روشن بودن مفهوم را مشخص
                        کنید.
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
                  goToNode(
                    navigatorNodes.length - 1,
                  );
                }}
              />
            )}
          </div>
        </div>
      </section>
    </main>
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
          Learning Summary
        </span>

        <h2 className="mt-5 text-3xl font-bold leading-tight">
          نقشه یادگیری RNA-seq شما
        </h2>

        <p className="mt-4 max-w-2xl leading-8 text-slate-300">
          این جمع‌بندی نمره یا ارزیابی رسمی دانش شما نیست. فقط کمک
          می‌کند ببینید کدام مفاهیم روشن‌تر شده‌اند و کدام بخش‌ها
          ارزش مرور دوباره دارند.
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {!allCompleted && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-bold text-amber-950">
              مسیر هنوز کامل نشده است.
            </p>

            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {completedCount} از {navigatorNodes.length} مرحله
              تکمیل شده است. می‌توانید هر زمان به نقشه مسیر
              برگردید و بخش‌های باقی‌مانده را ادامه دهید.
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryMetric
            value={strongNodes.length}
            label="مفاهیم روشن"
            description="پاسخ درست + اطمینان بالا"
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
            حالا می‌توانید این نقشه ذهنی را به پروژه واقعی
            متصل کنید.
          </h3>

          <p className="mt-3 leading-8 text-slate-600">
            اگر فقط برای یادگیری آمده‌اید، مرور مفاهیم علامت‌خورده
            بهترین قدم بعدی است. اگر پروژه واقعی دارید، مرحله بعد
            Project Mode خواهد بود تا سؤال، Sampleها و نوع داده شما
            را روی همین Workflow بررسی کنیم.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/learn/rna-seq#project-mode"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-bold text-white transition hover:bg-slate-800"
            >
              برای پروژه من چطور؟
            </a>

            <a
              href="/learn/rna-seq"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-teal-300"
            >
              بازگشت به RNA-seq Hub
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          بازگشت به آخرین مرحله Navigator
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
  badge,
}: {
  label: string;
  value: string;
  badge: "IN" | "OUT";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">
          {label}
        </p>

        <span
          dir="ltr"
          className={[
            "rounded-lg px-2 py-1 text-[10px] font-black",
            badge === "IN"
              ? "bg-cyan-100 text-cyan-800"
              : "bg-teal-100 text-teal-800",
          ].join(" ")}
        >
          {badge}
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
      <p
        dir="ltr"
        className="text-3xl font-black text-slate-950"
      >
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
