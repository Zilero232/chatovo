import { join } from 'node:path';

import { TAURI_ROOT } from '../shared/paths';

export const OVERLAY_ROOT = join(TAURI_ROOT, 'android');
export const GOOGLE_SERVICES_PATH = join(OVERLAY_ROOT, 'google-services.json');

export const GEN_ROOT = join(TAURI_ROOT, 'gen/android');
export const GEN_APP_ROOT = join(GEN_ROOT, 'app');
export const ROOT_GRADLE_PATH = join(GEN_ROOT, 'build.gradle.kts');
export const APP_GRADLE_PATH = join(GEN_APP_ROOT, 'build.gradle.kts');

export const KEYSTORE_FILE = 'chatovo.keystore';
export const SIGNING_SNIPPET_PATH = join(TAURI_ROOT, 'scripts/android/signing.kts');
