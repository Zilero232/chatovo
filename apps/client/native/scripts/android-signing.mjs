import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { patchAndroidGradle } from './lib/patch-android-gradle.mjs';

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const genRoot = join(tauriRoot, 'gen/android');
const gradlePath = join(genRoot, 'app/build.gradle.kts');
const keystorePath = join(genRoot, 'chatovo.keystore');
const snippetPath = join(tauriRoot, 'scripts/android-signing.kts');

const { ANDROID_KEY_ALIAS, ANDROID_KEY_BASE64, ANDROID_KEY_PASSWORD } = process.env;

if (!ANDROID_KEY_ALIAS || !ANDROID_KEY_PASSWORD || !ANDROID_KEY_BASE64) {
  console.error(
    '[signing] ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD and ANDROID_KEY_BASE64 are required'
  );
  process.exit(1);
}

writeFileSync(keystorePath, Buffer.from(ANDROID_KEY_BASE64, 'base64'));
writeFileSync(
  join(genRoot, 'keystore.properties'),
  [
    `keyAlias=${ANDROID_KEY_ALIAS}`,
    `password=${ANDROID_KEY_PASSWORD}`,
    'storeFile=../chatovo.keystore',
    ''
  ].join('\n')
);

try {
  writeFileSync(
    gradlePath,
    patchAndroidGradle({
      gradle: readFileSync(gradlePath, 'utf8'),
      signingSnippet: readFileSync(snippetPath, 'utf8')
    })
  );
} catch (error) {
  console.error(`[signing] ${error.message}`);
  process.exit(1);
}

console.log('[signing] release signing and native debug symbols wired into build.gradle.kts');
