import type { HomeStepKey } from '../../../config';

export type HomeStepFragmentLabels = {
  create: string;
  talk: string;
};

export type HomeStepFragmentProps = {
  step: HomeStepKey;
  labels: HomeStepFragmentLabels;
};
