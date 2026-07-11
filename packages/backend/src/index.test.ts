import { describe, it, expect, afterEach, vi } from "vitest";
import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import app from "./index";
import { makeSignupData } from "../test/fixtures";

function stubFetch(opts: { turnstileOk: boolean; expaStatus: 201 | 422 | "network-error" }) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

      if (url.includes("challenges.cloudflare.com")) {
        return new Response(JSON.stringify({ success: opts.turnstileOk }), { status: 200 });
      }

      if (url.includes("auth.aiesec.org")) {
        if (opts.expaStatus === "network-error") throw new Error("network down");
        if (opts.expaStatus === 422) {
          return new Response(JSON.stringify({ errors: { email: ["has already been taken"] } }), {
            status: 422,
          });
        }
        return new Response(null, { status: 201 });
      }

      throw new Error(`Unexpected fetch to ${url}`);
    })
  );
}

async function postSignup(overrides = {}) {
  const request = new Request("https://example.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(makeSignupData(overrides)),
  });
  const ctx = createExecutionContext();
  const res = await app.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

async function getExpaStatus(email: string): Promise<number | null> {
  const { results } = await env.DB.prepare("SELECT expa_status FROM signups WHERE email = ?")
    .bind(email)
    .all<{ expa_status: number | null }>();
  return results[0]?.expa_status ?? null;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /", () => {
  it("returns 201 and logs the signup to D1 on the happy path", async () => {
    stubFetch({ turnstileOk: true, expaStatus: 201 });
    const email = "happy-path@example.com";

    const res = await postSignup({ email });

    expect(res.status).toBe(201);
    const { results } = await env.DB.prepare("SELECT * FROM signups WHERE email = ?").bind(email).all();
    expect(results).toHaveLength(1);
    await expect(getExpaStatus(email)).resolves.toBe(201);
  });

  it("returns 403 when the captcha fails, without calling EXPA", async () => {
    stubFetch({ turnstileOk: false, expaStatus: 201 });

    const res = await postSignup({ email: "captcha-fail@example.com" });

    expect(res.status).toBe(403);
  });

  it("returns 422 when EXPA reports a duplicate email", async () => {
    stubFetch({ turnstileOk: true, expaStatus: 422 });

    const res = await postSignup({ email: "dup@example.com" });

    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body).toMatchObject({ errors: { email: ["has already been taken"] } });
  });

  it("still writes to D1 even when EXPA reports a duplicate email", async () => {
    stubFetch({ turnstileOk: true, expaStatus: 422 });
    const email = "dup-still-logged@example.com";

    await postSignup({ email });

    const { results } = await env.DB.prepare("SELECT * FROM signups WHERE email = ?").bind(email).all();
    expect(results).toHaveLength(1);
    await expect(getExpaStatus(email)).resolves.toBe(422);
  });

  it("writes a separate row for each repeat signup with the same email", async () => {
    stubFetch({ turnstileOk: true, expaStatus: 201 });
    const email = "repeat@example.com";

    await postSignup({ email, major: "Biology" });
    await postSignup({ email, major: "Physics" });

    const { results } = await env.DB.prepare("SELECT major FROM signups WHERE email = ? ORDER BY id").bind(email).all();
    expect(results).toEqual([{ major: "Biology" }, { major: "Physics" }]);
  });

  it("returns 503 when the EXPA request fails outright", async () => {
    stubFetch({ turnstileOk: true, expaStatus: "network-error" });
    const email = "expa-down@example.com";

    const res = await postSignup({ email });

    expect(res.status).toBe(503);
    await expect(getExpaStatus(email)).resolves.toBe(503);
  });

  it("still returns 201 from EXPA success even if the D1 insert fails", async () => {
    stubFetch({ turnstileOk: true, expaStatus: 201 });
    vi.spyOn(env.DB, "prepare").mockImplementation(() => {
      throw new Error("D1 unavailable");
    });

    const res = await postSignup({ email: "d1-down@example.com" });

    expect(res.status).toBe(201);
  });
});
