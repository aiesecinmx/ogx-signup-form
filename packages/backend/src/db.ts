import * as z from "zod/mini";
import { signupSchema } from "@ogx/shared";

type SignupData = z.infer<typeof signupSchema>;

// Persists every field sent to EXPA (for manual follow-up if the EXPA call fails)
// plus the analytics-only fields dropped from the EXPA payload. Password is never stored.
export async function insertSignup(db: D1Database, data: SignupData): Promise<number> {
  const { meta } = await db
    .prepare(
      `INSERT INTO signups (
        email, age, major, schooling_level, english_proficiency, referral_source,
        first_name, last_name, phone,
        university_id, university_alignment_id, university_value, program
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.email,
      data.age,
      data.major,
      data.schoolingLevel,
      data.englishProficiency,
      data.referralSource,
      data.firstName,
      data.lastName,
      data.phone,
      data.university!.id,
      data.university!.alignment_id,
      data.university!.value,
      data.program
    )
    .run();
  return meta.last_row_id;
}

export async function updateSignupExpaStatus(db: D1Database, id: number, expaStatus: number): Promise<void> {
  await db.prepare(`UPDATE signups SET expa_status = ? WHERE id = ?`).bind(expaStatus, id).run();
}
