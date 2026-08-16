# HubGene — Transcriptomics Learning Blueprint v1

**Project:** هاب‌ژن / HubGene  
**Document type:** Final Learning Architecture Blueprint  
**Version:** 1.0  
**Date:** 2026-08-16  
**Status:** Approved foundation for implementation  
**Primary focus:** Transcriptomics as the first major educational pillar of HubGene

---

# 1. تصمیم معماری اصلی

از این نقطه به بعد، **RNA-seq یک ستون اصلی مستقل در ساختار آموزشی هاب‌ژن نیست**.

ساختار صحیح علمی به این صورت در نظر گرفته می‌شود:

> **Transcriptomics = حوزه علمی اصلی**  
> **Bulk RNA-seq = یکی از مسیرهای اصلی درون Transcriptomics**

بنابراین آموزش شماره ۱ هاب‌ژن:

> **ترنسکریپتومیکس / Transcriptomics**

خواهد بود و Bulk RNA-seq اولین مسیر عمیق و تعاملی درون آن است.

---

# 2. پنج ستون اصلی آموزش‌های Omics

برای معماری سطح اول بخش Learn، فعلاً این پنج حوزه اصلی در نظر گرفته می‌شوند:

1. **ترنسکریپتومیکس / Transcriptomics**
2. **ژنومیکس / Genomics**
3. **اپی‌ژنومیکس / Epigenomics**
4. **پروتئومیکس / Proteomics**
5. **متابولومیکس / Metabolomics**

این پنج مورد باید به‌عنوان حوزه‌های اصلی Omics دیده شوند، نه مجموعه‌ای از ابزارها یا روش‌های تحلیل.

---

# 3. اصل تفکیک حوزه، فناوری و تحلیل

در معماری علمی هاب‌ژن باید سه سطح از هم جدا بمانند:

## 3.1 حوزه علمی

مثال:

```text
Transcriptomics
Genomics
Epigenomics
Proteomics
Metabolomics
```

## 3.2 روش یا Modality اندازه‌گیری

مثال در Transcriptomics:

```text
Bulk RNA-seq
Single-cell RNA-seq
Spatial Transcriptomics
Long-read Transcriptomics
small RNA-seq
```

## 3.3 مسیر یا روش تحلیل

مثال:

```text
Differential Expression
Functional Analysis
Network Biology
WGCNA
Biomarker Discovery
Machine Learning
Alternative Splicing
Isoform Analysis
```

قاعده مهم:

> **یک فناوری اندازه‌گیری با یک روش تحلیل یکسان نیست.**

مثال:

```text
Transcriptomics
→ Bulk RNA-seq
→ Expression Matrix
→ Network Biology
→ WGCNA
```

در این ساختار، WGCNA رقیب RNA-seq نیست؛ بلکه یک مسیر تحلیل روی داده مناسب Transcriptomics است.

---

# 4. جایگاه موضوعات قبلی در معماری جدید

## Single-cell

Single-cell RNA-seq در سطح پایه زیرمجموعه Transcriptomics است:

```text
Transcriptomics
├── Bulk RNA-seq
├── Single-cell RNA-seq
└── Spatial Transcriptomics
```

در آینده می‌توان یک Hub میان‌رشته‌ای با عنوان `Single-cell Omics` نیز داشت که شامل مواردی مانند:

```text
scRNA-seq
scATAC-seq
Single-cell Multiome
```

باشد.

---

## Network Biology

Network Biology یک Omics نیست.

باید به‌عنوان تحلیل میان‌رشته‌ای در نظر گرفته شود:

```text
Cross-cutting Analysis
├── Network Biology
├── Biomarker Discovery
├── Functional Analysis
├── Pathway Analysis
├── Machine Learning
└── Multi-omics Integration
```

---

## Public Data Research

Public Data نیز یک حوزه Omics مستقل نیست.

بلکه یک مسیر یا مهارت پژوهشی عرضی است:

```text
Public Data Research
├── GEO
├── SRA
├── TCGA
├── ENCODE
└── Other repositories
```

و به هر حوزه متصل می‌شود:

```text
Transcriptomics → Public Transcriptome Data
Genomics → Public Genomic Data
Epigenomics → ENCODE / GEO
```

---

## Microbiome

Microbiome یک Research Domain است، نه دقیقاً هم‌سطح پنج Omics اصلی.

