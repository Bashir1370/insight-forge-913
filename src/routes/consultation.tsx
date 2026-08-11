import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "رزرو مشاوره بیوانفورماتیک | بررسی رایگان و طراحی مطالعه" },
      {
        name: "description",
        content:
          "بررسی اولیه رایگان پروژه یا مشاوره تخصصی طراحی پژوهش با تحویل سند Bioinformatics Study Plan.",
      },
      { property: "og:title", content: "رزرو مشاوره بیوانفورماتیک" },
      {
        property: "og:description",
        content: "دو مدل مشاوره: بررسی اولیه رایگان و مشاوره تخصصی طراحی مطالعه.",
      },
    ],
  }),
  component: ConsultationPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید").max(100),
  email: z.string().trim().email("ایمیل معتبر نیست").max(255),
  affiliation: z.string().trim().max(150).optional(),
  topic: z.string().trim().min(1, "موضوع را انتخاب کنید"),
  message: z.string().trim().min(20, "توضیح پروژه حداقل ۲۰ کاراکتر باشد").max(1500),
});

const plans = [
  {
    id: "free",
    icon: Sparkles,
    title: "بررسی اولیه رایگان",
    price: "بدون هزینه",
    duration: "۲۰ دقیقه",
    points: [
      "ارزیابی کوتاه پرسش پژوهشی",
      "بررسی امکان‌پذیری تحلیل با داده موجود",
      "پیشنهاد مسیر کلی و خدمت مناسب",
    ],
  },
  {
    id: "expert",
    icon: FileText,
    title: "مشاوره تخصصی طراحی پژوهش",
    price: "بر اساس دامنه پروژه",
    duration: "۹۰ دقیقه + سند مکتوب",
    points: [
      "تحلیل عمیق فرضیه و طراحی آزمایش",
      "انتخاب پایپ‌لاین، ابزار و روش آماری",
      "تحویل سند Bioinformatics Study Plan",
      "برآورد زمان، منابع محاسباتی و ریسک‌ها",
    ],
  },
];

function ConsultationPage() {
  const [plan, setPlan] = useState("free");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      affiliation: form.get("affiliation"),
      topic: form.get("topic"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }
    setErrors({});
    e.currentTarget.reset();
    toast.success("درخواست مشاوره ثبت شد؛ نتیجه بررسی از طریق ایمیل اعلام می‌شود.");
  };

  return (
    <div>
      <header className="surface-hero">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-3xl text-navy md:text-4xl">مشاوره بیوانفورماتیک</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">
            پیش از تولید داده یا شروع تحلیل، مسیر علمی پروژه را با یک متخصص روشن کنید.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
        <div className="space-y-5">
          {plans.map((p) => {
            const active = plan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                className={`w-full rounded-2xl border p-6 text-start transition-all ${
                  active ? "border-primary bg-accent/50 shadow-glow" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                      <p.icon className="size-5" />
                    </span>
                    <span className="text-base font-bold text-navy">{p.title}</span>
                  </span>
                  {active && <CheckCircle2 className="size-5 text-primary" />}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck className="size-4 text-primary" />
                    {p.price}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" />
                    {p.duration}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                      <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-primary" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
          <p className="text-xs leading-6 text-muted-foreground">
            هنوز پرسش پژوهشی‌تان را جمع‌بندی نکرده‌اید؟ ابتدا{" "}
            <Link to="/wizard" className="font-semibold text-primary">
              طراح پروژه
            </Link>{" "}
            را تکمیل کنید تا جلسه مشاوره مؤثرتر باشد.
          </p>
        </div>

        <form onSubmit={submit} className="card-elevated h-fit space-y-4 p-7">
          <h2 className="text-lg text-navy">
            رزرو {plan === "free" ? "بررسی اولیه رایگان" : "مشاوره تخصصی"}
          </h2>

          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input id="name" name="name" maxLength={100} placeholder="دکتر ..." />
            {errors['name'] && <p className="text-xs text-destructive">{errors['name']}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ایمیل دانشگاهی</Label>
            <Input id="email" name="email" type="email" maxLength={255} dir="ltr" placeholder="name@university.ac.ir" />
            {errors['email'] && <p className="text-xs text-destructive">{errors['email']}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation">وابستگی سازمانی (اختیاری)</Label>
            <Input id="affiliation" name="affiliation" maxLength={150} placeholder="دانشگاه / آزمایشگاه" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">موضوع مشاوره</Label>
            <Select name="topic" defaultValue="design">
              <SelectTrigger id="topic">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">طراحی مطالعه و آزمایش</SelectItem>
                <SelectItem value="rnaseq">تحلیل RNA-seq</SelectItem>
                <SelectItem value="sc">تحلیل تک‌سلولی</SelectItem>
                <SelectItem value="public">داده‌های عمومی</SelectItem>
                <SelectItem value="genomics">ژنومیکس و واریانت</SelectItem>
                <SelectItem value="other">سایر</SelectItem>
              </SelectContent>
            </Select>
            {errors['topic'] && <p className="text-xs text-destructive">{errors['topic']}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">شرح کوتاه پروژه</Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              maxLength={1500}
              placeholder="پرسش پژوهشی، نوع داده، تعداد نمونه و هدف نهایی را بنویسید."
            />
            {errors['message'] && <p className="text-xs text-destructive">{errors['message']}</p>}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            ثبت درخواست مشاوره
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            اطلاعات پروژه شما محرمانه نگهداری می‌شود.
          </p>
        </form>
      </div>
    </div>
  );
}
