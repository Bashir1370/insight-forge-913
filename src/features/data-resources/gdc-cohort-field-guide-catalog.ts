import type {
  GdcCohortFieldGuideField,
  GdcCohortFieldGuideTab,
} from "./gdc-cohort-field-guide-config";

export const GDC_COHORT_FIELD_CATALOG_VERSION = 1;

type FieldSeed = {
  key: string;
  label: string;
  description: string;
};

type TabSeed = {
  pages: FieldSeed[][];
};

const seed = (key: string, label: string, description: string): FieldSeed => ({
  key,
  label,
  description,
});

const CATALOG: Record<string, TabSeed> = {
  demographic: {
    pages: [[
      seed("sex-at-birth", "Sex at Birth", "جنس ثبت‌شده در بدو تولد را نشان می‌دهد؛ برای محدود کردن یا مقایسه Caseها بر اساس sex استفاده می‌شود."),
      seed("race", "Race", "گروه نژادی گزارش‌شده برای بیمار را نشان می‌دهد و برای بررسی ترکیب جمعیتی Cohort کاربرد دارد."),
      seed("ethnicity", "Ethnicity", "قومیت گزارش‌شده، مانند Hispanic or Latino، را مشخص می‌کند و برای تفکیک جمعیت مطالعه به‌کار می‌رود."),
      seed("age-at-diagnosis", "Age at Diagnosis", "سن بیمار در زمان تشخیص را به‌صورت بازه‌ای فیلتر می‌کند؛ مناسب برای ساخت Cohortهای سنی مشخص."),
      seed("vital-status", "Vital Status", "وضعیت حیاتی ثبت‌شده بیمار، مانند Alive یا Dead، را برای انتخاب Caseها مشخص می‌کند."),
    ]],
  },
  "general-diagnosis": {
    pages: [
      [
        seed("ajcc-clinical-stage", "Ajcc Clinical Stage", "مرحله بالینی سرطان بر اساس سیستم AJCC را نشان می‌دهد؛ یعنی staging مبتنی بر اطلاعات بالینی پیش از ارزیابی پاتولوژیک کامل."),
        seed("ajcc-pathologic-stage", "Ajcc Pathologic Stage", "مرحله پاتولوژیک سرطان در سیستم AJCC را مشخص می‌کند و معمولاً بر یافته‌های بافت‌شناسی یا جراحی تکیه دارد."),
        seed("uicc-clinical-stage", "Uicc Clinical Stage", "مرحله بالینی بیماری بر اساس طبقه‌بندی UICC را برای محدود کردن Caseها بر مبنای stage مشخص می‌کند."),
        seed("uicc-pathologic-stage", "Uicc Pathologic Stage", "مرحله پاتولوژیک بیماری در سیستم UICC را نشان می‌دهد و برای انتخاب Caseهای دارای stage پاتولوژیک خاص کاربرد دارد."),
        seed("tumor-grade", "Tumor Grade", "درجه تومور را نشان می‌دهد؛ شاخصی از میزان تمایز سلولی و معمولاً شدت رفتار زیستی تومور."),
      ],
      [
        seed("morphology", "Morphology", "کد یا نوع مورفولوژیک تومور را بر اساس ظاهر و الگوی بافت‌شناسی مشخص می‌کند."),
        seed("year-of-diagnosis", "Year of Diagnosis", "سال ثبت تشخیص را فیلتر می‌کند و برای محدود کردن Cohort به یک بازه زمانی مشخص مفید است."),
        seed("site-of-resection-biopsy", "Site of Resection or Biopsy", "محل آناتومیکی‌ای را مشخص می‌کند که نمونه از آن جراحی یا بیوپسی شده است."),
        seed("sites-of-involvement", "Sites of Involvement", "ناحیه‌ها یا اندام‌هایی را نشان می‌دهد که درگیری بیماری در آن‌ها گزارش شده است."),
        seed("laterality", "Laterality", "سمت درگیری را مشخص می‌کند؛ مانند Left، Right، Bilateral یا Midline."),
      ],
    ],
  },
  "disease-status-history": {
    pages: [[
      seed("prior-malignancy", "Prior Malignancy", "مشخص می‌کند بیمار پیش از بیماری فعلی سابقه بدخیمی دیگری داشته است یا خیر."),
      seed("prior-treatment", "Prior Treatment", "نشان می‌دهد پیش از تشخیص یا درمان فعلی، سابقه درمان ضدسرطان برای بیمار ثبت شده است یا نه."),
      seed("synchronous-malignancy", "Synchronous Malignancy", "وجود بدخیمی دیگری را که هم‌زمان با سرطان اصلی تشخیص داده شده مشخص می‌کند."),
      seed("progression-recurrence", "Progression or Recurrence", "ثبت پیشرفت یا عود بیماری را مشخص می‌کند و برای تفکیک Caseهای دارای progression/recurrence مفید است."),
      seed("residual-disease", "Residual Disease", "میزان یا وجود بیماری باقی‌مانده پس از درمان یا جراحی را نشان می‌دهد."),
      seed("child-pugh", "Child Pugh Classification", "کلاس Child-Pugh را برای ارزیابی شدت اختلال عملکرد کبد در Caseهای دارای داده مرتبط نشان می‌دهد."),
      seed("ishak-fibrosis", "Ishak Fibrosis Score", "امتیاز Ishak را برای درجه‌بندی میزان فیبروز کبدی در Caseهای دارای این ارزیابی مشخص می‌کند."),
    ]],
  },
  "disease-specific": {
    pages: [
      [
        seed("ann-arbor-clinical", "Ann Arbor Clinical Stage", "مرحله بالینی لنفوم بر اساس سیستم Ann Arbor را مشخص می‌کند."),
        seed("ann-arbor-pathologic", "Ann Arbor Pathologic Stage", "مرحله پاتولوژیک لنفوم بر اساس سیستم Ann Arbor را نشان می‌دهد."),
        seed("cog-renal-stage", "Cog Renal Stage", "مرحله‌بندی COG برای تومورهای کلیوی کودکان را مشخص می‌کند."),
        seed("figo-stage", "Figo Stage", "مرحله بیماری در سرطان‌های زنان بر اساس سیستم FIGO را نشان می‌دهد."),
        seed("igcccg-stage", "Igcccg Stage", "گروه پیش‌آگهی IGCCCG را برای تومورهای سلول زایا مشخص می‌کند."),
        seed("inrg-stage", "Inrg Stage", "مرحله بیماری نوروبلاستوما را بر اساس سیستم INRG مشخص می‌کند."),
        seed("inss-stage", "Inss Stage", "مرحله نوروبلاستوما را بر اساس سیستم INSS نشان می‌دهد."),
        seed("iss-stage", "Iss Stage", "مرحله‌بندی International Staging System را برای میلوم مولتیپل مشخص می‌کند."),
        seed("masaoka-stage", "Masaoka Stage", "مرحله تومورهای تیموسی را بر اساس سیستم Masaoka نشان می‌دهد."),
      ],
      [
        seed("inpc-grade", "Inpc Grade", "درجه‌بندی پاتولوژیک نوروبلاستوما را بر اساس INPC مشخص می‌کند."),
        seed("who-cns-grade", "Who Cns Grade", "درجه تومورهای سیستم عصبی مرکزی را بر اساس طبقه‌بندی WHO نشان می‌دهد."),
        seed("cog-neuroblastoma-risk", "Cog Neuroblastoma Risk Group", "گروه خطر نوروبلاستوما را بر اساس معیارهای COG مشخص می‌کند."),
        seed("cog-rhabdomyosarcoma-risk", "Cog Rhabdomyosarcoma Risk Group", "گروه خطر رابدومیوسارکوما را بر اساس معیارهای COG نشان می‌دهد."),
        seed("international-prognostic-index", "International Prognostic Index", "امتیاز یا گروه IPI را برای ارزیابی پیش‌آگهی در لنفوم‌ها مشخص می‌کند."),
        seed("eln-risk", "Eln Risk Classification", "طبقه‌بندی خطر ELN را برای بدخیمی‌های میلوئیدی، به‌ویژه AML، نشان می‌دهد."),
        seed("medulloblastoma-molecular", "Medulloblastoma Molecular Classification", "گروه مولکولی مدولوبلاستوما را برای تفکیک زیرگروه‌های زیستی بیماری مشخص می‌کند."),
        seed("wilms-histology", "Wilms Tumor Histologic Subtype", "زیرنوع بافت‌شناسی تومور ویلمز را مشخص می‌کند."),
        seed("weiss-score", "Weiss Assessment Score", "امتیاز Weiss را برای ارزیابی ویژگی‌های بدخیمی در تومورهای قشر آدرنال نشان می‌دهد."),
      ],
    ],
  },
  treatment: {
    pages: [[
      seed("best-overall-response", "Best Overall Response", "بهترین پاسخ ثبت‌شده بیمار به درمان را نشان می‌دهد؛ مانند Complete Response، Partial Response یا Progressive Disease."),
      seed("therapeutic-agents", "Therapeutic Agents", "دارو یا عامل درمانی دریافت‌شده توسط بیمار را مشخص می‌کند و برای انتخاب Caseهای دریافت‌کننده درمان خاص کاربرد دارد."),
      seed("treatment-intent", "Treatment Intent Type", "هدف درمان را مشخص می‌کند؛ مانند adjuvant، neoadjuvant، palliative یا curative."),
      seed("treatment-outcome", "Treatment Outcome", "نتیجه ثبت‌شده درمان را نشان می‌دهد؛ برای مثال پاسخ، بیماری پایدار، پیشرفت یا توقف درمان."),
      seed("treatment-type", "Treatment Type", "نوع مداخله درمانی را مشخص می‌کند؛ مانند chemotherapy، radiation، surgery، immunotherapy یا targeted therapy."),
    ]],
  },
  exposure: {
    pages: [[
      seed("alcohol-history", "Alcohol History", "وجود یا عدم وجود سابقه مصرف الکل را در اطلاعات بالینی بیمار مشخص می‌کند."),
      seed("alcohol-intensity", "Alcohol Intensity", "شدت یا الگوی مصرف الکل را برای Caseهای دارای این اطلاعات نشان می‌دهد."),
      seed("tobacco-status", "Tobacco Smoking Status", "وضعیت مصرف دخانیات را مشخص می‌کند؛ مانند current، former یا never smoker."),
      seed("cigarettes-per-day", "Cigarettes Per Day", "تعداد تقریبی سیگار مصرف‌شده در روز را به‌صورت بازه‌ای فیلتر می‌کند."),
      seed("pack-years", "Pack Years Smoked", "میزان تجمعی مواجهه با سیگار را بر اساس pack-years برای محدود کردن Cohort مشخص می‌کند."),
      seed("smoking-onset-year", "Tobacco Smoking Onset Year", "سال شروع مصرف دخانیات را در Caseهای دارای این اطلاعات مشخص می‌کند."),
    ]],
  },
  "other-clinical": {
    pages: [[
      seed("bmi", "Bmi", "شاخص توده بدنی بیمار را به‌صورت بازه‌ای فیلتر می‌کند."),
      seed("weight", "Weight", "وزن ثبت‌شده بیمار را برای انتخاب Caseها در یک بازه مشخص استفاده می‌کند."),
      seed("height", "Height", "قد ثبت‌شده بیمار را برای محدودسازی Cohort بر اساس بازه قد به‌کار می‌برد."),
      seed("risk-factors", "Risk Factors", "عوامل خطر بالینی گزارش‌شده برای بیمار را نشان می‌دهد."),
      seed("menopause-status", "Menopause Status", "وضعیت یائسگی را در بیمارانی که این داده برایشان ثبت شده مشخص می‌کند."),
      seed("comorbidities", "Comorbidities", "بیماری‌ها یا شرایط همراه ثبت‌شده در کنار سرطان اصلی را مشخص می‌کند."),
      seed("pregnancy-outcome", "Pregnancy Outcome", "نتیجه بارداری ثبت‌شده را در Caseهای دارای اطلاعات مرتبط نشان می‌دهد."),
      seed("number-of-pregnancies", "Number of Pregnancies", "تعداد بارداری‌های ثبت‌شده را برای Caseهای دارای این متغیر مشخص می‌کند."),
    ]],
  },
  biospecimen: {
    pages: [[
      seed("tissue-type", "Tissue Type", "نوع بافت نمونه را مشخص می‌کند؛ مانند Tumor، Normal یا Peritumoral. این فیلتر وجود چنین نمونه‌ای را در Case تضمین می‌کند."),
      seed("biospecimen-anatomic-site", "Biospecimen Anatomic Site", "محل آناتومیکی برداشت نمونه زیستی را مشخص می‌کند."),
      seed("specimen-type", "Specimen Type", "نوع specimen ثبت‌شده برای نمونه را مشخص می‌کند و برای انتخاب Caseهای دارای نمونه مناسب کاربرد دارد."),
      seed("preservation-method", "Preservation Method", "روش نگهداری یا preservation نمونه را مشخص می‌کند؛ برای مثال frozen یا FFPE در صورت وجود."),
      seed("tumor-descriptor", "Tumor Descriptor", "رابطه نمونه با وضعیت تومور را مشخص می‌کند؛ مانند primary، recurrent یا metastatic."),
      seed("analyte-type", "Analyte Type", "نوع ماده استخراج‌شده از نمونه را مشخص می‌کند؛ مانند DNA، RNA یا سایر analyteها."),
    ]],
  },
  "genomic-filters": {
    pages: [[
      seed("mutated-gene", "Mutated Gene", "Caseها را بر اساس وجود جهش در یک یا چند ژن مشخص محدود می‌کند؛ می‌توانید ژن‌های موردنظر را وارد یا بارگذاری کنید."),
      seed("somatic-mutation", "Somatic Mutation", "Caseها را بر اساس جهش سوماتیک مشخص، مانند یک variant یا mutation شناخته‌شده، محدود می‌کند."),
    ]],
  },
  "available-data": {
    pages: [[
      seed("data-category", "Data Category", "دسته کلی داده‌های موجود برای Case را مشخص می‌کند؛ مانند Clinical، Biospecimen یا Transcriptome Profiling."),
      seed("data-type", "Data Type", "نوع دقیق‌تر داده یا فایل موجود برای Case را مشخص می‌کند."),
      seed("experimental-strategy", "Experimental Strategy", "روش آزمایش یا تولید داده را مشخص می‌کند؛ مانند RNA-Seq، WXS، WGS یا Methylation Array."),
      seed("workflow-type", "Workflow Type", "workflow پردازشی استفاده‌شده برای تولید فایل‌های مشتق‌شده را مشخص می‌کند."),
      seed("data-format", "Data Format", "فرمت فایل‌های موجود برای Case را مشخص می‌کند؛ مانند BAM، VCF، TSV یا JSON."),
      seed("platform", "Platform", "پلتفرم آزمایشگاهی یا دستگاه مورد استفاده برای تولید داده را مشخص می‌کند."),
      seed("access", "Access", "سطح دسترسی فایل‌ها را مشخص می‌کند؛ برای مثال Open یا Controlled."),
    ]],
  },
  "custom-filters": {
    pages: [[
      seed("add-custom-filter", "Add a Custom Filter", "برای افزودن هر ویژگی GDC که در دسته‌های پیش‌فرض نمایش داده نشده استفاده می‌شود؛ property را جست‌وجو کنید و آن را به Custom Filters اضافه کنید."),
    ]],
  },
};

