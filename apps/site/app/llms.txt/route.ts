import { LEGAL, SITE } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';

export const dynamic = 'force-static';

const url = (path: string) => new URL(path, SITE.url).toString();

const LLMS_TXT = `# ${SITE.name}

> ${SITE.en.description}

${SITE.name} is a real-time voice and video room service. Anyone can open a room in the browser,
share its link, and talk with screen sharing and chat. Rooms can be public or private with a
password. The same client ships as a desktop app for Windows, macOS and Linux, and as an Android
app. The project is source-available and developed in the open.

## Pages

- [Home](${url(ROUTES.home)}): what ${SITE.name} is, how a room works, and how to start one.
- [Home (English)](${url(ROUTES.homeEn)}): the English version of the home page.
- [Features](${url(ROUTES.features)}): voice and video rooms, screen sharing, chat, friends and direct calls, private rooms, desktop and mobile apps.
- [Download](${url(ROUTES.download)}): desktop builds for Windows, macOS and Linux, plus the Android app.
- [Changelog](${url(ROUTES.changelog)}): every release since the first public version, with what changed in each.
- [About](${url(ROUTES.about)}): the stack behind ${SITE.name}, the people who build it, and how to contribute.
- [Support](${url(ROUTES.support)}): answers to common questions and how to reach the maintainers.
- [Privacy policy](${url(ROUTES.privacy)}): what data ${SITE.name} stores and why.
- [Terms of service](${url(ROUTES.terms)}): the rules for using ${SITE.name}.

Every page above also exists in English under the /en prefix, for example [Features (English)](${url('/en/features')}).

## Technology

- Web client: Next.js and React, exported as a static site.
- Desktop and mobile shell: Tauri.
- API: NestJS running on Bun, with Prisma and PostgreSQL.
- Real-time media: LiveKit, a self-hosted WebRTC SFU.
- Authentication: better-auth.

## Optional

- [Full description](${url('/llms-full.txt')}): the same site described at length in one file.
- [Source code](${EXTERNAL_LINKS.repository}): the monorepo behind ${SITE.name}.
- [Releases](${EXTERNAL_LINKS.appReleases}): downloadable builds and release notes.
- [Contact](mailto:${LEGAL.supportEmail}): reach the maintainers by email.
`;

export const GET = () =>
  new Response(LLMS_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