می‌تواند چند فناوری مختلف داشته باشد:

```text
Microbiome
├── 16S rRNA sequencing
├── Shotgun Metagenomics
├── Metatranscriptomics
└── ...
```

بنابراین فعلاً بهتر است از پنج ستون اصلی Omics جدا نگه داشته شود.

---

# 5. Blueprint اصلی Transcriptomics

معماری داخلی Transcriptomics به پنج بخش اصلی تقسیم می‌شود:

```text
Transcriptomics
ترنسکریپتومیکس
│
├── A. Foundations
│   مبانی ترنسکریپتومیکس
│
├── B. Measurement Modalities
│   روش‌ها و فناوری‌های اندازه‌گیری
│
├── C. Analysis Paths
│   مسیرهای تحلیل
│
├── D. Interactive Labs
│   آزمایشگاه‌های تعاملی
│
└── E. Project Application
    اتصال به پروژه واقعی پژوهشگر
```

---

# 6. Transcriptomics Foundations

قبل از ورود به Bulk RNA-seq، کاربر باید یک Foundation Layer داشته باشد.

نسخه اولیه Foundations:

| کد | عنوان فارسی | English | سؤال اصلی |
|---|---|---|---|
| F1 | از ژنوم تا ترنسکریپتوم | Genome → Transcriptome | Genome و Transcriptome چه تفاوتی دارند؟ |
| F2 | بیان ژن یعنی چه؟ | Gene Expression | وقتی می‌گوییم یک ژن بیان شده یعنی چه؟ |
| F3 | RNA فقط mRNA نیست | RNA Types | چه انواع RNA وجود دارند؟ |
| F4 | ترنسکریپتومیکس چه چیزی اندازه می‌گیرد؟ | What Transcriptomics Measures | چه چیزی را مشاهده می‌کنیم و چه چیزی را نمی‌بینیم؟ |
| F5 | سؤال‌های قابل پاسخ با ترنسکریپتومیکس | Research Questions | Transcriptomics برای چه سؤال‌هایی مناسب است؟ |
| F6 | Bulk، Single-cell و Spatial | Measurement Resolution | هر روش چه تصویری از سیستم زیستی می‌دهد؟ |
| F7 | RNA-seq در این نقشه کجاست؟ | RNA-seq in Transcriptomics | RNA-seq چگونه Transcriptome را اندازه می‌گیرد؟ |

هدف Foundations این نیست که کاربر یک سری تعریف حفظ کند.

هدف این است که در پایان بتواند:

- Genome را از Transcriptome تفکیک کند.
- مفهوم Gene Expression را توضیح دهد.
- بداند RNA فقط mRNA نیست.
- بداند Transcriptomics چه سؤال‌هایی را می‌تواند پاسخ دهد.
- تفاوت کلی Bulk، Single-cell و Spatial را بفهمد.
- جایگاه RNA-seq را در کل اکوسیستم Transcriptomics تشخیص دهد.

---

# 7. انتخاب Modality باید از سؤال پژوهشی شروع شود

یکی از امضاهای آموزشی HubGene باید این باشد:

> **سؤال → مفهوم → تصمیم → ابزار**

نه:

> ابزار → اجرا → تفسیر بعدی

در Transcriptomics، کاربر باید به‌صورت تعاملی ببیند:

```text
می‌خواهید چه چیزی را درباره Transcriptome بدانید؟
             │
             ├── میانگین بیان در نمونه یا بافت؟
             │      → Bulk RNA-seq
             │
             ├── تفاوت بین سلول‌های منفرد؟
             │      → Single-cell RNA-seq
             │
             ├── بیان + موقعیت در بافت؟
             │      → Spatial Transcriptomics
             │
             ├── ساختار کامل Transcript / Isoform؟
             │      → Long-read Transcriptomics
             │
             └── RNAهای کوچک؟
                    → small RNA-seq
```

---

# 8. Bulk RNA-seq به‌عنوان اولین مسیر عمیق

۱۲ مرحله فعلی Bulk RNA-seq حفظ می‌شوند و به ستون فقرات اولین Learning Path جدی HubGene تبدیل می‌شوند:

