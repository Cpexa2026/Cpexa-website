import { requireIdentity } from "./cursor/identity.js"
import { previewResponse } from "./lib/preview.js"

export async function GET(request) {
  const identity = await requireIdentity(request)
  if (identity instanceof Response) return identity
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405 })
  }
  const response = previewResponse()
  if (request.method === "HEAD") {
    return new Response(null, { status: response.status, headers: response.headers })
  }
  return response
}
