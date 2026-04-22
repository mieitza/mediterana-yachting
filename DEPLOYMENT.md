# Deployment & Operations

Operational runbook for `mediteranayachting.com`. Pragmatic, copy-pasteable, owner-focused.

## Overview

| | |
|---|---|
| Host | Hostinger VPS (`76.13.15.171`, hostname `srv1300842`) |
| OS | Ubuntu (Linux 6.17) |
| Stack | Next.js 14 (standalone) + SQLite (via Drizzle) + NextAuth Credentials + Caddy 2 |
| Runtime | Docker Compose (2 services: `web`, `caddy`) |
| Domain | `mediteranayachting.com` + `www` |
| TLS | Automatic via Caddy (Let's Encrypt) |

There is **no CI/CD**. Deployments are run manually from a developer machine.

## Access

```sh
# First time per terminal: load the SSH key
ssh-add ~/.ssh/hostinger

# Connect
ssh -i ~/.ssh/hostinger root@76.13.15.171
```

Key security posture (2026-04-22):
- `PermitRootLogin yes`, password auth disabled (key only)
- No UFW, no fail2ban installed — see "Tech debt" below

## Repository layout vs. server layout

Local is a pnpm monorepo:
```
mediterana-yachting/
├── apps/web/        ← Next.js app (deployed)
├── apps/studio/     ← Sanity Studio (not currently deployed — legacy)
└── data/
```

Server is a flat single-package copy of `apps/web/`:
```
/root/build-web/     ← active deploy dir (matches docker container names build-web-*)
├── src/
├── public/
├── package.json
├── Dockerfile           ← server-only, do not remove
├── docker-compose.yml   ← server-only, do not remove
├── Caddyfile            ← server-only, do not remove
├── .env                 ← SECRETS, not in git, do not remove
└── .env.local           ← legacy fallback for NEXTAUTH_SECRET
```

`/opt/mediterana/` and `/root/mediterana-yachting/` are abandoned older deploys. Safe to delete when disk pressure returns.

## Architecture

```
Internet ─┬─ :80  ─┐
          │         ├─► caddy (Let's Encrypt, gzip, security headers)
          └─ :443 ─┘         │
                             ├─ /uploads/* → served directly from shared docker volume
                             └─ everything else → reverse_proxy web:3000 → Next.js
```

Docker volumes (persist across container rebuilds):

| Volume | Mount | Purpose |
|---|---|---|
| `build-web_sqlite_data` | `/app/data` | SQLite DB + WAL |
| `build-web_uploads` | `/app/public/uploads` (web) + `/srv/uploads` ro (caddy) | Admin-uploaded images |
| `build-web_backups` | `/app/backups` | In-container DB backups (currently stale, see Tech debt) |
| `build-web_caddy_data` | `/data` in caddy | **TLS private keys — do not delete** |
| `build-web_caddy_config` | `/config` in caddy | Caddy runtime config |

## Environment configuration

Docker Compose reads `/root/build-web/.env`. **This file is NOT in git.** It contains all runtime secrets.

### Required vars

| Var | Example | Notes |
|---|---|---|
| `DOMAIN` | `mediteranayachting.com` | Used by Caddyfile for vhost + ACME |
| `NEXTAUTH_URL` | `https://mediteranayachting.com` | Must match public URL or auth callbacks break |
| `NEXTAUTH_SECRET` | 32+ random chars | Generate with `openssl rand -base64 32` — rotating invalidates all sessions |
| `RESEND_API_KEY` | `re_...` | Contact form confirmations + newsletter welcome emails |
| `TURNSTILE_SECRET_KEY` | `0x...` | Server-side Turnstile verification (runtime) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x...` | Client-side widget. **Inlined at build time** — changing requires a rebuild, not just a restart |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | (unused post-seed) | Only consumed by initial seed script; admin lives in `users` table |

### Updating vars

```sh
# Edit on server
ssh root@76.13.15.171
vim /root/build-web/.env

# Apply
cd /root/build-web
docker compose up -d --force-recreate --no-deps web
```

For `NEXT_PUBLIC_*` vars, you also need a rebuild — see next section.

## Deployment procedure

Use this when local has commits that aren't on the server, or when a `NEXT_PUBLIC_*` env var changed.

### 1. Pre-flight (local)

```sh
# Clean working tree (or know what's uncommitted)
git status

# Verify the build works before burning a server round-trip
pnpm --filter web build
```

### 2. Backup (server)

```sh
ssh root@76.13.15.171 "bash -s" <<'EOF'
set -e
STAMP=$(date -u +%Y%m%d-%H%M%S)
BACKUP_DIR=/root/backups/pre-$STAMP
mkdir -p "$BACKUP_DIR"

# DB snapshot (safe while running; uses SQLite .backup)
sqlite3 /var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db \
  ".backup $BACKUP_DIR/mediterana.db"

# Tag current image as rollback point
CURRENT=$(docker inspect build-web-web-1 --format '{{.Image}}')
docker tag "$CURRENT" build-web-web:pre-$STAMP

# Source snapshot (optional, paranoia)
tar czf "$BACKUP_DIR/build-web-src.tar.gz" -C /root/build-web \
  --exclude=node_modules --exclude=.next --exclude=test-results \
  src package.json next.config.js tsconfig.json tailwind.config.ts

echo "Rollback image tag: build-web-web:pre-$STAMP"
echo "Backup dir: $BACKUP_DIR"
EOF
```

### 3. Sync code (local → server)

Only needed when local has commits the server doesn't. Check first:

```sh
# Compare a known-changed file
shasum apps/web/src/components/blog/PostCard.tsx
ssh root@76.13.15.171 'shasum /root/build-web/src/components/blog/PostCard.tsx'
```

If they match, skip this step. Otherwise:

```sh
# DRY RUN — always inspect the file list before committing
rsync -avzi --dry-run \
  --exclude='node_modules' --exclude='.next' \
  --exclude='.env' --exclude='.env.local' --exclude='.env.*.local' \
  --exclude='public/uploads' --exclude='tsconfig.tsbuildinfo' \
  --exclude='test-results' --exclude='playwright-report' \
  --exclude='.DS_Store' \
  apps/web/ root@76.13.15.171:/root/build-web/

# Real run — remove --dry-run
```

Do **not** use `--delete`. The server has `Dockerfile`, `docker-compose.yml`, `Caddyfile` that don't exist in `apps/web/`, and deleting them would break the deploy.

### 4. Build (server)

```sh
ssh root@76.13.15.171 'cd /root/build-web && docker compose build web'
```

If the build fails, the running container is untouched. Fix the issue and retry. Takes ~3-4 minutes.

### 5. Swap container (server)

```sh
ssh root@76.13.15.171 'cd /root/build-web && docker compose up -d --no-deps web'
```

`--no-deps` avoids touching Caddy. Downtime is ~5 seconds while the new container starts. Watch the boot:

```sh
ssh root@76.13.15.171 'docker logs build-web-web-1 --since 30s'
```

Look for `✓ Ready in XXms` and no red error lines.

### 6. Smoke test

```sh
for path in / /admin/login /contact /blog /yachts /api/auth/csrf; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "https://mediteranayachting.com$path")
  echo "$code  $path"