```text
Transcriptomics
      ↓
Bulk RNA-seq
      ↓
01 سؤال پژوهشی
02 طراحی مطالعه
03 از نمونه تا FASTQ
04 کنترل کیفیت
05 کمی‌سازی بیان
06 ماتریس بیان
07 نرمال‌سازی داده
08 بررسی ساختار نمونه‌ها
09 تحلیل بیان افتراقی
10 نمایش نتایج
11 تحلیل عملکردی
12 تفسیر زیستی
```

---

# 9. مدل استاندارد هر واحد آموزشی تعاملی

هر Node دیگر نباید فقط یک صفحه توضیحی باشد.

هر Node باید به یک **Interactive Learning Unit** تبدیل شود.

ساختار استاندارد:

```text
Concept
↓
Deep Dive
↓
Visual / Data Example
↓
Mini Lab
↓
Decision Scenario
↓
Mistake Clinic
↓
Case Study
↓
Apply to My Project
↓
Mastery Checkpoint
```

نسخه فارسی پیشنهادی:

1. **بفهم**
2. **عمیق‌تر شو**
3. **ببین**
4. **امتحان کن**
5. **تصمیم بگیر**
6. **اشتباه را پیدا کن**
7. **در یک Case Study ببین**
8. **به پروژه خودت وصل کن**
9. **ایستگاه تسلط**

Checkpoint و Confidence دیگر اصل آموزش نیستند؛ بلکه مرحله نهایی تثبیت مفهوم‌اند.

---

# 10. اصل تعامل در آموزش

هدف HubGene ساخت یک محیط آموزشی interaction-first است.

قاعده پیشنهادی:

> **هر ۲ تا ۳ دقیقه مطالعه باید حداقل یک تعامل معنی‌دار وجود داشته باشد.**

تعامل الزاماً Quiz نیست.

می‌تواند شامل موارد زیر باشد:

- انتخاب
- مرتب‌کردن مراحل
- مقایسه دو وضعیت
- بازکردن Metadata
- بررسی یک جدول
- تغییر یک پارامتر
- پیدا کردن خطا
- مشاهده اثر یک تصمیم
- تفسیر نمودار
- ساخت Experimental Design
- تشخیص Batch Effect
- انتخاب Claim علمی مناسب

---

# 11. انواع Mini Lab قابل استفاده مجدد

HubGene باید مجموعه‌ای از الگوهای تعاملی قابل استفاده مجدد بسازد.

## Decision Lab

کاربر بین چند تصمیم پژوهشی انتخاب می‌کند.

## Data Inspector

کاربر یک جدول، ماتریس، Metadata یا خروجی واقعی‌نما را بررسی می‌کند.

## Compare Lab

دو وضعیت یا دو نوع داده کنار هم قرار می‌گیرند.

## Build Lab

کاربر چیزی مانند Experimental Design را می‌سازد.

## Detect the Problem

کاربر یک پروژه مشکل‌دار را بررسی و مشکل را پیدا می‌کند.

## Interpretation Lab

کاربر PCA، Volcano Plot، Heatmap یا جدول آماری را تفسیر می‌کند.

## What Happens If...?

یک شرایط یا پارامتر تغییر می‌کند و کاربر اثر آن را مشاهده می‌کند.

---

# 12. Mini Lab پیشنهادی برای ۱۲ Node Bulk RNA-seq

| مرحله | Mini Lab پیشنهادی |
|---|---|
| سؤال پژوهشی | تبدیل یک موضوع مبهم به سؤال قابل تحلیل |
| طراحی مطالعه | ساخت Control/Treatment + Biological Replicate + کشف Confounding |
| از نمونه تا FASTQ | مرتب‌کردن Sample → RNA → Library → Sequencing → FASTQ |
| کنترل کیفیت | تفسیر هشدارهای QC و تصمیم برای بررسی یا اقدام |
| کمی‌سازی بیان | مشاهده تبدیل Reads به Gene/Transcript quantification |
| ماتریس بیان | تشخیص Raw Counts / TPM / FPKM و استفاده مناسب |
| نرمال‌سازی | مشاهده اثر Sequencing Depth و علت نیاز به Normalization |
| بررسی ساختار نمونه‌ها | PCA تعاملی + Outlier + Batch Effect |
| تحلیل بیان افتراقی | تصمیم‌گیری با log2FC + p-value + FDR |
| نمایش نتایج | تفسیر Volcano / Heatmap و تشخیص overinterpretation |
| تحلیل عملکردی | مقایسه Gene List و Ranked List و فهم ORA/GSEA |
| تفسیر زیستی | ساخت Claim علمی متناسب با قدرت شواهد |

