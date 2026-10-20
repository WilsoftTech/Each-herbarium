/** Public liveness probe: no credentials, user data or database work. */
export default async function health(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  }
  return Response.json(
    { service: "each-backend", ok: true },
    {
      headers: { "cache-control": "no-store" },
    },
  );
}
