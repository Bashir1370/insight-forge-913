import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FolderKanban,
  Search,
  Target,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { GdcQuestionDrivenGuideV3 as PreviousGuide } from "./GdcQuestionDrivenGuideV3";
import { GdcStudyDesignStage } from "./GdcStudyDesignStage";
import {
  DEFAULT_GDC_QUESTION_GUIDE,
  type GdcFacetConfig,
  type GdcFacetId,
  type GdcGuideHotspot,
  type GdcQuestionGuideConfig,
  type GdcQuestionId,
} from "./gdc-question-guide-config";

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";
const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

const questionIcons = {
  discover: FolderKanban,
  cohort: Users,
  files: Download,
  analysis: BarChart3,
  search: Search,
} as const;

type Props = {
  imageUrl?: string | null;
  managedHotspots?: unknown[];
  pageTitle?: string | null;
  pageDescription?: string | null;
  guideConfig: GdcQuestionGuideConfig;
};

type BridgeTarget = {
  questionId: GdcQuestionId;
  stageIndex?: number;
} | null;

function useProjectsImage(customUrl: string) {
  const [src, setSrc] = useState(customUrl);
  useEffect(() => {
    if (customUrl) {
      setSrc(customUrl);
      return;
    }
    let active = true;
    Promise.all(PROJECT_PARTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      return response.text();
    }))
      .then((parts) => {
        if (active) setSrc(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => {
        if (active) setSrc("");
      });
    return () => {
      active = false;
    };
  }, [customUrl]);
  return src;
}

function hotspotStyle(item: GdcGuideHotspot) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };
}

