import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileBarChart,
  Lock,
  Sparkles,
  Repeat2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, projectStages } from "@/lib/content";
import { SciTerm } from "@/components/site/sci-term";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "هاب‌ژن | از پرسش پژوهشی تا بینش زیستی" },
      {
        name: "description",
        content:
          "مشاوره تخصصی بیوانفورماتیک، تحلیل پیشرفته داده‌های زیستی و خروجی‌های آماده انتشار برای پژوهشگران، اساتید و آزمایشگاه‌های علوم حیات.",
      },
      { property: "og:title", content: "هاب‌ژن | از پرسش پژوهشی تا بینش زیستی" },
      {
        property: "og:description",
        content: "طراح تعاملی پروژه پژوهشی، تحلیل RNA-seq و تک‌سلولی، و مشاوره طراحی مطالعه.",
      },
    ],
  }),
  component: Index,
});

function NetworkGraphic() {
  const nodes: Array<[number, number]> = [
    [40, 60],
    [110, 30],
    [95, 120],
    [175, 75],
    [230, 35],
    [215, 145],
    [290, 95],
    [150, 175],
    [280, 190],
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [2, 7],
    [5, 7],
    [7, 8],
    [6, 8],
  ];

  return (
    <svg viewBox="0 0 330 230" className="h-full w-full" role="img" aria-label="شبکه مولکولی انتزاعی">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a]![0]}
          y1={nodes[a]![1]}
          x2={nodes[b]![0]}
          y2={nodes[b]![1]}

          stroke="var(--primary)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          style={{ animation: `dash-flow ${6 + i * 0.4}s linear infinite` }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 9 : 6}
          fill={i % 3 === 0 ? "var(--primary)" : "var(--primary-glow)"}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}

function ExpressionHeatmap() {
  const cells = Array.from({ length: 8 * 14 }, (_, i) => (Math.sin(i * 1.7) + Math.cos(i * 0.6)) / 2);
  return (
    <div className="grid grid-cols-14 gap-[3px]" style={{ gridTemplateColumns: "repeat(14, minmax(0,1fr))" }}>
      {cells.map((v, i) => (
        <span
          key={i}
          className="aspect-square rounded-[3px]"
          style={{
            background: `color-mix(in oklab, var(--primary) ${Math.round(((v + 1) / 2) * 90 + 8)}%, white)`,
          }}
        />
      ))}
    </div>
  );
}

const trust = [
  { icon: Sparkles, title: "تخصص علمی", text: "تیم تحلیل با پیشینه پژوهشی در ژنومیکس، ترنسکریپتومیکس و زیست‌شناسی محاسباتی." },
  { icon: Repeat2, title: "پایپ‌لاین بازتولیدپذیر", text: "نسخه‌بندی ابزارها، مستندسازی پارامترها و امکان اجرای مجدد کامل تحلیل." },
  { icon: Lock, title: "محرمانگی داده", text: "دسترسی محدود، انتقال امن و امکان حذف داده پس از پایان پروژه." },
  { icon: FileBarChart, title: "خروجی آماده انتشار", text: "شکل‌های وکتور، جداول تکمیلی و بخش روش‌شناسی قابل درج در مقاله." },
  { icon: Users, title: "همکاری پژوهشی", text: "امکان مشارکت بلندمدت به‌عنوان همکار تحلیلی در طرح‌های پژوهشی." },
  { icon: BookOpen, title: "انتقال دانش", text: "جلسات توضیح نتایج و آموزش تفسیر خروجی‌ها برای تیم پژوهشی شما." },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden surface-hero">
        <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 text-xs font-semibold text-primary">
              From Research Question to Biological Insight
            </span>
            <h1 className="mt-6 text-4xl leading-[1.25] text-navy md:text-5xl md:leading-[1.2]">
              پرسش پژوهشی خود را به یک <span className="text-gradient">استراتژی بیوانفورماتیک</span> تبدیل کنید
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              مشاوره تخصصی بیوانفورماتیک، تحلیل پیشرفته داده‌های زیستی و خروجی‌های پژوهشی آماده انتشار
              برای پژوهشگران علوم حیات.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/wizard">
                  شروع پروژه پژوهشی
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/consultation">مشاوره اولیه رایگان</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                ["۱۲", "خدمت تخصصی"],
                ["۶", "مرحله پیگیری پروژه"],
                ["۱۰۰٪", "تحلیل بازتولیدپذیر"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-extrabold text-navy">{v}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-rise-in">
            <div className="card-elevated animate-float-slow p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-navy">نقشه شبکه هم‌بیانی</span>
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                  زنده
                </span>
              </div>
              <div className="mt-2 h-52">
                <NetworkGraphic />
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <span className="text-xs font-semibold text-muted-foreground">
                  ماتریس بیان (نمونه × ژن)
                </span>
                <div className="mt-3">
                  <ExpressionHeatmap />
                </div>
              </div>
            </div>
            <div className="card-elevated absolute -bottom-8 start-2 hidden w-56 p-4 sm:block">
              <p className="text-xs text-muted-foreground">ژن‌های بیان‌متفاوت</p>
              <p className="mt-1 text-2xl font-extrabold text-navy">۸۴۲</p>
              <p className="mt-1 text-[11px] text-primary">FDR &lt; 0.05</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center text-2xl text-navy md:text-3xl">مسیر پروژه شما</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-muted-foreground">
          هر پروژه از پرسش علمی آغاز می‌شود و با نتایج قابل تفسیر و آماده انتشار پایان می‌یابد.
        </p>
        <ol className="mt-12 grid gap-4 md:grid-cols-6">
          {projectStages.map((stage, i) => (
            <li key={stage} className="card-elevated card-hover p-5 text-center">
              <span className="mx-auto flex size-9 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-semibold text-navy">{stage}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Services */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl text-navy md:text-3xl">خدمات تخصصی</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                از تحلیل <SciTerm term="RNA-seq" /> و داده‌های تک‌سلولی تا کشف بیومارکر و مصورسازی علمی.
              </p>
            </div>
            <Button asChild variant="soft">
              <Link to="/services">مشاهده همه خدمات</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="card-elevated card-hover group block p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl surface-navy p-10 shadow-elegant md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl md:text-3xl">طراح تعاملی پروژه پژوهشی</h2>
              <p className="mt-4 text-sm leading-8 opacity-90">
                در پنج گام کوتاه، مرحله پژوهش، حوزه، ارگانیسم، نوع داده و هدف علمی خود را مشخص کنید تا
                خلاصه پروژه، پایپ‌لاین پیشنهادی و گام بعدی برای شما تولید شود.
              </p>
              <Button asChild variant="hero" size="xl" className="mt-8">
                <Link to="/wizard">
                  ساخت خلاصه پروژه
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </div>
            <ul className="space-y-3">
              {[
                "مرحله پژوهش و حوزه علمی",
                "ارگانیسم و مدل مطالعاتی",
                "نوع داده و پلتفرم",
                "هدف نهایی و خروجی مورد انتظار",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm">
                  <CheckCircle2 className="size-4 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <h2 className="text-center text-2xl text-navy md:text-3xl">چرا پژوهشگران با ما کار می‌کنند</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="card-elevated card-hover p-6">
              <t.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-base font-bold text-navy">{t.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ما کیفیت علمی و بازتولیدپذیری تحلیل را تضمین می‌کنیم؛ پذیرش یا انتشار مقاله تضمین نمی‌شود.
        </p>
      </section>
    </>
  );
}
