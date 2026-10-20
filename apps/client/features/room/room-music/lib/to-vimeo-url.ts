export type VimeoUrl = `https://vimeo.com/${string}`;

export const toVimeoUrl = (ref: string): VimeoUrl | null =>
  ref.startsWith('https://vimeo.com/') ? (ref as VimeoUrl) : null;
