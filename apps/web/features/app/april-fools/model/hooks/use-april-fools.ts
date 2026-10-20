'use client';

import { getDate, getMonth } from 'date-fns';
import { useEffect } from 'react';

import { APRIL_FOOLS_CLASS, APRIL_FOOLS_DAY, APRIL_ZERO_BASED_MONTH } from '../../config/config';

export const useAprilFools = () => {
  useEffect(() => {
    const today = new Date();
    const isAprilFools =
      getMonth(today) === APRIL_ZERO_BASED_MONTH && getDate(today) === APRIL_FOOLS_DAY;

    if (!isAprilFools) {
      return;
    }

    document.documentElement.classList.add(APRIL_FOOLS_CLASS);

    return () => {
      document.documentElement.classList.remove(APRIL_FOOLS_CLASS);
    };
  }, []);
};
