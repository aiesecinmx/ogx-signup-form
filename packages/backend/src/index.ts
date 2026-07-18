import { Hono } from "hono";
import { cors } from "hono/cors";
import { parseAndValidate } from "./validate";
import { buildExpaPayload, postToExpa } from "./expa";
import { verifyTurnstile } from "./turnstile";
import { insertSignup, updateSignupExpaStatus } from "./db";

type Bindings = {
  EXPA_SIGNUP_URL: string;
  AIESEC_COUNTRY_ID: string;
  TURNSTILE_SECRET_KEY: string;
  DB: D1Database;
};

const ALLOWED_ORIGINS = [
  "https://aiesec.org.mx",
  "https://www.aiesec.org.mx",
  "http://localhost:5173",
  "http://localhost:4173",
];

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  cors({
    origin: (origin) =>
      ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.post("/", async (c) => {
  const validation = await parseAndValidate(c.req.raw);
  if (!validation.ok) return c.json({ error: "Bad Request", errors: validation.errors }, 400);

  const captchaOk = await verifyTurnstile(validation.data.turnstileToken, c.env.TURNSTILE_SECRET_KEY);
  if (!captchaOk) return c.json({ error: "Invalid captcha" }, 403);

  const payload = buildExpaPayload(validation.data);
  const [expaResult, d1Id] = await Promise.all([
    postToExpa(c.env.EXPA_SIGNUP_URL, payload), // Assuming this functions handles all rejections beforehand
    insertSignup(c.env.DB, validation.data).catch((err) => {
      console.error("D1 signup insert failed:", err);
      return null;
    }),
  ]);
  const expaStatus = expaResult.status;

  if (d1Id) {
    c.executionCtx.waitUntil(
      updateSignupExpaStatus(c.env.DB, d1Id, expaStatus).catch((err) =>
        console.error("D1 EXPA status update failed:", err)
      )
    );
  }

  if (expaStatus === 201) return new Response(null, { status: 201 });
  if (expaStatus === 422) return c.json({ errors: { email: ["has already been taken"] } }, 422);
  if (d1Id === null) return c.json({ error: "Service Unavailable" }, 503);
  return c.json({ status: "pending" }, 202);
});

export default app;
