import * as z from "zod/mini";
import { signupSchema } from "@ogx/shared";
import { env } from "cloudflare:workers";

type SignupData = z.infer<typeof signupSchema>;

const PROGRAM_TO_EXPA: Record<string, number> = { GV: 7, GTa: 8, GTe: 9 };

type ExpaResult = { status: 201 } | { status: 422 } | { status: 503 };

function parsePhone(raw: string): { country_code: string; phone: string } {
  if (/^\d{10}$/.test(raw)) return { country_code: "+52", phone: raw };
  if (raw.startsWith("+52")) return { country_code: "+52", phone: raw.slice(3) };
  // TODO: Improve logic to parse country code
  return { country_code: "", phone: raw };
}

const mcId = Number.parseInt(env.AIESEC_COUNTRY_ID, 10);
export function buildExpaPayload(data: SignupData) {
  const { country_code, phone } = parsePhone(data.phone);
  return {
    user: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      country_code,
      phone,
      password: data.password,
      country: mcId,
      lc: data.university!.id,
      lc_input: data.university!.id,
      referral_type: data.referralSource,
      alignment_id: data.university!.alignment_id,
      allow_phone_communication: 1,
      allow_email_communication: 1,
      allow_term_and_conditions: 1,
      selected_programmes: [PROGRAM_TO_EXPA[data.program]],
      created_via: "https://aiesec.org.mx",
    },
  };
}

export async function postToExpa(
  url: string,
  payload: ReturnType<typeof buildExpaPayload>
): Promise<ExpaResult> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Network error calling EXPA signup:", err);
    return { status: 503 };
  }

  if (res.status === 201) return { status: 201 };

  if (res.status === 422) {
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if ((data as any)?.errors?.email?.[0] === "has already been taken") {
      return { status: 422 };
    }
  }

  console.error("Unexpected EXPA response:", res.status, await res.text().catch(() => ""));
  return { status: 503 };
}
