import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Database, FileOutput, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/content";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { title: service.title, short: service.short };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "خدمت یافت نشد" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} | هسته بیوانفورماتیک`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.short },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = services.find((s) => s.slug === slug)!;

  return (
    <article>
      <header className="surface-hero">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <Link to="/services" className="text-xs font-semibold text-primary">
            ← همه خدمات
          </Link>
          <div className="mt-5 flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow">
              <service.icon className="size-6" />
            </span>
            <div>
              <h1 className="text-3xl text-navy md:text-4xl">{service.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground">{service.short}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-14">
        <section className="card-elevated p-7">
          <h2 className="text-lg text-navy">چه مشکلی را حل می‌کند</h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">{service.problem}</p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="card-elevated p-7">
            <h2 className="flex items-center gap-2 text-lg text-navy">
              <Users className="size-5 text-primary" />
              چه کسانی به آن نیاز دارند
            </h2>
            <ul className="mt-4 space-y-2.5">
              {service.audience.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                  <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="card-elevated p-7">
            <h2 className="flex items-center gap-2 text-lg text-navy">
              <Database className="size-5 text-primary" />
              داده ورودی موردنیاز
            </h2>
            <ul className="mt-4 space-y-2.5">
              {service.inputs.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                  <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card-elevated p-7">
          <h2 className="text-lg text-navy">گردش‌کار تحلیل</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.workflow.map((w, i) => (
              <li key={w} className="rounded-2xl border border-border bg-secondary/50 p-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm font-semibold text-navy">{w}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="card-elevated p-7">
          <h2 className="flex items-center gap-2 text-lg text-navy">
            <FileOutput className="size-5 text-primary" />
            خروجی‌های مورد انتظار
          </h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {service.outputs.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-primary" />
                {o}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl surface-navy p-8">
          <h2 className="text-lg">نمونه نتیجه</h2>
          <p className="mt-3 text-sm leading-8 opacity-90">{service.example}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/wizard">
                شروع این پروژه
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/consultation">مشاوره اولیه رایگان</Link>
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
