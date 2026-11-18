import type { SettingsCardProps } from './SettingsCard.types';

import s from '../../AppSettingsButton.module.scss';

export const SettingsCard = ({ children, title }: SettingsCardProps) => (
  <section className={s.card}>
    {title && <h3 className={s.cardTitle}>{title}</h3>}
    <div className={s.cardBody}>{children}</div>
  </section>
);
