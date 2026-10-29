# The developer badge

Two different things single out the people who build Chatovo, and they do not share a source:

- **The lobby strip** lists GitHub contributors, straight from the repository's API. Nothing about it touches the database.
- **The "Developers" tab and the DEV name badge** are driven by `user.developer` in the database, which marks Chatovo accounts.

Someone can appear in one and not the other: a contributor who never signed up has no account, and an account marked DEV may never have pushed.

## How someone gets the badge

`developer` is a boolean on the `user` table, independent of the role ([roles.md](roles.md)): a moderator or a plain user can carry it, an admin can go without. It is switched in the admin panel (Edit user → Developer badge) by anyone who outranks the person; on your own account only the owner can set it.

The migration that introduced the column (`20261028000000_add_user_developer`) gave it to every admin of the time, so no badge disappeared.

## What reads it

| Surface               | Where                                             | Source                                                 |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| Friends → Developers  | `widgets/social/friends-dialog/.../DevelopersTab` | `GET /users/developers` — every user with `developer` |
| Name badge            | `entities/auth/user/ui/UserName`                  | The same flag, carried on the profile and in LiveKit   |

On the client it is `useDevelopers()` — a TanStack query cached for an hour, since the list changes about never.

## The lobby strip

`LobbyContributors` calls `GET /github/contributors`, which proxies the GitHub API through the server. The proxy exists for two reasons: the response is cached server-side, and GitHub allows only 60 unauthenticated requests an hour per IP — calling it from every client would exhaust that quota quickly.

The strip renders nothing when the list is empty, so a repository with no contributors simply shows no section.

## An empty Developers tab is not a bug

A fresh database marks nobody, so **nothing shows until someone gets the badge** — that is the expected state, not a failure.

## Note on `verified`

`user.verified` is a separate flag with its own badge and no relation to `developer` or the role. Don't conflate them when reading `toUserProfile`.
