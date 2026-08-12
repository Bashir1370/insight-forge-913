import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertCircle, CalendarClock, FolderKanban, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { projectStages } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت | زیست فلو" },
      {
        name: "description",
        content: "مدیریت پروژه‌ها، درخواست‌های مشاوره، تخصیص تحلیل‌گر و پایش وضعیت زیست فلو.",
      },
      { property: "og:title", content: "پنل مدیریت زیست فلو" },
      { property: "og:description", content: "پایش پروژه‌ها، صف مشاوره و بار کاری تیم تحلیل." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const queue = [
  { id: "PRJ-2431", pi: "دکتر موسوی", type: "Single-cell", stage: 1, analyst: "—", priority: "بالا" },
  { id: "PRJ-2418", pi: "دکتر رضایی", type: "Bulk RNA-seq", stage: 4, analyst: "س. کریمی", priority: "متوسط" },
  { id: "PRJ-2402", pi: "دکتر احمدی", type: "WES", stage: 3, analyst: "م. نوری", priority: "متوسط" },
  { id: "PRJ-2391", pi: "دکتر شریفی", type: "Public dataset", stage: 2, analyst: "ه. عباسی", priority: "پایین" },
];

const consultRequests = [
  { name: "دکتر کاظمی", topic: "طراحی مطالعه ترنسکریپتوم", plan: "رایگان", time: "امروز ۱۰:۳۰" },
  { name: "دکتر فرهادی", topic: "تحلیل میکروبیوم روده", plan: "تخصصی", time: "فردا ۱۴:۰۰" },
  { name: "دکتر یزدانی", topic: "کشف بیومارکر در TCGA", plan: "تخصصی", time: "پنجشنبه ۹:۰۰" },
];

function Admin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-navy">پنل مدیریت</h1>
          <p className="mt-2 text-sm text-muted-foreground">پایش پروژه‌ها، صف مشاوره و بار کاری تیم تحلیل</p>
        </div>
        <Button variant="hero">گزارش هفتگی</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FolderKanban, label: "پروژه‌های در جریان", value: "۱۸" },
          { icon: CalendarClock, label: "مشاوره‌های این هفته", value: "۹" },
          { icon: Users2, label: "پژوهشگران فعال", value: "۴۷" },
          { icon: AlertCircle, label: "در انتظار اقدام", value: "۴" },
        ].map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <s.icon className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-extrabold text-navy">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 card-elevated p-6">
        <h2 className="flex items-center gap-2 text-lg text-navy">
          <Activity className="size-5 text-primary" />
          صف پروژه‌ها
        </h2>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شناسه</TableHead>
                <TableHead className="text-right">سرپرست پروژه</TableHead>
                <TableHead className="text-right">نوع داده</TableHead>
                <TableHead className="text-right">مرحله</TableHead>
                <TableHead className="text-right">تحلیل‌گر</TableHead>
                <TableHead className="text-right">اولویت</TableHead>
                <TableHead className="text-right">اقدام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold text-navy">{r.id}</TableCell>
                  <TableCell>{r.pi}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{projectStages[r.stage - 1]}</TableCell>
                  <TableCell>{r.analyst}</TableCell>
                  <TableCell>
                    <Badge variant={r.priority === "بالا" ? "default" : "secondary"}>{r.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      تخصیص
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <h2 className="text-lg text-navy">درخواست‌های مشاوره</h2>
          <ul className="mt-4 space-y-3">
            {consultRequests.map((c) => (
              <li key={c.name} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="text-sm font-bold text-navy">{c.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.topic}</p>
                </div>
                <div className="text-end">
                  <Badge variant={c.plan === "تخصصی" ? "default" : "secondary"}>{c.plan}</Badge>
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-lg text-navy">بار کاری تیم تحلیل</h2>
          <ul className="mt-4 space-y-4">
            {[
              ["س. کریمی", 80],
              ["م. نوری", 55],
              ["ه. عباسی", 35],
              ["ن. طاهری", 20],
            ].map(([name, load]) => (
              <li key={String(name)}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy">{name}</span>
                  <span className="text-xs text-muted-foreground">{load}٪</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-[image:var(--gradient-primary)]"
                    style={{ width: `${load}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