---

# 13. اصل «اجازه بده کاربر اشتباه کند»

Mini Labها نباید همیشه مانند Quiz سنتی عمل کنند.

در برخی تعاملات، کاربر باید بتواند یک تصمیم اشتباه بگیرد و پیامد آن را ببیند.

مثال:

در PCA کاربر انتخاب می‌کند:

> «نمونه پرت را فوراً حذف می‌کنم.»

HubGene می‌تواند ابتدا پیامد تصمیم را نشان دهد و سپس بپرسد:

> آیا هنوز می‌دانیم چرا این نمونه متفاوت بوده است؟

و بعد کاربر را به:

```text
QC
Metadata
Batch
Biological explanation
```

هدایت کند.

اصل آموزشی:

> **دیدن پیامد یک تصمیم اشتباه، از دریافت یک پیام ساده «غلط است» مؤثرتر است.**

---

# 14. Case Study سراسری Transcriptomics / Bulk RNA-seq

یک Case Study باید از ابتدا تا انتهای مسیر همراه کاربر باشد.

نمونه اولیه پیشنهادی:

## Drug X in Breast Cancer Cells

سؤال کلی:

> اثر Drug X بر الگوی بیان ژن سلول‌های سرطان پستان چیست؟

این پروژه در طول آموزش ادامه پیدا می‌کند:

```text
Research Question
↓
Experimental Design
↓
Samples
↓
Metadata
↓
FASTQ
↓
Quality Control
↓
Expression Matrix
↓
Normalization
↓
PCA
↓
Differential Expression
↓
Volcano / Heatmap
↓
Functional Analysis
↓
Biological Interpretation
```

هدف:

> کاربر ۱۲ مفهوم جداگانه یاد نگیرد؛ بلکه یک پروژه RNA-seq را از ابتدا تا انتها تجربه کند.

---

# 15. نمونه Mini Lab برای Sample Exploration

سناریو:

```text
Control 1
Control 2
Treatment 1
Treatment 2
Treatment 3
```

در PCA، `Treatment 3` از بقیه فاصله دارد.

از کاربر پرسیده می‌شود:

> بهترین اقدام بعدی چیست؟

گزینه‌های نمونه:

- حذف فوری نمونه
- نتیجه‌گیری درباره اثر شدید Treatment
- بررسی QC و Metadata
- نادیده گرفتن PCA

بعد از انتخاب بررسی Metadata:

| Sample | Group | Sex | Batch |
|---|---|---|---|
| C1 | Control | F | Batch 1 |
| C2 | Control | F | Batch 1 |
| T1 | Treatment | F | Batch 1 |
| T2 | Treatment | F | Batch 1 |
| T3 | Treatment | F | Batch 2 |

پیام آموزشی:

> **PCA مشکل را ثابت نمی‌کند؛ سرنخ ایجاد می‌کند.**

---

# 16. Interactive Labs به‌عنوان یک لایه رسمی محصول

Mini Lab صرفاً یک جزء جانبی نیست.

در معماری HubGene باید یک لایه مستقل به نام:

> **HubGene Interactive Labs**

در نظر گرفته شود.

نمونه Labهای Transcriptomics:

- Gene Expression Lab
- Experimental Design Lab
- FASTQ Lab
- QC Lab
- Expression Matrix Lab
- Normalization Lab
- PCA Lab
- Differential Expression Lab
- Volcano Plot Lab
- Enrichment Lab
- Interpretation Lab

در آینده این Labها می‌توانند هم داخل درس و هم به‌صورت مستقل قابل دسترسی باشند.

---

# 17. Analysis Paths در Transcriptomics

بعد از تولید داده مناسب، کاربر می‌تواند وارد مسیرهای تحلیلی مختلف شود:

```text
Transcriptomics
     ↓
Bulk RNA-seq
     ↓
Expression Matrix
     ├── Differential Expression
     ├── Functional Analysis
     ├── Alternative Splicing
     ├── Isoform Analysis
     ├── Network Biology
     ├── Biomarker Discovery
     └── Machine Learning
```

اصل مهم:

> کاربر نباید فقط چون یک تحلیل از نظر فنی قابل اجراست، به آن هدایت شود.

