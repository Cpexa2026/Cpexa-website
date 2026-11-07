const fs = require("node:fs")
const zlib = require("node:zlib")

const start = Date.now()
const expires = start + 7 * 24 * 60 * 60 * 1000
const meta = {
  createdAt: new Date(start).toISOString(),
  expiresAt: new Date(expires).toISOString(),
  projectName: "cpexa-client-review",
  source: "CPEXA_Interactive_Design_Preview.html",
}
fs.writeFileSync("review.json", JSON.stringify(meta, null, 2) + "\n")

let html = fs.readFileSync("source-preview.html", "utf8")
html = html.replace(
  "</head>",
  '<meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"></head>',
)
const deadlineScript = `<script>(()=>{const end=${expires};function check(){if(Date.now()>=end){document.body.innerHTML='<main style="padding:60px;font:20px Arial;color:#002b45"><h1>This review has expired.</h1><p>Please contact Studio Thirty Design for an updated preview.</p></main>';return;}setTimeout(check,Math.min(end-Date.now(),60000));}check();})();</script>`
html = html.replace("</body>", deadlineScript + "</body>")
fs.writeFileSync("preview.html.gz", zlib.gzipSync(html))
console.log(JSON.stringify({ expiresAt: meta.expiresAt }))
