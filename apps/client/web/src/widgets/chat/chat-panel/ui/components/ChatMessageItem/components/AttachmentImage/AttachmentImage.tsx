import { IMAGE_PROCESSABLE_MIMES } from '@chatovo/schemas';
import { Image } from '@chatovo/ui-kit';
import { useState } from 'react';

import type { AttachmentImageProps } from './AttachmentImage.types';

import { CHAT_PANEL } from '../../../../../config';
import { ImageLightbox } from '../ImageLightbox/ImageLightbox';

import s from './AttachmentImage.module.scss';

export const AttachmentImage = ({ attachment }: AttachmentImageProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { url, name, size, mime, image } = attachment;
  const { width, height } = image ?? CHAT_PANEL.imageFallbackSize;
  const unoptimized = !IMAGE_PROCESSABLE_MIMES.includes(mime);

  return (
    <>
      <button className={s.button} type='button' onClick={() => setIsPreviewOpen(true)}>
        <Image
          alt={name}
          blurDataURL={image?.placeholder}
          className={s.image}
          height={height}
          placeholder={image ? 'blur' : 'empty'}
          sizes='(max-width: 40rem) 85vw, 32rem'
          src={url}
          unoptimized={unoptimized}
          width={width}
        />
      </button>

      <ImageLightbox
        height={height}
        name={name}
        open={isPreviewOpen}
        size={size}
        src={url}
        unoptimized={unoptimized}
        width={width}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
};
