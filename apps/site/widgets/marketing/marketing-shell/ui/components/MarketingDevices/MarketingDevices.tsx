import Image from 'next/image';

import type { MarketingDevicesProps } from './MarketingDevices.types';

import s from './MarketingDevices.module.scss';

export const MarketingDevices = ({ locale, desktopAlt, mobileAlt }: MarketingDevicesProps) => (
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
