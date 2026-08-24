import { Link } from "@tanstack/react-router";

export function ResourceCatalog() {
  return (
    <section dir="rtl" className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Data Resources</h1>
        <p className="mt-2 text-slate-300">Explore biomedical data portals through guided learning.</p>

        <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">GDC / TCGA</h2>
          <p className="mt-3 text-slate-300">
            Learn how to navigate Genomic Data Commons and understand TCGA datasets.
          </p>
          <Link
            to="/resources/gdc"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-3 font-bold"
          >
            ورود به آموزش GDC / TCGA
          </Link>
        </div>
      </div>
    </section>
  );
}
