import { describe, it, expect } from "vitest";
import { env } from "cloudflare:workers";
import { insertSignup, updateSignupExpaStatus } from "./db";
import { makeSignupData } from "../test/fixtures";

describe("insertSignup", () => {
  it("writes a row to the signups table on signup", async () => {
    const data = makeSignupData({ email: "insert-test@example.com" });

    await insertSignup(env.DB, data);

    const { results } = await env.DB.prepare("SELECT * FROM signups WHERE email = ?")
      .bind(data.email)
      .all();

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      email: data.email,
      age: data.age,
      major: data.major,
      schooling_level: data.schoolingLevel,
      english_proficiency: data.englishProficiency,
      referral_source: data.referralSource,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      university_id: data.university!.id,
      university_alignment_id: data.university!.alignment_id,
      university_value: data.university!.value,
      program: data.program,
      expa_status: null,
    });
    expect(results[0]).not.toHaveProperty("password");
  });

  it("returns the id of the inserted row", async () => {
    const data = makeSignupData({ email: "returns-id@example.com" });

    const id = await insertSignup(env.DB, data);

    const { results } = await env.DB.prepare("SELECT id FROM signups WHERE email = ?")
      .bind(data.email)
      .all();
    expect(results).toEqual([{ id }]);
  });
});

describe("updateSignupExpaStatus", () => {
  it("sets the expa_status column for the given row", async () => {
    const id = await insertSignup(env.DB, makeSignupData({ email: "update-status@example.com" }));

    await updateSignupExpaStatus(env.DB, id, 422);

    const { results } = await env.DB.prepare("SELECT expa_status FROM signups WHERE id = ?").bind(id).all();
    expect(results).toEqual([{ expa_status: 422 }]);
  });
});
