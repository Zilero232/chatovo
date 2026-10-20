import { LEGAL, SITE } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';

export const dynamic = 'force-static';

const url = (path: string) => new URL(path, SITE.url).toString();

const LLMS_FULL_TXT = `# ${SITE.name}

> ${SITE.en.description}

## What it is

${SITE.name} is a real-time voice and video room service, built as an open alternative to the
usual group-call apps. You open a room in the browser, share its link, and whoever follows it
lands in the conversation. There is nothing to install to join, and no server to configure.

The same client ships three ways: as a website, as a desktop app for Windows, macOS and Linux
built with Tauri, and as an Android app distributed through Google Play. The desktop build adds
global shortcuts, push-to-talk and a system tray menu that the web version cannot offer.

## How a room works

A room is created from the lobby with a name. It is either open, so anyone with the link can
join, or private, in which case it is protected by a password that is checked before the media
server issues a join token. Room metadata such as its name is public either way, so the client
can render the password prompt; only entry is gated.

Inside a room participants can speak, turn on a camera, share a screen, send chat messages with
file attachments, and send floating emoji reactions. Chat history is stored and reloaded when you
come back. A microphone sensitivity gate cuts background noise before audio is published.

Leaving a room requires either pressing Leave or reloading the page. Navigating to the lobby,
the admin panel or settings keeps the call running and collapses it into a compact bar with the
microphone, sound, return and leave controls.

## Accounts and social features

Sign-in is by email and password, with a reset flow. Each account carries a profile: a display
name, an avatar, a banner color and a short bio. Users can add each other as friends, see who is
online and in which room, and start direct one-to-one voice calls. Direct messages arrive as push
notifications when the app is closed.

Administrators have an admin panel with an overview, user and room management, and abuse report
handling. They can also join rooms in an invisible mode that hides them from the participant
list, and trigger shared sound effects that everyone in the room hears.

## Privacy and pricing

${SITE.name} is free. There is no paid tier, no advertising and no usage limit on room size or
call length. What data is stored, and why, is written out on the privacy page. The media itself
is relayed by a self-hosted LiveKit server rather than a third-party service.

## Technology

- Website: Next.js and React, rendered on the server.
- Web app: Next.js and React, exported as a static app.
- Desktop and mobile shell: Tauri, wrapping the same web app.
- API: NestJS running on Bun, with Prisma and a self-hosted PostgreSQL database.
- Real-time media: LiveKit, a self-hosted WebRTC SFU, with server-issued JWTs.
- Realtime signalling: a WebSocket channel for presence, chat and reactions.
- Authentication: better-auth.
- Shared contracts: Zod schemas shared by the client and the server.

The project is source-available; the full monorepo, its release history and its issue tracker
are public.

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

## Links

- [Source code](${EXTERNAL_LINKS.repository}): the monorepo behind ${SITE.name}.
- [Releases](${EXTERNAL_LINKS.appReleases}): downloadable builds and release notes.
- [Contact](mailto:${LEGAL.supportEmail}): reach the maintainers by email.
`;

export const GET = () =>
  new Response(LLMS_FULL_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
