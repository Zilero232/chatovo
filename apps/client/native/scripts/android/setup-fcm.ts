import { copyFileSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { patchFile } from '../shared/lib/patch-file';
import {
  APP_GRADLE_PATH,
  GEN_APP_ROOT,
  GOOGLE_SERVICES_PATH,
  OVERLAY_ROOT,
  ROOT_GRADLE_PATH
} from './constants';
import { addGoogleServicesClasspath, applyGoogleServicesPlugin } from './lib/patch-fcm-gradle';

if (!existsSync(APP_GRADLE_PATH)) {
  console.warn('[fcm] gen/android not found — run `bun android:init` first');
  process.exit(0);
}

// MainActivity (routes a tapped push, bridges the call service), the call
// service and its notification icon: `android init` writes a bare MainActivity,
// so the overlay replaces it and adds the rest on every run.
for (const file of readdirSync(OVERLAY_ROOT).filter((name) => name.endsWith('.kt'))) {
  copyFileSync(join(OVERLAY_ROOT, file), join(GEN_APP_ROOT, 'src/main/java/chatovo/app', file));
}

cpSync(join(OVERLAY_ROOT, 'res'), join(GEN_APP_ROOT, 'src/main/res'), { recursive: true });

if (!existsSync(GOOGLE_SERVICES_PATH)) {
  console.warn('[fcm] android/google-services.json missing — push disabled on Android');
  process.exit(0);
}

copyFileSync(GOOGLE_SERVICES_PATH, join(GEN_APP_ROOT, 'google-services.json'));

// `[package.metadata.cargo-android]` only reaches the template on the very first
// `android init`; `tauri android build` re-renders the build files without it,
// so the plugin and its classpath have to be patched in on every run.
try {
  patchFile({ path: ROOT_GRADLE_PATH, patch: addGoogleServicesClasspath });
  patchFile({ path: APP_GRADLE_PATH, patch: applyGoogleServicesPlugin });
} catch (error) {
  console.error(`[fcm] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

console.info('[fcm] google-services.json and the Kotlin overlay copied, Gradle plugin applied');
