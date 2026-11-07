const fs = require("node:fs")

function readReviewPath() {
  if (process.env.REVIEW_PATH) return process.env.REVIEW_PATH.trim()
  if (fs.existsSync(".review-path")) return fs.readFileSync(".review-path", "utf8").trim()
  return ""
}

const output = ".vercel/output"
const fn = output + "/functions/review.func"
fs.rmSync(output, { recursive: true, force: true })
fs.mkdirSync(fn, { recursive: true })
fs.copyFileSync("server.cjs", fn + "/index.js")
fs.copyFileSync("preview.html.gz", fn + "/preview.html.gz")
fs.copyFileSync("review.json", fn + "/review.json")

const reviewPath = readReviewPath()
if (reviewPath) {
  fs.writeFileSync(fn + "/review-path.cjs", "module.exports = " + JSON.stringify(reviewPath) + "\n")
}

fs.writeFileSync(
  fn + "/.vc-config.json",
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "index.js",
    launcherType: "Nodejs",
    shouldAddHelpers: true,
  }),
)
fs.writeFileSync(
  output + "/config.json",
  JSON.stringify({ version: 3, routes: [{ src: "/(.*)", dest: "/review" }] }),
)
