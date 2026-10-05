# amin-api

Cloudflare Worker behind the dynamic parts of amindadgar.com, served at `https://api.amindadgar.com`. Runs on the Workers Free plan.

| Route | What it does |
| --- | --- |
| `GET /github-summary` | Cached AI summary of the last 30 days of public GitHub activity (from KV) |
| `POST /admin/refresh-github-summary` | Rebuilds the summary now; needs `Authorization: Bearer $ADMIN_TOKEN` |
| `GET /health` | Liveness check |
| cron `0 5 * * *` | Rebuilds the summary daily |

The summary is built from GitHub's public events, per-repo commit lists and the contribution calendar, then written by an OpenRouter model (`SUMMARY_MODELS` in `wrangler.jsonc`, tried in order). Model output is validated against the data: highlights about unknown repos are dropped and links must come from GitHub. If the model fails, the previous AI summary is kept for up to 7 days, after which a plain digest is served.

## Setup

```bash
npm install
npx wrangler login
npx wrangler secret put OPENROUTER_API_KEY   # set a credit limit on this key in OpenRouter
npx wrangler secret put GITHUB_TOKEN         # fine-grained, read-only, public repositories
npx wrangler secret put ADMIN_TOKEN          # any long random string
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

Run the site with `VITE_API_URL=http://localhost:8787` in the root `.env.local` to use the local Worker.

`npm test` runs the unit tests; `npm run typecheck` checks types. Re-run `npm run cf-typegen` after changing `wrangler.jsonc`.
