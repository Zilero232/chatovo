'use client';

import { useEffect, useState } from 'react';

import { appEvents } from '@/shared/lib';

import { printConsoleGreeting } from '../../lib/console-greeting';
import { useKonamiCode } from './use-konami-code';

type UseSecretGamesHostParams = {
  onKonami: () => void;
  onSecretOpen: () => void;
};

export const useSecretGamesHost = ({ onKonami, onSecretOpen }: UseSecretGamesHostParams) => {
  const [isSnakeOpen, setIsSnakeOpen] = useState(false);

  useEffect(() => {
    printConsoleGreeting();
  }, []);

  useKonamiCode(() => {
    onKonami();
    setIsSnakeOpen(true);
  });

  appEvents.on.secretGameOpen(() => {
    onSecretOpen();
    setIsSnakeOpen(true);
  });

  return { isSnakeOpen, setIsSnakeOpen };
};
