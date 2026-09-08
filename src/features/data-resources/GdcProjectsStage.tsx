import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { GdcHotspotArrow, type GdcHotspotArrowSettings } from "./GdcHotspotArrow";
import {
  DEFAULT_GDC_QUESTION_GUIDE,
  type GdcFacetConfig,
  type GdcFacetId,
  type GdcGuideHotspot,
  type GdcQuestionGuideConfig,
} from "./gdc-question-guide-config";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

type Props = {
  config: GdcQuestionGuideConfig;
  onPrevious: () => void;
  onNext: () => void;
};

type ArrowGuideHotspot = GdcGuideHotspot & GdcHotspotArrowSettings;

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
      .then((parts) => active && setSrc(`data:image/webp;base64,${parts.join("")}`))
      .catch(() => active && setSrc(""));
    return () => { active = false; };
  }, [customUrl]);

  return src;
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
    ["RNA-Seq", "88 (94.62%)"],
    ["WXS", "76 (81.72%)"],
    ["WGS", "61 (65.59%)"],
    ["miRNA-Seq", "50 (53.76%)"],
    ["Methylation Array", "46 (49.46%)"],
    ["Tissue Slide", "40 (43.01%)"],
    ["Genotyping Array", "37 (39.78%)"],
  ],
};

function FacetMock({ facet }: { facet: GdcFacetConfig }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      <div className="flex items-center justify-between bg-[#215d82] px-4 py-3 text-white">
        <b>{facet.title}</b><Search className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-[1fr_auto] border-b px-3 py-2 text-xs font-black text-[#215d82]"><span>Name</span><span>Projects</span></div>
      <div className="p-2">
        {fallbackRows[facet.id].map(([name, count]) => (
          <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-1.5 text-xs">
            <span className="flex min-w-0 items-center gap-2"><span className="h-4 w-4 shrink-0 rounded border border-slate-400" /><span className="truncate">{name}</span></span><b>{count}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function LensBody({ body }: { body: string }) {
  const lines = body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) return <p className="mt-2 text-sm leading-7 opacity-80">{body}</p>;
  return (
    <div className="mt-2 space-y-2 text-sm leading-7 opacity-80">
      {lines.map((line, index) => {
        const arrowIndex = line.indexOf("→");
        if (arrowIndex > 0) {
          const label = line.slice(0, arrowIndex).replace(/^[-*•–—]\s*/, "").trim();
          const description = line.slice(arrowIndex + 1).trim();
          return <div key={index} className="flex items-start gap-3 rounded-lg bg-white/50 px-3 py-2" dir="rtl"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" /><span className="min-w-0 flex-1 text-right">{description}</span><b dir="ltr" className="shrink-0 text-left font-bold opacity-90">{label}</b></div>;
        }
        return <div key={index} className="flex items-start gap-2" dir="rtl"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" /><span className="min-w-0 flex-1 text-right">{line.replace(/^[-*•–—]\s*/, "")}</span></div>;
      })}
    </div>
  );
}

function FacetLens({ facet, close }: { facet: GdcFacetConfig; close: () => void }) {
  const toneClass = (tone: string | undefined) => tone === "teal" ? "border-teal-100 bg-teal-50/70 text-teal-950" : tone === "sky" ? "border-sky-100 bg-sky-50/70 text-sky-950" : tone === "amber" ? "border-amber-100 bg-amber-50 text-amber-950" : "border-slate-200 bg-slate-50 text-slate-800";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" dir="rtl">
      <button aria-label="بستن" onClick={close} className="absolute inset-0" />
      <section className="relative z-10 grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-l">
          {facet.imageUrl ? <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={facet.imageUrl} alt={facet.title} className="block h-auto w-full" /></div> : <FacetMock facet={facet} />}
        </div>
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black text-teal-700">راهنمای {facet.title}</div><h2 className="mt-2 text-2xl font-black">{facet.lensTitle}</h2><p className="mt-2 text-sm font-bold text-slate-500">{facet.lensSubtitle}</p></div><button onClick={close} className="rounded-xl border p-2 text-slate-500"><X className="h-5 w-5" /></button></div>
          <div className="mt-6 space-y-4">{facet.sections.map((section, index) => <div key={index} className={`rounded-2xl border p-5 ${toneClass(section.tone)}`}><h3 className="text-sm font-black">{section.title}</h3><LensBody body={section.body} /></div>)}</div>
          <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
        </div>
      </section>
    </div>
  );
}

function arrowItem(item: GdcGuideHotspot, label?: string) {
  const hotspot = item as ArrowGuideHotspot;
  return {
    key: hotspot.key,
    label: label ?? hotspot.title,
    x: hotspot.x,
    y: hotspot.y,
    width: hotspot.width,
    height: hotspot.height,
    arrowDirection: hotspot.arrowDirection,
    arrowSize: hotspot.arrowSize,
    arrowOffsetX: hotspot.arrowOffsetX,
    arrowOffsetY: hotspot.arrowOffsetY,
  };
}

export function GdcProjectsStage({ config, onPrevious, onNext }: Props) {
  const [selectedFacet, setSelectedFacet] = useState<GdcFacetId>("primarySite");
  const [lensOpen, setLensOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const projects = config.projects;
  const src = useProjectsImage(projects.imageUrl);
  const facet = projects.facets.find((item) => item.id === selectedFacet) ?? projects.facets[0] ?? DEFAULT_GDC_QUESTION_GUIDE.projects.facets[0];
  if (!facet) throw new Error("GDC Projects stage requires at least one facet.");

  const hotspotMap = useMemo(() => new Map(projects.hotspots.map((item) => [item.key, item])), [projects.hotspots]);
  const filtersArea = hotspotMap.get("filtersArea");
  const tableArea = hotspotMap.get("projectsTable");
  const sectionLabels = [projects.orientationTitle, projects.facetIntroTitle, projects.tableReadTitle, projects.transitionTitle];

  function openFacetDetails(id: GdcFacetId) {
    setSelectedFacet(id);
    setActiveSection(1);
    setLensOpen(true);
  }

  function previousStep() {
    if (activeSection > 0) setActiveSection((value) => value - 1);
    else onPrevious();
  }

  function nextStep() {
    if (activeSection < sectionLabels.length - 1) setActiveSection((value) => value + 1);
    else onNext();
  }

  return (
    <>
      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_400px]" dir="ltr">
        <div className="xl:sticky xl:top-5 xl:self-start">
          <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]" dir="ltr">
            {src ? <img src={src} alt="صفحه Projects در GDC" className="block w-full" loading="eager" decoding="async" /> : <div className="flex aspect-[1905/847] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">در حال بارگذاری اسکرین‌شات Projects…</div>}

            {src && filtersArea ? <GdcHotspotArrow item={arrowItem(filtersArea, projects.filtersTitle)} showArrow={activeSection === 1} onClick={() => setActiveSection(1)} /> : null}
            {src && tableArea ? <GdcHotspotArrow item={arrowItem(tableArea, projects.tableTitle)} showArrow={activeSection === 2} onClick={() => setActiveSection(2)} /> : null}

            {src ? projects.facets.map((item) => {
              const hotspot = hotspotMap.get(item.id);
              if (!hotspot) return null;
              return <GdcHotspotArrow key={item.id} item={arrowItem(hotspot, item.title)} showArrow={activeSection === 1 && selectedFacet === item.id} onClick={() => openFacetDetails(item.id)} />;
            }) : null}
          </div>
        </div>

        <aside className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]" dir="rtl">
          <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">مرحله ۲ از {config.stageTitles.length}</span><span className="text-[10px] font-bold text-slate-400">صفحه Projects</span></div>
            <h2 className="mt-4 text-2xl font-black leading-9 text-slate-950">{projects.title}</h2>

            <div className="mt-5 grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
              {sectionLabels.map((label, index) => <button key={`${label}-${index}`} type="button" title={label} onClick={() => setActiveSection(index)} className={activeSection === index ? "min-w-0 rounded-lg bg-white px-2 py-2 text-[10px] font-black text-teal-700 shadow-sm" : "min-w-0 rounded-lg px-2 py-2 text-[10px] font-bold text-slate-500 transition hover:text-slate-800"}><span className="block truncate">{label}</span></button>)}
            </div>

            <div className="mt-4 min-h-[350px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              {activeSection === 0 ? <div><div className="text-xs font-black text-teal-800">{projects.orientationTitle}</div><p className="mt-3 text-sm leading-8 text-slate-700">{projects.orientationBody}</p><div className="mt-4 grid grid-cols-2 gap-3"><button type="button" onClick={() => setActiveSection(1)} className="rounded-xl border border-teal-200 bg-white p-3 text-right transition hover:border-teal-400 hover:bg-teal-50"><b className="text-xs text-teal-800">{projects.filtersTitle}</b><p className="mt-1 text-xs leading-6 text-slate-600">{projects.filtersBody}</p></button><button type="button" onClick={() => setActiveSection(2)} className="rounded-xl border border-sky-200 bg-white p-3 text-right transition hover:border-sky-400 hover:bg-sky-50"><b className="text-xs text-sky-800">{projects.tableTitle}</b><p className="mt-1 text-xs leading-6 text-slate-600">{projects.tableBody}</p></button></div></div> : null}

              {activeSection === 1 ? <div><div className="text-xs font-black text-teal-800">{projects.facetIntroTitle}</div><p className="mt-2 text-xs leading-6 text-slate-500">{projects.facetIntroBody}</p><div className="mt-3 grid gap-2">{projects.facets.map((item) => <button key={item.id} type="button" title={`برای توضیح دقیق ${item.title} کلیک کنید`} onMouseEnter={() => setSelectedFacet(item.id)} onFocus={() => setSelectedFacet(item.id)} onClick={() => openFacetDetails(item.id)} className={`group grid grid-cols-[112px_minmax(0,1fr)_68px] items-center gap-2 rounded-xl border px-3 py-2.5 text-right transition ${selectedFacet === item.id ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50"}`}><b dir="ltr" className="text-left text-xs text-slate-900">{item.title}</b><span className="text-xs leading-5 text-slate-500">{item.prompt}</span><span className="rounded-full bg-teal-700 px-2 py-1 text-center text-[9px] font-black text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">کلیک کنید</span></button>)}</div></div> : null}

              {activeSection === 2 ? <div><div className="text-xs font-black text-sky-800">{projects.tableReadTitle}</div><p className="mt-3 text-sm leading-8 text-slate-700">{projects.tableReadBody}</p><div className="mt-4 space-y-2">{projects.tableReadRows.map((row, index) => <div key={index} className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3"><b dir="ltr" className="text-left text-xs text-slate-900">{row.label}</b><span className="text-xs leading-6 text-slate-500">{row.body}</span></div>)}</div></div> : null}

              {activeSection === 3 ? <div className="flex min-h-[300px] flex-col justify-center"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="text-xs font-black text-amber-900">{projects.transitionTitle}</div><p className="mt-3 text-sm leading-8 text-amber-950/80">{projects.transitionBody}</p></div><div className="mt-4 rounded-xl border border-teal-100 bg-white px-4 py-3 text-xs leading-6 text-slate-600">حالا نقشه صفحه را می‌شناسیم؛ در مرحله بعد سؤال پژوهشی را به فیلترهای واقعی GDC تبدیل می‌کنیم.</div></div> : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2"><button type="button" onClick={previousStep} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600"><ChevronRight className="h-4 w-4" />{activeSection === 0 ? "مرحله قبل" : "قبلی"}</button><div className="text-[10px] font-black text-slate-400">{activeSection + 1} / {sectionLabels.length}</div><button type="button" onClick={nextStep} className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800">{activeSection === sectionLabels.length - 1 ? "مرحله بعد" : "بعدی"}<ChevronLeft className="h-4 w-4" /></button></div>
          </div>
        </aside>
      </div>

      {lensOpen ? <FacetLens facet={facet} close={() => setLensOpen(false)} /> : null}
    </>
  );
}
