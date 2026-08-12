import { Link } from "@tanstack/react-router";
import { Mail, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/site/brand-mark";
import { services } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl surface-navy">
              <BrandMark className="size-5" />
            </span>
            <span className="text-sm font-extrabold text-navy">هاب‌ژن</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            از پرسش پژوهشی تا بینش زیستی؛ مشاوره، تحلیل داده‌های زیستی و خروجی‌های آماده انتشار برای
            پژوهشگران علوم حیات.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy">خدمات</h3>
          <ul className="mt-4 space-y-2.5">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy">پلتفرم</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/wizard" className="hover:text-primary">
                طراح پروژه پژوهشی
              </Link>
            </li>
            <li>
              <Link to="/consultation" className="hover:text-primary">
                رزرو مشاوره
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary">
                داشبورد پژوهشگر
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary">
                دانشنامه آموزشی
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-primary">
                پنل مدیریت
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy">تماس</h3>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4 text-primary" />
            core@hubgene.research
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 text-primary" />
            داده‌های پژوهشی شما محرمانه است و تنها با تیم تحلیل پروژه به اشتراک گذاشته می‌شود.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HubGene Bioinformatics — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
