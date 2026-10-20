import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { MarketingIconGrid, MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { FeaturesGroupProps } from './FeaturesGroup.types';

import { FEATURES_GROUP_IMAGES, FEATURES_GROUP_ITEMS, FEATURES_ITEM_ICONS } from '../../../config';

import s from './FeaturesGroup.module.scss';

export const FeaturesGroup = async ({ groupKey, index, locale }: FeaturesGroupProps) => {
  const t = await getTranslations({ locale, namespace: 'features' });

  const image = FEATURES_GROUP_IMAGES[groupKey];
  const items = FEATURES_GROUP_ITEMS[groupKey].map((itemKey) => ({
    key: itemKey,
    Icon: FEATURES_ITEM_ICONS[itemKey],
    title: t(`items.${itemKey}.title`),
    description: t(`items.${itemKey}.description`)
  }));

  return (
    <MarketingSection className={s.root} id={groupKey}>
      <RevealOnScroll className={s.aside}>
        <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
        <h2 className={s.heading}>{t(`groups.${groupKey}.heading`)}</h2>
        <Text tone='muted'>{t(`groups.${groupKey}.subheading`)}</Text>

        {image && (
          <Image
            alt={t(`groups.${image.altKey}.imageAlt`)}
            className={s.shot}
            height={image.height}
            sizes='(min-width: 1024px) 400px, 100vw'
            src={`/product/${locale}/${image.src}.webp`}
            width={image.width}
          />
        )}
      </RevealOnScroll>

      <MarketingIconGrid columns={2} items={items} />
    </MarketingSection>
  );
};
