'use client';

import type { SecretGamesHostProps } from './SecretGamesHost.types';

import { useSecretGamesHost } from '../../model/hooks';
import { SnakeGame } from '../SnakeGame/SnakeGame';

export const SecretGamesHost = ({ onKonami, onSecretOpen }: SecretGamesHostProps) => {
  const { isSnakeOpen, setIsSnakeOpen } = useSecretGamesHost({ onKonami, onSecretOpen });

  return <SnakeGame isOpen={isSnakeOpen} onOpenChange={setIsSnakeOpen} />;
};
