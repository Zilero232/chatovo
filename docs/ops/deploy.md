# Deploying Chatovo on Timeweb Cloud

This document describes how to deploy Chatovo on a single Timeweb Cloud VPS
and set up automatic deployment through GitHub Actions.

## Architecture

Everything runs on one VPS. The site, the app, the API and LiveKit are split
across subdomains of a single domain, `chatovo.ru`:

| Subdomain            | What it serves                      |
| -------------------- | ----------------------------------- |
| `chatovo.ru`         | Public site (the `site` container)  |
| `app.chatovo.ru`     | The app, with the lobby at its root |
| `api.chatovo.ru`     | NestJS API (Bun)                    |
| `livekit.chatovo.ru` | LiveKit SFU (WSS signalling)        |

The site and the app are **two separate apps**. The app (`apps/web`) is a
Vite single-page app baked into the `web` image, whose Caddy serves it on
`app.chatovo.ru`. The site (`apps/site`) is a server-rendered Next.js app in its
own `site` container; Caddy reverse-proxies `chatovo.ru` to `site:3000`.

Each host sends the other's paths across with a 301, so old links keep working:
`chatovo.ru` redirects `/lobby`, `/room`, `/auth`, `/admin` and
`/account/delete` to `app.chatovo.ru` — the session lives in that origin's
storage, so an app page opened on the site host would look signed out — and
`app.chatovo.ru` redirects `/features`, `/download`, `/changelog`, `/about`,
`/support`, `/privacy`, `/terms` and `/en` to `chatovo.ru`.

The web app, the site and the server are packaged as Docker images — the images are built
in CI and published to the private GitHub Container Registry (ghcr.io). The VPS
builds nothing: it only pulls ready-made images and runs them.

```text
   push to master
        │
        ▼
   GitHub Actions:  builds 3 images  ──►  ghcr.io (private registry)
        │                                        │
        │ SSH                                    │ pull
        ▼                                        ▼
   ┌──────────────── VPS (Timeweb Cloud) ─────────────────┐
   │                                                       │
   │  web      — Caddy + the app's static files, terminates│
   │             HTTPS for chatovo.ru / app.chatovo.ru /   │
   │             api.chatovo.ru / livekit.chatovo.ru;      │
   │             ports 80/443 exposed                      │
   │  site     — Next.js server, :3000 (network-internal)  │
   │  server   — NestJS on Bun, :4000 (network-internal)   │
   │  livekit  — SFU, host networking, 7881/tcp + UDP media│
   │  postgres — self-hosted PostgreSQL, :5432             │
   │                                                       │
   └───────────────────────────────────────────────────────┘
```

- **Web app** — Vite + React SPA. The `chatovo-web` image builds `apps/web/dist`
  and serves it through the bundled Caddy (every unknown path falls back to
  `index.html`), which terminates
  HTTPS for all four subdomains. This is the only container facing the internet.
