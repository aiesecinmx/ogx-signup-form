import type { z } from "zod/mini";
import type { signupSchema } from "@ogx/shared";

type SignupData = z.infer<typeof signupSchema>;

export function makeSignupData(overrides: Partial<SignupData> = {}): SignupData {
  return {
    consent: true,
    firstName: "Jane",
    lastName: "Doe",
    age: "20",
    phone: "5512345678",
    email: "jane@example.com",
    password: "Passw0rd!",
    university: { id: 42, value: "Universidad Ejemplo", alignment_id: 7 },
    major: "Computer Science",
    schoolingLevel: "Undergraduate",
    englishProficiency: "Advanced",
    referralSource: "Instagram",
    program: "GV",
    turnstileToken: "test-token",
    ...overrides,
  };
}
