# Lume

My personal website and reading library, with notes on books and essays.

Live at [samuelswandi.com](https://samuelswandi.com).

Built with React, TypeScript, and Vite. Notes are written in Markdown and rendered
with React Markdown. React Router uses hash-based URLs for reading pages.

## Run locally

Install [Bun](https://bun.sh) 1.2.22, then run:

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://127.0.0.1:5173.

## Add a book or essay

1. Write the notes in `src/content/<slug>.md`.
2. Add a cover image to `public/covers/` if available.
3. Import the Markdown file with `?raw` in `src/library.ts` and add its metadata
   to `shelfItems`. Use the existing entries as examples.
4. Add the slug to `readingOrder` in `src/App.tsx` to place it in the library.

The reading page will be available at `/#/sources/<slug>`. Cover images are
optional; entries without one use a text-based cover.

## Build and preview

```sh
bun run build
bun run preview
```

The build runs TypeScript checks and writes the production site to `dist/`.
This repository tracks `dist/`, so include updated build output when committing
site changes. The preview command prints its local URL.

## Deploy

The site is hosted on Cloudflare Workers. Authenticate with the Cloudflare account
that owns the domain, then build and publish:

```sh
bunx wrangler login
bun run deploy
```

Deployments are manual. Pushing or merging to `main` does not deploy the site.
See [DEPLOYMENT.md](DEPLOYMENT.md) for configuration, account overrides, and
instructions for restoring the previous hosting setup.
