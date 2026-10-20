import type { LucideIcon } from 'lucide-react';

import {
  Atom,
  BookOpen,
  Braces,
  Bug,
  Database,
  FlaskConical,
  GitPullRequest,
  HardDrive,
  MonitorDown,
  Rocket,
  Server,
  Waypoints
} from 'lucide-react';

import type { AboutContributeKey, AboutStackKey, AboutStoryKey } from './sections';

export const ABOUT_STORY_ICONS: Record<AboutStoryKey, LucideIcon> = {
  problem: Rocket,
  control: HardDrive,
  openness: BookOpen
};

export const ABOUT_STACK_ICONS: Record<AboutStackKey, LucideIcon> = {
  client: Atom,
  desktop: MonitorDown,
  server: Server,
  media: Waypoints,
  schemas: Braces,
  tooling: FlaskConical
};

export const ABOUT_CONTRIBUTE_ICONS: Record<AboutContributeKey, LucideIcon> = {
  code: GitPullRequest,
  issues: Bug,
  selfHost: Database
};
