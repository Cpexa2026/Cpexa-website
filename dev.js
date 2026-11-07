import http from "node:http"
import { previewResponse } from "./lib/preview.js"
import review from "./review.json" with { type: "json" }

const port = Number(process.env.PORT) || 3921

http
  .createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405
      res.end()
      return
    }
    const response = previewResponse()
    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))
    if (req.method === "HEAD") {
      res.end()
      return
    }
    res.end(Buffer.from(await response.arrayBuffer()))
  })
  .listen(port, "0.0.0.0", () => {
    console.log(`CPEXA review listening on port ${port}`)
    console.log(`Expires: ${review.expiresAt}`)
  })
