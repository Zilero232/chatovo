export const normalizeMessage = (raw: string) =>
  raw
    .replace(/[^\S\n]+$/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
