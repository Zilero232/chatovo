import { Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { getRelease } from '@/entities/release';
import { EXTERNAL_LINKS } from '@/shared/constants';

import type { DownloadPlatformsProps } from './DownloadPlatforms.types';

import { PlatformGrid } from '../PlatformGrid/PlatformGrid';

import s from '../../DownloadPage.module.scss';

export const DownloadPlatforms = async ({ locale }: DownloadPlatformsProps) => {
  const t = await getTranslations({ locale, namespace: 'downloadApp' });

  const release = await getRelease();

  return (
    <div className={s.platforms}>
      {release ? (
        <Text size='sm' tone='muted'>
          {t('version', { version: release.version })}
        </Text>
      ) : (
        <Text size='sm' tone='muted'>
          {t('loadFailed')}{' '}
          <a
            className={s.inlineLink}
            href={EXTERNAL_LINKS.appReleases}
            rel='noopener noreferrer'
            target='_blank'
          >
            {t('openReleases')}
          </a>
        </Text>
      )}

      <PlatformGrid release={release} />
    </div>
  );
};
