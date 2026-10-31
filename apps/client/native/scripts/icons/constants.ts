import { join } from 'node:path';

import { TAURI_ROOT } from '../shared/paths';

export const MANIFEST_PATH = join(TAURI_ROOT, 'icon.manifest.json');
export const SOURCES_ROOT = join(TAURI_ROOT, '../web/assets/icons');
export const ICONS_ROOT = join(TAURI_ROOT, 'icons');

// Every size Windows requests across 100–400 % scaling; Tauri's own .ico has six.
export const ICO_SIZES = [16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 128, 256];

export const TRAY_SIZES = [16, 20, 24, 32, 40, 48, 64];

export const TRAY_TEMPLATE_SIZES = [36];
