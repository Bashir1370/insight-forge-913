import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/gdc-demo")({
  component: GdcDemoPage,
});

function GdcDemoPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
          Data Portal
        </span>
        <h1 className="mt-5 text-4xl font-black">GDC / TCGA</h1>
        <p className="mt-4 leading-8 text-slate-600">
          نسخه دمو کارت آموزشی Genomic Data Commons برای پروژه‌های TCGA.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-100 p-4 font-bold">Cancer Genomics</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-bold">TCGA Projects</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-bold">RNA-seq Workflow</div>
        </div>
        <Link
          to="/resources/gdc"
          className="mt-8 inline-flex rounded-xl bg-teal-700 px-5 py-3 font-bold text-white"
        >
          ورود به آموزش GDC
        </Link>
      </section>
    </main>
  );
}
