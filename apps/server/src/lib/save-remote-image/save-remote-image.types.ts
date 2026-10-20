export type SaveRemoteImageInput = {
  url: string;
  folder: string;
  maxBytes: number;
  maxWidth: number;
  quality: number;
};

export type SavedRemoteImage = {
  url: string;
  width: number;
  height: number;
};
