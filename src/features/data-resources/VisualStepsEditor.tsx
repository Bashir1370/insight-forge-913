type Step = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  steps: Step[];
  onSave: (steps: Step[]) => void;
};

export function VisualStepsEditor({ steps, onSave }: Props) {
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h3 className="font-bold">ویرایش Guided Tour Steps</h3>
      <div className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <input
            key={step.id}
            className="w-full rounded-lg border p-2"
            value={step.title}
            onChange={(e) => {
              const next = steps.map((item, i) =>
                i === index ? { ...item, title: e.target.value } : item
              );
              onSave(next);
            }}
          />
        ))}
      </div>
    </section>
  );
}
