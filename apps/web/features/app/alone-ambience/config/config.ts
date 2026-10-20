const IS_DEV = process.env.NODE_ENV === 'development';

export const ALONE_AMBIENCE_SRC = '/audios/easter-eggs/alone-lofi.mp3';

export const ALONE_TARGET_VOLUME = 0.12;

export const ALONE_FADE_STEP_MS = 80;

export const ALONE_AFTER_MS = IS_DEV ? 5_000 : 5 * 60_000;

export const ALONE_FADE_MS = IS_DEV ? 1000 : 4000;
