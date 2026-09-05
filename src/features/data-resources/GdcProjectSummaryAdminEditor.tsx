import { Save, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Hotspot = {
  key: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function GdcProjectSummaryAdminEditor({
  title,
  intro,
  hotspots = [],
  onSave,
}: {
  title: string;
  intro: string;
  hotspots?: Hotspot[];
  onSave: (value: { title: string; intro: string; hotspots: Hotspot[] }) => void | Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftIntro, setDraftIntro] = useState(intro);
  const [draftHotspots, setDraftHotspots] = useState<Hotspot[]>(hotspots);

  function updateHotspot(index: number, field: keyof Hotspot, value: string | number) {
    setDraftHotspots((items) => items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  function addHotspot() {
    setDraftHotspots((items) => [
      ...items,
      { key: `hotspot-${Date.now()}`, title: "Hotspot جدید", x: 50, y: 50, width: 10, height: 10 },
    ]);
  }

  async function save() {
    setSaving(true);
    try {
      await onSave({ title: draftTitle, intro: draftIntro, hotspots: draftHotspots });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50/30 p-4" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">مرحله Project Summary</h3>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
          <Save className="h-4 w-4" />
          {saving ? "ذخیره..." : "ذخیره"}
        </button>
      </div>

      <input className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
      <textarea className="mt-3 min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3" value={draftIntro} onChange={(e) => setDraftIntro(e.target.value)} />

      <div className="mt-5 flex items-center justify-between">
        <h4 className="font-bold">Hotspot ها</h4>
        <button type="button" onClick={addHotspot} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white"><Plus className="h-3 w-3" /> افزودن</button>
      </div>

      <div className="mt-3 space-y-3">
        {draftHotspots.map((spot, index) => (
          <div key={spot.key} className="grid grid-cols-2 gap-2 rounded-xl border bg-white p-3 text-xs md:grid-cols-6">
            <input value={spot.title} onChange={(e)=>updateHotspot(index,"title",e.target.value)} className="rounded border p-2 md:col-span-2" />
            {(["x","y","width","height"] as const).map((field)=>(
              <input key={field} type="number" value={spot[field]} onChange={(e)=>updateHotspot(index,field,Number(e.target.value))} className="rounded border p-2" />
            ))}
            <button type="button" onClick={()=>setDraftHotspots((items)=>items.filter((_,i)=>i!==index))} className="rounded border text-red-600"><Trash2 className="mx-auto h-4 w-4"/></button>
          </div>
        ))}
      </div>
    </section>
  );
}
