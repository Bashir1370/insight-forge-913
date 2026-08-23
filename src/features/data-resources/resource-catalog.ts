export type ResourceType =
  | "data-portal"
  | "repository"
  | "archive"
  | "browser"
  | "knowledgebase"
  | "database";

export type ResourceStatus = "active" | "planned";

export type OmicsDomain =
  | "transcriptomics"
  | "genomics"
  | "epigenomics"
  | "proteomics"
  | "metabolomics"
  | "cross-omics";

export interface ResourceRelation {
  label: string;
  href: string;
}

export interface PortalHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PortalScreen {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt: string;
  hotspots: PortalHotspot[];
}

export interface GuidedPortalStep {
  id: string;
  screenId: string;
  hotspotId: string;
  title: string;
  summary: string;
  whyItMatters: string;
  commonMistake?: string;
  nextAction?: string;
}

export interface GuidedTask {
  id: string;
  title: string;
  description: string;
  outcome: string;
  steps: string[];
}

export interface DataResource {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  organization: string;
  resourceType: ResourceType;
  status: ResourceStatus;
  domains: OmicsDomain[];
  modalities: string[];
  topics: string[];
  description: string;
  bestFor: string[];
  externalUrl: string;
  relatedLearning: ResourceRelation[];
  screens?: PortalScreen[];
  guidedSteps?: GuidedPortalStep[];
  guidedTasks?: GuidedTask[];
}

export const resourceTypeLabels: Record<ResourceType, string> = {
  "data-portal": "پورتال داده",
  repository: "مخزن داده",
  archive: "آرشیو",
  browser: "مرورگر داده",
  knowledgebase: "دانش‌پایه",
  database: "پایگاه داده",
};

export const domainLabels: Record<OmicsDomain, string> = {
  transcriptomics: "ترنسکریپتومیکس",
  genomics: "ژنومیکس",
  epigenomics: "اپی‌ژنومیکس",
  proteomics: "پروتئومیکس",
  metabolomics: "متابولومیکس",
  "cross-omics": "چندحوزه‌ای",
};

const gdcHomeHotspots: PortalHotspot[] = [
  { id: "analysis-center", label: "Analysis Center", x: 0.012, y: 0.096, width: 0.105, height: 0.055 },
  { id: "projects", label: "Projects", x: 0.127, y: 0.096, width: 0.072, height: 0.055 },
  { id: "cohort-builder", label: "Cohort Builder", x: 0.205, y: 0.096, width: 0.105, height: 0.055 },
  { id: "repository", label: "Repository", x: 0.314, y: 0.096, width: 0.087, height: 0.055 },
  { id: "search", label: "Search", x: 0.716, y: 0.096, width: 0.267, height: 0.055 },
  { id: "portal-summary", label: "Data Portal Summary", x: 0.014, y: 0.742, width: 0.486, height: 0.166 },
  { id: "primary-site-chart", label: "Cases by Major Primary Site", x: 0.69, y: 0.218, width: 0.287, height: 0.67 },
];

