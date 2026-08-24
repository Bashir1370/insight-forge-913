import { HotspotEditor } from "./HotspotEditor";

const demoHotspots = [
  { id: "5", title: "Search", x: 82, y: 16, width: 16, height: 6 },
  { id: "6", title: "Portal Summary", x: 5, y: 78, width: 42, height: 15 },
  { id: "7", title: "Primary Site Distribution", x: 72, y: 22, width: 25, height: 58 },
];

export function ResourceTourAdminPanel() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-950">مدیریت Tour منابع</h2>
        <p className="mt-2 text-sm text-slate-600">
          تنظیم موقعیت و اندازه Hotspot ها بدون تغییر فایل کد.
        </p>
      </div>
      <HotspotEditor initialHotspots={demoHotspots} />
    </section>
  );
}
