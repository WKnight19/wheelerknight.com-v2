# WheelerKnight.com v2 — Codebase Audit

Date: 2025-10-22

## Scope

- Entire repository: backend (Flask), frontend (React+TS), Docker/Compose, Nginx, env templates, scripts, and sample data.
- Static review only. No code edits performed.

## High-Risk Issues (fix before production)

- Secrets in examples and dev compose:
  - docker-compose.yml contains plaintext `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD` and DB creds, and backend defaults in `config.py` use weak defaults. Ensure real deployments use `.env`/secrets, not compose literals.
- Public PII in `contact` route:
  - `backend/routes/contact.py` returns phone and home/college addresses in `/api/contact/info`. Consider removing or gating with auth.
- JWT cookie security:
  - `backend/auth.py` sets `JWT_COOKIE_SECURE=False` and `JWT_COOKIE_CSRF_PROTECT=False`. For production over HTTPS set `True`.
- Uploads exposure:
  - Nginx exposes `/uploads/` and backend saves files under `UPLOAD_FOLDER`. Validate file types and block script execution (Nginx denies php/jsp/etc already). Ensure `UPLOAD_FOLDER` maps to Nginx alias path and is not world-writable in host.
- Email creds missing:
  - `config.validate_config()` warns when `EMAIL_USER`/`EMAIL_PASSWORD` missing. Contact forms won’t send.
- Healthcheck and ports in prod compose:
  - Both `frontend` and `nginx` map 80/443. Only Nginx should bind 80/443; the `frontend` service already uses Nginx in its own image—avoid port conflicts in production stack.

## Medium-Risk / Functional Issues

- Token refresh flow mismatch (frontend vs backend):
  - Frontend refresh calls `POST /auth/refresh` with `Authorization: Bearer <refresh_token>` (from localStorage).
  - Backend uses `@jwt_required(refresh=True)` which reads refresh from standard JWT locations (`headers`,`cookies`). This matches, but note `AuthService.login` stores tokens under `tokens.access_token`/`tokens.refresh_token` (OK). Ensure backend `JWT_TOKEN_LOCATION` includes `headers` (it does) and that `JWT_HEADER_TYPE` default is `Bearer` (Flask-JWT-Extended default). Works as designed.
- Strict mode React 19 with CRA 5:
  - `react` and `react-dom` 19 with `react-scripts@5.0.1` is typically unsupported. CRA 5 expects React 17/18. Build/runtime failures likely. Consider Vite or CRA alternative, or downgrade React to 18.
- TypeScript version pinned to 4.9 with React 19 types (v19.2):
  - Potential type incompatibilities. CRA uses tsconfig targeting es5 and module esnext; verify build.
- Webpack config presence with CRA:
  - `frontend/webpack.config.js` is not used by CRA without overrides. These optimizations won’t apply unless using custom config (e.g., craco, react-app-rewired) or a non-CRA build tool.
- Production frontend Dockerfile copies `nginx.conf` from frontend folder, but repo nginx config is under project root `nginx/nginx.conf` used by compose:
  - `frontend/Dockerfile.prod` expects `nginx.conf` next to Dockerfile. Ensure it exists (it does not in `frontend/`). Either copy correct file or rely on top-level Nginx service.
- Prod compose: duplicate SSL termination
  - `frontend` exposes 80/443 and mounts `/nginx/nginx.conf` into the container’s `/etc/nginx/nginx.conf`, while a separate `nginx` service also serves 80/443. Pick one pattern.

## Low-Risk / Quality Issues

- Logging color codes:
  - `ColoredFormatter` uses ANSI colors; in non-TTY logs colors may clutter. Acceptable.
- `config.validate_config()` only warns on default secrets in development; in production it raises only for `FLASK_DEBUG=True` and default `SECRET_KEY`. Consider also requiring `JWT_SECRET_KEY`.
- Pagination helper uses `query.paginate` (Flask-SQLAlchemy 3 supports this via `SQLAlchemy` integration)—OK, but ensure `flask_sqlalchemy.Pagination` import not required explicitly in callers.
- `create_sample_data.py` hardcodes DB URI to `mysql` host with dev creds; never run in prod.

## Backend Review

- App setup
  - `backend/app.py` loads config, validates, sets SQLAlchemy URI via `Config.get_database_uri()`, sets Mail from env, registers blueprints and error handlers, and has a health endpoint.
  - On startup, attempts `db.create_all()` with retries; in production with Alembic migrations you typically don’t auto-create tables.
- Auth
  - JWT config: token in headers and cookies, but cookies are insecure in prod by default as noted above.
  - Decorators `admin_required`/`super_admin_required` rely on `role` claim and DB lookup where needed; fine.
- Models
  - Generally consistent; enums used via SQLAlchemy Enum.
  - `Skill.proficiency_percentage` returns float but annotated int property; minor type mismatch in comment vs code.
  - JSON text fields manually json.dumps/loads in `Project` and `WorkExperience`; OK but consider `JSON` type.
- Error handling
  - Custom `APIError` and specialized errors registered; generic exceptions return full traceback unless `FLASK_ENV=production`.
