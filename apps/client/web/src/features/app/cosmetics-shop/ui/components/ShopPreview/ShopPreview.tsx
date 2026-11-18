import { resolveCosmetic } from '@chatovo/schemas';
import { Button } from '@chatovo/ui-kit';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { CosmeticRing, CosmeticTile } from '@/entities/app/shop';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';

import type { ShopPreviewProps } from './ShopPreview.types';

import s from '../../CosmeticsShop.module.scss';

export const ShopPreview = ({ preview, isTryingOn, onReset }: ShopPreviewProps) => {
  const t = useTranslations('shop');

  const { displayName, avatarUrl, verified, developer } = useCurrentUser();

  const ring = resolveCosmetic({ key: preview.speakingRing, kind: 'speakingRing' });
  const frame = resolveCosmetic({ key: preview.avatarFrame, kind: 'avatarFrame' });
  const name = resolveCosmetic({ key: preview.nameStyle, kind: 'nameStyle' });
  const tile = resolveCosmetic({ key: preview.tileBackground, kind: 'tileBackground' });

  return (
    <div className={s.stage}>
      <div className={s.stageHeader}>
        <span className={s.stageCaption}>
          <Sparkles aria-hidden />
          {isTryingOn ? t('trying') : t('previewTitle')}
        </span>
        {isTryingOn && (
          <Button size='xs' type='button' variant='ghost' onClick={onReset}>
            {t('resetTryOn')}
          </Button>
        )}
      </div>

      <div className={s.stageTile}>
        {tile && <CosmeticTile item={tile} />}

        <div className={s.stageAvatar}>
          <UserAvatar
            className={s.stageAvatarImage}
            name={displayName}
            sizes='128px'
            src={avatarUrl}
          />
          {frame && <CosmeticRing className={s.stageFrame} item={frame} />}
          {ring && <CosmeticRing className={s.stageRing} item={ring} />}
        </div>

        <UserName
          className={s.stageName}
          developer={developer}
          gradient={name?.colors}
          gradientAnimated={name?.animated}
          name={displayName}
          size='md'
          verified={verified}
        />
      </div>
    </div>
  );
};
