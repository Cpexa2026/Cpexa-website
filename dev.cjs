const http = require("node:http")
const fs = require("node:fs")
const review = require("./review.json")

if (!process.env.REVIEW_PATH && fs.existsSync(".review-path")) {
  process.env.REVIEW_PATH = fs.readFileSync(".review-path", "utf8").trim()
}

const handler = require("./server.cjs")
const port = Number(process.env.PORT) || 3921

http.createServer((req, res) => handler(req, res)).listen(port, "127.0.0.1", () => {
  console.log(`CPEXA review listening on 127.0.0.1:${port}`)
  console.log(`Expires: ${review.expiresAt}`)
})
