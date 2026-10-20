import { Download, ExternalLink, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import prettyBytes from 'pretty-bytes';

import { DOWNLOAD_PLATFORMS } from '@/entities/release';
import { EXTERNAL_LINKS } from '@/shared/constants';

import type { PlatformGridProps } from './PlatformGrid.types';

import { PlatformCard } from '../PlatformCard/PlatformCard';

import s from './PlatformGrid.module.scss';

export const PlatformGrid = ({ release }: PlatformGridProps) => {
  const t = useTranslations('downloadApp');

  return (
    <div className={s.root}>
      {DOWNLOAD_PLATFORMS.map(({ id, Icon }) => {
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
            label={t(`platforms.${id}`)}
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
