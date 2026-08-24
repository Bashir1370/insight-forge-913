type VisualAssetEditorProps = {
  imageUrl: string;
  onSave: (imageUrl: string) => void;
};

export function VisualAssetEditor({ imageUrl, onSave }: VisualAssetEditorProps) {
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h3 className="font-bold">ویرایش تصویر Resource</h3>
      <input
        className="mt-3 w-full rounded-lg border p-2"
        value={imageUrl}
        onChange={(event) => onSave(event.target.value)}
        placeholder="Image URL"
      />
      <p className="mt-2 text-sm text-slate-500">
        آدرس تصویر از Supabase در Resource Tour ذخیره می‌شود.
      </p>
    </section>
  );
}
