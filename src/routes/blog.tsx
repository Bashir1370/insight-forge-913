import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogCategories, blogPosts } from "@/lib/content";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "دانشنامه بیوانفورماتیک | راهنماهای RNA-seq و تحلیل داده زیستی" },
      {
        name: "description",
        content:
          "مقالات آموزشی درباره RNA-seq، تحلیل تک‌سلولی، طراحی آزمایش، داده‌های عمومی و آمار برای زیست‌شناسی.",
      },
      { property: "og:title", content: "دانشنامه بیوانفورماتیک" },
      {
        property: "og:description",
        content: "راهنماهای عملی تحلیل داده‌های زیستی برای پژوهشگران علوم حیات.",
      },
    ],
  }),
  component: Blog,
});

function Blog() {
  const [cat, setCat] = useState<string | null>(null);
  const posts = cat ? blogPosts.filter((p) => p.category === cat) : blogPosts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-3xl text-navy md:text-4xl">دانشنامه بیوانفورماتیک</h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">
        محتوای آموزشی برای پژوهشگرانی که می‌خواهند تحلیل داده‌های زیستی خود را دقیق‌تر و بازتولیدپذیرتر
        انجام دهند.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            cat === null ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground"
          }`}
        >
          همه
        </button>
        {blogCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              cat === c ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.slug} className="card-elevated card-hover flex flex-col p-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
              <BookOpen className="size-3.5" />
              {p.category}
            </span>
            <h2 className="mt-4 text-base font-bold leading-7 text-navy">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{p.excerpt}</p>
            <span className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="size-3.5" />
              {p.readingTime} مطالعه
            </span>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-3xl surface-navy p-10 text-center">
        <h2 className="text-2xl">پرسش پژوهشی مشخصی دارید؟</h2>
        <p className="mt-3 text-sm opacity-90">مسیر تحلیل آن را در چند گام کوتاه بسازید.</p>
        <Button asChild variant="hero" size="lg" className="mt-6">
          <Link to="/wizard">شروع طراح پروژه</Link>
        </Button>
      </div>
    </div>
  );
}
