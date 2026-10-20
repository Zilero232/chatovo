import Image from 'next/image';

import type { HomeDevicesProps } from './HomeDevices.types';

import s from './HomeDevices.module.scss';

export const HomeDevices = ({ locale, desktopAlt, mobileAlt }: HomeDevicesProps) => (
  <div className={s.root}>
    <div className={s.desktop}>
      <div aria-hidden className={s.titlebar}>
        <span />
        <span />
        <span />
      </div>
      <Image
        alt={desktopAlt}
        className={s.shot}
        height={1200}
        sizes='(min-width: 1024px) 520px, 90vw'
        src={`/product/${locale}/room-chat.webp`}
        width={1920}
      />
    </div>

    <div className={s.phone}>
      <Image
        alt={mobileAlt}
        className={s.shot}
        height={1266}
        sizes='180px'
        src={`/product/${locale}/mobile-room.webp`}
        width={585}
      />
    </div>
  </div>
);
