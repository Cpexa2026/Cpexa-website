const { gunzipSync } = require("node:zlib")
const fs = require("node:fs")
const path = require("node:path")
const review = require("./review.json")

const expiresAt = Date.parse(review.expiresAt)

const headers = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "text/html; charset=utf-8",
}

const expired = `<!doctype html><html><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow,noarchive"><body style="background:#f6f3ea;color:#002b45;font:18px Arial;padding:60px"><h1>This review link has expired.</h1><p>Please contact Studio Thirty Design for an updated preview.</p></body></html>`

function allowedPath() {
  if (process.env.REVIEW_PATH) return process.env.REVIEW_PATH
  try {
    return require("./review-path.cjs")
  } catch {
    return ""
  }
}

module.exports = (req, res) => {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  const allowed = allowedPath()
  const requested = new URL(req.url, "https://preview.invalid").pathname
  if (!allowed || (requested !== allowed && requested !== allowed + "/")) {
    res.statusCode = 404
    res.end("<h1>Review link required</h1>")
    return
  }
  if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
    res.statusCode = 410
    res.end(expired)
    return
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405
    res.end()
    return
  }
  res.statusCode = 200
  if (req.method === "HEAD") {
    res.end()
    return
  }
  res.end(gunzipSync(fs.readFileSync(path.join(__dirname, "preview.html.gz"))))
}
