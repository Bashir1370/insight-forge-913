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
} from "lucide-react";
import { useEffect, useState } from "react";

import { GdcQuestionDrivenGuideV3 as PreviousGuide } from "./GdcQuestionDrivenGuideV3";

type Props = {
  imageUrl?: string | null;
  managedHotspots?: unknown[];
  pageTitle?: string | null;
  pageDescription?: string | null;
};

type QuestionId = "discover" | "cohort" | "files" | "analysis" | "search";

type BridgeTarget = {
  questionId: QuestionId;
  stageIndex?: number;
} | null;

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";

const questions = [
  ["discover", "چه داده‌ای برای موضوع یا سرطان موردنظر من در GDC وجود دارد؟", "پروژه مناسب را پیدا کن و ببین چه داده‌ای در آن وجود دارد.", FolderKanban],
  ["cohort", "چطور گروه بیماران یا نمونه‌های مناسب مطالعه‌ام را انتخاب کنم؟", "از معیارهای پژوهشی به Cohort مناسب برس.", Users],
  ["files", "چطور فایل و نوع داده مناسب برای تحلیل را پیدا و دریافت کنم؟", "از Cohort به فایل درست و روش دریافت داده برس.", Download],
  ["analysis", "روی داده‌های گروه مطالعاتی من چه تحلیل‌هایی می‌توانم انجام دهم؟", "ابزار را بر اساس سؤال پژوهشی انتخاب کن.", BarChart3],
  ["search", "چطور یک ژن، جهش، پروژه یا شناسه مشخص را سریع پیدا کنم؟", "وقتی دقیقاً می‌دانی دنبال چه چیزی هستی.", Search],
] as const;

const stageTitles = [
  "اول محدوده داده‌ها را پیدا کنیم",
  "Projects را بخوان",
  "Program و Project",
  "پروژه مرتبط را محدود کن",
  "نوع داده را بررسی کن",
  "تصمیم بعدی",
] as const;

function StoryPanel({ onContinue }: { onContinue: () => void }) {
  return (
    <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="text-xs font-black text-teal-700">مرحله ۱ از ۶</div>
      <h2 className="mt-2 text-2xl font-black">اول محدوده داده‌ها را پیدا کنیم</h2>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs font-black text-slate-500">از یک مسئله واقعی شروع کنیم</div>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            فرض کنید موضوع پژوهش ما <b>سرطان پستان</b> است. قبل از انتخاب بیمار، دانلود فایل یا تحلیل، اول باید روشن کنیم:
            <b> آیا GDC اصلاً داده مناسبی برای این موضوع دارد؟</b>
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            برای پاسخ به این سؤال، اولین توقف ما بخش <b dir="ltr">Projects</b> است.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
          <div className="text-xs font-black text-teal-800">Project در GDC یعنی چه؟</div>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">
            <b dir="ltr">Project</b> یک واحد پژوهشی مشخص در GDC است؛ جایی که موارد مطالعه و داده‌های مرتبط با یک تلاش پژوهشی زیر یک ساختار مشترک سازمان‌دهی می‌شوند.
          </p>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">
            Project را با یک نوع سرطان یکی نگیرید. بعضی Projectها روی یک سرطان مشخص متمرکزند، اما بسته به طراحی مطالعه، یک Project می‌تواند <b>چند سرطان را هم شامل شود</b>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-black text-slate-500">جای Project در نقشه GDC</div>
          <div className="mt-3 grid gap-2 text-center text-[11px] font-black sm:grid-cols-4" dir="ltr">
            <div className="rounded-xl bg-slate-100 px-2 py-3">Program<br /><span className="font-medium text-slate-500">چتر پژوهشی بزرگ‌تر</span></div>
            <div className="rounded-xl border border-teal-200 bg-teal-50 px-2 py-3 text-teal-900">Project<br /><span className="font-medium text-teal-700">واحد مشخص مطالعه</span></div>
            <div className="rounded-xl bg-slate-100 px-2 py-3">Cases<br /><span className="font-medium text-slate-500">موارد پژوهشی</span></div>
            <div className="rounded-xl bg-slate-100 px-2 py-3">Data / Files<br /><span className="font-medium text-slate-500">داده‌ها و فایل‌ها</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
          <div className="text-xs font-black text-sky-800">یک اصطلاح برای ادامه مسیر</div>
          <p className="mt-2 text-sm leading-7 text-sky-950/80">
            بعدتر از میان Caseهای مناسب یک <b dir="ltr">Cohort</b> می‌سازیم؛ یعنی مجموعه Caseهایی که قرار است گروه مطالعه ما را تشکیل دهند. فعلاً هنوز در آن مرحله نیستیم.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="text-xs font-black text-amber-900">مأموریت فعلی</div>
          <p className="mt-2 text-sm leading-7 text-amber-950/80">
            فعلاً فقط می‌خواهیم وارد Projects شویم و بفهمیم <b>چه مطالعاتی و چه داده‌هایی برای سؤال پژوهشی ما وجود دارد</b>.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button disabled className="rounded-xl border px-4 py-3 text-sm font-bold opacity-40">
          <ChevronRight className="inline h-4 w-4" /> قبلی
        </button>
        <button onClick={onContinue} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white">
          برویم داخل Projects <ChevronLeft className="inline h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

function LegacyBridge({ target, onBackToIntro }: { target: BridgeTarget; onBackToIntro: () => void }) {
  useEffect(() => {
    if (!target) return;

    const questionTitle = questions.find(([id]) => id === target.questionId)?.[1];
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const buttons = Array.from(document.querySelectorAll("button"));

      if (questionTitle) {
        const questionButton = buttons.find((button) => button.textContent?.includes(questionTitle));
        questionButton?.click();
      }

      if (typeof target.stageIndex === "number") {
        const label = `${target.stageIndex + 1}. ${target.stageIndex === 0 ? "از کجا شروع کنم؟" : stageTitles[target.stageIndex]}`;
        const stageButton = buttons.find((button) => button.textContent?.trim().includes(label));
        if (stageButton) {
          stageButton.click();
          window.clearInterval(timer);
        }
      } else if (questionTitle && buttons.some((button) => button.textContent?.includes(questionTitle))) {
        window.clearInterval(timer);
      }

      if (attempts > 20) window.clearInterval(timer);
    }, 60);

    return () => window.clearInterval(timer);
  }, [target]);

  useEffect(() => {
    const normalizeFirstStep = () => {
      for (const button of Array.from(document.querySelectorAll("button"))) {
        const text = button.textContent?.trim() || "";
        if (text.startsWith("1. از کجا شروع کنم؟")) {
          button.textContent = "1. اول محدوده داده‌ها را پیدا کنیم";
        }
      }
    };

    normalizeFirstStep();
    const observer = new MutationObserver(normalizeFirstStep);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const captureFirstStep = (event: Event) => {
      const element = event.target instanceof Element ? event.target.closest("button") : null;
      const text = element?.textContent?.trim() || "";
      if (text.startsWith("1. اول محدوده داده‌ها را پیدا کنیم") || text.startsWith("1. از کجا شروع کنم؟")) {
        event.preventDefault();
        event.stopPropagation();
        onBackToIntro();
      }
    };
    document.addEventListener("click", captureFirstStep, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", captureFirstStep, true);
    };
  }, [onBackToIntro]);

  return null;
}

