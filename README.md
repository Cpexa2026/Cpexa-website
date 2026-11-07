# CPEXA Client Review

A shareable preview of the 22-screen CPEXA website design. Anyone who can open the app can view it until the cutoff in `review.json`. There are no payments, accounts, or live AI connections.

## Access

The preview is shown to every visitor until that cutoff, then it stops. To share it with a client, set the published app to public.

## Run locally

```bash
npm start
```

## Rebuild

Keep `source-preview.html` on this machine only. It is not part of the published app. Run `node prepare.cjs` to refresh the seven-day cutoff, then publish again.
