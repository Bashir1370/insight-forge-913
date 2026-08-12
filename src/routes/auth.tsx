import { createFileRoute, Link } from "@tanstack/react-router";
import { Dna } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود پژوهشگر | زیست فلو" },
      {
        name: "description",
        content: "ورود یا ساخت حساب پژوهشگر برای مدیریت پروژه‌ها، داده‌ها و جلسات مشاوره.",
      },
      { property: "og:title", content: "ورود پژوهشگر" },
      { property: "og:description", content: "دسترسی به داشبورد پروژه‌های بیوانفورماتیک." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const notice = () => toast.info("حساب‌های کاربری در نسخه نمایشی غیرفعال است؛ داشبورد نمونه را ببینید.");

  return (
    <div className="surface-hero">
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="card-elevated p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl surface-navy">
            <Dna className="size-6" />
          </span>
          <h1 className="mt-5 text-center text-2xl text-navy">حساب پژوهشگر</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            مدیریت پروژه‌ها، داده‌ها و جلسات مشاوره در یک محیط امن
          </p>

          <Tabs defaultValue="login" className="mt-7">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                ورود
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                ثبت‌نام
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="l-email">ایمیل</Label>
                <Input id="l-email" type="email" dir="ltr" placeholder="name@university.ac.ir" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="l-pass">گذرواژه</Label>
                <Input id="l-pass" type="password" dir="ltr" />
              </div>
              <Button variant="hero" className="w-full" onClick={notice}>
                ورود
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-name">نام و نام خانوادگی</Label>
                <Input id="s-name" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-email">ایمیل دانشگاهی</Label>
                <Input id="s-email" type="email" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-pass">گذرواژه</Label>
                <Input id="s-pass" type="password" dir="ltr" />
              </div>
              <Button variant="hero" className="w-full" onClick={notice}>
                ساخت حساب
              </Button>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/dashboard" className="font-semibold text-primary">
              مشاهده داشبورد نمونه
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
