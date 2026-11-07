# CPEXA Client Review
This separate Vercel project serves the current 22-screen design mockup through an unlisted review URL. It contains no production payments, accounts or AI connections.

## Run locally

```bash
npm start
```

The server prints the review path from `review.json`. Any other path returns 404. The link stops working at `expiresAt`.

## Publish
Run these commands from this folder using your own authorized Vercel account:
1. npm exec --yes --package=vercel -- vercel login
2. node prepare.cjs
3. npm exec --yes --package=vercel -- vercel --prod --scope studiothirtydesign-7809s-projects

Select or create the cpexa-client-review project. The build command is node build.cjs. No framework or dependencies are required.
The prepare command generates a new review path and a cutoff exactly seven days from the command's run time. See review.json for both. Append that path to the deployment URL to get the client review link.
Verify that the link opens without a Vercel login. The application itself limits access to the generated path and checks the deadline on the server. Do not share the project source.

## Access behavior
- Missing or invalid path: 404.
- Valid path before cutoff: interactive preview.
- Valid path at or after cutoff: 410 with an expiry message.
- Responses are not cached. An already-open preview checks its expiry every minute.
- Anyone with the review URL can use it until cutoff. This does not prevent copying or saving content that was already delivered.

## Rebuild
Keep the supplied prepare.cjs and source preview in this folder. Run node prepare.cjs to restart a seven-day window, then redeploy. A redeploy is required to change the server cutoff. No ongoing automation is needed.
