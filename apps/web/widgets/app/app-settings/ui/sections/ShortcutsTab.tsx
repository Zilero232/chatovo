'use client';

import { SHORTCUT_ACTIONS } from '@/entities/app/shortcut';
import { useIsTauriDesktop } from '@/shared/hooks';

import { ShortcutActionRow } from '../components/ShortcutActionRow/ShortcutActionRow';
import { WebNotice } from '../components/WebNotice';

import s from '../AppSettingsButton.module.scss';

export const ShortcutsTab = () => {
  const isDesktop = useIsTauriDesktop();

  if (!isDesktop) {
    return (
      <div className={s.tabPanel}>
        <WebNotice />
      </div>
    );
  }

  return (
    <div className={s.tabPanel}>
      {Object.values(SHORTCUT_ACTIONS).map((actionId) => (
        <ShortcutActionRow key={actionId} actionId={actionId} />
      ))}
    </div>
  );
};
