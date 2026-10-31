import { join } from 'node:path';

import {
  ICO_SIZES,
  ICONS_ROOT,
  MANIFEST_PATH,
  SOURCES_ROOT,
  TRAY_SIZES,
  TRAY_TEMPLATE_SIZES
} from './constants';
import { buildIco } from './lib/build-ico';
import { renderIcons } from './lib/render-icons';

// Every native icon from the SVGs — docs/architecture/app-icons.md.
await renderIcons({ source: MANIFEST_PATH, output: ICONS_ROOT });

await renderIcons({
  source: join(SOURCES_ROOT, 'app-icon-macos.svg'),
  output: join(ICONS_ROOT, 'macos')
});

await buildIco({
  source: join(SOURCES_ROOT, 'app-icon.svg'),
  pngRoot: join(ICONS_ROOT, 'ico'),
  output: join(ICONS_ROOT, 'icon.ico'),
  sizes: ICO_SIZES
});

await renderIcons({
  source: join(SOURCES_ROOT, 'tray-icon.svg'),
  output: join(ICONS_ROOT, 'tray'),
  sizes: TRAY_SIZES
});

await renderIcons({
  source: join(SOURCES_ROOT, 'tray-icon-template.svg'),
  output: join(ICONS_ROOT, 'tray-template'),
  sizes: TRAY_TEMPLATE_SIZES
});

console.info('[icons] app, macOS, .ico, tray and tray template icons generated');
