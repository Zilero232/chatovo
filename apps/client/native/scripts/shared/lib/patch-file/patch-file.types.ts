export type PatchFileInput = {
  path: string;
  patch: (content: string) => string;
};
