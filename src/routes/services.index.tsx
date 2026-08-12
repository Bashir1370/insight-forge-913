import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { services } from "@/lib/content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "خدمات بیوانفورماتیک | تحلیل RNA-seq، تک‌سلولی و ژنومیکس" },
      {
        name: "description",
        content:
          "فهرست خدمات زیست فلو: مشاوره، طراحی پژوهش، Bulk و Single-cell RNA-seq، داده‌های عمومی، مسیرها، شبکه، بیومارکر، میکروبیوم و مصورسازی.",
      },
      { property: "og:title", content: "خدمات تخصصی بیوانفورماتیک" },
      {
        property: "og:description",
        content: "دوازده خدمت تخصصی برای تحلیل داده‌های زیستی و تولید نتایج آماده انتشار.",
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl text-navy md:text-4xl">خدمات تخصصی</h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">
        هر خدمت با ورودی مشخص، گردش‌کار استاندارد و خروجی قابل انتشار تعریف شده است. اگر مطمئن نیستید
        کدام مسیر مناسب پروژه شماست، از طراح پروژه استفاده کنید.
      </p>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/wizard">
          راهنمای انتخاب خدمت
          <ArrowLeft className="size-4" />
        </Link>
      </Button>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            to="/services/$slug"
            params={{ slug: s.slug }}
            className="card-elevated card-hover group flex flex-col p-6"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
              <s.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-bold text-navy">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{s.short}</p>
            <span className="mt-4 text-xs font-semibold text-primary">جزئیات خدمت →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
