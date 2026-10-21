import { PlatformCard } from '@chatovo/ui-kit';
import { Download, ExternalLink, Smartphone } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { useTranslations } from 'use-intl';

import { DOWNLOAD_PLATFORMS } from '@/entities/app/release';
import { EXTERNAL_LINKS } from '@/shared/constants';

import type { PlatformGridProps } from './PlatformGrid.types';

import s from './PlatformGrid.module.scss';

export const PlatformGrid = ({ release }: PlatformGridProps) => {
  const t = useTranslations('downloadApp');

  return (
    <div className={s.root}>
      {DOWNLOAD_PLATFORMS.map(({ id, labelKey, Icon }) => {
        const asset = release?.assets[id];

        return (
          <PlatformCard
            key={id}
            link={
              asset && {
                actionLabel: t('downloadAction'),
                caption: prettyBytes(asset.sizeBytes),
                download: true,
                href: asset.downloadUrl,
                ActionIcon: Download
              }
            }
            Icon={Icon}
            label={t(`platforms.${labelKey}`)}
            unavailableLabel={t('notAvailable')}
          />
        );
      })}

      <PlatformCard
        link={{
          actionLabel: t('storeAction'),
          caption: t('googlePlay'),
          href: EXTERNAL_LINKS.googlePlay,
          ActionIcon: ExternalLink
        }}
        Icon={Smartphone}
        label={t('platforms.android')}
      />
    </div>
  );
};
