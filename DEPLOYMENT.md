# Deployment

The site is served by the `lume` Cloudflare Worker at https://samuelswandi.com.
`wrangler.jsonc` configures static assets from `dist` and the domain route.

Install dependencies and deploy:

```sh
bun install --frozen-lockfile
bunx wrangler login
bun run deploy
```

The deploy command builds the site before uploading it. Use the Cloudflare
account that owns `samuelswandi.com`. If your shell exports Cloudflare credentials
for another account, use the saved OAuth login instead:

```sh
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID bun run deploy
```

Deployment is manual; pushing to GitHub does not publish the site.

The existing `proxmox` Cloudflare Tunnel remains configured with
`samuelswandi.com` pointing to `http://localhost:3000`. The Worker route takes
precedence. To return traffic to that origin, remove the `samuelswandi.com/*`
Worker route in Cloudflare and remove the corresponding route from
`wrangler.jsonc` before deploying again. The previous origin must still be
running for that rollback to work.