- **Site** — Next.js with `output: 'standalone'`. The `chatovo-site` image runs
  `node apps/site/server.js` on port 3000 inside the docker network; Caddy
  proxies `chatovo.ru` → `site:3000`. It reads release and contributor data
  from the API over the compose network (`API_INTERNAL_URL=http://server:4000`,
  set in `docker-compose.yml`), so it needs no public API URL and no CORS entry.
  It must bind `HOSTNAME=0.0.0.0` (the Dockerfile sets it —
  [pitfalls](../architecture/pitfalls.md#site)). A healthcheck fetches
  `/robots.txt`.
- **Server** — NestJS on Bun. The `chatovo-server` image listens on port 4000
  inside the docker network only — from outside it is reachable solely through
  `web` (Caddy proxies `api.chatovo.ru` → `server:4000`).
- **LiveKit** — our own SFU on the same VPS, container `livekit/livekit-server`
  (pinned to a specific version, not `latest`). Caddy proxies
  `wss://livekit.chatovo.ru` to the signalling port. WebRTC media traffic goes
  directly over the UDP range 50000–50100 (see below).
- **Registry** — the `chatovo-web`, `chatovo-site` and `chatovo-server` images live in the
  private ghcr.io. CI publishes them with the built-in `GITHUB_TOKEN`; the VPS
  pulls with a personal access token (PAT). The LiveKit image comes straight
  from Docker Hub.
- **DB** — self-hosted PostgreSQL, the `postgres` container in the same compose
  file (data in the `pgdata` volume). Auth is better-auth on top of that same
  database. The schema is applied by the deploy workflow through Prisma
  migrations (`db:baseline` + `db:deploy`).
- **Tauri** — the desktop app is built separately by the release workflow and is
  not deployed to the VPS.

```text
   Browser / Tauri
        │
        │ HTTPS + WSS
        ▼
   ┌──────── VPS ────────────────────────────────────────────────┐
   │                                                             │
   │  Caddy (web container)                                      │
   │     • chatovo.ru          → site:3000 (Next.js server)      │
   │     • app.chatovo.ru      → app static files                │
   │     • api.chatovo.ru      → server:4000 (NestJS)            │
   │     • livekit.chatovo.ru  → host.docker.internal:7880 (WSS) │
   │                                                             │
   │  livekit (host network)                                     │
   │     • :7880/tcp       WebSocket signalling (behind Caddy)   │
   │     • :7881/tcp       TURN/TCP fallback (public)            │
   │     • :50000-50100/udp  WebRTC media (public)               │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
```

## Environment variables — how this works

There is **one `.env` file**, used both locally and on the VPS. Only the values
inside differ. Only the `.env.example` template is committed to git.

Server variables:

1. On the VPS you create a `.env` file in the working directory
   (`/opt/chatovo/.env`), using `.env.example` from the repository as the
   template. The file lives physically on the server; it is not in git.
2. When the container starts, Docker reads it — the `env_file: ./.env` line in
   `docker-compose.yml` — and puts the variables into the process environment.
3. The server reads them through `process.env`, and a Zod schema
   (`apps/server/src/lib/env.ts`) checks that everything is present.

The server's `SITE_URL` (default `https://chatovo.ru`, so production needs
nothing) is where room link previews take their OG image from:
`${SITE_URL}/opengraph-image`.

Web and site variables (`NEXT_PUBLIC_*`):

- They are baked into the web export and the site build **at image build
  time**. CI passes them to `docker build` as build-args, taking the values from
  GitHub Secrets. These are not secrets — they are visible in the browser bundle
  anyway. The site uses `NEXT_PUBLIC_APP_URL` for its links into the app.
- `API_INTERNAL_URL` is a runtime variable of the `site` container only, set in
  `docker-compose.yml`. Locally it is empty and the site falls back to
  `NEXT_PUBLIC_API_URL`, then `http://localhost:4000`.

## What lives in the repository

| File                           | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| `apps/web/Dockerfile`          | Web image: Vite SPA build + Caddy; built in CI      |
| `apps/site/Dockerfile`         | Site image: Next.js standalone on Node; built in CI |
| `apps/server/Dockerfile`       | Server image (Bun + Prisma); built in CI            |
| `infra/caddy/Caddyfile`        | Caddy config (copied into the web image)            |
| `infra/livekit/livekit.yaml`   | Config template for the self-hosted LiveKit server  |
| `docs/ops/deploy.md`           | This document — the deployment guide                |
| `docker-compose.yml`           | Runs web + site + server + postgres + livekit       |
| `.github/workflows/deploy.yml` | CI/CD: build the images → deploy                    |
| `.env.example`                 | Template for the shared web, site and server variables |

---

## Part 1. Preparing the VPS (once)

### 1.1. Create the server

In the Timeweb Cloud panel, create a cloud server:

- OS: **Ubuntu 24.04 LTS**
- Plan: at least **1 vCPU / 2 GB RAM** (the VPS only runs images — the build
  happens in CI, so it does not need many resources).
- Write down the public **IP address** you are given.

### 1.2. Configure DNS

In the settings for the `chatovo.ru` domain, add A-records pointing at the
server IP:

| Type | Name      | Value         |
| ---- | --------- | ------------- |
| A    | `@`       | `<server IP>` |
| A    | `www`     | `<server IP>` |
| A    | `app`     | `<server IP>` |
| A    | `api`     | `<server IP>` |
| A    | `livekit` | `<server IP>` |

Wait for propagation (`ping chatovo.ru` returns your IP). The subdomains:

- `app.chatovo.ru` — the app itself, with the lobby at its root;
- `api.chatovo.ru` — the main HTTPS endpoint of the API;
- `livekit.chatovo.ru` — for the self-hosted LiveKit server (see the
  "Self-hosted LiveKit" section; if you use LiveKit Cloud you can skip the
  `livekit` A-record).

> This is mandatory: Caddy cannot issue a TLS certificate until the domain
> points at the server.

### 1.3. Install Docker and open the ports

Connect over SSH (`ssh root@<IP>`):

```bash
# Docker + compose plugin
curl -fsSL https://get.docker.com | sh

# Open the ports:
#   80/443       — Caddy (HTTPS + certificate issuance)
#   7881/tcp     — LiveKit TURN/TCP fallback
#   50000-50100/udp — LiveKit WebRTC media
ufw allow OpenSSH \
  && ufw allow 80/tcp && ufw allow 443/tcp \
  && ufw allow 7881/tcp && ufw allow 50000:50100/udp \
  && ufw --force enable
```

> If you do **not** need LiveKit on the server (you are using LiveKit Cloud),
> you can leave 7881/tcp and the UDP range closed. See the "Self-hosted
> LiveKit" section.

> Git is not needed on the VPS — the repository is never cloned there. CI
> copies `docker-compose.yml` to the server on every deploy.

### 1.4. Create the working directory

The VPS stores no project code. All it needs is one directory holding three
files: `docker-compose.yml` (placed there by CI), `.env` and `livekit.yaml`
(both created by hand).

```bash
mkdir -p /opt/chatovo
```

> The path `/opt/chatovo` is arbitrary; it is the same value as `DEPLOY_PATH`
> in the GitHub secrets.

### 1.5. Create the server variables file

In `/opt/chatovo`, create a `.env` file. Use the `.env.example` template from
the repository as the model (open it on GitHub):

```bash
nano /opt/chatovo/.env
```

Fill in real values for better-auth (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`),
Postgres (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and the matching
`DATABASE_URL` / `DIRECT_URL`) and LiveKit, set `NODE_ENV=production`, and set
**`CORS_ORIGINS=https://app.chatovo.ru`** — without it the browser will block
requests from the app to `api.chatovo.ru`. The `.env` file exists only on the
VPS, never in git. `docker-compose.yml` expects it alongside itself, which is
why the path is exactly `/opt/chatovo/.env`.

### 1.6. Create livekit.yaml (self-hosted LiveKit only)

If you plan to use LiveKit Cloud, skip this step and put
`LIVEKIT_URL=wss://<project>.livekit.cloud` in `.env`, with the keys from the
Cloud dashboard.

For a self-hosted LiveKit server, create a `livekit.yaml` file in that same
`/opt/chatovo` directory, modelled on `infra/livekit/livekit.yaml` from the
repository. Details are in the "Self-hosted LiveKit" section below.

### 1.7. Check the domain in the Caddyfile

The domain is baked into the web image at build time. If your domain is not
`chatovo.ru`, edit `infra/caddy/Caddyfile` (including the `app.chatovo.ru` and
`livekit.chatovo.ru` blocks) BEFORE the first CI run.

### 1.8. Log in to the GitHub Container Registry

The images are private, so the VPS has to authenticate with ghcr.io once. You
need a personal access token — see section 2.2 for how to create one.

Once you have the token, run on the VPS:

```bash
echo "<YOUR_PAT>" | docker login ghcr.io -u <YOUR_GITHUB_LOGIN> --password-stdin
```

Docker saves the credentials — you do not need to repeat this on every deploy.

> The image names in `docker-compose.yml` are `ghcr.io/zilero232/chatovo-web`,
> `ghcr.io/zilero232/chatovo-site` and `ghcr.io/zilero232/chatovo-server`. If your GitHub account differs, fix
> the owner in the `image:` lines (lowercase only).

### 1.9. Start the stack

The images must already exist in the registry — they land there after the first
CI run (Part 2). That first CI run also copies `docker-compose.yml` into
`/opt/chatovo`, applies the Prisma migrations and starts the stack. So the
order is: set up CI and trigger the workflow (Part 2), then come back here and
verify on the VPS:

```bash
cd /opt/chatovo
docker compose ps          # web, site, server, postgres, livekit should be up
```

To pull and restart by hand, if you ever need to:

```bash
docker compose pull      # pull the web/site/server images from ghcr.io + livekit
docker compose up -d     # start web, site, server, postgres, livekit
```

On its first start, Caddy inside the `web` image issues TLS certificates for
all four domains at once: `chatovo.ru`, `app.chatovo.ru`, `api.chatovo.ru` and
`livekit.chatovo.ru`. To check:

```bash
curl https://chatovo.ru                 # returns the site HTML (from the site container)
curl https://app.chatovo.ru             # returns the app shell, which opens the lobby
curl https://api.chatovo.ru/health      # expected: {"ok":true}
curl -I https://livekit.chatovo.ru      # expected: 200/426 from LiveKit
```

> Before the first CI run the images are not in the registry yet and
> `docker compose pull` will fail — that is expected. Do Part 2 first.

If the certificate was not issued, check DNS and ports 80/443, then
`docker compose logs web`. If `chatovo.ru` answers 502, the `site` container
is down: `docker compose logs site`.

---

## Self-hosted LiveKit

The LiveKit server for voice rooms lives on the same VPS as a fourth container
(`livekit/livekit-server`). This is the alternative to LiveKit Cloud — the
project code does not tell them apart; the only difference is the values of
`LIVEKIT_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`.

### Why host networking

In `docker-compose.yml` the LiveKit container runs with `network_mode: host`.
WebRTC requires the server to advertise ICE candidates with the real external
IP and to listen on the media ports on it directly. Behind Docker NAT (bridge)
this would break — media traffic would never find its way to the server.

Because of host networking the signalling port 7880 is published straight on
the host, but it does **not** need to be opened to the outside — Caddy, inside
the bridge network, reaches it through `host.docker.internal` (see
`extra_hosts` in the `web` service).

### Ports

| Port        | Protocol | Who opens it      | Why                                       |
| ----------- | -------- | ----------------- | ----------------------------------------- |
| 443         | tcp      | Caddy (public)    | HTTPS → WSS to LiveKit signalling         |
| 7880        | tcp      | LiveKit (on host) | Signalling, reachable locally only        |
| 7881        | tcp      | LiveKit (public)  | TURN/TCP fallback for clients without UDP |
| 50000-50100 | udp      | LiveKit (public)  | WebRTC media (RTP)                        |

All public ports are opened in step 1.3.

### Creating `livekit.yaml`

On the VPS, next to `docker-compose.yml`:

```bash
# Generate a key pair — just two random strings. The secret must be at least
# 32 characters. On the VPS (openssl is available):
echo "API$(openssl rand -hex 8)"   # API key
openssl rand -base64 36            # API secret
# On a Windows machine — see the PowerShell variant in infra/livekit/README.md.
# Copy the output — you need it twice: in livekit.yaml and in /opt/chatovo/.env

# Create the config, modelled on the template in the repository
nano /opt/chatovo/livekit.yaml
```

Model the contents on `infra/livekit/livekit.yaml`. At minimum you need one
`keys:` block with a `<API key>: <secret>` pair. Leave `use_external_ip: true`
enabled — it detects the external IP of the VPS on its own.

### Keys must match

The same `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` must be written **in two
places** on the VPS:

1. In `livekit.yaml` (the `keys:` block) — the LiveKit server validates
   incoming JWTs and API requests with this key.
2. In `/opt/chatovo/.env` (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`) — the
   server signs the JWTs it hands to clients with the same key.

If they diverge, LiveKit will reject the token the server issued and the client
will not connect. The browser never sees the key, only the signed token.

### The client URL

`NEXT_PUBLIC_LIVEKIT_URL` is baked into the client bundle at `vite build` time.
After switching LiveKit Cloud → self-hosted (or back), you need a **new CI run**
for the change to reach the browser bundle and the Tauri build.

| Where it is set                         | Value for self-hosted      |
| --------------------------------------- | -------------------------- |
| GitHub Secret `NEXT_PUBLIC_LIVEKIT_URL` | `wss://livekit.chatovo.ru` |
| `.env` (local dev build / Tauri)        | `wss://livekit.chatovo.ru` |
| `/opt/chatovo/.env` → `LIVEKIT_URL`     | `wss://livekit.chatovo.ru` |

### Checks after starting

```bash
# 1. The container is alive
docker compose ps livekit
docker compose logs --tail=50 livekit
# Expect the lines "starting LiveKit server" and
# "using external IP <your-IP>" in the logs.

# 2. Signalling is reachable through Caddy
curl -I https://livekit.chatovo.ru
# Expect 200 or 426 Upgrade Required (normal — it is a WSS endpoint).

# 3. Opening a real room — through the Chatovo app itself.
#    If media does not flow but the connection is established, it is almost
#    always the ports: check that 7881/tcp and 50000-50100/udp really are open
#    at the hosting provider (some VPS providers block UDP ranges at the firewall).
```

### When to stay on LiveKit Cloud

Self-hosting saves money and removes the dependency on an external service, but
it has two downsides: voice consumes VPS bandwidth (roughly 50 kbit/s per
participant in each direction), and you have to keep the LiveKit server
updated. Up to ~50 simultaneous voice participants on a single small VPS is
comfortable; beyond that it makes sense either to scale the VPS vertically or
to go back to Cloud.

---

## Part 2. Setting up CI/CD (GitHub Actions)

The `.github/workflows/deploy.yml` workflow is triggered manually
(**Actions → deploy → Run workflow**) and:

1. builds the web, site and server Docker images **in parallel** (a matrix
   job) and publishes them to ghcr.io;
2. copies `docker-compose.yml` to the VPS (`scp`), then over SSH pulls the
   three images (`docker compose pull web site server`), applies the Prisma
   migrations (`bun db:baseline`, `bun db:deploy`) and restarts the stack;
3. waits for the `server` and `site` containers to report healthy, and fails
   the deploy if either never does.

The images are built in CI, not on the VPS. CI publishes them using the
built-in `GITHUB_TOKEN` — no separate secret is needed for that.

### 2.1. The SSH key for deployment

GitHub Actions logs in to your VPS over SSH (to copy the compose file and run
`docker compose pull`). This needs a **dedicated SSH key** used only for
deployment — not your personal one.

What an SSH key is: a **pair of two files** that work together:

- the **private** one (no extension, e.g. `chatovo_deploy`) — a secret, like a
  password;
- the **public** one (`chatovo_deploy.pub`) — not a secret, safe to show.

The principle: the holder of the private key proves its identity to a server
that holds the matching public key. So the private key belongs to whoever
connects (CI), and the public key to whatever is connected to (the VPS).

#### 2.1.1. Create the key pair (on your local machine)

```bash
ssh-keygen -t ed25519 -f chatovo_deploy -N "" -C "github-actions"
```

This command creates **two files** in the current directory:

- `chatovo_deploy` — the **private** key;
- `chatovo_deploy.pub` — the **public** key.

What the flags mean: `-t ed25519` — a modern algorithm; `-f chatovo_deploy` —
the file name; `-N ""` — no passphrase on the key (otherwise CI cannot use it
automatically); `-C "github-actions"` — a comment label for convenience.

#### 2.1.2. Put the public key on the VPS

```bash
ssh-copy-id -i chatovo_deploy.pub root@<IP>
```

This command copies the **contents of `chatovo_deploy.pub`** into
`~/.ssh/authorized_keys` on the VPS. From that point on, anyone holding the
**private** `chatovo_deploy` can log in to the VPS over SSH as `root` without a
password.

> If `ssh-copy-id` is not available (for example on Windows without WSL), do the
> same by hand: open `chatovo_deploy.pub`, copy its contents (a single line),
> and append it as its own line to `~/.ssh/authorized_keys` on the VPS (create
> the file if it does not exist). Directory permissions: `chmod 700 ~/.ssh && chmod 600
~/.ssh/authorized_keys`.

#### Alternative: generate the key directly on the VPS

Since the key is for CI rather than for you personally — the private half ends
up in GitHub Secrets either way — it is often easier to create the pair on the
VPS in a single session, without `ssh-copy-id`:

```bash
# Connect to the VPS and run:
ssh-keygen -t ed25519 -f ~/chatovo_deploy -N "" -C "github-actions"
cat ~/chatovo_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

cat ~/chatovo_deploy   # the contents → GitHub Secret SSH_PRIVATE_KEY

# Once the private key is in GitHub Secrets, the files on the VPS can be removed:
rm ~/chatovo_deploy ~/chatovo_deploy.pub
```

The result is the same: the public key stays in `authorized_keys`, the private
one goes to GitHub Secrets. Next is step 2.1.3 (already done if you took this
route: you copied the private key above).

#### 2.1.3. Put the private key into GitHub Secrets

The contents of the private key `chatovo_deploy` go into the `SSH_PRIVATE_KEY`
secret (see the table in 2.3). Take it **whole**, including the
`-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`
lines.

If the key was created **on your local machine**, you already have it at hand:

```bash
cat chatovo_deploy
```

If the key was created **on the VPS**, there are three ways to get it off:

**A. Download the file with `scp` (recommended).** From a normal terminal on
your local machine:

```bash
scp root@<IP>:~/chatovo_deploy ./chatovo_deploy
cat chatovo_deploy   # open it and copy the contents
```

Once you have pasted it into the GitHub secret, delete the file both locally
and on the VPS.

**B. Just `cat` it in the SSH session and select it with the mouse.** Fine for
regular SSH clients (Windows Terminal, iTerm, Terminal.app, PuTTY). Avoid this
in the Timeweb panel's web console — its clipboard handling is unreliable.

```bash
cat ~/chatovo_deploy
```

Select from `-----BEGIN OPENSSH PRIVATE KEY-----` through
`-----END OPENSSH PRIVATE KEY-----` inclusive. In Windows Terminal the
selection is copied automatically; elsewhere use Ctrl+C / Cmd+C.

**C. What NOT to do** — encoding it with `base64` and sending it over
Telegram/email or similar. A private key must never pass through third-party
services.

#### Check before saving the secret

When pasting the key into the GitHub secret, make sure that:

- The first line is exactly `-----BEGIN OPENSSH PRIVATE KEY-----`
- The last line is exactly `-----END OPENSSH PRIVATE KEY-----`
- Between them are several lines of letters, digits and the characters `+`, `/`, `=`
- There is no stray leading whitespace and no blank lines inside the key

If CI later fails at the `Configure SSH` step, it is almost always a bad
copy-paste. Delete the secret and save it again.

#### Summary — where everything should end up

| File                            | Where                                    | Why                                |
| ------------------------------- | ---------------------------------------- | ---------------------------------- |
| `chatovo_deploy` (private)      | GitHub Secrets → `SSH_PRIVATE_KEY`       | So CI can log in to the VPS        |
| `chatovo_deploy.pub` (public)   | VPS → `~/.ssh/authorized_keys`           | So the VPS accepts that key        |
| Both files on the local machine | delete them, or keep them somewhere safe | If lost — just generate a new pair |

> Never commit a private key to git and never share it. If it leaks, remove the
> matching line from `~/.ssh/authorized_keys` on the VPS and create a new pair.

### 2.2. A personal access token for the VPS (registry access)

The VPS has to pull private images from ghcr.io, so it needs a token with
package read permission:

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Tokens (classic) → Generate new token**.
2. Tick the **`read:packages`** scope.
3. Generate the token and copy it.
4. Use it for `docker login ghcr.io` on the VPS (section 1.8).

> This token is only for the VPS pulling images. CI publishes images with its
> own built-in token — there is no need to add the PAT there.

### 2.3. Secrets in GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret                    | Value                                                                       |
| ------------------------- | --------------------------------------------------------------------------- |
| `SSH_HOST`                | Server IP                                                                   |
| `SSH_USER`                | `root` (or the deploy user)                                                 |
| `SSH_PORT`                | `22`                                                                        |
| `SSH_PRIVATE_KEY`         | Contents of the `chatovo_deploy` file (the whole private key)               |
| `DEPLOY_PATH`             | `/opt/chatovo`                                                              |
| `NEXT_PUBLIC_API_URL`     | `https://api.chatovo.ru` (one secret for both web and Tauri)                |
| `NEXT_PUBLIC_APP_URL`     | `https://app.chatovo.ru` (web and site: the site's links into the app)      |
| `NEXT_PUBLIC_LIVEKIT_URL` | `wss://livekit.chatovo.ru` (self-hosted) or `wss://<project>.livekit.cloud` |

### 2.4. Run the deploy

**Actions → deploy → Run workflow**. The workflow is manual only; a push to
`master` does not deploy.

After a successful run the images are in ghcr.io, the migrations have been
applied and the stack is running on the VPS.

---

## Day-to-day operations

| Action                        | Command                                       |
| ----------------------------- | --------------------------------------------- |
| Deploy                        | **Actions → deploy → Run workflow**           |
| Web app / Caddy logs          | `docker compose logs -f web` (on the VPS)     |
| Site logs                     | `docker compose logs -f site`                 |
| Server logs                   | `docker compose logs -f server`               |
| Pull fresh images and restart | `docker compose pull && docker compose up -d` |
| Container status              | `docker compose ps`                           |

### Rolling back to a previous version

The workflow publishes every image under the `latest` tag, so a rollback means
re-running the deploy from the commit you want: **Actions → deploy → Run
workflow**, selecting that commit's branch or tag. The commit SHA of a working
build can be found in git history or on the Actions tab.

### Updating the database schema

Migrations are applied by the deploy workflow, inside the freshly pulled server
image and before the new containers start serving traffic:

```bash
bun db:baseline   # marks the baseline migration applied, a no-op afterwards
bun db:deploy     # applies whatever is pending
```

You do not need to run these by hand. See [migrations.md](migrations.md)
for how migrations are authored and why the baseline step exists.

---

## Building the Tauri app for production

Tauri uses the same Vite build and the same production API as the web app.
Both web and desktop talk to `https://api.chatovo.ru` — there is no longer any
difference between the `NEXT_PUBLIC_API_URL` values of the two builds.

```bash
# 1. Prepare the .env for a production build
cp .env.example .env
nano .env
#    NEXT_PUBLIC_API_URL=https://api.chatovo.ru
#    the other NEXT_PUBLIC_* — production values

# 2. Build the web export, then the Tauri bundle
bun --filter @chatovo/web build
bun tauri:build
```

The finished installers appear in `apps/tauri/target/release/bundle/`. On the
server, CORS allows the Tauri origin (`tauri://localhost`) automatically, plus
`https://app.chatovo.ru` through `CORS_ORIGINS`.

---

## First-deploy checklist

Order matters: CI must publish the images to the registry **before** anything
starts on the VPS.

- [ ] VPS created, Docker installed
- [ ] Ports open: 80/443/tcp, 7881/tcp, 50000-50100/udp (the last two only for
      self-hosted LiveKit)
- [ ] DNS A-records `@`, `www`, `app`, `api` and `livekit` point at the IP
- [ ] Directory `/opt/chatovo` created on the VPS
- [ ] `/opt/chatovo/.env` filled in (`NODE_ENV=production`,
      `CORS_ORIGINS=https://app.chatovo.ru`)
- [ ] `/opt/chatovo/livekit.yaml` created with a `keys:` pair (self-hosted)
- [ ] The keys in `livekit.yaml` and in `.env` match
- [ ] The domain in `infra/caddy/Caddyfile` checked (all four blocks:
      `chatovo.ru`, `app.chatovo.ru`, `api.chatovo.ru` and `livekit.chatovo.ru`)
- [ ] Deploy SSH key added to the VPS
- [ ] PAT with `read:packages` created, `docker login ghcr.io` run on the VPS
- [ ] All secrets set in GitHub Actions
- [ ] The deploy workflow ran green — the three images appeared in ghcr.io and the
      migrations applied
- [ ] `docker compose ps` on the VPS shows web, site, server, postgres and livekit up
- [ ] Caddy issued the certificates, `https://api.chatovo.ru/health` → `{"ok":true}`
- [ ] `https://chatovo.ru` opens (site), `https://app.chatovo.ru` opens on the lobby,
      `https://chatovo.ru/lobby` 301s to the app host
- [ ] The app reaches `api.chatovo.ru` with no CORS errors
- [ ] `https://livekit.chatovo.ru` returns 200/426 (self-hosted)
- [ ] Voice in a room genuinely connects from the browser
