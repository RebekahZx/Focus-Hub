// Runs the session API route handlers against a real MongoDB.
// Skipped unless MONGODB_URI_TEST is set (CI provides one; see .github/workflows/build.yml).
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

const uri = process.env.MONGODB_URI_TEST;
let currentUser = null;

vi.mock("next-auth", () => ({ getServerSession: async () => (currentUser ? { user: currentUser } : null) }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));

describe.skipIf(!uri)("session API", () => {
  let collection, item, mongoose;
  const host = { email: "host@example.com", name: "Host" };
  const guest = { email: "guest@example.com", name: "Guest" };
  const post = (body) => new Request("http://test/api/sessions", { method: "POST", body: JSON.stringify(body) });
  const params = (code) => ({ params: Promise.resolve({ code }) });

  beforeAll(async () => {
    process.env.MONGODB_URI = uri;
    collection = await import("../../app/api/sessions/route.js");
    item = await import("../../app/api/sessions/[code]/route.js");
    mongoose = (await import("mongoose")).default;
  });

  afterAll(async () => {
    await mongoose?.connection?.db?.dropDatabase();
    await mongoose?.disconnect();
  });

  test("requires sign-in", async () => {
    currentUser = null;
    expect((await collection.POST(post({}))).status).toBe(401);
    expect((await collection.GET()).status).toBe(401);
  });

  test("validates input", async () => {
    currentUser = host;
    const res = await collection.POST(post({ title: "", focusMin: 5, breakMin: 5, rounds: 2 }));
    expect(res.status).toBe(400);
    expect(Object.keys((await res.json()).errors)).toEqual(expect.arrayContaining(["title", "focusMin"]));
  });

  test("create, list, fetch, and delete a session", async () => {
    currentUser = host;
    const created = await collection.POST(post({ title: "Exam revision", subject: "Physics", focusMin: 25, breakMin: 5, rounds: 3, startsAt: "now" }));
    expect(created.status).toBe(201);
    const { session } = await created.json();
    expect(session.code).toMatch(/^[a-z2-9]{4}-[a-z2-9]{4}$/);
    expect(session.hostEmail).toBe(host.email);

    const mine = await (await collection.GET()).json();
    expect(mine.sessions.map((s) => s.code)).toContain(session.code);

    currentUser = guest;
    const fetched = await item.GET(null, params(session.code));
    expect(fetched.status).toBe(200);
    expect((await fetched.json()).session.title).toBe("Exam revision");
    expect((await collection.GET().then((r) => r.json())).sessions).toHaveLength(0); // guest hosts nothing

    expect((await item.DELETE(null, params(session.code))).status).toBe(403); // only the host
    currentUser = host;
    expect((await item.DELETE(null, params(session.code))).status).toBe(204);
    expect((await item.GET(null, params(session.code))).status).toBe(404);
  });

  test("rejects malformed codes", async () => {
    currentUser = guest;
    expect((await item.GET(null, params("not-a-code!"))).status).toBe(404);
  });
});
