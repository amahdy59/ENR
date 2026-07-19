import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { SiteLayout, PageHeader, ContentSection } from "@/components/site/SiteLayout";
import { Breadcrumbs, type Crumb } from "@/components/site/Breadcrumbs";

export function StubPage({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  const { t } = useTranslation(["stub", "common"]);
  return (
    <SiteLayout>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <ContentSection>
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        {children ?? (
          <div className="rounded-2xl border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-background-surface)] p-10 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              {t("stub:placeholder")}
            </p>
            <LocaleLink
              to="/"
              className="mt-4 inline-flex rounded-lg bg-[color:var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              {t("common:actions.returnHome")}
            </LocaleLink>
          </div>
        )}
      </ContentSection>
    </SiteLayout>
  );
}

export function Card({ title, body, meta }: { title: string; body?: string; meta?: string }) {
  return (
    <article className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-background-elevated)] p-5 shadow-sm">
      {meta && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-accent)]">
          {meta}
        </p>
      )}
      <h3 className="text-lg font-bold text-[color:var(--color-text-brand)]">{title}</h3>
      {body && <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{body}</p>}
    </article>
  );
}

/**
 * Localized head metadata for stub-style pages.
 * The `head()` returned reads the current route's `{-$locale}` param and
 * chooses the Arabic strings when the URL is under /ar/*.
 */
export function stubHead(
  titleEn: string,
  descriptionEn: string,
  path: string,
  titleAr?: string,
  descriptionAr?: string,
) {
  return ({ params }: { params: { locale?: string } }) => {
    const isAr = params.locale === "ar";
    const title = isAr && titleAr ? titleAr : titleEn;
    const description = isAr && descriptionAr ? descriptionAr : descriptionEn;
    const enPath = path === "/" ? "/" : path;
    const arPath = path === "/" ? "/ar" : `/ar${path}`;
    const canonical = isAr ? arPath : enPath;
    return {
      meta: [
        { title: `${title} — ${isAr ? "الهيئة القومية لسكك حديد مصر" : "ENR"}` },
        { name: "description", content: description },
        {
          property: "og:title",
          content: `${title} — ${isAr ? "الهيئة القومية لسكك حديد مصر" : "ENR"}`,
        },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:locale", content: isAr ? "ar_EG" : "en_US" },
        { property: "og:locale:alternate", content: isAr ? "en_US" : "ar_EG" },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "en", href: enPath },
        { rel: "alternate", hrefLang: "ar", href: arPath },
        { rel: "alternate", hrefLang: "x-default", href: enPath },
      ],
    };
  };
}
