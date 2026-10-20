import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import type { SupportGroupProps } from './SupportGroup.types';

import { SUPPORT_GROUP_ICONS, SUPPORT_GROUP_ITEMS } from '../../../config';

import s from '../../SupportPage.module.scss';

export const SupportGroup = async ({ groupKey, locale }: SupportGroupProps) => {
  const t = await getTranslations({ locale, namespace: 'support' });

  const Icon = SUPPORT_GROUP_ICONS[groupKey];

  return (
    <div className={s.group}>
      <div className={s.groupHead}>
        <span aria-hidden className={s.groupIcon}>
          <Icon />
        </span>

        <div>
          <Text as='h2' className={s.groupHeading} weight='semibold'>
            {t(`groups.${groupKey}.heading`)}
          </Text>
          <Text size='sm' tone='muted'>
            {t(`groups.${groupKey}.description`)}
          </Text>
        </div>
      </div>

      <div className={s.items}>
        {SUPPORT_GROUP_ITEMS[groupKey].map((itemKey, index) => (
          <RevealOnScroll
            key={itemKey}
            as='article'
            className={s.item}
            delay={Math.min(index, 4) * 0.05}
          >
            <Text as='h3' className={s.question} weight='semibold'>
              {t(`items.${itemKey}.question`)}
            </Text>
            <Text size='sm' tone='muted'>
              {t(`items.${itemKey}.answer`)}
            </Text>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
};
