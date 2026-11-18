import { resolveCosmetic } from '@chatovo/schemas';
import { Award, ChevronRight, Palette, Pencil } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { BadgeRow } from '@/entities/app/badges';
import { CosmeticRing } from '@/entities/app/shop';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { FriendTag } from '@/entities/social/friend';
import { getBannerStyle, isTauriMobile } from '@/shared/lib';

import type { ProfileMenuCardProps } from './ProfileMenuCard.types';

import s from '../../UserBar.module.scss';

export const ProfileMenuCard = ({ onOpenSettings }: ProfileMenuCardProps) => {
  const t = useTranslations('profileMenu');

  const { user, displayName, avatarUrl, bannerColor, friendTag, verified, developer, cosmetics } =
    useCurrentUser();

  const isMobileApp = isTauriMobile();
  const frame = resolveCosmetic({ key: cosmetics?.avatarFrame ?? null, kind: 'avatarFrame' });
  const nameStyle = resolveCosmetic({ key: cosmetics?.nameStyle ?? null, kind: 'nameStyle' });

  return (
    <div className={s.card}>
      <div className={s.cardBanner} style={getBannerStyle(bannerColor)} />

      <div className={s.cardBody}>
        <div className={s.cardAvatar}>
          <UserAvatar
            className={s.cardAvatarImage}
            name={displayName}
            sizes='80px'
            src={avatarUrl}
          />
          {frame && <CosmeticRing className={s.cardFrame} item={frame} />}
        </div>

        <UserName
          className={s.cardName}
          developer={developer}
          gradient={nameStyle?.colors}
          gradientAnimated={nameStyle?.animated}
          name={displayName}
          size='md'
          verified={verified}
        />

        <div className={s.cardMeta}>
          {friendTag && <FriendTag tag={friendTag} />}
          {user && <BadgeRow userId={user.id} />}
        </div>

        <div className={s.cardMenu}>
          <button
            className={s.cardMenuItem}
            type='button'
            onClick={() => onOpenSettings('profile')}
          >
            <Pencil aria-hidden />
            {t('editProfile')}
          </button>
          <button className={s.cardMenuItem} type='button' onClick={() => onOpenSettings('badges')}>
            <Award aria-hidden />
            {t('badges')}
            <ChevronRight aria-hidden className={s.cardMenuChevron} />
          </button>
          <button
            className={s.cardMenuItem}
            type='button'
            onClick={() => onOpenSettings('appearance')}
          >
            <Palette aria-hidden />
            {isMobileApp ? t('myItems') : t('shop')}
            {!isMobileApp && <span className={s.cardMenuNew}>{t('new')}</span>}
            <ChevronRight aria-hidden className={s.cardMenuChevron} />
          </button>
        </div>
      </div>
    </div>
  );
};
