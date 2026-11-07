import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { gunzipSync } from "node:zlib"
import { fileURLToPath } from "node:url"
import review from "../review.json" with { type: "json" }

const root = dirname(fileURLToPath(import.meta.url))
const expiresAt = Date.parse(review.expiresAt)
const preview = gunzipSync(readFileSync(join(root, "../preview.html.gz")))

const headers = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "text/html; charset=utf-8",
}

const expired = `<!doctype html><html><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow,noarchive"><body style="background:#f6f3ea;color:#002b45;font:18px Arial;padding:60px"><h1>This review has expired.</h1><p>Please contact Studio Thirty Design for an updated preview.</p></body></html>`

export function previewResponse() {
  if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
    return new Response(expired, { status: 410, headers })
  }
  return new Response(preview, { status: 200, headers })
}
