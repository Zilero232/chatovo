const IS_DEV = process.env.NODE_ENV === 'development';

export const NIGHT_OWL_FROM_HOUR = IS_DEV ? 0 : 3;
export const NIGHT_OWL_TO_HOUR = IS_DEV ? 24 : 5;

export const QUIET_ONE_MINUTES = IS_DEV ? 0.15 : 60;
export const SOLO_CONCERT_MINUTES = IS_DEV ? 0.25 : 30;
export const MUTE_MASTER_TOGGLES = IS_DEV ? 3 : 25;