const COLUMN_X = [16.7, 37.8, 58.8, 79.4];
const ROW_Y = [31.4, 55.2, 78.8];

function toField(item: FieldSeed, index: number): GdcCohortFieldGuideField {
  const column = index % 4;
  const row = Math.floor(index / 4);
  const x = COLUMN_X[column] ?? COLUMN_X[0];
  const y = ROW_Y[row] ?? 88;

  return {
    key: item.key,
    label: item.label,
    description: item.description,
    x,
    y,
    width: 18.5,
    height: 5.2,
    panelX: Math.max(0, x - 0.8),
    panelY: Math.max(0, y - 2),
    panelWidth: 19.7,
    panelHeight: 22,
  };
}

export function seedGdcCohortFieldGuideTabs(
  tabs: GdcCohortFieldGuideTab[],
  previousVersion: number,
) {
  if (previousVersion >= GDC_COHORT_FIELD_CATALOG_VERSION) return tabs;

  return tabs.map((tab) => {
    const tabSeed = CATALOG[tab.key];
    if (!tabSeed) return tab;

    return {
      ...tab,
      pages: tab.pages.map((page, pageIndex) => {
        if (page.fields.length > 0 || !page.imageUrl.trim()) return page;
        const pageSeeds = tabSeed.pages[pageIndex] ?? [];
        if (!pageSeeds.length) return page;
        return {
          ...page,
          fields: pageSeeds.map(toField),
        };
      }),
    };
  });
}
