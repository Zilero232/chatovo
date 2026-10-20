export const HERO_SCENE_COLORS = {
  fur: '#f5ecdf',
  belly: '#fff8ec',
  ink: '#3a2850',
  ear: '#ff9f86',
  coral: '#ff7a59',
  sun: '#ffcf5c',
  cushion: '#e8664a',
  cushionTrim: '#ff9f86',
  shadow: '#08040a',
  sky: '#fff1dd',
  ground: '#2a1d3a'
} as const;

export const HERO_SCENE_CAMERA = {
  position: [0, 0.35, 12.5],
  target: [0, 0.1, 0],
  fov: 30
} as const;

export const HERO_SCENE_DPR = { full: [1, 1.75], lite: [1, 1.25] } as const;

export const HERO_SCENE_MOTION = {
  headTurn: 0.38,
  headTilt: 0.18,
  followEase: 4,
  bobSpeed: 2.2,
  bobHeight: 0.035,
  blinkEveryMs: [2600, 5200],
  blinkMs: 130,
  tailSpeed: 1.4,
  tailSwing: 0.22,
  ringPeriod: 2.4,
  ringCount: 3,
  ringGrowth: 0.85,
  ringOpacity: 0.28,
  maxFrameDelta: 0.1
} as const;

export const HERO_TOON_STEPS = [90, 180, 255] as const;

export const HERO_SCENE_LIGHTS = {
  hemisphere: 1.6,
  directional: 1.8,
  directionalPosition: [3, 5, 4],
  stageOffset: [0, -0.1, 0]
} as const;

export const HERO_SCENE_GEOMETRY = {
  earX: 0.62,
  eyeX: 0.32,
  cupX: 1.02
} as const;

export const HERO_STAGE_FADE = { duration: 0.6 } as const;
