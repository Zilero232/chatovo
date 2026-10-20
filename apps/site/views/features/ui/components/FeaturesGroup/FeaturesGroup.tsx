import { getTranslations } from 'next-intl/server';

import { MarketingIconGrid } from '@/widgets/marketing/marketing-shell';

import type { FeaturesGroupProps } from './FeaturesGroup.types';

import { FEATURES_GROUP_ITEMS, FEATURES_ITEM_ICONS } from '../../../config';

export const FeaturesGroup = async ({ groupKey, locale }: FeaturesGroupProps) => {
  const t = await getTranslations({ locale, namespace: 'features' });

  const items = FEATURES_GROUP_ITEMS[groupKey].map((itemKey) => ({
    key: itemKey,
    Icon: FEATURES_ITEM_ICONS[itemKey],
    title: t(`items.${itemKey}.title`),
    description: t(`items.${itemKey}.description`)
  }));

  return (
    <MarketingIconGrid
      description={t(`groups.${groupKey}.subheading`)}
      heading={t(`groups.${groupKey}.heading`)}
      id={groupKey}
      items={items}
    />
  );
};
