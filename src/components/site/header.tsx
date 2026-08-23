import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BrandMark } from "@/components/site/brand-mark";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "خانه" },
  { to: "/services", label: "خدمات" },
  { to: "/learn", label: "آموزش" },
  { to: "/resources", label: "منابع داده" },
  { to: "/wizard", label: "طراح پروژه" },
  { to: "/consultation", label: "مشاوره" },
  { to: "/dashboard", label: "داشبورد پژوهشگر" },
  { to: "/blog", label: "دانشنامه" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl surface-navy shadow-glow">
            <BrandMark className="size-5" />
          </span>

          <span className="leading-tight">
            <span className="block text-sm font-extrabold text-navy">
              هاب‌ژن
            </span>

            <span className="block text-[10px] text-muted-foreground">
              Bioinformatics & Computational Biology
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-navy-soft transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{
                className: "bg-accent text-accent-foreground",
              }}
              activeOptions={{
                exact: item.to === "/",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link to="/dashboard">داشبورد من</Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:inline-flex"
              >
                <LogOut className="size-4" />
                خروج
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link to="/auth">ورود پژوهشگر</Link>
            </Button>
          )}

          <Button asChild size="sm" variant="hero">
            <Link to="/wizard">شروع پروژه</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="منو"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col p-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-soft hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground"
            >
              پنل مدیریت
            </Link>

            {session ? (
              <button
                onClick={() => {
                  setOpen(false);
                  void handleSignOut();
                }}
                className="rounded-lg px-3 py-2.5 text-start text-sm font-medium text-navy-soft hover:bg-accent"
              >
                خروج از حساب
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-soft hover:bg-accent"
              >
                ورود پژوهشگر
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
