const fs = require("node:fs")

const output = ".vercel/output"
const fn = output + "/functions/review.func"
fs.mkdirSync(fn + "/lib", { recursive: true })
fs.mkdirSync(fn + "/cursor", { recursive: true })
for (const file of ["index.js", "package.json", "review.json", "preview.html.gz"]) {
  fs.copyFileSync(file, fn + "/" + file)
}
fs.copyFileSync("lib/preview.js", fn + "/lib/preview.js")
for (const file of ["identity.js", "identity.dev.js"]) {
  fs.copyFileSync("cursor/" + file, fn + "/cursor/" + file)
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
