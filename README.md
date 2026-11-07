# CPEXA Client Review

A Vercel project that serves the 22-screen CPEXA website design at an unlisted review URL. It contains no payments, accounts, or live AI connections.

## Access

The preview is available only at the path written to `.review-path`. Any other path returns 404. The link stops at the cutoff in `review.json`, then returns 410. Responses are not cached. Anyone with the review URL can open it until that cutoff.

`.review-path` is not committed. Do not share the project source.

## Run locally

```bash
npm start
```

The server listens on `127.0.0.1:3921`. Open the path from `.review-path`.

## Publish to Vercel

From this folder, with your own authorized Vercel account:

```bash
npm exec --yes --package=vercel -- vercel login
node prepare.cjs
npm run build
npm exec --yes --package=vercel -- vercel deploy --prebuilt --prod --yes --scope studiothirtydesign-7809s-projects --name cpexa-client-review
```

`node prepare.cjs` starts a new seven-day window and writes a new review path. Deploy the prebuilt output so that path is included. Append the path to the deployment URL to get the client review link.

## Rebuild

Keep `source-preview.html` on this machine only. It is not part of the deployment. Run `node prepare.cjs`, then `npm run build`, then deploy again. A redeploy is required to change the server cutoff.
