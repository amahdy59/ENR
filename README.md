# Egyptian National Railways (ENR) Web Application

A bilingual (English & Arabic), high-performance, and fully accessible (WCAG 2.1 AAA Contrast / 2.1 AA Mobile) web application designed for planning journeys, buying tickets, and viewing timetables across 350+ railway stations in Egypt.

---

## 🚀 Tech Stack

- **Core**: React 19, TypeScript, and [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (modern React framework with Server-Side Rendering and automatic routing).
- **Styling**: Tailwind CSS v4 using modern logical properties.
- **State Management & Data Ingestion**: `@tanstack/react-query` and Supabase JS SDK.
- **Bilingual & Localization**: `i18next` with RTL-native layout mirroring.
- **Linting & Quality Assurance**: ESLint, Prettier, and Playwright for accessibility regression testing.

---

## 📁 Architecture & Organization

The project follows a **layer-based organization**:

```text
├── .github/workflows/   # CI automation (A11y/Contrast audits)
├── public/              # Static public assets, manifest, and robots.txt
├── scripts/             # Accessibility and design token contrast audits
├── src/
│   ├── assets/          # Shared visual media (hero and route banners)
│   ├── components/      # Reusable presentation and utility modules
│   │   ├── home/        # Modular sections of the homepage (Hero, News, etc.)
│   │   ├── search/      # Search and result row layout modules
│   │   ├── site/        # Global layout elements (Header, Footer, Dialogs)
│   │   └── ui/          # Radix-based UI primitive components (shadcn)
│   ├── config/          # Central constants and viewport configuration
│   ├── hooks/           # App-wide React hooks (use-mobile, use-session)
│   ├── i18n/            # Internationalization, path routing, and locales
│   ├── integrations/    # External clients (Supabase database connections)
│   ├── lib/             # Utility algorithms (fares, formatting, validation)
│   ├── routes/          # File-based routing under localized path parameters
│   ├── start.ts         # Middleware setup and server startup parameters
│   └── styles.css       # Core stylesheets and tailwind layout overrides
```

### ⚡ Performance & Data Optimization

- **Lazy-Loaded Dataset Split**: The main database dataset containing railway coordinate schedules (`stations.generated.ts` and `trips.generated.ts` ~500KB) is dynamically imported only when search results or station finder pages mount. This keeps the initial home bundle light (under the 250KB budget).
- **Memoized Filters**: Result grids are heavily memoized, recalculating only when search parameters or filters (max price, departure times, stops) change.

---

## 🌍 RTL & Bilingual (i18n) Workflow

The application supports English and Arabic natively with complete page layout mirroring for RTL contexts.

### 1. Logical CSS Properties

To prevent layout breaking in RTL contexts, physical CSS properties are avoided. We use Tailwind's logical layout utility classes:

- **Margins & Padding**: Use `ms-`, `me-`, `ps-`, `pe-` instead of `ml-`, `mr-`, `pl-`, `pr-`.
- **Alignments & Borders**: Use `start-` and `end-` instead of `left-` and `right-`.
- **RTL Direction Detection**: In `src/routes/{-$locale}/route.tsx`, the layout automatically adds `dir="rtl"` and `lang="ar"` to the `<html>` document based on the route parameters.

### 2. Auto-Flipped SVG Vectors

In `src/styles.css`, an `@utility rtl-flip` helper is configured to automatically scale SVG icons (chevrons, back arrows, navigation steps) when in RTL contexts:

```css
@utility rtl-flip {
  [dir="rtl"] & {
    transform: scaleX(-1);
  }
}
```

---

## ♿ Accessibility & Quality Standards

Built strictly in accordance with **WCAG 2.1 AAA Contrast** guidelines and **WCAG 2.1 AA Mobile Navigation**:

1. **Token-Level Contrast**:
   - Every foreground-background text pair (light and dark mode) meets or exceeds a **7:1 contrast ratio** for body text and **4.5:1** for UI components.
   - Verified on commits via `node scripts/audit-contrast.mjs`.
2. **Keyboard Focus & Navigation**:
   - Every interactive element provides a custom high-visibility focus ring (`focus-visible:ring-4 focus-visible:ring-[color:var(--color-interactive-focus-ring)]`).
   - A `skip-to-content` anchor is rendered as the first element in the layout.
   - Interactive wrappers (e.g. `BackToTop`) programmatically return focus to the `#main-content` container after executing.
3. **Interactive Touch Targets**:
   - Tap targets are designed to be at least **44x44px** (per Apple HIG and Android guidelines) to accommodate mobile screen usage.
4. **Announcements**:
   - Dynamic error summaries and search updates are wrapped in an `aria-live="assertive"` alert box to ensure screen readers announce changes instantly.

---

## 🛠️ Local Development & Scripts

### Prerequisites

Make sure Node.js (v20 or v22) is installed.

### Setup Instructions

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the Vite local development server:
   ```bash
   npm run dev
   ```
3. Build for development (Vite development bundle):
   ```bash
   npm run build:dev
   ```

### Verification Audits

- **Linter & Code Hygiene**: Run ESLint to verify syntax and formatting:
  ```bash
  npm run lint
  ```
- **Prettier Format**: Apply syntax styling rules to all source code files:
  ```bash
  npm run format
  ```
- **Token Contrast Checker**: Run the static color contrast audit:
  ```bash
  npm run audit:contrast
  ```
- **Mobile Viewport Accessibility Scan**: Run Playwright and axe-core headless audits:
  ```bash
  npm run audit:a11y:mobile
  ```
