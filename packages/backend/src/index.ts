import { Hono } from "hono";
import { cors } from "hono/cors";
import { parseAndValidate } from "./validate";
import { buildExpaPayload, postToExpa } from "./expa";

type Bindings = {
  EXPA_SIGNUP_URL: string;
  AIESEC_COUNTRY_ID: string;
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

  const payload = buildExpaPayload(validation.data);
  const result = await postToExpa(c.env.EXPA_SIGNUP_URL, payload);

  if (result.status === 201) return new Response(null, { status: 201 });
  if (result.status === 422) return c.json({ errors: { email: ["has already been taken"] } }, 422);
  return c.json({ error: "Service Unavailable" }, 503);
});

export default app;
