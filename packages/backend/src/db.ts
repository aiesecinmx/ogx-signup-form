import * as z from "zod/mini";
import { signupSchema } from "@ogx/shared";

type SignupData = z.infer<typeof signupSchema>;

export async function insertSignup(db: D1Database, data: SignupData): Promise<number> {
  const { meta } = await db
    .prepare(
      `INSERT INTO signups (email, age, major, schooling_level, english_proficiency, referral_source)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.email,
      data.age,
      data.major,
      data.schoolingLevel,
      data.englishProficiency,
      data.referralSource
    )
    .run();
  return meta.last_row_id;
}

export async function updateSignupExpaStatus(db: D1Database, id: number, expaStatus: number): Promise<void> {
  await db.prepare(`UPDATE signups SET expa_status = ? WHERE id = ?`).bind(expaStatus, id).run();
}
