import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Code2,
  Download,
  FlaskConical,
  Loader2,
  Play,
  RefreshCw,
  ServerOff,
  TerminalSquare,
} from "lucide-react";

const WEBR_VERSION = "0.6.0";
const WEBR_MODULE_URL = `https://webr.r-wasm.org/v${WEBR_VERSION}/webr.mjs`;
const SNAPSHOT_ID = "HG-RNA-SEQ-POC-v1";

const setupCode = `# HubGene RNA-seq browser PoC
# Snapshot: ${SNAPSHOT_ID}
# توجه: این داده فقط برای آزمون فنی موتور R داخل مرورگر ساخته شده است و داده TCGA نیست.

genes <- c(
  "TP53", "MKI67", "PCNA", "CCNB1", "CDK1", "MCM2", "MCM5", "EPCAM", "KRT19", "AFP",
  "ALB", "APOA1", "CYP3A4", "CPS1", "G6PC", "HNF4A", "CXCL9", "CXCL10", "CD274", "STAT1"
)

sample_ids <- paste0("HG", sprintf("%02d", 1:12))
condition <- factor(c(rep("reference", 6), rep("tumor", 6)), levels = c("reference", "tumor"))

counts <- matrix(c(
  281,243,220,185,150,228,201,128,180,99,1174,955,723,607,471,469,107,103,51,122,
  295,224,222,192,148,175,205,121,154,86,1163,899,718,598,519,434,104,107,56,105,
  324,233,226,175,152,220,222,122,152,72,1229,868,683,561,515,458,80,106,58,120,
  275,265,211,178,167,204,193,146,141,82,1165,872,729,590,448,445,96,104,64,121,
  290,225,215,158,148,204,165,154,147,84,1160,874,642,618,474,439,85,103,57,93,
  286,218,222,198,162,196,180,139,152,77,1230,914,723,587,487,442,92,109,53,124,
  670,562,474,402,328,405,421,304,373,190,420,259,272,233,171,127,221,290,159,336,
  682,548,517,406,364,456,392,334,346,194,416,296,234,220,179,153,247,285,166,341,
  702,549,508,446,339,436,403,311,339,184,434,310,222,214,160,170,284,281,193,327,
  654,529,490,425,343,444,411,331,352,183,441,311,243,221,158,147,234,269,174,360,
  599,525,431,398,358,441,407,309,402,159,418,313,249,209,183,152,269,244,179,309,
  652,595,520,393,392,478,426,309,353,167,416,316,254,226,165,138,248,262,177,351
), nrow = length(genes), byrow = FALSE,
   dimnames = list(genes, sample_ids))

metadata <- data.frame(
  sample_id = sample_ids,
  condition = condition,
  row.names = sample_ids
)

stopifnot(identical(colnames(counts), rownames(metadata)))
`;

type Step = {
  id: string;
  title: string;
  why: string;
  code: string;
  expected: string;
};

