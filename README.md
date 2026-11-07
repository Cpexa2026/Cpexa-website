# CPEXA Client Review

A private preview of the 22-screen CPEXA website design. A person must be signed in to Cursor, and allowed by the owner, to open it. There are no payments, accounts, or live AI connections.

## Access

Every request checks the signed-in Cursor viewer. Someone who is not signed in is refused. The preview also stops at the cutoff in `review.json`.

## Run locally

```bash
npm start
```

On this machine the server simulates a signed-in viewer so the preview can be opened. A published app does not use that simulation.

## Rebuild

Keep `source-preview.html` on this machine only. It is not part of the published app. Run `node prepare.cjs` to refresh the seven-day cutoff, then publish again.
