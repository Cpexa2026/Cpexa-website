const fs = require("node:fs")
const path = require("node:path")

const html = fs.readFileSync(path.join(__dirname, "site.html"))
const motion = fs.readFileSync(path.join(__dirname, "hero-motion.mjs"))

const headers = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "text/html; charset=utf-8",
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(Object.assign(new Error("too large"), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

module.exports = async (req, res) => {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  const url = new URL(req.url, "https://cpexa.invalid")
  if (url.pathname === "/api/ask") {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST")
      res.statusCode = 405
      res.end()
      return
    }
    try {
      req.bodyText = await readBody(req, 2000)
    } catch (error) {
      res.statusCode = error.status || 400
      res.setHeader("Content-Type", "application/json; charset=utf-8")
      res.end(JSON.stringify({ message: "Ask a short question in your own words." }))
      return
    }
    try {
      await require("./ask.cjs").handleAsk(req, res)
    } catch {
      if (!res.writableEnded) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.end(JSON.stringify({ message: "The published answers could not be reached. Use the contact page, or try again in a moment." }))
      }
    }
    return
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405
    res.end()
    return
  }
  if (url.pathname === "/hero-motion.mjs") {
    res.setHeader("Content-Type", "text/javascript; charset=utf-8")
    res.statusCode = 200
    if (req.method === "HEAD") res.end()
    else res.end(motion)
    return
  }
  res.statusCode = 200
  if (req.method === "HEAD") {
    res.end()
    return
  }
  res.end(html)
}
