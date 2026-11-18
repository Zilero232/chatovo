import type { ShopGridProps } from './ShopGrid.types';

import { BundleCard } from '../BundleCard/BundleCard';
import { ItemCard } from '../ItemCard/ItemCard';

import s from '../../CosmeticsShop.module.scss';

export const ShopGrid = ({
  catalog,
  tryOn,
  busyKey,
  canPurchase,
  showPrice,
  isEquipping,
  onBuy,
  onToggleEquip,
  onTryOn
}: ShopGridProps) => {
  const { items, bundles } = catalog;

  return (
    <>
      {bundles.length > 0 && (
        <ul className={s.bundles}>
          {bundles.map((bundle) => (
            <BundleCard
              key={bundle.key}
              bundle={bundle}
              canPurchase={canPurchase}
              isBuying={busyKey === bundle.key}
              isTryingOn={tryOn === bundle.key}
              onBuy={onBuy}
              onTryOn={onTryOn}
            />
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <ul className={s.grid}>
          {items.map((entry) => (
            <ItemCard
              key={entry.key}
              canPurchase={canPurchase}
              entry={entry}
              isBuying={busyKey === entry.key}
              isEquipping={isEquipping}
              isTryingOn={tryOn === entry.key}
              showPrice={showPrice}
              onBuy={onBuy}
              onToggleEquip={onToggleEquip}
              onTryOn={onTryOn}
            />
          ))}
        </ul>
      )}
    </>
  );
};
