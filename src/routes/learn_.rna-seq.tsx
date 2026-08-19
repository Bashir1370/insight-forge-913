import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/learn_/rna-seq")({
  component: LegacyRnaSeqRedirect,
});

function LegacyRnaSeqRedirect() {
  const target = "/learn/transcriptomics/rna-seq";

  useEffect(() => {
    window.location.replace(target);
  }, []);

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-right text-slate-900"
    >
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-teal-700">
          مسیر RNA-seq منتقل شده است
        </p>
        <h1 className="mt-3 text-2xl font-black text-slate-950">
          در حال ورود به ساختار جدید آموزش
        </h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          مسیر تخصصی RNA-seq اکنون در خانه ترنسکریپتومیکس قرار دارد.
        </p>
        <a
          href={target}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
        >
          ورود به مسیر RNA-seq
        </a>
      </div>
    </main>
  );
}
