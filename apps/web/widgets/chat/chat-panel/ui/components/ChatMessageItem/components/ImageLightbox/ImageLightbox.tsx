import { Button, Dialog, DialogContent, DialogTitle, Image } from '@chatovo/ui-kit';
import { Download, ExternalLink, X } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { useTranslations } from 'use-intl';

import { buildDownloadUrl, openExternal } from '@/shared/lib';

import type { ImageLightboxProps } from './ImageLightbox.types';

import s from './ImageLightbox.module.scss';

export const ImageLightbox = ({
  src,
  name,
  size,
  width,
  height,
  open,
  unoptimized,
  onOpenChange
}: ImageLightboxProps) => {
  const t = useTranslations('chat');
  const tCommon = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content} showCloseButton={false}>
        <header className={s.bar}>
          <div className={s.meta}>
            <DialogTitle className={s.name}>{name}</DialogTitle>
            <span className={s.size}>{prettyBytes(size)}</span>
          </div>

          <Button
            aria-label={tCommon('close')}
            size='icon-sm'
            variant='ghost'
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden />
          </Button>
        </header>

        <figure className={s.figure}>
          <Image
            alt={name}
            className={s.image}
            height={height}
            sizes='(max-width: 90rem) 100vw, 90rem'
            src={src}
            unoptimized={unoptimized}
            width={width}
          />
        </figure>

        <footer className={s.footer}>
          <Button size='sm' variant='ghost' onClick={() => openExternal(src)}>
            <ExternalLink aria-hidden />
            {t('openInBrowser')}
          </Button>

          <Button
            download={name}
            href={buildDownloadUrl({ url: src, name })}
            size='sm'
            variant='secondary'
          >
            <Download aria-hidden />
            {t('download')}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
