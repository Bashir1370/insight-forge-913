import { useState } from "react";

type VisualContentItem = {
  key: string;
  label: string;
  value: string;
};

export function VisualContentEditor({
  items,
  onSave,
}: {
  items: VisualContentItem[];
  onSave: (items: VisualContentItem[]) => void;
}) {
  const [values, setValues] = useState(items);

  return (
    <section className="rounded-3xl border bg-white p-5">
      <h3 className="text-lg font-black">ویرایش محتوای صفحه</h3>
      <p className="mt-2 text-sm text-slate-500">تغییر متن‌ها بدون ویرایش کد</p>

      <div className="mt-5 space-y-4">
        {values.map((item, index) => (
          <label key={item.key} className="block">
            <span className="text-sm font-bold">{item.label}</span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-xl border p-3"
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
        className="mt-5 rounded-xl bg-teal-700 px-5 py-2 font-bold text-white"
        onClick={() => onSave(values)}
      >
        ذخیره محتوا
      </button>
    </section>
  );
}