const steps: Step[] = [
  {
    id: "inspect",
    title: "۱. ساختار داده را ببین",
    why: "قبل از هر مدل آماری باید بدانیم ماتریس شمارش و فراداده دقیقاً چه ابعادی دارند و گروه‌ها چگونه توزیع شده‌اند.",
    code: `dim(counts)\nhead(metadata)\ntable(metadata$condition)`,
    expected: "باید یک ماتریس ۲۰ ژن × ۱۲ نمونه و دو گروه ۶ نمونه‌ای ببینید.",
  },
  {
    id: "library-size",
    title: "۲. اندازه کتابخانه را بررسی کن",
    why: "جمع شمارش‌های هر نمونه یک سیگنال اولیه برای مقایسه مقیاس نمونه‌هاست؛ این مقدار به‌تنهایی حکم کیفیت نمونه را صادر نمی‌کند.",
    code: `library_size <- colSums(counts)\nround(library_size)`,
    expected: "برای هر ۱۲ نمونه یک مقدار عددی نمایش داده می‌شود.",
  },
  {
    id: "transform",
    title: "۳. یک تبدیل اکتشافی بساز",
    why: "برای نمایش فاصله کلی نمونه‌ها در این PoC از log2(count + 1) استفاده می‌کنیم. در پروژه نهایی TCGA برای تحلیل واقعی از روش‌های مناسب‌تر و مدل شمارش استفاده خواهیم کرد.",
    code: `log_counts <- log2(counts + 1)\nround(log_counts[1:5, 1:4], 2)`,
    expected: "باید بخشی از ماتریس تبدیل‌شده را با مقادیر اعشاری ببینید.",
  },
  {
    id: "pca",
    title: "۴. PCA را واقعاً در R اجرا کن",
    why: "این مرحله ثابت می‌کند محاسبه فقط یک انیمیشن نیست؛ R داخل مرورگر روی ماتریس موجود در حافظه PCA را محاسبه می‌کند.",
    code: `pca <- prcomp(t(log_counts), scale. = TRUE)\npca_scores <- data.frame(sample = rownames(pca$x), condition = metadata$condition, pca$x[, 1:2])\nround(pca_scores[, c("PC1", "PC2")], 3)`,
    expected: "برای هر نمونه مختصات PC1 و PC2 محاسبه می‌شود.",
  },
  {
    id: "reproducibility",
    title: "۵. اثر انگشت محیط را ثبت کن",
    why: "یک تحلیل قابل بازتولید باید نسخه R و محیط اجرای خود را ثبت کند.",
    code: `R.version.string\nSys.info()[c("sysname", "machine")]`,
    expected: `نسخه R مربوط به webR ${WEBR_VERSION} و مشخصات محیط WebAssembly نمایش داده می‌شود.`,
  },
];

type RuntimeStatus = "idle" | "loading" | "ready" | "error";
type PackageStatus = "idle" | "checking" | "ready" | "unavailable";

type StepResult = {
  output: string;
  error: boolean;
};

