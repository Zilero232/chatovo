import { resolveCosmetic } from '@chatovo/schemas';
import { Text } from '@chatovo/ui-kit';

import { BadgeRow } from '@/entities/app/badges';
import { CosmeticRing } from '@/entities/app/shop';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { FriendTag } from '@/entities/social/friend';
import { getBannerStyle } from '@/shared/lib';

import type { ProfileCardProps } from './ProfileCard.types';

import { useUserProfile } from '../../model/hooks';
import { AvatarZoom, ProfileCardSkeleton, ProfileVoiceBlock } from './components';

import s from './ProfileCard.module.scss';

export const ProfileCard = ({ identity, name, renderFriendActions }: ProfileCardProps) => {
  const { user } = useCurrentUser();

  const { data: profile, isLoading } = useUserProfile(identity);

  const isSelf = user?.id === identity;

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const displayName = profile?.name ?? name;
  const frame = resolveCosmetic({
    key: profile?.cosmetics.avatarFrame ?? null,
    kind: 'avatarFrame'
  });
  const nameStyle = resolveCosmetic({
    key: profile?.cosmetics.nameStyle ?? null,
    kind: 'nameStyle'
  });

  return (
    <div className={s.root}>
      <div className={s.banner} style={getBannerStyle(profile?.bannerColor)} />

      <div className={s.body}>
        <div className={s.avatarWrap}>
          <AvatarZoom name={displayName} src={profile?.avatarUrl ?? null}>
            <UserAvatar
              colorize
              className={s.avatar}
              name={displayName}
              size='lg'
              sizes='64px'
              src={profile?.avatarUrl}
            />
          </AvatarZoom>
          {frame && <CosmeticRing className={s.avatarFrame} item={frame} />}
        </div>

        <div className={s.identity}>
          <UserName
            className={s.name}
            developer={profile?.developer ?? false}
            gradient={nameStyle?.colors}
            gradientAnimated={nameStyle?.animated}
            name={displayName}
            profileUrl={profile?.profileUrl}
            size='md'
            verified={profile?.verified ?? false}
          />
          {profile?.friendTag && <FriendTag className={s.tag} tag={profile.friendTag} />}
          <BadgeRow className={s.badges} userId={identity} />
        </div>

        {profile?.bio && (
          <Text className={s.bio} size='sm' tone='muted'>
            {profile.bio}
          </Text>
        )}

        <ProfileVoiceBlock identity={identity} isSelf={isSelf} />

        {!isSelf &&
          profile?.friendTag &&
          renderFriendActions?.({
            userId: identity,
            friendTag: profile.friendTag,
            displayName,
            avatarUrl: profile.avatarUrl ?? null,
            verified: profile.verified ?? false,
            developer: profile.developer ?? false
          })}
      </div>
    </div>
  );
};
