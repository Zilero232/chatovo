'use client';

import { AppSplash } from '@chatovo/ui-kit';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/shared/constants';

const AppRootPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.lobby);
    // eslint-disable-next-line react/exhaustive-deps -- one redirect on mount; router is a stable ref
  }, []);

  return <AppSplash />;
};

export default AppRootPage;
