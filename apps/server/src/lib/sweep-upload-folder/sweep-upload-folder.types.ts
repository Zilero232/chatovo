export type SweepUploadFolderInput = {
  folder: string;
  maxAgeMs: number;
};

export type SweepUploadFolderResult = {
  removed: number;
  total: number;
};
