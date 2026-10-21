import {
  BrandMark,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle
} from '@chatovo/ui-kit';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { SecretClickArea } from '@/features/app/secret-games';
import { AppSidebar } from '@/widgets/app/app-sidebar';
import { UserBar } from '@/widgets/app/user-bar';

import type { MobileNavProps } from './MobileNav.types';

import s from './MobileNav.module.scss';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const t = useTranslations('appSidebar');

  const close = () => onOpenChange(false);

  return (
    <div className={s.topBar}>
      <div className={s.topBarInner}>
        <Sheet
          trigger={
            <Button
              aria-label={t('openMenu')}
              className={s.menuButton}
              size='icon'
              type='button'
              variant='ghost'
            >
              <Menu />
            </Button>
          }
          open={open}
          onOpenChange={onOpenChange}
        >
          <SheetContent
            className={s.sheet}
            modalClassName={s.sheetModal}
            showCloseButton={false}
            side='left'
          >
            <SheetTitle className={s.sheetTitleSr}>{t('menu')}</SheetTitle>
            <SheetDescription className={s.sheetTitleSr}>{t('menuDescription')}</SheetDescription>

            <header className={s.sheetHeader}>
              <BrandMark size={24} />
              <span className={s.sheetBrand}>Chatovo</span>
              <Button
                aria-label={t('closeMenu')}
                size='icon'
                type='button'
                variant='ghost'
                onClick={close}
              >
                <X />
              </Button>
            </header>

            <nav className={s.sheetNav}>
              <AppSidebar variant='menu' onNavigate={close} />
            </nav>

            <UserBar />
          </SheetContent>
        </Sheet>

        <div className={s.brand}>
          <SecretClickArea>
            <BrandMark glow size={28} />
          </SecretClickArea>
          <span className={s.brandTitle}>Chatovo</span>
        </div>
      </div>
    </div>
  );
};
