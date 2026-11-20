const fs = require("node:fs")

const output = ".vercel/output"
const fn = output + "/functions/site.func"
fs.rmSync(output, { recursive: true, force: true })
fs.mkdirSync(fn, { recursive: true })
fs.copyFileSync("server.cjs", fn + "/index.js")
fs.copyFileSync("ask.cjs", fn + "/ask.cjs")
fs.copyFileSync("faqs.json", fn + "/faqs.json")
fs.copyFileSync("site.html", fn + "/site.html")
fs.copyFileSync("hero-motion.mjs", fn + "/hero-motion.mjs")
const runtimeEnv = {}
for (const name of ["OPENAI_API_KEY", "OPENAI_MODEL", "CPEXA_PERSON_EMAIL", "ASK_GUARD_SECRET"]) {
  let value = String(process.env[name] || "").trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim()
  }
  if (value) runtimeEnv[name] = value
}
fs.writeFileSync(
  fn + "/.vc-config.json",
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "index.js",
    launcherType: "Nodejs",
    shouldAddHelpers: true,
    environment: runtimeEnv,
  }),
)
fs.writeFileSync(
  output + "/config.json",
  JSON.stringify({ version: 3, routes: [{ src: "/(.*)", dest: "/site" }] }),
)