function StoryPanel({ config, onContinue }: { config: GdcQuestionGuideConfig; onContinue: () => void }) {
  const intro = config.intro;
  return (
    <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="text-xs font-black text-teal-700">مرحله ۱ از {config.stageTitles.length}</div>
      <h2 className="mt-2 text-2xl font-black">{intro.title}</h2>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs font-black text-slate-500">{intro.issueLabel}</div>
          <p className="mt-2 text-sm leading-7 text-slate-700">{intro.issueBody}</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{intro.entryBody}</p>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
          <div className="text-xs font-black text-teal-800">{intro.projectTitle}</div>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">{intro.projectBody}</p>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">{intro.projectCaveat}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-black text-slate-600">{intro.architectureTitle}</div>
          <p className="mt-2 text-sm leading-7 text-slate-700">{intro.architectureIntro}</p>
          <div className="mt-3 grid gap-2 text-center text-[11px] font-black sm:grid-cols-4" dir="ltr">
            {intro.architectureCards.map((card, index) => (
              <div
                key={`${card.title}-${index}`}
                className={index === 1 ? "rounded-xl border border-teal-200 bg-teal-50 px-2 py-3 text-teal-900" : "rounded-xl bg-slate-100 px-2 py-3"}
              >
                {card.title}<br />
                <span className={index === 1 ? "font-medium text-teal-700" : "font-medium text-slate-500"}>{card.subtitle}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-500">{intro.architectureSummary}</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="text-xs font-black text-amber-900">{intro.missionTitle}</div>
          <p className="mt-2 text-sm leading-7 text-amber-950/80">{intro.missionBody}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button disabled className="rounded-xl border px-4 py-3 text-sm font-bold opacity-40">
          <ChevronRight className="inline h-4 w-4" /> قبلی
        </button>
        <button onClick={onContinue} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white">
          {intro.nextButton} <ChevronLeft className="inline h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

const fallbackRows: Record<GdcFacetId, Array<[string, string]>> = {
  primarySite: [],
  program: [],
  diseaseType: [
    ["adenomas and adenocarcinomas", "51 (54.84%)"],
    ["epithelial neoplasms, nos", "30 (32.26%)"],
    ["squamous cell neoplasms", "29 (31.18%)"],
    ["cystic, mucinous and serous neoplasms", "22 (23.66%)"],
    ["ductal and lobular neoplasms", "21 (22.58%)"],
  ],
  dataCategory: [
    ["sequencing reads", "92 (98.92%)"],
    ["structural variation", "88 (94.62%)"],
    ["transcriptome profiling", "88 (94.62%)"],
    ["simple nucleotide variation", "86 (92.47%)"],
    ["clinical", "75 (80.65%)"],
    ["biospecimen", "71 (76.34%)"],
  ],
  experimentalStrategy: [
    ["RNA-Seq", "88 (94.62%)"], ["WXS", "76 (81.72%)"], ["WGS", "61 (65.59%)"],
    ["miRNA-Seq", "50 (53.76%)"], ["Methylation Array", "46 (49.46%)"],
    ["Tissue Slide", "40 (43.01%)"], ["Genotyping Array", "37 (39.78%)"],
  ],
};

function FacetMock({ facet }: { facet: GdcFacetConfig }) {
  const rows = fallbackRows[facet.id];
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      <div className="flex items-center justify-between bg-[#215d82] px-4 py-3 text-white"><b>{facet.title}</b><Search className="h-4 w-4" /></div>
      <div className="grid grid-cols-[1fr_auto] border-b px-3 py-2 text-xs font-black text-[#215d82]"><span>Name</span><span>Projects</span></div>
      <div className="p-2">
        {rows.map(([name, count]) => (
          <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-1.5 text-xs">
            <span className="flex min-w-0 items-center gap-2"><span className="h-4 w-4 shrink-0 rounded border border-slate-400" /><span className="truncate">{name}</span></span><b>{count}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function LensBody({ body }: { body: string }) {
  const lines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <p className="mt-2 text-sm leading-7 opacity-80">{body}</p>;
  }

  return (
    <div className="mt-2 space-y-2 text-sm leading-7 opacity-80">
      {lines.map((line, index) => {
        const bulletMatch = line.match(/^(?:[-*•–—]\s*)?(.*)$/);
        const text = bulletMatch?.[1]?.trim() ?? line;
        const arrowIndex = text.indexOf("→");

        if (arrowIndex > 0) {
          const label = text.slice(0, arrowIndex).trim();
          const description = text.slice(arrowIndex + 1).trim();
          return (
            <div key={`${line}-${index}`} className="flex items-start gap-3 rounded-lg bg-white/50 px-3 py-2" dir="rtl">
              <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" aria-hidden="true" />
              <span className="min-w-0 flex-1 text-right">{description}</span>
              <b dir="ltr" className="shrink-0 text-left font-bold opacity-90">{label}</b>
            </div>
          );
        }

        return (
          <div key={`${line}-${index}`} className="flex items-start gap-2" dir="rtl">
            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-right">{text}</span>
          </div>
        );
      })}
    </div>
  );
}

function FacetLens({ facet, close }: { facet: GdcFacetConfig; close: () => void }) {
  const toneClass = (tone: string | undefined) => {
    if (tone === "teal") return "border-teal-100 bg-teal-50/70 text-teal-950";
    if (tone === "sky") return "border-sky-100 bg-sky-50/70 text-sky-950";
    if (tone === "amber") return "border-amber-100 bg-amber-50 text-amber-950";
    return "border-slate-200 bg-slate-50 text-slate-800";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" dir="rtl">
      <button aria-label="بستن" onClick={close} className="absolute inset-0" />
      <section className="relative z-10 grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-l">
          {facet.imageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img src={facet.imageUrl} alt={facet.title} className="block h-auto w-full" />
            </div>
          ) : <FacetMock facet={facet} />}
        </div>
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black text-teal-700">راهنمای {facet.title}</div>
              <h2 className="mt-2 text-2xl font-black">{facet.lensTitle}</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">{facet.lensSubtitle}</p>
            </div>
            <button onClick={close} className="rounded-xl border p-2 text-slate-500"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-6 space-y-4">
            {facet.sections.map((section, index) => (
              <div key={index} className={`rounded-2xl border p-5 ${toneClass(section.tone)}`}>
                <h3 className="text-sm font-black">{section.title}</h3>
                <LensBody body={section.body} />
              </div>
            ))}
          </div>
          <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
        </div>
      </section>
    </div>
  );
}

function ProjectsStage({
  config,
  selectedFacet,
  onSelectFacet,
  onOpenFacet,
  onPrevious,
  onNext,
}: {
  config: GdcQuestionGuideConfig;
  selectedFacet: GdcFacetId;
  onSelectFacet: (id: GdcFacetId) => void;
  onOpenFacet: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const projects = config.projects;
  const src = useProjectsImage(projects.imageUrl);
  const facet = projects.facets.find((item) => item.id === selectedFacet) ?? projects.facets[0];
  const hotspotMap = useMemo(() => new Map(projects.hotspots.map((item) => [item.key, item])), [projects.hotspots]);
  const filtersArea = hotspotMap.get("filtersArea");
  const tableArea = hotspotMap.get("projectsTable");

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
          {src ? <img src={src} alt="صفحه Projects در GDC" className="block w-full" /> : <div className="flex aspect-[1905/847] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">در حال بارگذاری اسکرین‌شات Projects…</div>}
          {src && filtersArea ? <div className="pointer-events-none absolute rounded-lg border-2 border-dashed border-teal-300/80" style={hotspotStyle(filtersArea)} /> : null}
          {src && tableArea ? <div className="pointer-events-none absolute rounded-lg border-2 border-dashed border-slate-300/80" style={hotspotStyle(tableArea)} /> : null}
          {src && filtersArea ? <div className="pointer-events-none absolute rounded-full bg-teal-700 px-3 py-1.5 text-[10px] font-black text-white shadow" style={{ left: `${filtersArea.x + 1}%`, top: `${filtersArea.y}%` }}>{projects.filtersOverlayLabel}</div> : null}
          {src && tableArea ? <div className="pointer-events-none absolute rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-black text-white shadow" style={{ left: `${tableArea.x + 1}%`, top: `${tableArea.y}%` }}>{projects.tableOverlayLabel}</div> : null}
          {src ? projects.facets.map((item) => {
            const hotspot = hotspotMap.get(item.id);
            if (!hotspot) return null;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`نمایش ${item.title}`}
                onClick={() => onSelectFacet(item.id)}
                className={`absolute rounded-md border-[3px] transition ${selectedFacet === item.id ? "border-teal-400 bg-teal-300/15 shadow-[0_0_0_999px_rgba(15,23,42,.08)]" : "border-transparent bg-transparent hover:border-sky-300 hover:bg-sky-200/10"}`}
                style={hotspotStyle(hotspot)}
              />
            );
          }) : null}
        </div>
      </div>

      <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="text-xs font-black text-teal-700">مرحله ۲ از {config.stageTitles.length}</div>
        <h2 className="mt-2 text-2xl font-black">{projects.title}</h2>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="text-xs font-black text-slate-500">{projects.orientationTitle}</div>
          <p className="mt-2 text-sm leading-7 text-slate-700">{projects.orientationBody}</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3"><b className="text-xs text-teal-800">{projects.filtersTitle}</b><p className="mt-1 text-xs leading-6 text-teal-950/75">{projects.filtersBody}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-3"><b className="text-xs text-slate-700">{projects.tableTitle}</b><p className="mt-1 text-xs leading-6 text-slate-600">{projects.tableBody}</p></div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 p-3">
          <div className="px-1 text-xs font-black text-slate-700">{projects.facetIntroTitle}</div>
          <p className="mt-2 px-1 text-xs leading-6 text-slate-500">{projects.facetIntroBody}</p>
          <div className="mt-3 space-y-2">
            {projects.facets.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFacet(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-right transition ${selectedFacet === item.id ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <div className="grid min-h-[58px] grid-cols-[132px_minmax(0,1fr)] items-center gap-4" dir="rtl">
                  <b dir="ltr" className="w-full text-left text-sm leading-5 text-slate-950">{item.title}</b>
                  <span className="w-full text-right text-xs leading-6 text-slate-500">{item.prompt}</span>
                </div>
              </button>
            ))}
          </div>
          <button onClick={onOpenFacet} className="mt-3 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-black text-teal-800">{facet.title} را در همین صفحه باز کن</button>
        </div>

        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
          <div className="text-xs font-black text-sky-800">{projects.tableReadTitle}</div>
          <p className="mt-2 text-xs leading-6 text-sky-950/75">{projects.tableReadBody}</p>
          <div className="mt-3 space-y-2">
            {projects.tableReadRows.map((row, index) => <div key={index} className="rounded-xl bg-white px-3 py-2"><b dir="ltr" className="text-xs">{row.label}</b><span className="mr-2 text-xs text-slate-500">{row.body}</span></div>)}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="text-xs font-black text-amber-900">{projects.transitionTitle}</div>
          <p className="mt-2 text-xs leading-6 text-amber-950/75">{projects.transitionBody}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold"><ChevronRight className="inline h-4 w-4" /> قبلی</button>
          <button onClick={onNext} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white">بعدی <ChevronLeft className="inline h-4 w-4" /></button>
        </div>
      </aside>
    </div>
  );
}

function PreviousGuideBridge({ target }: { target: NonNullable<BridgeTarget> }) {
  useEffect(() => {
    const defaultQuestion = DEFAULT_GDC_QUESTION_GUIDE.questions.find((item) => item.id === target.questionId);
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const buttons = Array.from(document.querySelectorAll("button"));
      if (defaultQuestion) {
        buttons.find((button) => button.textContent?.includes(defaultQuestion.title))?.click();
      }
      if (typeof target.stageIndex === "number") {
        const prefix = `${target.stageIndex + 1}.`;
        const stageButton = buttons.find((button) => button.textContent?.trim().startsWith(prefix));
        if (stageButton) {
          stageButton.click();
          window.clearInterval(timer);
        }
      } else if (defaultQuestion && buttons.some((button) => button.textContent?.includes(defaultQuestion.title))) {
        window.clearInterval(timer);
      }
      if (attempts > 20) window.clearInterval(timer);
    }, 60);
    return () => window.clearInterval(timer);
  }, [target]);
  return null;
}

export function GdcQuestionDrivenGuideV5({ imageUrl, managedHotspots, pageTitle, pageDescription, guideConfig }: Props) {
  const [stage, setStage] = useState(0);
  const [selectedFacet, setSelectedFacet] = useState<GdcFacetId>("primarySite");
  const [lensOpen, setLensOpen] = useState(false);
  const [bridgeTarget, setBridgeTarget] = useState<BridgeTarget>(null);

  const selectedFacetConfig = guideConfig.projects.facets.find((item) => item.id === selectedFacet) ?? guideConfig.projects.facets[0];

  if (bridgeTarget) {
    return (
      <>
        <PreviousGuideBridge target={bridgeTarget} />
        <PreviousGuide imageUrl={imageUrl} managedHotspots={managedHotspots} pageTitle={pageTitle} pageDescription={pageDescription} />
      </>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <a href="/resources" className="text-sm font-bold text-slate-500">بازگشت به منابع داده</a>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">آموزش سؤال‌محور GDC</span>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">{pageTitle || "آموزش پرتال GDC"}</h1>
              <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">{pageDescription}</p>
            </div>
            <a href="https://portal.gdc.cancer.gov/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">GDC واقعی <ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-teal-700"><Target className="h-4 w-4" />برای چه کاری وارد GDC شده‌اید؟</div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {guideConfig.questions.map((question) => {
              const Icon = questionIcons[question.id];
              return (
                <button
                  key={question.id}
                  onClick={() => question.id === "discover" ? setStage(0) : setBridgeTarget({ questionId: question.id })}
                  className={`rounded-2xl border p-4 text-right ${question.id === "discover" ? "border-teal-300 bg-teal-50" : "border-slate-200"}`}
                >
                  <Icon className="h-5 w-5 text-teal-700" />
                  <div className="mt-3 text-sm font-black leading-6">{question.title}</div>
                  <div className="mt-2 text-xs leading-5 text-slate-500">{question.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {guideConfig.stageTitles.map((title, index) => (
            <button
              key={`${title}-${index}`}
              onClick={() => index <= 2 ? setStage(index) : setBridgeTarget({ questionId: "discover", stageIndex: index })}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${stage === index ? "bg-teal-700 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}
            >
              {index + 1}. {title}
            </button>
          ))}
        </div>

        {stage === 0 ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
            <div className="xl:sticky xl:top-5 xl:self-start">
              <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
                <img src={imageUrl || DEFAULT_IMAGE} alt="صفحه اصلی GDC" className="w-full" />
                <div className="pointer-events-none absolute left-[12.6%] top-[8.8%] h-[7%] w-[9%] rounded-lg border-[3px] border-teal-400 bg-teal-300/20 shadow-[0_0_0_999px_rgba(15,23,42,.18)]" />
              </div>
            </div>
            <StoryPanel config={guideConfig} onContinue={() => setStage(1)} />
          </div>
        ) : stage === 1 ? (
          <ProjectsStage
            config={guideConfig}
            selectedFacet={selectedFacet}
            onSelectFacet={setSelectedFacet}
            onOpenFacet={() => setLensOpen(true)}
            onPrevious={() => setStage(0)}
            onNext={() => setStage(2)}
          />
        ) : (
          <GdcStudyDesignStage
            title={guideConfig.stageTitles[2] ?? "طراحی مطالعه و اعمال فیلترها"}
            stageNumber={3}
            stageTotal={guideConfig.stageTitles.length}
            onPrevious={() => setStage(1)}
            onNext={() => setBridgeTarget({ questionId: "discover", stageIndex: 3 })}
          />
        )}
      </section>

      {lensOpen && selectedFacetConfig ? <FacetLens facet={selectedFacetConfig} close={() => setLensOpen(false)} /> : null}
    </main>
  );
}
