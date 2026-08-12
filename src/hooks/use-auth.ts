import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      setSession(next);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: (session?.user ?? null) as User | null, loading };
}

export type Profile = {
  id: string;
  full_name: string | null;
  organization: string | null;
  research_field: string | null;
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let mounted = true;
    supabase
      .from("profiles")
      .select("id, full_name, organization, research_field")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted) setProfile((data as Profile) ?? null);
      });
    return () => {
      mounted = false;
    };
  }, [userId]);

  return profile;
}

export function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "ایمیل یا گذرواژه نادرست است.";
  if (m.includes("email not confirmed")) return "ایمیل شما هنوز تأیید نشده است؛ لینک تأیید را بررسی کنید.";
  if (m.includes("already registered") || m.includes("user already")) return "حسابی با این ایمیل از قبل وجود دارد.";
  if (m.includes("password") && (m.includes("6") || m.includes("weak") || m.includes("short")))
    return "گذرواژه ضعیف است؛ حداقل ۶ کاراکتر انتخاب کنید.";
  if (m.includes("invalid") && m.includes("email")) return "ایمیل واردشده معتبر نیست.";
  if (m.includes("rate limit") || m.includes("too many")) return "تعداد تلاش‌ها زیاد است؛ کمی بعد دوباره امتحان کنید.";
  if (m.includes("fetch") || m.includes("network")) return "ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کنید.";
  return "خطایی در احراز هویت رخ داد؛ دوباره تلاش کنید.";
}
