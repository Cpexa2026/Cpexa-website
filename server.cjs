const fs = require("node:fs")
const path = require("node:path")

const html = fs.readFileSync(path.join(__dirname, "site.html"))

const headers = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "text/html; charset=utf-8",
}

module.exports = (req, res) => {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
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
  res.end(html)
}
