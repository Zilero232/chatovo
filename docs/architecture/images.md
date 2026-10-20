# Images and link previews

The web app is a static SPA with no image optimizer of its own. Every image goes through the kit's `Image` (the `next/image` equivalent: `srcSet`, `sizes`, lazy loading, blur placeholder), and a loader points it at the API, which resizes with `sharp`. Work is split between upload time (once per file) and delivery (once per size, then cached).

## Upload time — normalise once

`src/lib/` on the server, called from the upload services:

- **Avatar** (`optimizeAvatar`) — re-encoded as WebP, capped at `AVATAR_MAX_DIMENSION` (768 px, shared through `@chatovo/schemas`), animation kept, metadata dropped. The upload cap is `AVATAR_MAX_BYTES` (10 MB) because the stored file is tiny whatever arrives.
- **Chat image** (`processChatImage`) — the original is kept for "open in browser" and download, minus EXIF (camera and GPS data from phones). The attachment records the displayed `width` / `height` (EXIF orientation and animation frames accounted for) and a ~16 px WebP `placeholder` as a data URL. With these, the client reserves the exact box before loading and shows a blur instead of an empty gap.
- SVG, HEIC and anything that fails to decode is stored as a plain file attachment.

## Delivery — `GET /images?url&w&q`

The equivalent of `/_next/image`, in `modules/images`:

- **Sources.** Our own uploads (`PUBLIC_FILES_URL/uploads/…`, read straight from disk with a path-traversal guard) and an allow-list of remote hosts (`IMAGE_REMOTE_HOSTS`, e.g. GitHub avatars), the analogue of Next's `remotePatterns`. Anything else is refused, so the endpoint can't be used as an open proxy.
- **Sizes.** `w` must be one of `IMAGE_WIDTHS` and `q` one of `IMAGE_QUALITIES`, the same sets `IMAGE_CONFIG` hands to the kit's `ImageConfigProvider`. A free width would let anyone fill the cache.
- **Output.** Always WebP, never enlarged. AVIF is deliberately left out: it encodes about ten times slower, which is the wrong trade on a single VPS.
- **Cache.** Results go to `IMAGE_CACHE_DIR` (a Docker volume), keyed by `sha256(url, w, q)`. Concurrent misses for the same key render once (`coalesceAsync`). Upload sources are `immutable` (attachment keys are UUIDs, avatar URLs carry `?v=`); remote ones live a day.

**Cleanup** follows nginx `proxy_cache` (`inactive` + `max_size`). A cache hit refreshes the file's access time, at most once a day, while the modification time stays the creation time and still drives remote freshness. Every night `ImageCacheSweeperService` deletes what nobody asked for in 14 days, then the least recently used files until the cache fits in 2 GB, plus `.tmp` leftovers older than an hour. Everything evicted is simply re-rendered on the next request. The policy lives in `IMAGES.cache`; the helpers (`listFileStats`, `selectEvictions`, `removeFiles`) are in `src/lib`.

On the client, `shared/lib/image-loader` exports the loader and `IMAGE_CONFIG`, which `AppProviders` passes to `ImageConfigProvider`. It routes optimizable sources to `/images` and passes everything else (data and blob URLs, static assets) through untouched. Components never decide that themselves, with one exception: a chat attachment whose format is outside `IMAGE_PROCESSABLE_MIMES` (shared through `@chatovo/schemas`, e.g. SVG or HEIC) is rendered `unoptimized`. Every image is the kit's `Image` with a `sizes` that matches its rendered size. `UserAvatar` takes `sizes` for anything larger than the default 40 px.

The loader recognises our uploads by the origin of `NEXT_PUBLIC_API_URL`, and the server by the origin of `PUBLIC_FILES_URL`, so the two must point at the same host (`https://api.chatovo.ru` in production). If they differ, uploads simply bypass the optimizer. If `NEXT_PUBLIC_API_URL` is relative, the loader passes everything through, because the optimizer would be unreachable.

## Link previews in chat

The first link in a message, found with the same `remark-gfm` parse the chat renders (so links in code are ignored), is unfurled by `GET /link-preview?url=`:

1. `safeFetch` downloads at most 512 KB of the page.
2. `decodeHtml` picks the charset (`html-encoding-sniffer` + `iconv-lite`, so windows-1251 pages work).
3. `open-graph-scraper` reads the tags, falling back to Twitter tags and `<title>`.
4. The preview image is downloaded, resized and stored under `uploads/link-previews/`, so it is served by us through the optimizer. Users never load third-party images, and third parties never see their IPs.

Results, failures included (for a shorter time), are cached with `cache-manager`. The route is throttled per user. `LinkPreviewSweeperService` deletes stored preview images older than 30 days. A live preview is rebuilt, and its image rewritten, every 6 hours at most, so a 30-day-old file belongs to no live preview.

Room links unfurl too. The outbound user agent says `like TwitterBot`, so Caddy serves our own room Open Graph page (`GET /link-preview/room`) to it, exactly as it does for Telegram and Discord. Its image is the site's OG card, `${SITE_URL}/opengraph-image` — the server's `SITE_URL` defaults to `https://chatovo.ru`, since the card is rendered by `apps/site`, not the web export.

## Outbound fetches and SSRF

Every request to a user-supplied URL goes through `src/lib/safe-fetch`:

- Only http(s), on the default ports, with no credentials in the URL.
- Each hop, redirects included, is resolved once. It is refused unless every address is public unicast (`ipaddr.js`), which rules out loopback, private networks, link-local and cloud metadata, CGNAT, and IPv4-mapped tricks.
- The connection is pinned to the checked IP, with the original `Host` and TLS `serverName`, so DNS rebinding can't swap the address between check and connect.
- The response is capped by time and size.

Libraries that do this through an `http.Agent` don't work here: in Bun a custom `lookup` on `node:https` drops SNI, so the pin uses Bun's `fetch` with `tls.serverName` instead.

`OUTBOUND_PROXY_URL` optionally routes these fetches through an http(s) proxy, for sites blocked from the server (YouTube from RU). The address is still checked here, and the proxy is handed the vetted IP, so the proxy can't be used to reach private networks either.
