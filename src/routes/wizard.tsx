import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { labelFor, recommendation, wizardSteps, type WizardAnswers } from "@/lib/wizard";

export const Route = createFileRoute("/wizard")({
  head: () => ({
    meta: [
      { title: "طراح پروژه پژوهشی | هسته بیوانفورماتیک" },
      {
        name: "description",
        content:
          "در پنج گام مرحله پژوهش، حوزه، ارگانیسم، نوع داده و هدف علمی خود را مشخص کنید و خلاصه پروژه و پایپ‌لاین پیشنهادی دریافت کنید.",
      },
      { property: "og:title", content: "طراح تعاملی پروژه پژوهشی" },
      {
        property: "og:description",
        content: "پرسشنامه علمی گام‌به‌گام برای تولید استراتژی بیوانفورماتیک پروژه شما.",
      },
    ],
  }),
  component: WizardPage,
});

function WizardPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [done, setDone] = useState(false);

  const current = wizardSteps[step]!;
  const progress = ((done ? wizardSteps.length : step) / wizardSteps.length) * 100;
  const result = useMemo(() => recommendation(answers), [answers]);

  const pick = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    if (step === wizardSteps.length - 1) setDone(true);
    else setStep(step + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  return (
    <div className="surface-hero">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl text-navy md:text-4xl">طراح پروژه پژوهشی</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">
            به‌جای فرم تماس خالی، در چند گام کوتاه چارچوب علمی پروژه‌تان را می‌سازیم.
          </p>
        </div>

        <div className="mt-10 card-elevated p-6 md:p-10">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>
              گام {done ? wizardSteps.length : step + 1} از {wizardSteps.length}
            </span>
            <span>{Math.round(progress)}٪</span>
          </div>
          <Progress value={progress} className="mt-3 h-2" />

          {!done ? (
            <div key={current.key} className="mt-8 animate-rise-in">
              <h2 className="text-xl text-navy">{current.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{current.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((opt) => {
                  const selected = answers[current.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => pick(opt.value)}
                      className={`rounded-2xl border p-4 text-start transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-glow ${
                        selected ? "border-primary bg-accent" : "border-border bg-card"
                      }`}
                    >
                      <span className="block text-sm font-bold text-navy">{opt.label}</span>
                      {opt.hint && (
                        <span className="mt-1 block text-xs text-muted-foreground">{opt.hint}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  <ArrowRight className="size-4" />
                  گام قبلی
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RefreshCw className="size-4" />
                  شروع دوباره
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 animate-rise-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-6 text-primary" />
                <h2 className="text-xl text-navy">خلاصه پروژه پژوهشی شما</h2>
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["مرحله پژوهش", labelFor("stage", answers.stage)],
                  ["حوزه پژوهشی", labelFor("field", answers.field)],
                  ["ارگانیسم", labelFor("organism", answers.organism)],
                  ["نوع داده", labelFor("dataType", answers.dataType)],
                  ["هدف پژوهش", labelFor("goal", answers.goal)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-border bg-secondary/50 p-4">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm font-bold text-navy">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-2xl border border-primary/30 bg-accent/60 p-5">
                <p className="text-xs font-semibold text-accent-foreground">گام بعدی پیشنهادی</p>
                <p className="mt-1 text-base font-bold text-navy">{result.nextStep}</p>
                {result.notes.map((n) => (
                  <p key={n} className="mt-2 text-xs text-muted-foreground">
                    {n}
                  </p>
                ))}
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold text-navy">خدمات پیشنهادی</h3>
                  <ul className="mt-3 space-y-2">
                    {result.services.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm text-navy-soft"
                      >
                        <CheckCircle2 className="size-4 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                    <Workflow className="size-4 text-primary" />
                    پایپ‌لاین پیشنهادی
                  </h3>
                  <ol className="mt-3 space-y-2">
                    {result.pipeline.map((p, i) => (
                      <li key={p} className="flex items-center gap-3 text-sm text-navy-soft">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg">
                  <Link to="/consultation">
                    رزرو مشاوره با متخصص
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/dashboard">مشاهده در داشبورد</Link>
                </Button>
                <Button variant="ghost" size="lg" onClick={reset}>
                  <RefreshCw className="size-4" />
                  ساخت پروژه جدید
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
