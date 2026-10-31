import { run } from '@tauri-apps/cli';

import type { RenderIconsInput } from './render-icons.types';

/**
 * Runs `tauri icon`: the full platform set, or only the given PNG `sizes`.
 * A manifest `source` also writes the Android mipmaps into `gen/android`.
 */
export const renderIcons = async ({ source, output, sizes }: RenderIconsInput) => {
  const sizeArgs = sizes ? ['--png', sizes.join(',')] : [];

  await run(['icon', source, '--output', output, ...sizeArgs], 'tauri');
};