قانون HubGene:

> **قابل اجرا بودن ≠ مناسب بودن**

---

# 18. Shared Concepts

بسیاری از مفاهیم فقط متعلق به Transcriptomics نیستند.

باید به‌تدریج به یک لایه مشترک تبدیل شوند:

```text
Shared Concepts
│
├── Experimental Design
├── Biological Replicates
├── Technical Replicates
├── Metadata
├── Batch Effect
├── Covariates
├── Confounders
├── Multiple Testing
├── PCA
├── Clustering
├── Statistical Significance
├── Reproducibility
└── Biological Interpretation
```

اصل معماری:

> مفهوم پایه یک بار ساخته می‌شود، اما در هر Omics مثال و Context مخصوص همان حوزه نمایش داده می‌شود.

---

# 19. ساختار کل Learn هاب‌ژن

Blueprint بلندمدت:

```text
Omics
│
├── Transcriptomics
│   ├── Foundations
│   ├── Bulk RNA-seq
│   ├── Single-cell RNA-seq
│   ├── Spatial Transcriptomics
│   ├── Long-read Transcriptomics
│   └── Advanced Topics
│
├── Genomics
├── Epigenomics
├── Proteomics
└── Metabolomics

Cross-cutting
│
├── Experimental Design
├── Statistics
├── Public Data Research
├── Functional Analysis
├── Network Biology
├── Biomarker Discovery
├── Visualization
└── Biological Interpretation
```

---

# 20. معماری فنی پیشنهادی برای Interactive Learning Engine

محتوای جدید نباید داخل یک فایل بزرگ Navigator جمع شود.

Navigator باید به یک Shell / Engine تبدیل شود.

ساختار پیشنهادی:

```text
src/features/transcriptomics-learning/

  components/
    ConceptBlock.tsx
    DeepDive.tsx
    VisualExample.tsx
    DecisionLab.tsx
    DataInspector.tsx
    CompareLab.tsx
    BuildLab.tsx
    MistakeClinic.tsx
    CaseStudyBlock.tsx
    ProjectBridge.tsx
    MasteryCheckpoint.tsx

  foundations/
    genome-to-transcriptome.tsx
    gene-expression.tsx
    rna-types.tsx
    what-transcriptomics-measures.tsx
    transcriptomics-questions.tsx
    bulk-vs-single-cell-vs-spatial.tsx
    rna-seq-in-transcriptomics.tsx

  bulk-rna-seq/
    research-question.tsx
    study-design.tsx
    sequencing.tsx
    quality-control.tsx
    quantification.tsx
    expression-matrix.tsx
    normalization.tsx
    sample-exploration.tsx
    differential-expression.tsx
    visualization.tsx
    functional-analysis.tsx
    interpretation.tsx
```

Navigator / route اصلی باید عمدتاً مسئول این موارد باشد:

- Navigation
- Progress
- Supabase persistence
- Deep linking
- Dashboard context
- Active node
- Learning summary

---

# 21. ذخیره تعاملات Mini Lab

برای نسخه اول:

> Mini Lab interactions = Local State

لازم نیست تمام کلیک‌ها و تصمیم‌های کوچک در دیتابیس ذخیره شوند.

فعلاً خروجی اصلی Node همان سیستم موجود است:

```text
selected_answer
confidence
status
```

در:

```text
learning_progress
```

بعداً اگر ارزش واقعی برای شخصی‌سازی داشت، می‌توان جدول جدیدی مانند:

```text
learning_interactions
```

اضافه کرد.

اصل فعلی:

> **کیفیت آموزش مهم‌تر از جمع‌آوری Event است.**

---

# 22. Route Strategy

در حال حاضر Routeهای موجود مانند:

```text
/learn/rna-seq
/learn/rna-seq/navigator
/learn/rna-seq/project
```

به Dashboard، learning progress، assessment و Deep Links متصل هستند.

بنابراین در این مرحله URLها تغییر نمی‌کنند.

از نظر مفهومی UI باید نشان دهد:

```text
Transcriptomics
↓
Bulk RNA-seq
```

اما Route Migration به ساختاری مانند:

```text
/learn/transcriptomics
/learn/transcriptomics/bulk-rna-seq
```

بعداً و پس از تثبیت معماری انجام خواهد شد.

اصل فعلی:

