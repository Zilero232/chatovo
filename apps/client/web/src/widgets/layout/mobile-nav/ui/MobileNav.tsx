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
import { LanguageSwitcher } from '@/widgets/app/language-switcher';
import { ChannelsPanel } from '@/widgets/room/channels-panel';

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

            <div className={s.sheetBody}>
              <div className={s.sheetRail}>
                <Button
                  aria-label={t('closeMenu')}
                  className={s.sheetClose}
                  size='icon'
                  type='button'
                  variant='ghost'
                  onClick={close}
                >
                  <X />
                </Button>

                <AppSidebar
                  channelsOpened={false}
                  showToggleChannels={false}
                  onNavigate={close}
                  onToggleChannels={() => undefined}
                />
              </div>

              <div className={s.sheetChannels}>
                <ChannelsPanel variant='drawer' onNavigate={close} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className={s.brand}>
          <SecretClickArea>
            <BrandMark glow size={28} />
          </SecretClickArea>
          <span className={s.brandTitle}>Chatovo</span>
        </div>

        <LanguageSwitcher />
      </div>
    </div>
  );
};
