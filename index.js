import { previewResponse } from "./lib/preview.js"

export async function GET(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405 })
  }
  const response = previewResponse()
  if (request.method === "HEAD") {
    return new Response(null, { status: response.status, headers: response.headers })
  }
  return response
}
