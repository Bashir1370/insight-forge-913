import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical, ServerOff } from "lucide-react";

import {
  getLearningDomain,
  getSpecialistTrack,
} from "@/features/learning/learning-catalog";
import { SpecialistTrackHome } from "@/features/learning/components/SpecialistTrackHome";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq",
)({
  component: BulkRnaSeqTrackPage,
});

function BulkRnaSeqTrackPage() {
  const domain = getLearningDomain("transcriptomics");
  const track = getSpecialistTrack(
    "transcriptomics",
    "bulk-rna-seq",
  );

  if (!domain || !track) {
    return null;
  }

  return (
    <>
      <SpecialistTrackHome domain={domain} track={track} />

      <section className="bg-slate-50 px-4 pb-14 sm:px-6 lg:px-8" dir="rtl">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-violet-200 bg-gradient-to-l from-violet-50 via-white to-teal-50 p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-black text-violet-700">
                <FlaskConical className="size-4" />
                آزمایشگاه نسل بعدی RNA-seq
              </div>
              <h2 className="mt-3 text-xl font-black leading-9 text-slate-950 sm:text-2xl">
                PoC اجرای R واقعی داخل مرورگر، بدون سرور محاسباتی
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
                قبل از ساخت پروژه‌های واقعی TCGA، موتور فنی را آزمایش می‌کنیم: R روی دستگاه خود پژوهشگر اجرا می‌شود، state بین سلول‌ها باقی می‌ماند، خروجی واقعی می‌گیریم و در پایان اسکریپت R قابل بازتولید ساخته می‌شود.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                <ServerOff className="size-4 text-teal-700" />
                محاسبه روی دستگاه کاربر؛ نه روی سرور هاب‌ژن
              </div>
            </div>

            <Link
              to="/learn/transcriptomics/rna-seq/browser-r-poc"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              ورود به PoC
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
