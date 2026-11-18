import { Tabs, TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { ShopCategory } from '../../../lib/build-shop-catalog';
import type { ShopCategoryTabsProps } from './ShopCategoryTabs.types';

import { SHOP_CATEGORIES } from '../../../config';

import s from '../../CosmeticsShop.module.scss';

export const ShopCategoryTabs = ({
  category,
  isMobileApp,
  isUnlockedAll,
  onChange
}: ShopCategoryTabsProps) => {
  const t = useTranslations('shop.categories');

  const categories = isMobileApp
    ? (['owned'] as const)
    : SHOP_CATEGORIES.filter((id) => !isUnlockedAll || id !== 'bundles');

  return (
    <Tabs
      className={s.categoriesRoot}
      value={category}
      onValueChange={(value) => onChange(value as ShopCategory)}
    >
      <TabsList className={s.categories}>
        {categories.map((id) => (
          <TabsTrigger key={id} className={s.category} value={id}>
            {t(id)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