> **اول معماری علمی و تجربه آموزشی را تثبیت کن؛ بعد URL migration را انجام بده.**

---

# 23. اولین Gold Standard Interactive Lesson

قبل از توسعه ۱۲ Node Bulk RNA-seq، اولین واحدی که باید با کیفیت کامل طراحی شود:

# F1 — از ژنوم تا ترنسکریپتوم

```text
Genome
↓
Transcriptome
↓
Gene Expression
```

این درس باید نمونه طلایی Template آموزشی HubGene باشد.

هدف آن:

- ساخت مدل ذهنی Genome vs Transcriptome
- معرفی Gene Expression
- نشان‌دادن اینکه سلول‌های با Genome مشابه می‌توانند Transcriptome متفاوت داشته باشند
- آماده‌کردن ذهن کاربر برای فهم Transcriptomics
- آزمایش معماری Mini Lab
- آزمایش Decision-based learning
- آزمایش Visual Example
- آزمایش Mistake Clinic
- آزمایش Mastery Checkpoint

اگر F1 با کیفیت مطلوب ساخته شود، Template آن برای تمام Foundations و سپس Bulk RNA-seq قابل استفاده خواهد بود.

---

# 24. اصل مرکزی تجربه آموزشی HubGene

HubGene قرار نیست صرفاً یک Course Library باشد.

هدف:

> **Research-driven learning**

نه:

> **Course-driven learning**

کاربر باید بتواند:

- از ابتدا یاد بگیرد.
- در میانه یک پروژه وارد شود.
- یک مفهوم خاص را پیدا کند.
- یک مشکل واقعی را حل کند.
- یک خروجی را تفسیر کند.
- مفهوم را به پروژه خودش وصل کند.
- از یادگیری به تصمیم پژوهشی برسد.

---

# 25. اصول نهایی قفل‌شده

## اصل ۱

> **Transcriptomics اولین ستون اصلی آموزش HubGene است.**

## اصل ۲

> **Bulk RNA-seq اولین مسیر عمیق و تعاملی Transcriptomics است.**

## اصل ۳

> **RNA-seq نباید هم‌سطح Transcriptomics، Genomics یا Proteomics قرار گیرد.**

## اصل ۴

> **Single-cell RNA-seq در سطح پایه زیرمجموعه Transcriptomics است.**

## اصل ۵

> **Network Biology، Biomarker Discovery و Public Data مسیرهای Cross-cutting هستند، نه Omics اصلی.**

## اصل ۶

> **آموزش باید Interaction-first باشد، نه Text-first.**

## اصل ۷

> **هر Node یک Interactive Learning Unit است.**

## اصل ۸

> **Mini Lab یک جزء رسمی معماری محصول است.**

## اصل ۹

> **یک Case Study پیوسته باید مراحل آموزش را به هم متصل کند.**

## اصل ۱۰

> **سؤال → مفهوم → تصمیم → ابزار**

## اصل ۱۱

> **قابل اجرا بودن ≠ مناسب بودن**

## اصل ۱۲

> **اول کیفیت آموزشی، سپس جمع‌آوری داده رفتاری بیشتر.**

---

# 26. قدم بعدی تأییدشده

قدم بعدی توسعه:

> طراحی کامل **F1 — از ژنوم تا ترنسکریپتوم**

به‌عنوان اولین Gold Standard Interactive Lesson هاب‌ژن.

F1 باید قبل از کدنویسی در این ابعاد طراحی شود:

```text
Learning Objective
Concept
Mental Model
Deep Dive
Visual Story
Mini Lab
Decision Scenario
Mistake Clinic
Case Study Connection
Apply to My Research
Mastery Checkpoint
```

پس از نهایی‌شدن F1، همان معماری به Foundations دیگر و سپس مسیر Bulk RNA-seq گسترش داده خواهد شد.

---

# Final Product Vision

هدف نهایی بخش آموزش HubGene:

> **یک اکوسیستم آموزشی تعاملی برای علوم اُمیکس که پژوهشگر را از فهم مفهوم، به تصمیم درست پژوهشی و سپس به کاربرد در پروژه واقعی خودش می‌رساند.**

مسیر تجربه:

```text
Understand
↓
Explore
↓
Interact
↓
Decide
↓
Apply
↓
Interpret
```

و در سطح کل محصول:

```text
Learn
→ Design
→ Consult
→ Analyze
```