import type { ShopCategory } from '../../../lib/build-shop-catalog';

export type ShopCategoryTabsProps = {
  category: ShopCategory;
  isMobileApp: boolean;
  isUnlockedAll: boolean;
  onChange: (category: ShopCategory) => void;
};
