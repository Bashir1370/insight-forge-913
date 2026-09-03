export const GDC_QUESTION_GUIDE_CONTENT_KEY = "gdc_question_guide_v1";

export type GdcQuestionId = "discover" | "cohort" | "files" | "analysis" | "search";
export type GdcFacetId = "primarySite" | "program" | "diseaseType" | "dataCategory" | "experimentalStrategy";

export type GdcGuideHotspot = {
  key: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GdcLensSection = {
  title: string;
  body: string;
  tone?: "neutral" | "teal" | "sky" | "amber";
};

export type GdcFacetConfig = {
  id: GdcFacetId;
  title: string;
  prompt: string;
  lensTitle: string;
  lensSubtitle: string;
  imageUrl?: string;
  sections: GdcLensSection[];
};

export type GdcQuestionGuideConfig = {
  version: 1;
  questions: Array<{ id: GdcQuestionId; title: string; subtitle: string }>;
  stageTitles: string[];
  intro: {
    title: string;
    issueLabel: string;
    issueBody: string;
    entryBody: string;
    projectTitle: string;
    projectBody: string;
    projectCaveat: string;
    architectureTitle: string;
    architectureIntro: string;
    architectureCards: Array<{ title: string; subtitle: string }>;
    architectureSummary: string;
    missionTitle: string;
    missionBody: string;
    nextButton: string;
  };
  projects: {
    imageUrl: string;
    title: string;
    orientationTitle: string;
    orientationBody: string;
    filtersTitle: string;
    filtersBody: string;
    tableTitle: string;
    tableBody: string;
    facetIntroTitle: string;
    facetIntroBody: string;
    tableReadTitle: string;
    tableReadBody: string;
    tableReadRows: Array<{ label: string; body: string }>;
    transitionTitle: string;
    transitionBody: string;
    filtersOverlayLabel: string;
    tableOverlayLabel: string;
    facets: GdcFacetConfig[];
    hotspots: GdcGuideHotspot[];
  };
};

export const DEFAULT_GDC_QUESTION_GUIDE: GdcQuestionGuideConfig = {
  version: 1,
  questions: [
    { id: "discover", title: "چه داده‌ای برای موضوع یا سرطان موردنظر من در GDC وجود دارد؟", subtitle: "پروژه مناسب را پیدا کن و ببین چه داده‌ای در آن وجود دارد." },
    { id: "cohort", title: "چطور گروه بیماران یا نمونه‌های مناسب مطالعه‌ام را انتخاب کنم؟", subtitle: "از معیارهای پژوهشی به Cohort مناسب برس." },
    { id: "files", title: "چطور فایل و نوع داده مناسب برای تحلیل را پیدا و دریافت کنم؟", subtitle: "از Cohort به فایل درست و روش دریافت داده برس." },
    { id: "analysis", title: "روی داده‌های گروه مطالعاتی من چه تحلیل‌هایی می‌توانم انجام دهم؟", subtitle: "ابزار را بر اساس سؤال پژوهشی انتخاب کن." },
    { id: "search", title: "چطور یک ژن، جهش، پروژه یا شناسه مشخص را سریع پیدا کنم؟", subtitle: "وقتی دقیقاً می‌دانی دنبال چه چیزی هستی." },
  ],
  stageTitles: [
    "اول محدوده داده‌ها را پیدا کنیم",
    "Projects را بخوان",
    "Program و Project",
    "پروژه مرتبط را محدود کن",
    "نوع داده را بررسی کن",
    "تصمیم بعدی",
  ],
  intro: {
    title: "اول محدوده داده‌ها را پیدا کنیم",
    issueLabel: "از یک مسئله واقعی شروع کنیم",
    issueBody: "فرض کنید موضوع پژوهش ما سرطان پستان است. قبل از انتخاب بیمار، دانلود فایل یا تحلیل، اول باید روشن کنیم: آیا GDC اصلاً داده مناسبی برای این موضوع دارد؟",
    entryBody: "برای پاسخ به این سؤال، اولین توقف ما بخش Projects است.",
    projectTitle: "Project در GDC یعنی چه؟",
    projectBody: "Project یک واحد پژوهشی مشخص در GDC است؛ جایی که موارد مطالعه و داده‌های مرتبط با یک تلاش پژوهشی زیر یک ساختار مشترک سازمان‌دهی می‌شوند.",
    projectCaveat: "Project را با یک نوع سرطان یکی نگیرید. بعضی Projectها روی یک سرطان مشخص متمرکزند، اما بسته به طراحی مطالعه، یک Project می‌تواند چند سرطان را هم شامل شود.",
    architectureTitle: "چند اصطلاح مهم در معماری GDC",
    architectureIntro: "بیایید قبل از ادامه، چند اصطلاح پرکاربرد در GDC را خیلی ساده بشناسیم و ببینیم Project دقیقاً کجای معماری این دیتابیس قرار می‌گیرد.",
    architectureCards: [
      { title: "Program", subtitle: "برنامه پژوهشی بزرگ‌تر" },
      { title: "Project", subtitle: "یک مطالعه مشخص" },
      { title: "Cases", subtitle: "موارد یا بیماران مطالعه" },
      { title: "Data / Files", subtitle: "داده‌ها و فایل‌های مرتبط" },
    ],
    architectureSummary: "خیلی ساده: یک Program می‌تواند چند Project داشته باشد؛ هر Project شامل Caseهای مطالعه است و داده‌ها و فایل‌ها به همین موارد پژوهشی مرتبط می‌شوند.",
    missionTitle: "مأموریت فعلی",
    missionBody: "فعلاً فقط می‌خواهیم وارد Projects شویم و بفهمیم چه مطالعاتی و چه داده‌هایی برای سؤال پژوهشی ما وجود دارد.",
    nextButton: "برویم داخل Projects",
  },
  projects: {
    imageUrl: "",
    title: "صفحه Projects را مثل یک نقشه بخوانیم",
    orientationTitle: "اول نقشه صفحه را بخوانیم",
    orientationBody: "صفحه Projects دو بخش اصلی دارد: فیلترها در سمت چپ و فهرست Projectها در سمت راست. قبل از انتخاب هر گزینه، اول نقش این دو بخش را می‌شناسیم.",
    filtersTitle: "سمت چپ",
    filtersBody: "سؤال پژوهشی را به معیارهای قابل فیلتر تبدیل می‌کنیم.",
    tableTitle: "سمت راست",
    tableBody: "بعد از هر انتخاب می‌بینیم چه Projectهایی هنوز با معیارهای ما سازگارند.",
    facetIntroTitle: "هر فیلتر جواب چه سؤالی را می‌دهد؟",
    facetIntroBody: "قرار نیست اسم همه گزینه‌ها را حفظ کنیم. روی هر مورد کلیک کنید؛ همان ناحیه روی تصویر مشخص می‌شود و می‌توانید جزئیاتش را باز کنید.",
    tableReadTitle: "جدول سمت راست را هم بخوانیم",
    tableReadBody: "هر ردیف جدول یک Project را نشان می‌دهد و ستون‌ها خلاصه‌ای از محدوده پژوهشی و داده‌های آن را در اختیار ما می‌گذارند.",
    tableReadRows: [
      { label: "Project", body: "این مطالعه چیست؟" },
      { label: "Disease Type / Primary Site / Cases", body: "چه مواردی را پوشش می‌دهد؟" },
      { label: "Experimental Strategy", body: "داده چگونه تولید شده؟" },
    ],
    transitionTitle: "حالا داستان پژوهش را ادامه بدهیم",
    transitionBody: "سؤال ما درباره سرطان پستان بود. به‌جای اینکه Projectها را یکی‌یکی بخوانیم، در قدم بعد ویژگی‌های سؤال پژوهشی را به فیلترهای GDC تبدیل می‌کنیم.",
    filtersOverlayLabel: "Filters · سؤال را محدود می‌کنیم",
    tableOverlayLabel: "Projects Table · نتیجه را می‌خوانیم",
    facets: [
      {
        id: "primarySite",
        title: "Primary Site",
        prompt: "تومور از کدام ناحیه بدن منشأ گرفته؟",
        lensTitle: "Primary Site یعنی چه؟",
        lensSubtitle: "محل آناتومیکی اولیه‌ای که تومور یا بیماری از آن منشأ گرفته است",
        imageUrl: "/images/gdc/gdc-primary-site.webp",
        sections: [
          { title: "این لیست همه سرطان‌ها نیست", body: "Primary Site نوع سرطان نیست؛ محل اولیه تومور را دسته‌بندی می‌کند. فهرست GDC قابل اسکرول است و گزینه‌های بیشتری پایین‌تر وجود دارند.", tone: "neutral" },
          { title: "عدد و درصد روبه‌روی هر مورد چیست؟", body: "ستون Projects می‌گوید چند Project از مجموعه فعلی با آن Primary Site مرتبط‌اند و درصد داخل پرانتز سهم آن‌ها از کل Projectهای فعلی است.", tone: "teal" },
          { title: "Primary Site با Disease Type یکی نیست", body: "Primary Site محل آناتومیکی اولیه را می‌گوید؛ Disease Type نوع یا طبقه‌بندی بیماری را توصیف می‌کند.", tone: "amber" },
        ],
      },
      {
        id: "program",
        title: "Program",
        prompt: "داده‌ها متعلق به کدام برنامه پژوهشی بزرگ هستند؟",
        lensTitle: "Program یعنی چه؟",
        lensSubtitle: "یک برنامه پژوهشی بزرگ که چند Project می‌تواند زیر آن قرار بگیرد",
        imageUrl: "/images/gdc/gdc-program.webp",
        sections: [
          { title: "این فهرست نام سرطان‌ها نیست", body: "Programها مجموعه‌های پژوهشی بزرگ در GDC هستند. برای نمونه TCGA، TARGET و CPTAC هر کدام یک Program هستند و می‌توانند چندین Project و چند نوع بیماری را پوشش دهند.", tone: "neutral" },
          { title: "عدد و درصد کنار Program چیست؟", body: "عدد، تعداد Projectهای مرتبط با آن Program در نتایج فعلی را نشان می‌دهد و درصد، سهم آن Projectها از کل Projectهای فعلی است.", tone: "teal" },
          { title: "+21 more یعنی چه؟", body: "یعنی Programهای بیشتری در فهرست وجود دارند و با باز کردن ادامه فهرست می‌توانید آن‌ها را ببینید.", tone: "sky" },
        ],
      },
      {
        id: "diseaseType",
        title: "Disease Type",
        prompt: "بیماری از نظر نوع یا طبقه‌بندی چگونه تعریف شده؟",
        lensTitle: "Disease Type یعنی چه؟",
        lensSubtitle: "نوع یا طبقه‌بندی پاتولوژیک بیماری در Projectها",
        sections: [
          { title: "با Primary Site فرق دارد", body: "Primary Site محل آناتومیکی اولیه را مشخص می‌کند؛ Disease Type ماهیت یا طبقه‌بندی بیماری را نشان می‌دهد. بنابراین ممکن است یک Primary Site شامل چند Disease Type باشد.", tone: "neutral" },
          { title: "عدد و درصد چه می‌گویند؟", body: "عدد، تعداد Projectهای مرتبط با آن Disease Type در مجموعه فعلی است و درصد سهم آن Projectها از کل نتایج فعلی را نشان می‌دهد.", tone: "teal" },
          { title: "+42 more", body: "یعنی Disease Typeهای بیشتری در فهرست وجود دارند و موارد نمایش‌داده‌شده فقط ابتدای لیست هستند.", tone: "sky" },
        ],
      },
      {
        id: "dataCategory",
        title: "Data Category",
        prompt: "چه دسته‌ای از داده در Project وجود دارد؟",
        lensTitle: "Data Category یعنی چه؟",
        lensSubtitle: "دسته کلی داده‌ای که در Projectها وجود دارد",
        sections: [
          { title: "این فیلتر می‌گوید چه جنس داده‌ای دارید", body: "برای مثال Clinical داده‌های بالینی، Biospecimen اطلاعات نمونه، Transcriptome Profiling داده‌های مرتبط با RNA و بیان ژن و Simple Nucleotide Variation داده‌های واریانت‌های کوچک را پوشش می‌دهد.", tone: "neutral" },
          { title: "عدد و درصد چه معنی دارد؟", body: "عدد، تعداد Projectهایی است که آن Data Category را دارند و درصد، سهم آن‌ها از کل Projectهای فعلی را نشان می‌دهد.", tone: "teal" },
          { title: "+5 more", body: "یعنی دسته‌های داده دیگری هم در ادامه فهرست وجود دارند.", tone: "sky" },
        ],
      },
      {
        id: "experimentalStrategy",
        title: "Experimental Strategy",
        prompt: "داده با چه روش آزمایشی یا توالی‌یابی تولید شده؟",
        lensTitle: "Experimental Strategy یعنی چه؟",
        lensSubtitle: "روش آزمایشی یا فناوری‌ای که برای تولید داده استفاده شده است",
        sections: [
          { title: "با Data Category اشتباه نگیرید", body: "Data Category می‌گوید چه نوع داده‌ای دارید؛ Experimental Strategy می‌گوید آن داده با چه روش یا فناوری تولید شده است، مثل RNA-Seq، WXS، WGS یا scRNA-Seq.", tone: "neutral" },
          { title: "عدد و درصد کنار روش‌ها چیست؟", body: "عدد، تعداد Projectهایی است که آن Experimental Strategy را دارند و درصد، سهم آن‌ها از کل Projectهای فعلی است. یک Project می‌تواند چند Experimental Strategy داشته باشد؛ بنابراین مجموع درصدها الزاماً 100٪ نیست.", tone: "teal" },
        ],
      },
    ],
    hotspots: [
      { key: "filtersArea", title: "Filters area", x: 0.7, y: 36, width: 20, height: 59 },
      { key: "projectsTable", title: "Projects table", x: 22, y: 39, width: 77, height: 56 },
      { key: "primarySite", title: "Primary Site", x: 1, y: 48, width: 20, height: 7 },
      { key: "program", title: "Program", x: 1, y: 55.5, width: 20, height: 7 },
      { key: "diseaseType", title: "Disease Type", x: 1, y: 63, width: 20, height: 7 },
      { key: "dataCategory", title: "Data Category", x: 1, y: 70.5, width: 20, height: 7 },
      { key: "experimentalStrategy", title: "Experimental Strategy", x: 1, y: 78, width: 20, height: 14 },
    ],
  },
};

function mergeById<T extends { id: string }>(defaults: T[], incoming: unknown): T[] {
  if (!Array.isArray(incoming)) return defaults.map((item) => ({ ...item }));
  return defaults.map((fallback) => {
    const found = incoming.find((item: any) => item?.id === fallback.id);
    return found ? ({ ...fallback, ...found } as T) : ({ ...fallback } as T);
  });
}

function mergeHotspots(defaults: GdcGuideHotspot[], incoming: unknown): GdcGuideHotspot[] {
  if (!Array.isArray(incoming)) return defaults.map((item) => ({ ...item }));
  return defaults.map((fallback) => {
    const found = incoming.find((item: any) => item?.key === fallback.key);
    return found ? { ...fallback, ...found } : { ...fallback };
  });
}

export function parseGdcQuestionGuideConfig(raw?: string | null): GdcQuestionGuideConfig {
  if (!raw) return structuredClone(DEFAULT_GDC_QUESTION_GUIDE);
  try {
    const parsed = JSON.parse(raw) as Partial<GdcQuestionGuideConfig>;
    const defaults = DEFAULT_GDC_QUESTION_GUIDE;
    const facets = mergeById(defaults.projects.facets, parsed.projects?.facets).map((facet) => {
      const incomingFacet = Array.isArray(parsed.projects?.facets)
        ? (parsed.projects?.facets as any[]).find((item) => item?.id === facet.id)
        : null;
      return {
        ...facet,
        sections: Array.isArray(incomingFacet?.sections)
          ? incomingFacet.sections.map((section: any, index: number) => ({
              ...(facet.sections[index] ?? { title: "", body: "", tone: "neutral" as const }),
              ...section,
            }))
          : facet.sections,
      };
    });

    return {
      ...defaults,
      ...parsed,
      questions: mergeById(defaults.questions, parsed.questions),
      stageTitles: Array.isArray(parsed.stageTitles) && parsed.stageTitles.length
        ? defaults.stageTitles.map((title, index) => parsed.stageTitles?.[index] ?? title)
        : [...defaults.stageTitles],
      intro: { ...defaults.intro, ...(parsed.intro ?? {}), architectureCards: Array.isArray(parsed.intro?.architectureCards) ? parsed.intro!.architectureCards! : defaults.intro.architectureCards },
      projects: {
        ...defaults.projects,
        ...(parsed.projects ?? {}),
        facets,
        hotspots: mergeHotspots(defaults.projects.hotspots, parsed.projects?.hotspots),
        tableReadRows: Array.isArray(parsed.projects?.tableReadRows) ? parsed.projects!.tableReadRows! : defaults.projects.tableReadRows,
      },
    };
  } catch {
    return structuredClone(DEFAULT_GDC_QUESTION_GUIDE);
  }
}

export function getGdcQuestionGuideConfig(content: Array<{ key?: string; value?: string }> | null | undefined) {
  const raw = content?.find((item) => item.key === GDC_QUESTION_GUIDE_CONTENT_KEY)?.value;
  return parseGdcQuestionGuideConfig(raw);
}

export function toGdcQuestionGuideContent(config: GdcQuestionGuideConfig) {
  return {
    key: GDC_QUESTION_GUIDE_CONTENT_KEY,
    label: "GDC question-driven guide configuration",
    value: JSON.stringify(config),
  };
}
