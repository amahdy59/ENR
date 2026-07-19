import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useBi } from "@/i18n/bi";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/i18n/LocaleLink";

export const Route = createFileRoute("/{-$locale}/auth")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "تسجيل الدخول — الهيئة القومية لسكك حديد مصر" : "Sign in — ENR" },
        { name: "description", content: isAr
          ? "سجّل الدخول أو أنشئ حساباً لحجز التذاكر وحفظ بيانات المسافرين ومراجعة الحجوزات."
          : "Sign in or create an ENR account to book tickets, save travellers, and view bookings." },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: AuthPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm text-[color:var(--color-text-secondary)]">{error.message}</p>
      </div>
    </SiteLayout>
  ),
});

function AuthPage() {
  const bi = useBi();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const accountPath = () => localizedPath("/account", locale) as never;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: accountPath() });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, locale]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${localizedPath("/account", locale)}`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        navigate({ to: accountPath() });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: accountPath() });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : bi("Something went wrong", "حدث خطأ ما"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error instanceof Error ? result.error.message : bi("Google sign-in failed", "فشل تسجيل الدخول عبر جوجل"));
      return;
    }
    if (result.redirected) return;
    navigate({ to: accountPath() });
  }

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-md flex-col px-6 py-12 md:py-16">
        <h1 className="text-2xl font-bold text-[color:var(--color-text-brand)]">
          {mode === "signin"
            ? bi("Sign in to ENR", "سجّل الدخول إلى الهيئة")
            : bi("Create your ENR account", "أنشئ حسابك في الهيئة")}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          {mode === "signin"
            ? bi("Access saved bookings and travellers.", "اطّلع على حجوزاتك والمسافرين المحفوظين.")
            : bi("Save travellers, view bookings, and book faster.", "احفظ بيانات المسافرين، وشاهد حجوزاتك، واحجز بشكل أسرع.")}
        </p>

        <button
          onClick={handleGoogle}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] text-sm font-semibold text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-background-surface)]"
        >
          {bi("Continue with Google", "المتابعة عبر جوجل")}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-[color:var(--color-text-tertiary)]">
          <div className="h-px flex-1 bg-[color:var(--color-border-default)]" />
          {bi("or", "أو")}
          <div className="h-px flex-1 bg-[color:var(--color-border-default)]" />
        </div>

        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          {mode === "signup" && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">{bi("Full name", "الاسم الكامل")}</span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm"
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">{bi("Email", "البريد الإلكتروني")}</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm"
              dir="ltr"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">{bi("Password", "كلمة المرور")}</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg border border-[color:var(--color-border-default)] px-3 text-sm"
              dir="ltr"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {loading
              ? bi("Please wait…", "يُرجى الانتظار…")
              : mode === "signin"
                ? bi("Sign in", "تسجيل الدخول")
                : bi("Create account", "إنشاء حساب")}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-[color:var(--color-text-secondary)] hover:underline"
        >
          {mode === "signin"
            ? bi("No account? Sign up", "ليس لديك حساب؟ سجّل الآن")
            : bi("Have an account? Sign in", "لديك حساب بالفعل؟ سجّل الدخول")}
        </button>
      </div>
    </SiteLayout>
  );
}