export function GdcQuestionDrivenGuideV4({ imageUrl, managedHotspots, pageTitle, pageDescription }: Props) {
  const [bridgeTarget, setBridgeTarget] = useState<BridgeTarget>(null);

  if (bridgeTarget) {
    return (
      <>
        <LegacyBridge target={bridgeTarget} onBackToIntro={() => setBridgeTarget(null)} />
        <PreviousGuide
          imageUrl={imageUrl}
          managedHotspots={managedHotspots}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        />
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
            <a href="https://portal.gdc.cancer.gov/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
              GDC واقعی <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-teal-700"><Target className="h-4 w-4" />برای چه کاری وارد GDC شده‌اید؟</div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {questions.map(([id, title, short, Icon]) => (
              <button
                key={id}
                onClick={() => id === "discover" ? setBridgeTarget(null) : setBridgeTarget({ questionId: id })}
                className={`rounded-2xl border p-4 text-right ${id === "discover" ? "border-teal-300 bg-teal-50" : "border-slate-200"}`}
              >
                <Icon className="h-5 w-5 text-teal-700" />
                <div className="mt-3 text-sm font-black leading-6">{title}</div>
                <div className="mt-2 text-xs leading-5 text-slate-500">{short}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {stageTitles.map((title, index) => (
            <button
              key={title}
              onClick={() => index === 0 ? setBridgeTarget(null) : setBridgeTarget({ questionId: "discover", stageIndex: index })}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${index === 0 ? "bg-teal-700 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}
            >
              {index + 1}. {title}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
          <div className="xl:sticky xl:top-5 xl:self-start">
            <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
              <img src={imageUrl || DEFAULT_IMAGE} alt="صفحه اصلی GDC" className="w-full" />
              <div className="pointer-events-none absolute left-[12.6%] top-[8.8%] h-[7%] w-[9%] rounded-lg border-[3px] border-teal-400 bg-teal-300/20 shadow-[0_0_0_999px_rgba(15,23,42,.18)]" />
            </div>
          </div>
          <StoryPanel onContinue={() => setBridgeTarget({ questionId: "discover", stageIndex: 1 })} />
        </div>
      </section>
    </main>
  );
}
