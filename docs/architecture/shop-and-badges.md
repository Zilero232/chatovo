# Paid cosmetics and badges

Chatovo is free. Every feature (rooms, voice, video, screen sharing, chat, music) costs nothing. The only paid things are optional cosmetics. They change how you look to others and never what you can do. The site says the same thing in its FAQ and in the terms.

## What is sold

The catalog is code, not data: `packages/schemas/src/shop/catalog.ts`. It has eight **collections** (`mint`, `sunset`, `ocean`, `sakura`, `neon`, `aurora`, `holo`, `royal`). Each collection has a rarity (`common` → `legendary`), a 2–4 colour palette, an `animated` flag and an `isNew` flag. Every collection yields one item of each **kind**:

| Kind             | Key            | Where it shows                                                        |
| ---------------- | -------------- | --------------------------------------------------------------------- |
| `speakingRing`   | `<set>-ring`   | the voice ring around the avatar while the person talks (room tile)   |
| `avatarFrame`    | `<set>-frame`  | a ring around the avatar: room tile, profile card, own profile popup |
| `nameStyle`      | `<set>-name`   | gradient display name: room tile, chat author, profile card           |
| `tileBackground` | `<set>-tile`   | a gradient wash behind the participant tile in a room                 |

Each price comes from the table `COSMETIC_PRICES[rarity][kind]`. A **set** (`bundle-<set>`) grants all four items at `BUNDLE_DISCOUNT` (30%) off. Its price is rounded down to end in 9. A set is offered only while none of its parts is owned. A new set means a new entry in `COLLECTIONS` plus its name and tagline in the nine locale files. Never rename a key: profiles and entitlements store keys, and an unknown key degrades to "nothing equipped" (`equippedCosmeticSchema.catch(null)`).

Everything is drawn with SVG gradients and CSS: `CosmeticRing`, `CosmeticTile` (`entities/app/shop`) and the `gradient` prop of `UserName`. There are no image assets.

## Data

- `profile.cosmetics` (JSONB) holds the four equipped slots and is parsed by `parseEquippedCosmetics`. It travels to clients in `UserProfile.cosmetics` and in the LiveKit participant metadata.
- `shop_orders` has one row per payment attempt: `product_key` (an item or a set), `amount_rub`, `status`, and the YooKassa `payment_id`.
- `entitlements` has one row per owned item (`user_id`, `product_key`). A set writes four rows that share one `order_id`.

## Paying with YooKassa

The YooKassa client lives in `modules/shop/services/yookassa` and calls the REST API with `fetch`, Basic auth and an `Idempotence-Key` equal to the order id.

1. `POST /shop/orders` checks that nothing in the product is owned, creates the order, then creates a payment with `capture: true` and a redirect confirmation. If the YooKassa call fails, the order is marked `canceled` and the client gets `PAYMENT_PROVIDER_FAILED`.
2. The buyer pays on the YooKassa page.
   - **Web:** the app redirects in the same tab. `YOOKASSA_RETURN_URL` brings the buyer back to `/lobby?order=<id>`, where `ShopOrderReturn` polls the order and shows a toast.
   - **Desktop:** the page opens in the system browser and the settings dialog polls the order.
3. `POST /shop/webhook` (anonymous) takes a notification. **The body is never trusted.** The server re-reads the payment with `GET /payments/{id}`, checks the amount and currency against the order, and then marks the order `succeeded` and inserts the entitlements in one transaction (`skipDuplicates`). `GET /shop/orders/:id` runs the same sync, so a lost webhook only delays delivery.

The webhook is also fenced by `YookassaIpGuard`, which accepts only YooKassa's published notification ranges (`YOOKASSA_WEBHOOK_CIDRS`, the same list GnomeVPN uses, matched with `ipaddr.js`; loopback is allowed outside production) and is exempt from throttling. `OrderSweeperService` re-reads every pending order between 2 minutes and 24 hours old every 5 minutes, so a payment whose notification was lost and whose buyer closed the tab still settles.

With `YOOKASSA_SEND_RECEIPT=true` every payment carries a 54-FZ receipt line (`vat_code: 1`, service, full payment) addressed to the account's email.

Without `YOOKASSA_SHOP_ID` / `YOOKASSA_SECRET_KEY` the shop is disabled (`ShopState.enabled = false`). The catalog still shows, buying is off with a notice, and owned items keep working.

### Android and Google Play

The Android build shows only the "My items" tab. It has no prices and no buy buttons, so the Play payments policy for digital goods is never in play. Purchases happen on the web or on desktop, and the items then show everywhere.

### Double payments and refunds

- Asking for the same product again while its order is still pending returns that order and its payment link. A double click or an abandoned tab does not create a second payment.
- If a payment still lands for items the user already owns (an old pending link, a set after a single item), fulfilment grants nothing new. It logs an error naming the payment so it can be refunded by hand.
- A `refund.succeeded` notification is re-read through `GET /refunds/{id}`. The server then deletes that order's entitlements, takes the refunded items off the profile and marks the order `refunded`.

## Equipping and the owner

`POST /shop/equip` checks ownership, writes the one slot atomically (`jsonb_set`, so two equips at once do not overwrite each other), and patches the person's LiveKit metadata in every room they are in (`patchParticipantMetadataEverywhere`: only the rooms the presence store has them in, and the lobby presence too). The LiveKit token does not grant `canUpdateOwnMetadata`, so a client cannot fake cosmetics, roles or badges in its own metadata. Others see the change live without a rejoin.

The owner (`OWNER_EMAIL`, [roles](roles.md)) holds the `unlockAllCosmetics` permission. `GET /shop` reports every key as owned with `unlockedAll: true`, equip skips the ownership check, and the shop hides sets and shows an "everything is unlocked" notice.

## The settings dialog and the profile popup

Settings is a two-pane dialog in `widgets/app/app-settings`. On the left are the profile card, the grouped tabs (`SETTINGS_GROUPS`: account, customization, voice, app), sub-items that scroll to sections marked with `data-settings-section`, and Log out. On the right are the tab title and hint.

Clicking your own name in the bottom user bar opens a Discord-style profile popup with links to Edit profile, Badges and the shop. Anything can open settings on a given tab with `appEvents.emit.settingsOpen({ tab })`.

## Badges

Badges are earned, never sold. The supporter badge is the only one tied to money: it comes with any successful purchase. `packages/schemas/src/badges` holds the ids and the tier thresholds (`BADGE_TIERS`). `BadgesService` computes every value from data that already exists, so nothing new is tracked:

| Badge       | Value                                  | Tiers         |
| ----------- | -------------------------------------- | ------------- |
| `supporter` | successful shop orders                 | 1             |
| `veteran`   | days since sign-up                     | 30 / 180 / 365 |
| `social`    | accepted friendships                   | 3 / 10 / 25   |
| `chatter`   | text messages sent, not deleted        | 50 / 500 / 5000 |
| `host`      | group rooms owned                      | 1 / 5 / 15    |
| `collector` | owned cosmetics                        | 4 / 12 / 24   |

`GET /badges/me` returns progress for the Badges tab (grid plus a detail panel with the next goal and the tier ladder). `GET /badges/:userId` returns earned badges only, for the badge row on profile cards. Tier colours are bronze, silver and gold. The local easter-egg `achievements` feature is separate and stays client-only.
