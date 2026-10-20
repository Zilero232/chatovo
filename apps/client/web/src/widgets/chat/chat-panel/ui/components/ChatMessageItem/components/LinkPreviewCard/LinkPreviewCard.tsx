import { Image } from '@chatovo/ui-kit';
import { motion } from 'motion/react';

import { handleExternalLinkClick } from '@/shared/lib';

import type { LinkPreviewCardProps } from './LinkPreviewCard.types';

import { CHAT_PANEL } from '../../../../../config';
import { useLinkPreview } from '../../../../../model/hooks';

import s from './LinkPreviewCard.module.scss';

export const LinkPreviewCard = ({ url }: LinkPreviewCardProps) => {
  const preview = useLinkPreview(url);

  if (!preview) {
    return null;
  }

  const { title, description, siteName, image } = preview;
  const layout =
    image && image.width >= CHAT_PANEL.linkPreviewCard.largeImageMinWidth ? 'large' : 'thumbnail';

  return (
    <motion.a
      animate={{ opacity: 1 }}
      className={s.card}
      data-layout={layout}
      href={url}
      initial={{ opacity: 0 }}
      rel='noopener noreferrer'
      target='_blank'
      onClick={(event) => handleExternalLinkClick({ event, url })}
    >
      <span className={s.text}>
        <span className={s.site}>{siteName}</span>
        <span className={s.title}>{title}</span>
        {description !== null && <span className={s.description}>{description}</span>}
      </span>

      {image !== null && (
        <Image
          alt=''
          className={s.image}
          height={image.height}
          sizes={layout === 'large' ? '(max-width: 40rem) 80vw, 26rem' : '5rem'}
          src={image.url}
          width={image.width}
        />
      )}
    </motion.a>
  );
};
