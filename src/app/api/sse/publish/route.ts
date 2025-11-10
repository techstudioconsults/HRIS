// Archived: server-side publish endpoint disabled.
export async function POST() {
  return new Response("Publish endpoint is archived. Use your backend to fan-out events.", { status: 410 });
}
