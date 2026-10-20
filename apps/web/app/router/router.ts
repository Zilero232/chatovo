import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet
} from '@tanstack/react-router';

import { ROUTES } from '@/shared/constants';

import { AuthedLayout } from '../routes/AuthedLayout';
import { NotFound } from '../routes/NotFound';
import { RootRedirect } from '../routes/RootRedirect';
import { RouteError } from '../routes/RouteError';
import { StandaloneLayout } from '../routes/StandaloneLayout';
import {
  lobbySearchSchema,
  parseSearch,
  resetPasswordSearchSchema,
  roomSearchSchema,
  stringifySearch
} from './search';

// Only the root has an error boundary: an error anywhere replaces the layouts below it,
// and a URL nothing matches renders the root not-found page.
const rootRoute = createRootRoute({
  component: Outlet,
  errorComponent: RouteError,
  notFoundComponent: NotFound
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RootRedirect
});

// Lobby, room and admin: the app behind a session. The call lives in this layout,
// so it outlives navigation between these routes.
const authedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authed',
  component: AuthedLayout
});

const lobbyRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: ROUTES.lobby,
  validateSearch: lobbySearchSchema,
  component: lazyRouteComponent(() => import('@/views/lobby'), 'LobbyPage')
});

const roomRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: ROUTES.room,
  validateSearch: roomSearchSchema,
  component: lazyRouteComponent(() => import('@/views/room'), 'RoomPage')
});

const adminRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: ROUTES.admin,
  component: lazyRouteComponent(() => import('@/views/admin'), 'AdminPage')
});

// Auth and account deletion: no app shell, no session required.
const standaloneRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'standalone',
  component: StandaloneLayout
});

const authRoute = createRoute({
  getParentRoute: () => standaloneRoute,
  path: ROUTES.auth,
  component: lazyRouteComponent(() => import('@/views/auth'), 'AuthPage')
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => standaloneRoute,
  path: ROUTES.resetPassword,
  validateSearch: resetPasswordSearchSchema,
  component: lazyRouteComponent(() => import('@/views/reset-password'), 'ResetPasswordPage')
});

const accountDeleteRoute = createRoute({
  getParentRoute: () => standaloneRoute,
  path: ROUTES.accountDelete,
  component: lazyRouteComponent(() => import('@/views/account-delete'), 'AccountDeletePage')
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authedRoute.addChildren([lobbyRoute, roomRoute, adminRoute]),
  standaloneRoute.addChildren([authRoute, resetPasswordRoute, accountDeleteRoute])
]);

export const router = createRouter({
  routeTree,
  parseSearch,
  stringifySearch,
  notFoundMode: 'root'
});
