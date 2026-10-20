export type SoundPlayer<TKey extends string> = {
  dispose: () => void;
  get: (key: TKey) => HTMLAudioElement;
  play: (key: TKey, volume?: number) => HTMLAudioElement;
};

export type CreateSoundPlayerInput<TKey extends string> = {
  sources: Record<TKey, string>;
  defaultVolume?: number;
};
