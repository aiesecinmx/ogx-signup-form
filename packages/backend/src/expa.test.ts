import { describe, it, expect, afterEach, vi } from "vitest";
import { buildExpaPayload, postToExpa } from "./expa";
import { makeSignupData } from "../test/fixtures";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buildExpaPayload", () => {
  it.each([
    ["GV", 7],
    ["GTa", 8],
    ["GTe", 9],
  ] as const)("maps program %s to EXPA id %d", (program, expected) => {
    const payload = buildExpaPayload(makeSignupData({ program }));
    expect(payload.user.selected_programmes).toEqual([expected]);
  });

  it("parses a 10-digit local phone number as +52", () => {
    const payload = buildExpaPayload(makeSignupData({ phone: "5512345678" }));
    expect(payload.user.country_code).toBe("+52");
    expect(payload.user.phone).toBe("5512345678");
  });

  it("strips a +52 prefix already present", () => {
    const payload = buildExpaPayload(makeSignupData({ phone: "+525512345678" }));
    expect(payload.user.country_code).toBe("+52");
    expect(payload.user.phone).toBe("5512345678");
  });

  it("falls back to an empty country code for unrecognized formats", () => {
    const payload = buildExpaPayload(makeSignupData({ phone: "+447911123456" }));
    expect(payload.user.country_code).toBe("");
    expect(payload.user.phone).toBe("+447911123456");
  });

  it("maps signup fields onto the EXPA user payload", () => {
    const data = makeSignupData();
    const payload = buildExpaPayload(data);
    expect(payload.user).toMatchObject({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      lc: data.university!.id,
      lc_input: data.university!.id,
      referral_type: data.referralSource,
      alignment_id: data.university!.alignment_id,
    });
  });
});

describe("postToExpa", () => {
  const url = "https://auth.aiesec.org/users.json";
  const payload = buildExpaPayload(makeSignupData());

  it("returns 201 on success", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 201 })));
    await expect(postToExpa(url, payload)).resolves.toEqual({ status: 201 });
  });

  it("returns 422 when EXPA reports the email is already taken", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ errors: { email: ["has already been taken"] } }), {
            status: 422,
          })
      )
    );
    await expect(postToExpa(url, payload)).resolves.toEqual({ status: 422 });
  });

  it("returns 503 on a 422 with an unrelated error body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ errors: { phone: ["is invalid"] } }), { status: 422 }))
    );
    await expect(postToExpa(url, payload)).resolves.toEqual({ status: 503 });
  });

  it("returns 503 on an unexpected status code", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("oops", { status: 500 })));
    await expect(postToExpa(url, payload)).resolves.toEqual({ status: 503 });
  });

  it("returns 503 when the network request throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      })
    );
    await expect(postToExpa(url, payload)).resolves.toEqual({ status: 503 });
  });
});