done
```

All should be `200`. Then open the site in a browser and verify:
- Home + hero renders
- `/contact` — Turnstile widget appears, form submittable
- `/blog` — post excerpts don't show literal HTML tags
- `/admin/login` → log in → admin pages render

## Rollback

If the new container is broken, roll back immediately (~30 seconds, zero data loss):

```sh
ssh root@76.13.15.171 "bash -s" <<'EOF'
cd /root/build-web
# Find most recent pre-* tag
TAG=$(docker images build-web-web --format '{{.Tag}}' | grep '^pre-' | sort -r | head -1)
echo "Rolling back to build-web-web:$TAG"
docker tag build-web-web:$TAG build-web-web:latest
docker compose up -d --force-recreate --no-deps web
sleep 3
docker logs build-web-web-1 --tail 5
EOF
```

SQLite is volume-mounted, so DB state is unaffected by container lifecycle. Rollback only reverts application code.

If the DB also needs to be rolled back (e.g., a bad migration):

```sh
ssh root@76.13.15.171 "bash -s" <<'EOF'
cd /root/build-web
docker compose stop web
# Use the pre-deploy snapshot — replace STAMP with the one you want
cp /root/backups/pre-STAMP/mediterana.db \
   /var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db
docker compose start web
EOF
```

## Common operations

### View container logs

```sh
# Live tail
ssh root@76.13.15.171 'docker logs -f build-web-web-1'
ssh root@76.13.15.171 'docker logs -f build-web-caddy-1'

# Last 100 lines
ssh root@76.13.15.171 'docker logs --tail 100 build-web-web-1'

# Since a time
ssh root@76.13.15.171 'docker logs --since 1h build-web-web-1'
```

### Restart a service without code change

```sh
ssh root@76.13.15.171 'cd /root/build-web && docker compose restart web'
# or to pick up a new .env:
ssh root@76.13.15.171 'cd /root/build-web && docker compose up -d --force-recreate --no-deps web'
```

### Reset admin password

The admin user lives in `users` table. Hashing uses bcrypt (`$2b$`, cost 12). `bcryptjs` is tree-shaken out of the runtime image, so hash on the host with Python.

```sh
ssh root@76.13.15.171 "bash -s" <<'EOF'
set -e
umask 077
cat > /tmp/_pw <<'PWEOF'
YOUR_NEW_PASSWORD_HERE
PWEOF

