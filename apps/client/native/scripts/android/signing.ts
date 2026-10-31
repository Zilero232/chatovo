import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { patchFile } from '../shared/lib/patch-file';
import { APP_GRADLE_PATH, GEN_ROOT, KEYSTORE_FILE, SIGNING_SNIPPET_PATH } from './constants';
import { buildKeystoreProperties } from './lib/build-keystore-properties';
import { patchAndroidGradle } from './lib/patch-gradle';

const { ANDROID_KEY_ALIAS, ANDROID_KEY_BASE64, ANDROID_KEY_PASSWORD } = process.env;

if (!ANDROID_KEY_ALIAS || !ANDROID_KEY_PASSWORD || !ANDROID_KEY_BASE64) {
  console.error(
    '[signing] ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD and ANDROID_KEY_BASE64 are required'
  );
  process.exit(1);
}

writeFileSync(join(GEN_ROOT, KEYSTORE_FILE), Buffer.from(ANDROID_KEY_BASE64, 'base64'));
writeFileSync(
  join(GEN_ROOT, 'keystore.properties'),
  buildKeystoreProperties({
    alias: ANDROID_KEY_ALIAS,
    password: ANDROID_KEY_PASSWORD,
    storeFile: `../${KEYSTORE_FILE}`
  })
);

const signingSnippet = readFileSync(SIGNING_SNIPPET_PATH, 'utf8');

try {
  patchFile({
    path: APP_GRADLE_PATH,
    patch: (gradle) => patchAndroidGradle({ gradle, signingSnippet })
  });
} catch (error) {
  console.error(`[signing] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

console.info('[signing] release signing and native debug symbols wired into build.gradle.kts');
