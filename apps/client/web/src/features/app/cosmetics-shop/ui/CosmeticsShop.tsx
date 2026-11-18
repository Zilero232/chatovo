import { Button, CenteredState, Spinner } from '@chatovo/ui-kit';
import { Info, Sparkles } from 'lucide-react';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useCosmeticsShop } from '../model/hooks';
import { ShopCategoryTabs, ShopGrid, ShopPreview } from './components';

import s from './CosmeticsShop.module.scss';

export const CosmeticsShop = () => {
  const t = useTranslations('shop');

  const {
    catalog,
    preview,
    category,
    tryOn,
    isPending,
    isError,
    isEnabled,
    isMobileApp,
    isUnlockedAll,
    canPurchase,
    isWatching,
    busyKey,
    isEquipping,
    selectCategory,
    retry,
    buy,
    toggleEquip,
    toggleTryOn,
    resetTryOn
  } = useCosmeticsShop();
  const isEmpty = catalog.items.length === 0 && catalog.bundles.length === 0;

  const notice = match({ isWatching, isEnabled, isMobileApp, isUnlockedAll })
    .with({ isUnlockedAll: true }, () => t('ownerUnlocked'))
    .with({ isWatching: true }, () => t('paymentWaiting'))
    .with({ isMobileApp: false, isEnabled: false }, () => t('disabled'))
    .otherwise(() => null);

  return (
    <div className={s.root}>
      {preview && (
        <ShopPreview isTryingOn={tryOn !== null} preview={preview} onReset={resetTryOn} />
      )}

      {notice && (
        <div className={s.notice}>
          <Info className={s.noticeIcon} />
          <span>{notice}</span>
        </div>
      )}

      <ShopCategoryTabs
        category={category}
        isMobileApp={isMobileApp}
        isUnlockedAll={isUnlockedAll}
        onChange={selectCategory}
      />

      {match({ isPending, isError, isEmpty })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ isError: true }, () => (
          <CenteredState
            action={
              <Button size='sm' type='button' variant='outline' onClick={retry}>
                {t('retry')}
              </Button>
            }
            description={t('loadFailedHint')}
            size='sm'
            title={t('loadFailed')}
          />
        ))
        .with({ isEmpty: true }, () => (
          <CenteredState icon={<Sparkles />} size='sm' title={t(`empty.${category}`)} />
        ))
        .with({ isPending: false, isError: false, isEmpty: P.boolean }, () => (
          <ShopGrid
            busyKey={busyKey}
            canPurchase={canPurchase}
            catalog={catalog}
            isEquipping={isEquipping}
            showPrice={!isMobileApp}
            tryOn={tryOn}
            onBuy={buy}
            onToggleEquip={toggleEquip}
            onTryOn={toggleTryOn}
          />
        ))
        .exhaustive()}
    </div>
  );
};
