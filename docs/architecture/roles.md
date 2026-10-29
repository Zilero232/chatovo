# Roles and permissions

Four fixed roles, ranked. Every check asks for a **permission**, never a role name, and every action on another person asks whether the actor **outranks** them. Both rules live in one place, `packages/schemas/src/auth/roles.ts`, and the server and the client import the same functions.

| Rank | Role        | Permissions                                                                                  |
| ---- | ----------- | -------------------------------------------------------------------------------------------- |
| 3    | `owner`     | everything an admin has; untouchable                                                         |
| 2    | `admin`     | `adminPanel`, `manageRoles`, `blockUsers` + everything a moderator has                       |
| 1    | `moderator` | `moderateAnyRoom`, `invisible`, `seeInvisible`, `bypassRoomBans` — no admin panel            |
| 0    | `user`      | none                                                                                         |

`role` is a plain string column on `user`; `toUserRole` reads anything unknown as `user`, so a stray value never grants anything.

## The hierarchy rule

`canActOnRole({ actorRole, targetRole })`: anyone may act on a plain user (the room owner moderating their room is a plain user), and only a **strictly higher** rank may act on staff. So an admin can't kick, ban, mute, block, edit or delete the messages of another admin, a moderator can't touch an admin, and nobody can touch the owner.

It is enforced in:

- room moderation — `assertModerationTarget` (kick, ban, mute), on top of "not yourself, not the room's owner";
- chat — deleting someone else's message (`assertSenderNotProtected`);
- the admin panel — `assertCanEditUser` (profile, flags, role) and `UserBlockService.block`.

The client mirrors it to hide what would be refused: the participant menu, the chat message actions and the admin user row read the same function. The server never trusts that.

## The owner

There is exactly one, and it is set **only by config**: `OWNER_EMAIL` in the server `.env`.

- On every start `OwnerRoleService` promotes the account with that email and demotes any other `owner` to `admin`.
- An account that signs up with that email gets the role at sign-up.
- No endpoint can grant or take `owner`: `assignableRoles` never includes it, and the admin schema excludes it.

Moving ownership is a change to `.env` and a restart. Without `OWNER_EMAIL` there is no owner, and admins simply can't touch each other.

## Handing out roles

`assignableRoles(actorRole)` — strictly below your own rank, never `owner`: the owner hands out `admin`, `moderator`, `user`; an admin hands out `moderator`, `user`. Nobody changes their own role (`BLOCK_SELF`). Verified and DEV on your own account can be set only by the owner. A role change closes the person's realtime socket and LiveKit sessions (`dropPrivileges`), so the new rights apply at once.

The better-auth admin plugin stays mounted for its ban columns, but every `/auth/admin/*` route is off (`DISABLED_AUTH_PATHS` in `src/config/auth.ts`). Otherwise any admin could call its `set-role` and step around the hierarchy.

## Errors

| Code                  | When                                                     |
| --------------------- | -------------------------------------------------------- |
| `ADMIN_ONLY`          | a `/moderation` route without `adminPanel`               |
| `ROLE_PROTECTED`      | the target ranks as high as you or higher                |
| `ROLE_NOT_ASSIGNABLE` | the role is not below yours, or it is `owner`            |
| `BLOCK_SELF`          | changing your own role                                   |

## The DEV badge

Separate from the role — see [developer-role.md](developer-role.md).
