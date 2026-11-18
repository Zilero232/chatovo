import { match } from 'ts-pattern';

import { CosmeticRing, CosmeticTile } from '@/entities/app/shop';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';

import type { ItemPreviewProps } from './ItemPreview.types';

import s from '../../CosmeticsShop.module.scss';

export const ItemPreview = ({ item }: ItemPreviewProps) => {
  const { displayName, avatarUrl } = useCurrentUser();

  const avatar = (
    <UserAvatar className={s.previewAvatar} name={displayName} sizes='64px' src={avatarUrl} />
  );

  return match(item.kind)
    .with('speakingRing', () => (
      <div className={s.preview}>
        {avatar}
        <CosmeticRing className={s.previewRingSpeaking} item={item} />
      </div>
    ))
    .with('avatarFrame', () => (
      <div className={s.preview}>
        {avatar}
        <CosmeticRing className={s.previewRing} item={item} />
      </div>
    ))
    .with('nameStyle', () => (
      <div className={s.previewName}>
        <UserName
          gradient={item.colors}
          gradientAnimated={item.animated}
          name={displayName}
          size='md'
        />
      </div>
    ))
    .with('tileBackground', () => (
      <div className={s.previewTile}>
        <CosmeticTile item={item} />
        {avatar}
      </div>
    ))
    .exhaustive();
};
