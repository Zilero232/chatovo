import { USER_ROLE } from '@chatovo/schemas';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, bearer } from 'better-auth/plugins';
import { createElement } from 'react';

import { DomainEvent } from '../../common/events/domain-events';
import { emitDomainEvent } from '../../common/events/emit-domain-event';
import { DISABLED_AUTH_PATHS } from '../../config/auth';
import { allowedOrigins } from '../../config/cors';
import { validateEnv } from '../../config/env.schema';
import { basePrisma } from '../../core/base-prisma';
import { issueUniqueFriendTag } from '../../lib';
import { ChangeEmail, DeleteAccount, ResetPassword, sendEmail, VerifyEmail } from '../email';
import { authBaseURL } from './auth-base-url';
import { withClientCallback } from './auth-callback-url';
import { prepareUserDeletion } from './lib/prepare-user-deletion';
import { purgeUserContent } from './lib/purge-user-content';

const env = validateEnv(process.env);

export const auth = betterAuth({
  basePath: '/auth',
  disabledPaths: DISABLED_AUTH_PATHS,
  baseURL: authBaseURL(),
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: allowedOrigins,
  account: {
    storeStateStrategy: 'database',
    skipStateCookieCheck: true
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        react: createElement(ResetPassword, { url })
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        react: createElement(VerifyEmail, { url: withClientCallback(url) })
      });
    }
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        await sendEmail({
          to: user.email,
          subject: 'Approve email change',
          react: createElement(ChangeEmail, { newEmail, url: withClientCallback(url) })
        });
      }
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: 'Confirm account deletion',
          react: createElement(DeleteAccount, { url: withClientCallback(url) })
        });
      },
      beforeDelete: async (user) => {
        await prepareUserDeletion(user.id);
      },
      afterDelete: async (user) => {
        await purgeUserContent(user.id);
      }
    },
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false
      },
      verified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false
      },
      developer: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false
      },
      friendTag: {
        type: 'string',
        required: false,
        input: false
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const friendTag = await issueUniqueFriendTag(user.name);

          return {
            data: {
              ...user,
              role: user.email.toLowerCase() === env.OWNER_EMAIL ? USER_ROLE.owner : USER_ROLE.user,
              friendTag
            }
          };
        },
        after: async (user) => {
          await basePrisma.profile.create({
            data: { userId: user.id, displayName: user.name }
          });

          emitDomainEvent(DomainEvent.UserSignedUp, { name: user.name, email: user.email });
        }
      }
    }
  },
  plugins: [admin({ defaultRole: USER_ROLE.user, adminRoles: [USER_ROLE.admin] }), bearer()],
  database: prismaAdapter(basePrisma, { provider: 'postgresql' })
});