export const dataResources: DataResource[] = [
  {
    id: "gdc",
    slug: "gdc",
    title: "Genomic Data Commons (GDC)",
    shortTitle: "GDC / TCGA",
    organization: "National Cancer Institute (NCI)",
    resourceType: "data-portal",
    status: "active",
    domains: ["transcriptomics", "genomics", "cross-omics"],
    modalities: ["Bulk RNA-seq", "Single-cell RNA-seq", "WXS", "WGS", "Copy Number"],
    topics: ["Cancer", "TCGA", "Clinical metadata", "Public data", "Controlled data"],
    description:
      "پورتال اصلی NCI برای جست‌وجو، ساخت cohort، مرور پروژه‌ها، تحلیل و دریافت داده‌های هماهنگ‌شده سرطان؛ از جمله پروژه‌های TCGA.",
    bestFor: [
      "پیدا کردن پروژه‌های TCGA و سایر پروژه‌های سرطان",
      "ساخت cohort بر اساس ویژگی‌های بالینی و نمونه",
      "فیلتر و دریافت فایل‌های مولکولی مرتبط با cohort",
      "اتصال داده مولکولی به metadata بالینی و biospecimen",
    ],
    externalUrl: "https://portal.gdc.cancer.gov/",
    relatedLearning: [
      { label: "ترنسکریپتومیکس", href: "/learn/transcriptomics" },
      { label: "مسیر RNA-seq", href: "/learn/rna-seq" },
      { label: "پروژه RNA-seq", href: "/learn/rna-seq/project" },
    ],
    screens: [
      {
        id: "home",
        title: "صفحه اصلی GDC Data Portal",
        description:
          "نقشه اولیه رابط کاربری برای شناخت مسیرهای اصلی قبل از ورود به یک workflow واقعی.",
        imageAlt: "نمای صفحه اصلی GDC Data Portal",
        hotspots: gdcHomeHotspots,
      },
    ],
    guidedSteps: [
      {
        id: "gdc-analysis-center",
        screenId: "home",
        hotspotId: "analysis-center",
        title: "Analysis Center",
        summary:
          "مرکز دسترسی به ابزارهای اصلی و ابزارهای تحلیلی GDC برای cohort فعال است.",
        whyItMatters:
          "پس از ساخت cohort می‌توانید ابزارهای مناسب را برای مشاهده یا تحلیل همان cohort از اینجا اجرا کنید.",
        commonMistake:
          "Analysis Center را با محل دانلود فایل‌ها اشتباه نگیرید؛ دانلود فایل‌های انتخابی عمدتاً از Repository انجام می‌شود.",
        nextAction: "برای شناخت ساختار پروژه‌ها به Projects بروید.",
      },
      {
        id: "gdc-projects",
        screenId: "home",
        hotspotId: "projects",
        title: "Projects",
        summary:
          "نمای project-level برای مرور داده‌های GDC و پیدا کردن پروژه‌های موردنظر، مانند پروژه‌های TCGA.",
        whyItMatters:
          "قبل از انتخاب فایل، باید بدانید پروژه موردنظر چه بیماری، primary site و experimental strategyهایی دارد.",
        nextAction: "در سناریوی RNA-seq بعداً پروژه‌ای مثل TCGA-LIHC را از اینجا دنبال می‌کنیم.",
      },
      {
        id: "gdc-cohort-builder",
        screenId: "home",
        hotspotId: "cohort-builder",
        title: "Cohort Builder",
        summary:
          "برای محدود کردن cases بر اساس ویژگی‌های بالینی، biospecimen و سایر فیلترهای cohort استفاده می‌شود.",
        whyItMatters:
          "GDC یک workflow cohort-centric دارد؛ ابتدا گروه cases موردنظر را تعریف می‌کنید و سپس همان cohort را در بخش‌های دیگر استفاده می‌کنید.",
        commonMistake:
          "فیلترهای Cohort Builder روی cases اعمال می‌شوند؛ برای فیلتر نوع فایل باید به Repository بروید.",
      },
      {
        id: "gdc-repository",
        screenId: "home",
        hotspotId: "repository",
        title: "Repository",
        summary:
          "محل مرور و دریافت فایل‌های مرتبط با cohort فعال و فیلتر کردن file-level properties است.",
        whyItMatters:
          "برای workflowهایی مثل RNA-seq، اینجا جایی است که Data Category، Data Type و Experimental Strategy را برای رسیدن به فایل مناسب محدود می‌کنیم.",
        commonMistake:
          "case filter و file filter را با هم یکی ندانید؛ cohort را در Cohort Builder و فایل را در Repository محدود کنید.",
      },
      {
        id: "gdc-search",
        screenId: "home",
        hotspotId: "search",
        title: "Global Search",
        summary:
          "برای جست‌وجوی سریع project، gene، case و شناسه‌های مرتبط در GDC استفاده می‌شود.",
        whyItMatters:
          "وقتی شناسه یا نام مشخصی دارید، سریع‌تر از پیمایش کامل پورتال شما را به نقطه مناسب می‌رساند.",
      },
      {
        id: "gdc-summary",
        screenId: "home",
        hotspotId: "portal-summary",
        title: "Data Portal Summary",
        summary:
          "یک نمای کلی از release و ابعاد فعلی داده‌های پورتال ارائه می‌کند.",
        whyItMatters:
          "به پژوهشگر یادآوری می‌کند که GDC یک منبع versioned و در حال به‌روزرسانی است و release داده باید در گزارش پژوهش ثبت شود.",
      },
      {
        id: "gdc-primary-site",
        screenId: "home",
        hotspotId: "primary-site-chart",
        title: "Cases by Major Primary Site",
        summary:
          "نمای توزیع cases بر اساس primary site است و تصویری سریع از گستره سرطان‌های موجود در پورتال می‌دهد.",
        whyItMatters:
          "این نمودار برای orientation مناسب است؛ اما جای تعریف دقیق cohort یا انتخاب فایل را نمی‌گیرد.",
      },
    ],
    guidedTasks: [
      {
        id: "find-tcga-rnaseq",
        title: "پیدا کردن داده RNA-seq یک پروژه TCGA",
        description:
          "یک مأموریت آموزشی که پژوهشگر را از انتخاب پروژه تا رسیدن به فایل‌های Gene Expression Quantification هدایت می‌کند.",
        outcome:
          "پژوهشگر تفاوت project، cohort، case و file را می‌فهمد و می‌تواند مسیر دریافت داده را توضیح دهد.",
        steps: [
          "پروژه سرطان موردنظر را پیدا کن",
          "cohort مناسب را تعریف یا فعال کن",
          "به Repository برو",
          "Experimental Strategy را روی RNA-Seq محدود کن",
          "Data Category و Data Type مناسب را انتخاب کن",
          "فایل‌ها و metadata موردنیاز برای تحلیل downstream را بررسی کن",
        ],
      },
    ],
  },
  {
    id: "geo",
    slug: "geo",
    title: "Gene Expression Omnibus (GEO)",
    shortTitle: "GEO",
    organization: "NCBI",
    resourceType: "repository",
    status: "planned",
    domains: ["transcriptomics", "epigenomics"],
    modalities: ["Bulk RNA-seq", "Microarray", "Single-cell", "Functional genomics"],
    topics: ["Public studies", "Series", "Samples", "Processed data"],
    description:
      "یکی از مهم‌ترین مخازن عمومی داده‌های functional genomics و expression studies.",
    bestFor: ["پیدا کردن مطالعات منتشرشده", "دسترسی به metadata و processed data"],
    externalUrl: "https://www.ncbi.nlm.nih.gov/geo/",
    relatedLearning: [{ label: "ترنسکریپتومیکس", href: "/learn/transcriptomics" }],
  },
  {
    id: "sra",
    slug: "sra",
    title: "Sequence Read Archive (SRA)",
    shortTitle: "SRA",
    organization: "NCBI",
    resourceType: "archive",
    status: "planned",
    domains: ["transcriptomics", "genomics", "epigenomics", "cross-omics"],
    modalities: ["RNA-seq", "WGS", "WXS", "ChIP-seq", "ATAC-seq"],
    topics: ["Raw sequencing", "FASTQ", "Run accession"],
    description:
      "آرشیو بزرگ داده‌های خام sequencing که در بسیاری از مطالعات عمومی نقطه دسترسی به reads است.",
    bestFor: ["دریافت reads خام", "فهم accessionهای sequencing"],
    externalUrl: "https://www.ncbi.nlm.nih.gov/sra",
    relatedLearning: [{ label: "ترنسکریپتومیکس", href: "/learn/transcriptomics" }],
  },
  {
    id: "gtex",
    slug: "gtex",
    title: "Genotype-Tissue Expression (GTEx)",
    shortTitle: "GTEx",
    organization: "NIH Common Fund",
    resourceType: "data-portal",
    status: "planned",
    domains: ["transcriptomics", "genomics"],
    modalities: ["Bulk RNA-seq", "Genotype", "eQTL"],
    topics: ["Normal tissues", "Gene expression", "eQTL"],
    description:
      "منبع مرجع برای بررسی بیان ژن و regulation ژنتیکی در بافت‌های انسانی غیرسرطانی.",
    bestFor: ["مقایسه بافت‌ها", "بررسی expression در بافت سالم", "مطالعات eQTL"],
    externalUrl: "https://gtexportal.org/",
    relatedLearning: [{ label: "ترنسکریپتومیکس", href: "/learn/transcriptomics" }],
  },
  {
    id: "pride",
    slug: "pride",
    title: "PRIDE Archive",
    shortTitle: "PRIDE",
    organization: "EMBL-EBI",
    resourceType: "repository",
    status: "planned",
    domains: ["proteomics"],
    modalities: ["Mass spectrometry proteomics"],
    topics: ["Proteomics", "Mass spectrometry", "ProteomeXchange"],
    description:
      "مخزن عمومی مهم برای داده‌های mass-spectrometry proteomics و پروژه‌های ProteomeXchange.",
    bestFor: ["پیدا کردن dataset پروتئومیکس", "دریافت فایل‌ها و metadata پروژه"],
    externalUrl: "https://www.ebi.ac.uk/pride/",
    relatedLearning: [],
  },
  {
    id: "ensembl",
    slug: "ensembl",
    title: "Ensembl",
    shortTitle: "Ensembl",
    organization: "EMBL-EBI",
    resourceType: "browser",
    status: "planned",
    domains: ["genomics", "transcriptomics", "cross-omics"],
    modalities: ["Genome annotation", "Comparative genomics", "Variation"],
    topics: ["Genes", "Transcripts", "Variants", "Annotation"],
    description:
      "منبع و مرورگر ژنومی برای annotation ژن‌ها، transcriptها، variation و comparative genomics.",
    bestFor: ["شناخت annotation", "بررسی gene/transcript", "مرور variation"],
    externalUrl: "https://www.ensembl.org/",
    relatedLearning: [],
  },
  {
    id: "cbioportal",
    slug: "cbioportal",
    title: "cBioPortal for Cancer Genomics",
    shortTitle: "cBioPortal",
    organization: "cBioPortal community",
    resourceType: "data-portal",
    status: "planned",
    domains: ["genomics", "transcriptomics", "cross-omics"],
    modalities: ["Mutation", "Copy number", "Expression", "Clinical"],
    topics: ["Cancer", "Multi-omics", "Clinical exploration"],
    description:
      "پورتال اکتشافی برای مشاهده و مقایسه داده‌های مولکولی و بالینی مطالعات سرطان.",
    bestFor: ["اکتشاف سریع cancer genomics", "پیوند molecular profiles با clinical features"],
    externalUrl: "https://www.cbioportal.org/",
    relatedLearning: [],
  },
  {
    id: "uniprot",
    slug: "uniprot",
    title: "UniProt",
    shortTitle: "UniProt",
    organization: "UniProt Consortium",
    resourceType: "knowledgebase",
    status: "planned",
    domains: ["proteomics", "cross-omics"],
    modalities: ["Protein annotation"],
    topics: ["Protein", "Function", "Sequence", "Annotation"],
    description:
      "دانش‌پایه مرجع برای sequence و annotation عملکردی پروتئین‌ها.",
    bestFor: ["شناخت پروتئین", "بررسی function و annotation", "اتصال شناسه‌های پروتئینی"],
    externalUrl: "https://www.uniprot.org/",
    relatedLearning: [],
  },
];

export function getDataResource(slug: string) {
  return dataResources.find((resource) => resource.slug === slug);
}
