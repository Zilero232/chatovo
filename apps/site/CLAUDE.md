# CLAUDE.md — apps/site

Guidance for `@chatovo/site`, the public website on chatovo.ru — landing, features, downloads, changelog, about, support, privacy, terms. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The product is a separate app, [apps/web](../web/CLAUDE.md), on app.chatovo.ru.

**Next.js 16 / React 19**, App Router, **server-rendered** (`output: 'standalone'`): its own Docker image `chatovo-site` runs `node apps/site/server.js` behind Caddy ([deploy](../../docs/ops/deploy.md)). Dev runs on **:3001**. Same FSD and style guide as the web app ([fsd.md](../../docs/architecture/fsd.md), [docs/guides/](../../docs/guides/README.md)); the `.claude/rules/client/` digests load here too.

## Layer map

```text
app/                  # routes (thin server wrappers)
                      #   [locale]/{page,features,download,changelog,about,support,privacy,terms}/page.tsx
                      #   [locale]/not-found.tsx, [locale]/[...rest] → notFound(), [locale]/opengraph-image.tsx
                      #   sitemap.ts, robots.ts, llms.txt/, llms-full.txt/ (force-static)
proxy.ts              # Next 16's middleware: next-intl routing
views/                # home, features, download, changelog, about, support, legal, not-found
widgets/marketing/    # marketing-shell: header, footer, hero, sections, scene, MarketingAppCta
entities/release/     # getRelease / getContributors — server fetchers against the API
shared/               # config/ (env, SITE) constants/ (ROUTES, APP_ROUTES) hooks/ i18n/ lib/ seo/
scripts/              # write-play-release-notes.ts (called by release.yml)
```

The design system is `@chatovo/ui-kit`; brand and URL constants come from `@chatovo/config`.

## Conventions that bite

- **Server components by default.** `'use client'` only for real interactivity (mobile nav, the WebGL hero, the locale redirect). The layout gives `NextIntlClientProvider` only the `ui` namespace, so a client component gets its strings as props from a server parent.
- **Every page reads its locale through `readPageLocale(params)`** (`shared/lib`): it 404s an unknown locale and calls `setRequestLocale`, which keeps the page statically renderable. Strings come from `getTranslations` (or `useTranslations` in a non-async server component); keys live in `shared/i18n/locales/{en,ru}/marketing.json`, plus the kit's `ui` namespace from `uiMessages`.
- **Locale routing is `proxy.ts`** + `shared/i18n/routing.ts`: ru is the default with no prefix, en lives under `/en`, `/ru/*` redirects to the bare path, `localeDetection: false`. The one-time browser-language hop on the home page is the client `HomeLocaleRedirect`.
- **Internal links go through `localizeMarketingPath({ path, locale })`** with `ROUTES` — never a hand-built `/en/...`.
- **Links into the app go through `buildAppHref(APP_ROUTES.x)`** (`NEXT_PUBLIC_APP_URL`, default `http://localhost:3000`). The header CTA `MarketingAppCta` is a static link: the session token lives in the app origin's localStorage, so the site never knows who is signed in.
- **Metadata on every page**: `generateMetadata` → `createMarketingMetadata({ locale, namespace, path })` (canonical + hreflang from the namespace's `meta` keys), or `createPageMetadata` for a page with fixed copy (legal). Both in `shared/seo`.
- **Data**: only through `entities/release` (`getRelease`, `getContributors`), which fetch `env.apiUrl` — `API_INTERNAL_URL` (`http://server:4000` in Docker) || `NEXT_PUBLIC_API_URL` || `http://localhost:4000` — with `revalidate` 30 min and return `null` / `[]` on failure. A page that calls them sets `export const dynamic = 'force-dynamic'` (download, about), otherwise `next build` would fetch the API at build time; everything else stays static.
- **The changelog** is `views/changelog/config/releases.ts`; a release adds its entry there, with strings in both `marketing.json` files.
- **The standalone server binds `HOSTNAME=0.0.0.0`** (set in the Dockerfile): bound to the container hostname, next-intl's internal rewrite loops into a 307 ([pitfalls](../../docs/architecture/pitfalls.md)).
- Alias `@/*` → `apps/site/*`.

## Verification

```bash
bun --filter @chatovo/site typecheck
bun --filter @chatovo/site build   # the standalone build; catches server/client boundary and metadata errors
bun run test                       # includes the site project (locale parity, unused keys)
bun run test:e2e                   # site-desktop / site-mobile projects against :3001
```
