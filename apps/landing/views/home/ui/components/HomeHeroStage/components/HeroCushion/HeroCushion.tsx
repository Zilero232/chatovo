'use client';

import { HERO_SCENE_COLORS } from '../../../../../config';
import { useHeroMaterial } from '../../../../../model/contexts';

export const HeroCushion = () => {
  const cushion = useHeroMaterial('cushion');
  const trim = useHeroMaterial('cushionTrim');

  return (
    <group position={[0, -1.55, 0]}>
      <mesh material={cushion} scale={[1, 0.32, 1]}>
        <sphereGeometry args={[1.75, 48, 24]} />
      </mesh>
      <mesh material={trim} position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, 0.05, 10, 64]} />
      </mesh>
      <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 48]} />
        <meshBasicMaterial transparent color={HERO_SCENE_COLORS.shadow} opacity={0.4} />
      </mesh>
    </group>
  );
};
