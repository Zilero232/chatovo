# Releasing the apps

Desktop installers and the Android bundle ship together from [.github/workflows/release.yml](../../.github/workflows/release.yml). There are no local release scripts.

```text
checks ─ draft ─┬─ desktop (windows, macos-aarch64, macos-x86_64, linux) ─┬─ publish
                └─ android (signed aab) ──────────────────────────────────┘
```

## Cutting a release

The version lives in the root `package.json` only; the per-app manifests stay at `0.0.0`. Bump it, then:

```bash
git tag v1.2.8 && git push --tags
```

The `checks` job refuses a tag that doesn't match the root version, then runs the client build, `bun run verify`, `bun run test` and `bun run lint:rust`. Nothing is signed for a commit that doesn't pass.

A manual run (Actions → release → Run workflow) takes `targets` — `all`, `desktop` or `android` — to rebuild one platform without paying for the other. Either way the release is appended to, never replaced, and stays a draft until `publish` flips it.

## What each job does

- **desktop** — `tauri-action` on a runner per platform (Tauri can't cross-compile). It builds the client itself and merges every platform into one `latest.json` for the updater. macOS ships separate bundles per architecture because the updater keys its platforms on it.
- **android** — `tauri android init` regenerates `gen/android`, then the FCM and signing overlays are applied, then the aab is built for `aarch64` and `x86_64`, attached to the draft and uploaded to Google Play ([below](#google-play-upload)).

## Google Play upload

The `android` job hands the aab to [`r0adkll/upload-google-play`](https://github.com/r0adkll/upload-google-play), which creates a release on the track in the `PLAY_TRACK` repository variable (`production` when unset) and sends it for review. Google publishes it once moderation passes; nothing else is clicked. The step is skipped while `PLAY_SERVICE_ACCOUNT_JSON` is unset, and the aab stays on the GitHub Release for a manual upload either way.

One-time setup:

1. Google Cloud Console, in any project: enable the **Google Play Android Developer API**, create a service account, add a JSON key.
2. Play Console → Users and permissions → Invite new users: the service account's email, with access to Chatovo and the **Release apps to testing tracks** and **Release to production** permissions.
3. GitHub → Settings → Secrets and variables → Actions: the whole JSON file as the `PLAY_SERVICE_ACCOUNT_JSON` secret, and optionally `PLAY_TRACK`.

The version code comes from the root `package.json` version, so every release must bump it — Play rejects a version code it has already seen. "What's new" is filled from the changelog: `apps/client/scripts/write-play-release-notes.ts` takes the entry for the root version in `views/changelog/config/releases.ts`, turns its entry titles into bullets in Russian and English, and cuts them at Play's 500-character limit. A tag whose version has no changelog entry fails the `android` job before the build, so the changelog is written as part of the bump.

## The toolchain

Bun, Node and Rust come from [mise.toml](../../mise.toml) through `.github/actions/setup` (`jdx/mise-action`); a job asks for Rust with `tools: rust`, and the extra Rust targets (macOS arches, Android) through `rust-targets`. The JDK, the Android SDK and the NDK stay with their own actions (`setup-java`, `setup-android`, `setup-ndk`). Bumping bun means `mise.toml` and the `oven/bun` tag in both Dockerfiles.

### 16 KB page size

Google Play refuses an update whose 64-bit native libraries are not 16 KB aligned ([page-sizes guide](https://developer.android.com/guide/practices/page-sizes)). The only native library in the aab is the Rust one, `libchatovo_lib.so` per ABI — no `libc++_shared.so`, and the Gradle dependencies (FCM included) ship none. Two things keep it compliant:

- **ELF alignment.** The `android` job uses NDK r28c, which links 16 KB aligned by default, and [apps/tauri/.cargo/config.toml](../../apps/tauri/.cargo/config.toml) passes `-z max-page-size=16384 -z common-page-size=16384` to the linker for every Android target on top, so an older local NDK cannot regress it. Keep that entry `cfg(target_os = "android")`: the Tauri CLI sets `CARGO_TARGET_<TRIPLE>_RUSTFLAGS` itself and cargo joins it with `cfg` entries only.
- **Zip alignment.** The libs ship uncompressed (`extractNativeLibs="false"`), which needs AGP 8.5.1+; the Tauri template brings AGP 8.11 and no `useLegacyPackaging`, so nothing is set here.

To check a build: `llvm-readelf -lW libchatovo_lib.so` (every `LOAD` `Align` at `0x4000` or more) on the libs in the aab's `base/lib/<abi>/`, and `zipalign -c -P 16 -v 4` on an apk built from it (`bundletool build-apks`).

## Secrets

Listed in the header of `release.yml`: the `NEXT_PUBLIC_*` URLs baked into every bundle, `TAURI_SIGNING_PRIVATE_KEY` for the updater, and `ANDROID_KEY_*` for the Play upload key. The Android keystore is the *upload* key — Play App Signing holds the app key, so the upload key can be rotated from the Console if it leaks ([google-play/signing.md](google-play/signing.md)).
