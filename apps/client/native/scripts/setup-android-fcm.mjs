import {
  copyFileSync,
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const googleServicesSrc = join(tauriRoot, 'android/google-services.json');
const androidSrc = join(tauriRoot, 'android');
const genRoot = join(tauriRoot, 'gen/android');
const genApp = join(genRoot, 'app');
const appGradlePath = join(genApp, 'build.gradle.kts');
const rootGradlePath = join(genRoot, 'build.gradle.kts');

if (!existsSync(appGradlePath)) {
  console.warn('[fcm] gen/android not found — run `bun android:init` first');
  process.exit(0);
}

// MainActivity (routes a tapped push, bridges the call service), the call
// service and its notification icon: `android init` writes a bare MainActivity,
// so the overlay replaces it and adds the rest on every run.
for (const file of readdirSync(androidSrc).filter((name) => name.endsWith('.kt'))) {
  copyFileSync(join(androidSrc, file), join(genApp, 'src/main/java/chatovo/app', file));
}

cpSync(join(androidSrc, 'res'), join(genApp, 'src/main/res'), { recursive: true });

if (!existsSync(googleServicesSrc)) {
  console.warn('[fcm] android/google-services.json missing — push disabled on Android');
  process.exit(0);
}

copyFileSync(googleServicesSrc, join(genApp, 'google-services.json'));

// `[package.metadata.cargo-android]` only reaches the template on the very first
// `android init`; `tauri android build` re-renders the build files without it,
// so the plugin and its classpath have to be patched in on every run. The
// anchors are matched loosely: pinning them to a version string breaks silently
// the moment Tauri bumps it.
const addClasspath = () => {
  const gradle = readFileSync(rootGradlePath, 'utf8');

  if (gradle.includes('com.google.gms:google-services')) {
    return;
  }

  const patched = gradle.replace(
    /(buildscript\s*\{[\s\S]*?dependencies\s*\{)/,
    '$1\n        classpath("com.google.gms:google-services:4.4.2")'
  );

  if (patched === gradle) {
    throw new Error('[fcm] could not patch the buildscript block in build.gradle.kts');
  }

  writeFileSync(rootGradlePath, patched);
};

const addPlugin = () => {
  const gradle = readFileSync(appGradlePath, 'utf8');

  if (gradle.includes('com.google.gms.google-services')) {
    return;
  }

  const patched = gradle.replace(
    /(plugins\s*\{[\s\S]*?id\("rust"\))/,
    '$1\n    id("com.google.gms.google-services")'
  );

  if (patched === gradle) {
    throw new Error('[fcm] could not patch the plugins block in app/build.gradle.kts');
  }

  writeFileSync(appGradlePath, patched);
};

addClasspath();
addPlugin();

console.info('[fcm] google-services.json and the Kotlin overlay copied, Gradle plugin applied');
