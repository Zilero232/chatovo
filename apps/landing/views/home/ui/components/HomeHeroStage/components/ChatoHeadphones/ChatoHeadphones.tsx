'use client';

import { HERO_SCENE_GEOMETRY } from '../../../../../config';
import { useHeroMaterial } from '../../../../../model/contexts';

export const ChatoHeadphones = () => {
  const coral = useHeroMaterial('coral');
  const sun = useHeroMaterial('sun');

  return (
    <group>
      <mesh material={coral} position={[0, 0.05, 0]}>
        <torusGeometry args={[1.06, 0.07, 12, 48, Math.PI]} />
      </mesh>
      {[-HERO_SCENE_GEOMETRY.cupX, HERO_SCENE_GEOMETRY.cupX].map((x) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={coral}>
            <cylinderGeometry args={[0.3, 0.3, 0.24, 28]} />
          </mesh>
          <mesh material={sun} position={[0, x > 0 ? -0.13 : 0.13, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 28]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
