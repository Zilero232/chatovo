# Android signing

An unsigned release APK will not install on a device — Android reports it as
invalid. The AAB uploaded to Play is signed with the **upload key**; Play App
Signing then re-signs the APKs it generates from it with the **app signing key**,
which Google holds.

## 1. Create the upload key (once)

```bash
keytool -J-Dkeystore.pkcs12.legacy -genkeypair -v \
  -keystore chatovo-release.keystore -alias chatovo \
  -keyalg RSA -keysize 2048 -validity 10000
```

`-J-Dkeystore.pkcs12.legacy` matters only if the key is ever exported with
Google's PEPK tool, which cannot read the PKCS12 algorithms a modern JDK writes
and reports that as `keystore password was incorrect` — with the correct
password. Harmless to keep. Keep both passwords identical: `android-signing.kts`
feeds one property into `keyPassword` and `storePassword` alike.

Keep the keystore and the passwords safe. **Losing them means the app can never
be updated.**

Under Play App Signing the upload key is **rotatable**: if it leaks, request a
new one from the Play Console and keep shipping updates. The app signing key
never changes, but Google holds it — losing the upload key is recoverable,
losing account access is not.

Run it on its own line. In fish, pasting it together with the next command
leaves the password prompt reading from the wrong buffer, and keytool fails with
a password error that has nothing to do with the password.

## 2. GitHub Actions secrets

**Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `ANDROID_KEY_ALIAS` | key alias, e.g. `chatovo` |
| `ANDROID_KEY_PASSWORD` | keystore + key password |
| `ANDROID_KEY_BASE64` | the `.keystore` / `.jks` file itself, base64 |

Encode the keystore:

```bash
# macOS (BSD base64 has no -w; strip the wrapping by hand)
base64 -i chatovo-release.keystore | tr -d '\n' > keystore.base64

# Linux / Git Bash
base64 -w0 chatovo-release.keystore

# PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("chatovo-release.keystore"))
```

`keystore.base64` is not a second artefact — it is the same private key written
as text, because a GitHub secret takes text and not a file. Treat it like the
keystore, delete the local copy once the secret is set, and regenerate it from
the keystore whenever it is needed again.

Verify the round-trip before pasting it (`base64 -D` on macOS, `-d` elsewhere):

```bash
base64 -D -i keystore.base64 -o roundtrip.bin && cmp chatovo-release.keystore roundtrip.bin && echo ok
```

`android-signing.mjs` decodes the secret back with `Buffer.from(…, 'base64')`,
so a stray newline in it breaks the build rather than the paste.

Job `android` in `release.yml` wires signing up after `tauri android init` and
verifies the APK with `apksigner` before uploading.

## 3. Play App Signing

Mandatory for every app created after August 2021, so there is no opt-out.

**Play Console → Release → Setup → App signing.** Two ways in:

- **Let Play generate the app key** (default, simplest). Upload the first AAB
  signed with the keystore from step 1; Play registers it as the upload key.
- **Upload an existing private key** with Google's `pepk.jar`, using the
  encryption key the Console shows on that page. Only needed when an existing
  install base must keep updating — not the case here.

Note for the migration: an app previously distributed elsewhere and re-signed by
that store cannot be updated in place by a Play build. Those installs need a
manual uninstall and reinstall.

## 4. Automated uploads (not wired)

Uploading the AAB is manual today — the aab is attached to the GitHub Release by
job `android` and uploaded from the Play Console by hand.

Automating it later needs a Google Cloud service account with the Play Developer
API enabled, granted release permissions in the Play Console, and its JSON key
in a GitHub secret. It is deliberately left out until the app has shipped once:
the first release has to be created in the Console anyway.

## 5. Local builds


```bash
cp .env.example .env
```

Production URLs for a device build:

```env
NEXT_PUBLIC_API_URL=https://api.chatovo.ru
NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.chatovo.ru
```

After `bun android:init`, configure signing in `apps/client/native/gen/android/` per the
[Tauri docs](https://v2.tauri.app/distribute/sign/android):

1. `gen/android/keystore.properties` — path to the `.keystore`, alias, passwords
2. `gen/android/app/build.gradle.kts` — `signingConfigs` and `signingConfig` on `release`

Then:

```bash
bun android:build
```

The Gradle edits have to be repeated after every `tauri android init` — `gen/` is
regenerated. Locally that is the same script CI runs:

```bash
ANDROID_KEY_ALIAS=chatovo ANDROID_KEY_PASSWORD=... ANDROID_KEY_BASE64=$(base64 -w0 chatovo-release.keystore) \
  node apps/client/native/scripts/android-signing.mjs
```

## 6. What to upload to Play

The AAB only:

```text
apps/client/native/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab
```

Job `android` in `release.yml` attaches it to the draft GitHub Release as
`Chatovo_<version>_android.aab`. Play derives the per-device APKs from it.
