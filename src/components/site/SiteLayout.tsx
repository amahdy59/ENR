import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { MobileTabBar } from "./MobileTabBar";
import { BackToTop } from "./BackToTop";
import { AnnouncerProvider } from "./LiveAnnouncer";
import { CookieConsent } from "./CookieConsent";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <AnnouncerProvider>
      <div className="flex min-h-dvh flex-col bg-[color:var(--color-background-base)] font-sans text-[color:var(--color-text-primary)]">
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 pb-16 md:pb-0 focus:outline-none">{children}</main>
        <SiteFooter />
        <MobileTabBar />
        <BackToTop />
        <CookieConsent />
      </div>
    </AnnouncerProvider>
  );
}



export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="w-full bg-[color:var(--color-brand-primary-tint)]">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-14 lg:px-20">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold text-[color:var(--color-text-brand)] md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-base text-[color:var(--color-text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function ContentSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-14 lg:px-20">
      {children}
    </section>
  );
}
