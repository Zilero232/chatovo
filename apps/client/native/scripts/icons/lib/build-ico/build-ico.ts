import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pngToIco from 'png-to-ico';

import type { BuildIcoInput } from './build-ico.types';

import { renderIcons } from '../render-icons';

/** Renders `source` at every size into `pngRoot` and packs those PNGs into one `.ico`. */
export const buildIco = async ({ source, pngRoot, output, sizes }: BuildIcoInput) => {
  await renderIcons({ source, output: pngRoot, sizes });

  const pngs = sizes.map((size) => join(pngRoot, `${size}x${size}.png`));

  writeFileSync(output, await pngToIco(pngs));
};
