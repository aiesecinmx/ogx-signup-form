import * as z from "zod/mini";
import { signupSchema } from "@ogx/shared";

type SignupData = z.infer<typeof signupSchema>;

type ValidationResult =
  | { ok: true; data: SignupData }
  | { ok: false; errors: Record<string, string> };

export async function parseAndValidate(req: Request): Promise<ValidationResult> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { ok: false, errors: { _: "Invalid JSON" } };
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const [k, v] of Object.entries(z.flattenError(parsed.error).fieldErrors)) {
      if ((v as string[] | undefined)?.[0]) errors[k] = (v as string[])[0];
    }
    return { ok: false, errors };
  }

  return { ok: true, data: parsed.data };
}
