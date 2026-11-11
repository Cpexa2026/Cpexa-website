const http = require("node:http")
const handler = require("./server.cjs")

const port = Number(process.env.PORT) || 3921

http.createServer((req, res) => handler(req, res)).listen(port, "127.0.0.1", () => {
  console.log(`CPEXA website listening on 127.0.0.1:${port}`)
})
