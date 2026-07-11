# OGX Signup Form

A multi-step registration form for AIESEC Mexico's OGX programs (GV, GTa, GTe). It creates accounts directly in EXPA and is embedded into AIESEC in Mexico's WordPress site via a custom plugin.

## Architecture

This is a pnpm monorepo with three packages:

| Package | Description |
|---|---|
| `packages/frontend` | Preact app — the signup form UI |
| `packages/backend` | Hono API running on a Cloudflare Worker — validates submissions and forwards them to EXPA |
| `packages/shared` | Zod schemas shared between frontend and backend |

The frontend is built as a static bundle and shipped inside a WordPress plugin (`wordpress/aiesec-signup-form`). The plugin exposes a `[aiesec_signup_form]` shortcode that page editors use to embed the form. The backend runs as a standalone Cloudflare Worker.

## Tech stack

- **Frontend**: [Preact](https://preactjs.com/) · [MUI](https://mui.com/) · [Tailwind CSS v4](https://tailwindcss.com/) · [Vite](https://vitejs.dev/) · [Zustand](https://github.com/pmndrs/zustand)
- **Backend**: [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
- **Validation**: [Zod](https://zod.dev/) (shared between frontend and backend)
- **Bot Protection**: [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- **WordPress**: Custom plugin with a shortcode, self-hosted on Azure

## Local setup

**Pre-requisites**: Node.js, pnpm 10+

```bash
pnpm install
```

### Frontend

Create `packages/frontend/.env` (values below use Turnstile's public test key):

```env
VITE_MX_SIGNUP_URL=http://localhost:8787
VITE_MX_ALIGNMENTS_URL=https://api.aiesec.org/v2/lists/mcs_alignments?mc_name=Mexico
VITE_TURNSTILE_SITE_KEY=3x00000000000000000000FF
```

```bash
pnpm dev
# → http://localhost:5173
```

### Backend

Create `packages/backend/.dev.vars` (the Turnstile secret below is Cloudflare's test key that always passes validation):

```env
EXPA_SIGNUP_URL=https://auth.aiesec.org/users.json
AIESEC_COUNTRY_ID=1589
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

```bash
pnpm --filter @ogx/backend dev
# → http://localhost:8787
```

## Deployment

### Backend (Cloudflare Worker)

The Worker is connected to this repository through AIESEC Mexico's Cloudflare account. Any push to `main` that modifies `packages/backend` or `packages/shared` triggers an automatic deployment.

### Frontend (WordPress plugin)

Every push to `main` triggers the **Build WordPress Plugin** GitHub Actions workflow, which:

1. Builds the frontend with the production environment variables stored in the `production` GitHub environment.
2. Assembles a ready-to-install WordPress plugin by combining the PHP files from `wordpress/aiesec-signup-form/` with the built frontend assets.
3. Uploads the result as a `signup-form-plugin` artifact on the workflow run.

To update the live site, download the artifact from the workflow run and install it on the WordPress site via **Plugins → Add New → Upload Plugin**.

### WordPress plugin configuration

The plugin reads the `AIESEC_ALIGNMENTS_URL` environment variable at runtime to fetch MC alignment data. It caches the response for 1 hour using WordPress transients. Make sure this variable is set on the server (or in `wp-config.php`).

### Using the shortcode

Once the plugin is active, embed the form on any page with:

```
[aiesec_signup_form program="GV"]
[aiesec_signup_form program="GTa"]
[aiesec_signup_form program="GTe"]
```
