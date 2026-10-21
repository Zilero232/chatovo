---
paths:
  - 'apps/client/web/**/*.{ts,tsx}'
  - 'apps/client/web/src/shared/i18n/locales/**'
  - 'apps/landing/**/*.{ts,tsx}'
  - 'apps/landing/shared/i18n/locales/**'
  - 'packages/ui-kit/**/*.{ts,tsx}'
  - 'packages/ui-kit/messages/**'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/i18n.md; keep them in sync. -->

# Client — i18n

Every user-visible string goes through `useTranslations` — from `use-intl` in the web app and the kit, from `next-intl` on the site (plus `getTranslations` from `next-intl/server` in the site's server components). Keys live in each app's `shared/i18n/locales/<locale>/<namespace>.json` for all nine locales (`LOCALES` in `@chatovo/config`: en, ru, uk, es, pt, de, fr, tr, pl) — the same files and keys everywhere; a new key goes into all nine, translated. The tests in `shared/i18n/_tests/` fail on a missing key, a message left in English, an untranslated error code (web) or an unused key. Web namespaces: `admin`, `app`, `auth`, `common`, `room`, `social`; the site has one `marketing.json`. A kit component reads the `ui` namespace (`packages/ui-kit/messages/<locale>.json`, exported as `uiMessages` and spread into both apps' messages). `messages.d.ts` types the messages from the English files.

Site: its client components receive only the `ui` namespace — pass them strings as props from a server parent. Pages read the locale with `readPageLocale(params)`; internal links go through `localizeMarketingPath`.
