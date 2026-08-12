import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/site/brand-mark";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage, useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود پژوهشگر | هاب‌ژن" },
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
  const navigate = useNavigate();
  const { session } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [signName, setSignName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPass, setSignPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function handleLogin() {
    if (!loginEmail || !loginPass) {
      toast.error("ایمیل و گذرواژه را وارد کنید.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPass,
    });
    setBusy(false);
    if (error) {
      toast.error(authErrorMessage(error.message));
      return;
    }
    toast.success("خوش آمدید!");
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleSignup() {
    if (!signName.trim() || !signEmail || !signPass) {
      toast.error("همه فیلدها را کامل کنید.");
      return;
    }
    if (signPass.length < 6) {
      toast.error("گذرواژه ضعیف است؛ حداقل ۶ کاراکتر انتخاب کنید.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: signEmail.trim(),
      password: signPass,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: signName.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(authErrorMessage(error.message));
      return;
    }
    if (data.session) {
      toast.success("حساب شما ساخته شد.");
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    setPendingEmail(signEmail.trim());
    toast.success("لینک تأیید به ایمیل شما ارسال شد.");
  }

  return (
    <div className="surface-hero">
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="card-elevated p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl surface-navy">
            <BrandMark className="size-6" />
          </span>
          <h1 className="mt-5 text-center text-2xl text-navy">حساب پژوهشگر</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            مدیریت پروژه‌ها، داده‌ها و جلسات مشاوره در یک محیط امن
          </p>

          {pendingEmail && (
            <div className="mt-5 rounded-2xl border border-primary/30 bg-accent/40 p-4 text-center text-sm leading-7 text-navy">
              حساب شما ساخته شد. برای فعال‌سازی، لینک تأیید ارسال‌شده به{" "}
              <span dir="ltr" className="font-semibold">
                {pendingEmail}
              </span>{" "}
              را باز کنید و سپس وارد شوید.
            </div>
          )}

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
                <Input
                  id="l-email"
                  type="email"
                  dir="ltr"
                  placeholder="name@university.ac.ir"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="l-pass">گذرواژه</Label>
                <Input
                  id="l-pass"
                  type="password"
                  dir="ltr"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button variant="hero" className="w-full" disabled={busy} onClick={handleLogin}>
                {busy ? "در حال ورود..." : "ورود"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-name">نام و نام خانوادگی</Label>
                <Input
                  id="s-name"
                  maxLength={100}
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-email">ایمیل دانشگاهی</Label>
                <Input
                  id="s-email"
                  type="email"
                  dir="ltr"
                  value={signEmail}
                  onChange={(e) => setSignEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-pass">گذرواژه</Label>
                <Input
                  id="s-pass"
                  type="password"
                  dir="ltr"
                  value={signPass}
                  onChange={(e) => setSignPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
              </div>
              <Button variant="hero" className="w-full" disabled={busy} onClick={handleSignup}>
                {busy ? "در حال ساخت حساب..." : "ساخت حساب"}
              </Button>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/wizard" className="font-semibold text-primary">
              شروع طراحی پروژه پژوهشی
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
