const crypto = require("node:crypto")
const assert = require("node:assert/strict")
const { Readable } = require("node:stream")

process.env.ASK_MIN_INTERVAL_MS = "0"
delete process.env.OPENAI_API_KEY
delete process.env.OPENAI_MODEL

const ask = require("./ask.cjs")
const handler = require("./server.cjs")

function solve(ip, hour, question) {
  const seed = ask.seedFor(ip, hour, question)
  for (let n = 0; n < 100000; n += 1) {
    const digest = crypto.createHash("sha256").update(`${seed}:${n}`).digest()
    if (ask.leadingZeroBits(digest) >= ask.BITS) return { n, hour }
  }
  throw new Error("proof not found")
}

function call(raw) {
  const req = Readable.from(raw.body ? [Buffer.from(raw.body)] : [])
  req.method = raw.method || "POST"
  req.url = raw.url || "/api/ask"
  req.headers = raw.headers || {}
  let body = ""
  const headers = {}
  const res = {
    statusCode: 0,
    headersSent: false,
    writableEnded: false,
    setHeader(name, value) {
      headers[name.toLowerCase()] = value
    },
    end(chunk) {
      body += chunk || ""
      this.writableEnded = true
    },
  }
  return new Promise((resolve, reject) => {
    Promise.resolve(handler(req, res))
      .then(() => resolve({ status: res.statusCode, headers, body: body ? JSON.parse(body) : null, raw: body }))
      .catch(reject)
  })
}

async function askQuestion(question, ip, cookie) {
  const headers = { host: "127.0.0.1:3921", origin: "http://127.0.0.1:3921", "x-real-ip": ip }
  if (cookie) headers.cookie = cookie
  const first = await call({
    headers,
    body: JSON.stringify({ question }),
  })
  assert.equal(first.body.needProof, true)
  const proof = solve(ip, first.body.hour, question.replace(/\s+/g, " ").trim())
  const headers2 = { ...headers }
  if (first.headers["set-cookie"]) headers2.cookie = first.headers["set-cookie"].split(";")[0]
  if (cookie) headers2.cookie = cookie
  const second = await call({
    headers: headers2,
    body: JSON.stringify({ question, proof }),
  })
  second.cookie = second.headers["set-cookie"] ? second.headers["set-cookie"].split(";")[0] : headers2.cookie
  return second
}

async function main() {
  ask.resetAskLimits()
  const blocked = await call({
    headers: { host: "cpexa.example", origin: "https://evil.example" },
    body: JSON.stringify({ question: "When is the Houston Workshop?" }),
  })
  assert.equal(blocked.status, 403)

  ask.resetAskLimits()
  const houston = await askQuestion("When is the Houston Workshop?", "203.0.113.10")
  assert.equal(houston.status, 200)
  assert.equal(houston.body.mode, "faq")
  assert.match(houston.body.answer, /February 17, 2027/)
  assert.match(houston.body.answer, /not been confirmed/)

  ask.resetAskLimits()
  const price = await askQuestion("What is the membership price?", "203.0.113.11")
  assert.match(price.body.answer, /\$240/)
  assert.match(price.body.answer, /\$399/)
  assert.match(price.body.answer, /annual/i)
  assert.doesNotMatch(price.body.answer, /first 100|100 Charter|enrollment cap/i)

  ask.resetAskLimits()
  const limits = await askQuestion("How often should P-Card spending limits be reviewed?", "203.0.113.21")
  assert.match(limits.body.answer, /at least annually/i)

  ask.resetAskLimits()
  const unknown = await askQuestion("Tell me a recipe for sourdough bread", "203.0.113.12")
  assert.equal(unknown.body.answer, ask.GAP)

  ask.resetAskLimits()
  const trap = await call({
    headers: { host: "127.0.0.1:3921", origin: "http://127.0.0.1:3921", "x-real-ip": "203.0.113.13" },
    body: JSON.stringify({ question: "When is the Houston Workshop?", website: "spam.example" }),
  })
  assert.equal(trap.body.answer, ask.GAP)
  assert.equal(trap.body.needProof, undefined)

  let fetches = 0
  global.fetch = async (url, options) => {
    fetches += 1
    assert.equal(url, "https://api.openai.com/v1/chat/completions")
    assert.match(options.headers.Authorization, /^Bearer test-key$/)
    const sent = JSON.parse(options.body)
    assert.equal(sent.model, "gpt-4o-mini")
    assert.equal(sent.max_tokens, 280)
    assert.equal(sent.messages[0].role, "system")
    assert.equal(sent.messages[1].role, "user")
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: "The Houston Workshop is February 17, 2027. Booking is not confirmed." } }] }),
    }
  }
  process.env.OPENAI_API_KEY = "test-key"
  ask.resetAskLimits()
  const live = await askQuestion("When is the Houston workshop?", "203.0.113.14")
  assert.equal(fetches, 1)
  assert.equal(live.body.mode, "openai")
  assert.match(live.body.answer, /February 17, 2027/)

  ask.resetAskLimits()
  fetches = 0
  const skipped = await askQuestion("Explain quantum weaving", "203.0.113.15")
  assert.equal(fetches, 0)
  assert.equal(skipped.body.mode, "faq")
  delete process.env.OPENAI_API_KEY

  ask.resetAskLimits()
  let cookie = ""
  for (let i = 0; i < 8; i += 1) {
    const result = await askQuestion("When is the Houston Workshop?", "203.0.113.16", cookie)
    assert.equal(result.status, 200, `question ${i + 1}`)
    cookie = result.cookie
  }
  const limited = await askQuestion("When is the Houston Workshop?", "203.0.113.16", cookie)
  assert.equal(limited.status, 429)

  const huge = await call({
    headers: { host: "127.0.0.1:3921", origin: "http://127.0.0.1:3921" },
    body: "x".repeat(2001),
  })
  assert.equal(huge.status, 413)

  console.log("ask tests passed")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
