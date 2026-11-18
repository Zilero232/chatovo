import { Popover, PopoverContent, PopoverTrigger } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { GameActivityCard } from '@/features/app/game-activity';
import { ReportProblemButton } from '@/features/app/report-problem';
import { AppSettingsButton } from '@/widgets/app/app-settings';

import { useProfileMenu } from '../model/hooks';
import { ProfileMenuCard } from './components/ProfileMenuCard/ProfileMenuCard';

import s from './UserBar.module.scss';

export const UserBar = () => {
  const t = useTranslations('channels');
  const tMenu = useTranslations('profileMenu');

  const { avatarUrl, developer, displayName, verified } = useCurrentUser();
  const { isOpen, setIsOpen, openSettings } = useProfileMenu();

  return (
    <div className={s.wrapper}>
      <GameActivityCard />

      <div className={s.root}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger aria-label={tMenu('open')} className={s.identity} variant='ghost'>
            <UserAvatar
              className={s.avatar}
              fallbackClassName={s.fallback}
              name={displayName}
              src={avatarUrl}
            />
            <span className={s.info}>
              <UserName
                className={s.name}
                developer={developer}
                name={displayName}
                verified={verified}
              />
              <span className={s.status}>
                <span className={s.dot}>
                  <span className={s.dotPing} />
                  <span className={s.dotCore} />
                </span>
                {t('online')}
              </span>
            </span>
          </PopoverTrigger>

          <PopoverContent align='start' className={s.popover} side='top' sideOffset={10}>
            <ProfileMenuCard onOpenSettings={openSettings} />
          </PopoverContent>
        </Popover>

        <div className={s.actions}>
          <ReportProblemButton />
          <AppSettingsButton />
        </div>
      </div>
    </div>
  );
};
