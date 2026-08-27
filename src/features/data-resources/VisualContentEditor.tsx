import { useEffect, useState } from "react";

import type { EditableResourceContent } from "./resource-tour-model";

export function VisualContentEditor({
  items,
  onSave,
}: {
  items: EditableResourceContent[];
  onSave: (items: EditableResourceContent[]) => void | Promise<void>;
}) {
  const [values, setValues] = useState(items);

  useEffect(() => {
    setValues(items);
  }, [items]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-black text-slate-950">ویرایش محتوای صفحه</h3>
      <p className="mt-2 text-sm text-slate-500">تغییر عنوان و توضیحات بدون ویرایش کد</p>

      <div className="mt-5 space-y-4">
        {values.map((item, index) => (
          <label key={item.key} className="block">
            <span className="text-sm font-bold text-slate-700">{item.label}</span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-teal-500"
              value={item.value}
              onChange={(event) => {
                const next = [...values];
                next[index] = { ...item, value: event.target.value };
                setValues(next);
              }}
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 rounded-xl bg-teal-700 px-5 py-2 font-bold text-white transition hover:bg-teal-800"
        onClick={() => onSave(values)}
      >
        ذخیره محتوا
      </button>
    </section>
  );
}
