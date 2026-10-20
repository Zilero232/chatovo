'use client';

import { Canvas } from '@react-three/fiber';

import type { ChatoCanvasProps } from './ChatoCanvas.types';

import {
  HERO_SCENE_CAMERA,
  HERO_SCENE_COLORS,
  HERO_SCENE_DPR,
  HERO_SCENE_LIGHTS
} from '../../../../../config';
import { HeroMaterialsProvider } from '../../../../../model/contexts';
import { ChatoModel } from '../ChatoModel/ChatoModel';
import { FirstFrame } from '../FirstFrame/FirstFrame';
import { HeroCushion } from '../HeroCushion/HeroCushion';
import { SoundRings } from '../SoundRings/SoundRings';

export const ChatoCanvas = ({ tier, isRunning, eventSource, onReady }: ChatoCanvasProps) => (
  <Canvas
    flat
    camera={{ position: [...HERO_SCENE_CAMERA.position], fov: HERO_SCENE_CAMERA.fov }}
    dpr={[...HERO_SCENE_DPR[tier]]}
    eventSource={eventSource}
    frameloop={isRunning ? 'always' : 'never'}
    gl={{ alpha: true, antialias: tier === 'full', powerPreference: 'low-power' }}
    onCreated={({ camera }) => camera.lookAt(...HERO_SCENE_CAMERA.target)}
  >
    <hemisphereLight
      args={[HERO_SCENE_COLORS.sky, HERO_SCENE_COLORS.ground, HERO_SCENE_LIGHTS.hemisphere]}
    />
    <directionalLight
      intensity={HERO_SCENE_LIGHTS.directional}
      position={[...HERO_SCENE_LIGHTS.directionalPosition]}
    />
    <HeroMaterialsProvider>
      <group position={[...HERO_SCENE_LIGHTS.stageOffset]}>
        <FirstFrame onFrame={onReady} />
        <SoundRings />
        <ChatoModel />
        <HeroCushion />
      </group>
    </HeroMaterialsProvider>
  </Canvas>
);