export function BrowserRnaSeqPoc() {
  const webRRef = useRef<any>(null);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus>("idle");
  const [runtimeMessage, setRuntimeMessage] = useState(
    "موتور R هنوز راه‌اندازی نشده است.",
  );
  const [editableCode, setEditableCode] = useState<Record<string, string>>(() =>
    Object.fromEntries(steps.map((step) => [step.id, step.code])),
  );
  const [results, setResults] = useState<Record<string, StepResult>>({});
  const [runningStep, setRunningStep] = useState<string | null>(null);
  const [executedSteps, setExecutedSteps] = useState<string[]>([]);
  const [packageStatus, setPackageStatus] = useState<PackageStatus>("idle");
  const [packageMessage, setPackageMessage] = useState(
    "هنوز سازگاری DESeq2 در این مرورگر بررسی نشده است.",
  );

  const completedCount = executedSteps.length;
  const completeScript = useMemo(() => {
    const body = steps
      .filter((step) => executedSteps.includes(step.id))
      .map((step) => `\n# ${step.title}\n${editableCode[step.id] ?? step.code}\n`)
      .join("\n");

    return `${setupCode}\n${body}\n# ثبت محیط\nsessionInfo()\n`;
  }, [editableCode, executedSteps]);

  async function initializeRuntime() {
    if (runtimeStatus === "ready" && webRRef.current) return;

    setRuntimeStatus("loading");
    setRuntimeMessage(`در حال بارگذاری webR ${WEBR_VERSION} و آماده‌سازی R داخل مرورگر…`);

    try {
      const module = (await import(
        /* @vite-ignore */ WEBR_MODULE_URL
      )) as any;
      const webR = new module.WebR({
        channelType: module.ChannelType.PostMessage,
      });
      await webR.init();
      await webR.evalRVoid(setupCode);
      webRRef.current = webR;
      const rVersion = await webR.evalRString("R.version.string");
      setRuntimeStatus("ready");
      setRuntimeMessage(`${rVersion} آماده است. Snapshot فنی ${SNAPSHOT_ID} در حافظه R بارگذاری شد.`);
    } catch (error) {
      console.error(error);
      setRuntimeStatus("error");
      setRuntimeMessage(
        error instanceof Error
          ? `راه‌اندازی R ناموفق بود: ${error.message}`
          : "راه‌اندازی R داخل مرورگر ناموفق بود.",
      );
    }
  }

  async function runStep(step: Step) {
    if (!webRRef.current || runtimeStatus !== "ready") {
      await initializeRuntime();
    }

    const webR = webRRef.current;
    if (!webR) return;

    setRunningStep(step.id);
    try {
      const shelter = await new webR.Shelter();
      try {
        const capture = await shelter.captureR(
          editableCode[step.id] ?? step.code,
          { withAutoprint: true },
        );
        const output = capture.output
          .map((item: any) =>
            typeof item.data === "string"
              ? item.data
              : `[${String(item.type)}]`,
          )
          .join("\n");
        setResults((current) => ({
          ...current,
          [step.id]: {
            output: output || "کد بدون خروجی متنی اجرا شد.",
            error: false,
          },
        }));
        setExecutedSteps((current) =>
          current.includes(step.id) ? current : [...current, step.id],
        );
      } finally {
        await shelter.purge();
      }
    } catch (error) {
      console.error(error);
      setResults((current) => ({
        ...current,
        [step.id]: {
          output:
            error instanceof Error
              ? error.message
              : "R هنگام اجرای این سلول خطا برگرداند.",
          error: true,
        },
      }));
    } finally {
      setRunningStep(null);
    }
  }

  async function testDeseq2() {
    if (!webRRef.current || runtimeStatus !== "ready") {
      await initializeRuntime();
    }
    const webR = webRRef.current;
    if (!webR) return;

    setPackageStatus("checking");
    setPackageMessage(
      "در حال بررسی مخزن باینری WebAssembly. این آزمون ممکن است برای دانلود وابستگی‌های package چند دقیقه زمان ببرد…",
    );

    try {
      let available = await webR.evalRBoolean(
        'requireNamespace("DESeq2", quietly = TRUE)',
      );
      if (!available) {
        await webR.installPackages(["DESeq2"]);
        available = await webR.evalRBoolean(
          'requireNamespace("DESeq2", quietly = TRUE)',
        );
      }

      if (available) {
        const version = await webR.evalRString(
          'as.character(packageVersion("DESeq2"))',
        );
        setPackageStatus("ready");
        setPackageMessage(
          `DESeq2 نسخه ${version} در این محیط WebAssembly قابل بارگذاری است. می‌توانیم فاز بعدی PoC را روی مدل شمارش واقعی بسازیم.`,
        );
      } else {
        setPackageStatus("unavailable");
        setPackageMessage(
          "مخزن WebAssembly در این اجرا DESeq2 را آماده نکرد. برای فاز بعد باید bundle سازگار را خودمان build/self-host کنیم یا مسیر تحلیلی جایگزین طراحی کنیم.",
        );
      }
    } catch (error) {
      console.error(error);
      setPackageStatus("unavailable");
      setPackageMessage(
        error instanceof Error
          ? `آزمون DESeq2 ناموفق بود: ${error.message}`
          : "آزمون DESeq2 ناموفق بود. این نتیجه فقط درباره سازگاری WebAssembly است، نه خود DESeq2 در R معمولی.",
      );
    }
  }

  function resetSession() {
    webRRef.current?.close?.();
    webRRef.current = null;
    setRuntimeStatus("idle");
    setRuntimeMessage("موتور R هنوز راه‌اندازی نشده است.");
    setResults({});
    setExecutedSteps([]);
    setPackageStatus("idle");
    setPackageMessage("هنوز سازگاری DESeq2 در این مرورگر بررسی نشده است.");
    setEditableCode(Object.fromEntries(steps.map((step) => [step.id, step.code])));
  }

  function downloadScript() {
    const blob = new Blob([completeScript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "HubGene_RNAseq_browser_PoC.R";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-l from-violet-50 via-white to-teal-50 p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black text-violet-700">
              <FlaskConical className="size-4" />
              PoC فنی آزمایشگاه RNA-seq با R
            </div>
            <h1 className="mt-4 max-w-4xl text-2xl font-black leading-10 text-slate-950 sm:text-4xl sm:leading-[1.5]">
              آیا می‌توانیم R را بدون سرور محاسباتی داخل مرورگر اجرا کنیم؟
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600 sm:text-base">
              این صفحه یک آزمون مهندسی واقعی است: webR داخل مرورگر شما راه‌اندازی می‌شود، یک Snapshot کوچک در حافظه R قرار می‌گیرد و کدهای R واقعاً روی دستگاه شما اجرا می‌شوند. این Snapshot فعلاً داده TCGA نیست؛ هدف این مرحله اثبات موتور اجرا، حفظ state، خروجی R، قابلیت بازتولید و سازگاری DESeq2 است.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black text-teal-700">موتور محاسباتی</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">R روی دستگاه پژوهشگر</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  سرور هاب‌ژن این محاسبات را اجرا نمی‌کند. هر مرورگر یک session مستقل R خواهد داشت.
                </p>
              </div>
              <StatusBadge status={runtimeStatus} />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-left font-mono text-xs leading-6 text-emerald-300" dir="ltr">
              {runtimeMessage}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={runtimeStatus === "loading"}
                onClick={() => void initializeRuntime()}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white disabled:opacity-50"
              >
                {runtimeStatus === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {runtimeStatus === "ready" ? "R آماده است" : "راه‌اندازی R"}
              </button>
              <button
                type="button"
                onClick={resetSession}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"
              >
                <RefreshCw className="size-4" /> شروع دوباره
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
            <div className="flex items-center gap-3">
              <ServerOff className="size-5 text-teal-300" />
              <p className="font-black">چیزی که این PoC باید ثابت کند</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-7 text-slate-300">
              <p>✓ R بدون R Server اجرا شود.</p>
              <p>✓ متغیرها بین سلول‌های آموزشی در همان session باقی بمانند.</p>
              <p>✓ خروجی واقعی R در صفحه دیده شود.</p>
              <p>✓ کدهای اجراشده در پایان به یک اسکریپت R تبدیل شوند.</p>
              <p>✓ سازگاری DESeq2 جداگانه و بدون فرض قبلی آزمایش شود.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-1 size-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-black text-amber-950">مرز علمی این نسخه</p>
              <p className="mt-2 text-sm leading-8 text-amber-950/80">
                اعداد این Snapshot برای تست فنی ساخته شده‌اند و نباید به‌عنوان نتیجه زیستی یا TCGA تفسیر شوند. وقتی موتور تأیید شد، همین رابط با Snapshot واقعی و نسخه‌بندی‌شده TCGA-LIHC جایگزین می‌شود.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black text-violet-700">دفترچه اجرای R</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">سلول‌ها را یکی‌یکی اجرا کن</h2>
            </div>
            <p className="text-xs font-bold text-slate-500">
              {completedCount.toLocaleString("fa-IR")} از {steps.length.toLocaleString("fa-IR")} سلول اجرا شده
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            {steps.map((step) => (
              <CodeCell
                key={step.id}
                step={step}
                code={editableCode[step.id] ?? step.code}
                result={results[step.id]}
                running={runningStep === step.id}
                ready={runtimeStatus === "ready"}
                completed={executedSteps.includes(step.id)}
                onCodeChange={(value) =>
                  setEditableCode((current) => ({ ...current, [step.id]: value }))
                }
                onRun={() => void runStep(step)}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-violet-200 bg-violet-50/70 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Code2 className="size-5 text-violet-700" />
              <div>
                <p className="text-xs font-black text-violet-700">آزمون تصمیم‌ساز</p>
                <h2 className="mt-1 font-black text-violet-950">آیا DESeq2 در WebAssembly آماده است؟</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-8 text-violet-950/80">
              این دکمه ابتدا بررسی می‌کند DESeq2 از قبل موجود است یا نه؛ در صورت نیاز تلاش می‌کند نسخه باینری سازگار را از مخزن رسمی webR نصب کند. نتیجه این تست تعیین می‌کند فاز بعد را مستقیم با DESeq2 بسازیم یا package bundle اختصاصی آماده کنیم.
            </p>
            <button
              type="button"
              disabled={packageStatus === "checking"}
              onClick={() => void testDeseq2()}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-black text-white disabled:opacity-50"
            >
              {packageStatus === "checking" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FlaskConical className="size-4" />
              )}
              بررسی DESeq2
            </button>
            <div className="mt-4 rounded-2xl border border-violet-200 bg-white p-4 text-sm leading-7 text-slate-700">
              {packageMessage}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Download className="size-5 text-emerald-700" />
              <div>
                <p className="text-xs font-black text-emerald-700">قابل بازتولید از روز اول</p>
                <h2 className="mt-1 font-black text-emerald-950">اسکریپت همان کدهایی که اجرا کردی</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-8 text-emerald-950/80">
              هر سلولی که اجرا می‌کنی وارد اسکریپت نهایی می‌شود. در پروژه واقعی، همین سازوکار فایل R کامل تحلیل TCGA را به پژوهشگر تحویل خواهد داد.
            </p>
            <button
              type="button"
              disabled={executedSteps.length === 0}
              onClick={downloadScript}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="size-4" /> دانلود اسکریپت R
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function CodeCell({
  step,
  code,
  result,
  running,
  ready,
  completed,
  onCodeChange,
  onRun,
}: {
  step: Step;
  code: string;
  result: StepResult | undefined;
  running: boolean;
  ready: boolean;
  completed: boolean;
  onCodeChange: (value: string) => void;
  onRun: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TerminalSquare className="size-4 text-teal-700" />
              <h3 className="font-black text-slate-950">{step.title}</h3>
            </div>
            <p className="mt-2 max-w-4xl text-sm leading-8 text-slate-600">{step.why}</p>
          </div>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <CheckCircle2 className="size-3.5" /> اجرا شد
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="border-b border-slate-200 bg-slate-950 p-4 lg:border-b-0 lg:border-l">
          <textarea
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            spellCheck={false}
            dir="ltr"
            className="min-h-48 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-4 text-left font-mono text-xs leading-6 text-slate-100 outline-none focus:border-teal-400"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] leading-5 text-slate-400">می‌توانی کد را قبل از اجرا تغییر بدهی.</p>
            <button
              type="button"
              disabled={running}
              onClick={onRun}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-teal-500 px-4 text-xs font-black text-slate-950 disabled:opacity-50"
            >
              {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              {ready ? "اجرا در R" : "راه‌اندازی و اجرا"}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs font-black text-slate-500">خروجی R</p>
          <pre
            className={[
              "mt-3 min-h-40 overflow-x-auto whitespace-pre-wrap rounded-2xl border p-4 text-left font-mono text-xs leading-6",
              result?.error
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-slate-200 bg-slate-50 text-slate-800",
            ].join(" ")}
            dir="ltr"
          >
            {result?.output ?? "بعد از اجرای سلول، خروجی واقعی R اینجا نمایش داده می‌شود."}
          </pre>
          <div className="mt-3 rounded-xl bg-sky-50 px-3 py-2 text-xs leading-6 text-sky-900">
            انتظار آموزشی: {step.expected}
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: RuntimeStatus }) {
  const label =
    status === "ready"
      ? "R آماده"
      : status === "loading"
        ? "در حال بارگذاری"
        : status === "error"
          ? "خطا"
          : "خاموش";

  const classes =
    status === "ready"
      ? "bg-emerald-50 text-emerald-700"
      : status === "loading"
        ? "bg-sky-50 text-sky-700"
        : status === "error"
          ? "bg-rose-50 text-rose-700"
          : "bg-slate-100 text-slate-500";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${classes}`}>
      {label}
    </span>
  );
}
