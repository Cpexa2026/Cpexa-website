const fs = require("node:fs")

const output = ".vercel/output"
const fn = output + "/functions/site.func"
fs.rmSync(output, { recursive: true, force: true })
fs.mkdirSync(fn, { recursive: true })
fs.copyFileSync("server.cjs", fn + "/index.js")
fs.copyFileSync("site.html", fn + "/site.html")
fs.copyFileSync("hero-motion.mjs", fn + "/hero-motion.mjs")
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
  JSON.stringify({ version: 3, routes: [{ src: "/(.*)", dest: "/site" }] }),
)
