const http = require("node:http")
const handler = require("./server.cjs")
const review = require("./review.json")

const port = Number(process.env.PORT) || 3921
const host = "0.0.0.0"

http.createServer((req, res) => handler(req, res)).listen(port, host, () => {
  console.log(`CPEXA review link: http://127.0.0.1:${port}${review.path}`)
  console.log(`Expires: ${review.expiresAt}`)
})
