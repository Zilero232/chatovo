import { MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_SPOTLIGHTS } from '../../../config';
import { HomeSpotlight } from '../HomeSpotlight/HomeSpotlight';

import s from './HomeSpotlights.module.scss';

export const HomeSpotlights = ({ locale }: HomePageProps) => (
  <MarketingSection className={s.root} id='features'>
    {HOME_SPOTLIGHTS.map((spotlight, index) => (
      <HomeSpotlight
        key={spotlight.key}
        isReversed={index % 2 === 1}
        locale={locale}
        spotlight={spotlight}
      />
    ))}
  </MarketingSection>
);