HASH=$(python3 -c '
import bcrypt
with open("/tmp/_pw","rb") as f:
    pw = f.read().rstrip(b"\n")
print(bcrypt.hashpw(pw, bcrypt.gensalt(12)).decode(), end="")
')
shred -u /tmp/_pw

DB=/var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db
sqlite3 "$DB" "UPDATE users SET password_hash = '$HASH', updated_at = unixepoch() WHERE email = 'ion@mediteranayachting.com';"

# Verify
sqlite3 "$DB" "SELECT email, role, datetime(updated_at,'unixepoch') FROM users;"
EOF
```

### Inspect the database

The SQLite CLI is not inside the container, but is on the host:

```sh
ssh root@76.13.15.171
DB=/var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db

sqlite3 "$DB" ".tables"
sqlite3 "$DB" "SELECT COUNT(*) FROM inquiries;"
sqlite3 "$DB" "SELECT id, name, email, created_at FROM inquiries ORDER BY created_at DESC LIMIT 10;"
```

For complex queries, copy the DB to `/tmp/` and work on the copy to avoid any lock risk.

### Database backup (manual)

```sh
ssh root@76.13.15.171 '
STAMP=$(date -u +%Y%m%d-%H%M%S)
sqlite3 /var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db \
  ".backup /root/backups/manual-$STAMP.db"
ls -lh /root/backups/manual-$STAMP.db
'
```

### Check SSL cert status

```sh
ssh root@76.13.15.171 '
echo | openssl s_client -servername mediteranayachting.com \
  -connect mediteranayachting.com:443 2>/dev/null | \
  openssl x509 -noout -dates -subject
'
```

Caddy auto-renews ~30 days before expiry. No manual action needed unless you see errors in `docker logs build-web-caddy-1`.

### Disk usage

```sh
ssh root@76.13.15.171 'df -h / && du -sh /root/* /opt/* /var/lib/docker 2>/dev/null | sort -h | tail'
```

If disk pressure:
1. `docker system prune -a --volumes=false` (keeps volumes, drops old images/layers)
2. Remove old pre-deploy backups in `/root/backups/`
3. Drop abandoned `/opt/mediterana/` and `/root/mediterana-yachting/` (abandoned older deploys)

## Tech debt

Known gaps, ordered by priority:

| # | Issue | Risk | Fix |
|---|---|---|---|
| 1 | No `package-lock.json` — `npm install --legacy-peer-deps` in Dockerfile re-resolves semver ranges on every build | Silent dep drift between builds | Generate a lock file once, sync to server, switch Dockerfile to `npm ci` |
| 2 | Secrets baked into image — `.dockerignore` excludes `.env.local` / `.env.*.local` but not plain `.env` | Image file contains `NEXTAUTH_SECRET`, `RESEND_API_KEY`, etc. Safe while image stays on host; leaks if ever exported | Add `.env` to `.dockerignore` and rebuild |
| 3 | No automated deploy pipeline — "prod push" is manual and has failed silently before | Local commits drift from prod without anyone noticing | Add a GitHub Action on push-to-main that rsyncs + rebuilds, or a `scripts/deploy.sh` in the repo |
| 4 | No UFW, no fail2ban on the VPS | SSH brute-force exposure (keys-only so not a breach path, but noisy logs) | `apt install ufw fail2ban && ufw allow 22,80,443 && ufw enable` |
| 5 | In-container backups stopped Feb 14, 2026 | No rolling backups | Find + restart the backup job, or add a host-side cron doing `sqlite3 ... .backup` |
| 6 | DB is SQLite in a single docker volume; volume loss = data loss | Total loss if `/var/lib/docker/volumes/` goes bad | Add an offsite backup (daily `rsync` or `rclone` to S3/B2 of `/root/backups/`) |
| 7 | `.env.local` on server holds a legacy copy of `NEXTAUTH_SECRET` from before the `.env` existed | Minor confusion, no functional issue | Delete `/root/build-web/.env.local` once `.env` is confirmed authoritative |
| 8 | Abandoned deploy directories `/opt/mediterana/` (~596 MB) and `/root/mediterana-yachting/` (~525 MB) | Wasted disk | `rm -rf` after confirming nothing mounts them |
| 9 | `apps/studio/` (Sanity Studio) is in the monorepo but not used by production | Confusion during onboarding; two parallel CMS schemas to maintain | Decide whether to retire Sanity or re-enable it; current production reads from SQLite `admin/*` panel |

## Useful file paths

On server:

| Path | What |
|---|---|
| `/root/build-web/` | Active deploy directory |
| `/root/build-web/.env` | Runtime secrets (not in git) |
| `/root/backups/` | DB snapshots + pre-deploy tarballs |
| `/var/lib/docker/volumes/build-web_sqlite_data/_data/mediterana.db` | Live SQLite DB |
| `/var/lib/docker/volumes/build-web_uploads/_data/` | Admin-uploaded images |
| `/var/lib/docker/volumes/build-web_caddy_data/_data/` | Caddy TLS keys (**do not delete**) |

Locally:

| Path | What |
|---|---|
| `apps/web/` | Source for what runs in production |
| `apps/web/src/lib/db/schema.ts` | Drizzle schema (source of truth for DB structure) |
| `apps/web/src/app/admin/` | Admin panel routes |
| `apps/web/src/app/(site)/` | Public site routes |
| `apps/web/src/app/api/` | API routes (inquiry, newsletter, admin, auth) |

## Emergency contacts

- Resend account (contact emails, newsletter): dashboard at https://resend.com
- Turnstile (spam protection): Cloudflare dashboard → Turnstile → Site Key `0x4AAAAAACTONE2rDw214iY8`
- Hostinger (VPS host): Hostinger panel → VPS `srv1300842`