- Routes
  - All API endpoints wrapped by `handle_api_response` which catches exceptions and returns 500 with error string; note this can mask typed `APIError` shapes. Many routes raise `ValidationError`—these will be caught by `handle_api_response` before Flask’s error handler. Consider re-raising to let registered handlers format error payloads.

## Frontend Review

- Dependencies
  - `react-scripts` + React 19 likely incompatible (see High/Medium above).
  - TS libs at 4.9 and `@types/react` 19.2; CRA 5 template targets earlier versions.
- API client
  - Uses `REACT_APP_API_URL`; present in env examples and compose. Refresh flow matches backend as discussed.
  - On refresh success, it only sets new access token; refresh token rotation isn’t implemented—acceptable but note security.
- Auth context
  - Expects `AuthService.getCurrentUser()` response shape `{ success, data, message }`, then uses `response.data` as user; this matches backend `handle_api_response`. `login` also expects `{ data: { user, tokens } }` which matches backend route.
- Routing
  - Uses protected HOC based on context; fine.

## Docker/Compose/Nginx

- Dev compose
  - Frontend uses `volumes: - /app/node_modules` to keep node_modules inside container, standard.
  - Backend mounts source, uses `python app.py` entrypoint.
- Prod compose
  - Conflicts on ports (frontend vs nginx). Consolidate.
  - Healthchecks use `curl` in backend container; ensure `curl` is installed (backend Dockerfile.prod installs curl—OK).
  - Redis optional; env `REDIS_URL` included in env.prod.example but backend doesn’t use Redis yet.
- Nginx config
  - Reasonable security headers and gzip. CSP is permissive (`'unsafe-inline'`), consider tightening.
  - Rate-limiting blocks defined at bottom appear out of `http {}`/`server {}` context if this file is loaded as single nginx.conf via compose mount; ensure proper context nesting. In the provided file, the `limit_req_zone` and `location` blocks at the bottom are not inside a `server` block—this will cause nginx config error unless this file is included differently. In compose, it mounts to `/etc/nginx/nginx.conf` (full main config), where `location` directives at top level are invalid. Move rate limiting and locations into server block or use http context.

## Environment Variables Inventory

- Backend required/used:
  - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
  - SECRET_KEY, JWT_SECRET_KEY
  - FLASK_ENV, FLASK_DEBUG
  - CORS_ORIGINS
  - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_USE_TLS
  - MAX_FILE_SIZE, UPLOAD_FOLDER
  - JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES
  - LOG_LEVEL, LOG_FILE (via logging_config usage in app)
- Frontend:
  - REACT_APP_API_URL, REACT_APP_ENVIRONMENT, REACT_APP_GOOGLE_ANALYTICS_ID
  - REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_PUBLIC_KEY
- Ops (prod):
  - SSL_CERT_PATH, SSL_KEY_PATH
  - REDIS_URL, CACHE_TTL (unused in code currently)
  - BACKUP_RETENTION_DAYS, BACKUP_SCHEDULE (for scripts)

## Unused/Dead Code and Mismatches

- Webpack config not used by CRA without override.
- Redis env values present but not used by backend.
- Email sending logic not implemented in contact reply (logged only).
- `docs` references in root README (DEVELOPMENT_PLAN.md, docs/api.md, docs/deployment.md, docs/contributing.md) don’t exist or differ; verify links.

## Recommended Actions

- Frontend build/runtime
  - Migrate from CRA to Vite or Next.js, or downgrade React to 18.x compatible with `react-scripts@5`.
  - If staying with CRA, remove unused `webpack.config.js` or wire up with craco.
- Prod networking
  - Choose a single Nginx: either use the frontend image’s Nginx to serve static files and proxy API, or the top-level `nginx` service. Avoid both exposing 80/443.
  - Fix Nginx main config contexts: move `limit_req_zone` into `http {}` and `location` directives into `server {}`.
- Security
  - Set `JWT_COOKIE_SECURE=True` and `JWT_COOKIE_CSRF_PROTECT=True` in production; or keep tokens strictly in headers and disable cookies.
  - Remove personal addresses from `/api/contact/info` or protect it.
  - Ensure strong `SECRET_KEY` and `JWT_SECRET_KEY` in prod; enforce via `validate_config()`.
  - Tighten CSP if possible and avoid `'unsafe-inline'`.
- Email/Notifications
  - Configure SMTP creds and implement email send on contact reply.
- Uploads
  - Ensure `UPLOAD_FOLDER` path is mounted to Nginx alias `/usr/share/nginx/uploads` (compose already mounts volume). Validate MIME/type serverside.
- DB migrations
  - Prefer `flask db upgrade` over `db.create_all()` at runtime in production.
- Observability
  - Add structured logging and error tracking (Sentry) if desired.

## Quick Checks to Run

- Backend: `pip install -r backend/requirements.txt && FLASK_ENV=development python backend/app.py` (with MySQL running) to verify imports and DB connectivity.
- Frontend: `npm ci && npm start`—expect issues with React 19 and CRA; validate.
- Docker: `docker-compose -f docker-compose.prod.yml config` to catch Nginx config errors.

## Conclusion

The codebase is generally well-structured. Address the production Nginx/port conflicts, React 19 with CRA incompatibility, secrets handling, JWT cookie security, and public PII exposure before production. Tighten env validation and decide on a single Nginx entry point for prod.
