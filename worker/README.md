# amin-api

Cloudflare Worker behind the dynamic parts of amindadgar.com, served at `https://api.amindadgar.com`. Runs on the Workers Free plan.

| Route | What it does |
| --- | --- |
| `GET /github-summary` | Cached AI summary of the last 30 days of public GitHub activity (from KV) |
| `POST /admin/refresh-github-summary` | Rebuilds the summary now; needs `Authorization: Bearer $ADMIN_TOKEN` |
| `POST /chat/session` | Verifies a Turnstile token and issues a 30-minute signed session bound to the visitor's IP hash |
| `POST /chat` | One message in, a streamed (SSE) assistant reply out |
| `POST /chat/contact-click` | Records that the visitor used the contact card (lead signal) |
| `GET /admin/conversations?days=7` | Recent chats with messages, for lead insights; needs `ADMIN_TOKEN` |
| `GET /health` | Liveness check |
| cron `0 5 * * *` | Rebuilds the summary daily and prunes expired usage counters |

The summary is built from GitHub's public events, per-repo commit lists and the contribution calendar, then written by an OpenRouter model (`SUMMARY_MODELS` in `wrangler.jsonc`, tried in order). Model output is validated against the data: highlights about unknown repos are dropped and links must come from GitHub. If the model fails, the previous AI summary is kept for up to 7 days, after which a plain digest is served.

## Chat assistant

Answers are grounded in `src/data/portfolio.ts` (imported directly, so the site and the assistant share one source of truth) plus the cached GitHub summary. Conversation history is stored server-side in D1, so visitors can't forge earlier turns.

Abuse protection, in the order requests hit it:

1. Origin allow-list (`ALLOWED_ORIGINS` plus this project's Vercel previews)
2. Turnstile verification to open a session
3. Burst limit: 5 messages per minute per visitor (`CHAT_BURST` rate-limit binding)
4. `CHAT_MAX_TURNS` messages per conversation, 500 characters per message, 700 output tokens per reply
5. Daily quotas in D1: `CHAT_DAILY_LIMIT_PER_VISITOR` and `CHAT_DAILY_LIMIT_GLOBAL`
6. The credit limit on the OpenRouter key

Visitors are identified by an HMAC of their IP (`SESSION_SECRET`); raw IPs are never stored.

## Setup

```bash
npm install
npx wrangler login
npx wrangler secret put OPENROUTER_API_KEY   # set a credit limit on this key in OpenRouter
npx wrangler secret put GITHUB_TOKEN         # fine-grained, read-only, public repositories
npx wrangler secret put ADMIN_TOKEN          # any long random string
npx wrangler secret put TURNSTILE_SECRET_KEY # from the Turnstile widget for amindadgar.com
openssl rand -hex 32 | npx wrangler secret put SESSION_SECRET
npx wrangler d1 migrations apply amin-api-db --remote
npm run deploy
```

Deploying creates the `api.amindadgar.com` DNS record automatically (the zone is on Cloudflare). Then populate the summary once instead of waiting for the cron:

```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" https://api.amindadgar.com/admin/refresh-github-summary
```

## Local development

```bash
cp .dev.vars.example .dev.vars   # fill in keys
npm run dev                      # http://localhost:8787
```

Run the site with `VITE_API_URL=http://localhost:8787` and `VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (Turnstile's always-pass test key) in the root `.env.local` to use the local Worker. Apply the schema locally first with `npx wrangler d1 migrations apply amin-api-db --local`.

`npm test` runs the unit tests; `npm run typecheck` checks types. Re-run `npm run cf-typegen` after changing `wrangler.jsonc`.
