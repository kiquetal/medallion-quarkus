# Zelus — Project Steering

## Stack
- Quarkus 3.32 backend with Quinoa serving an Angular 19 SPA
- PostgreSQL via Dev Services
- All routes served under `quarkus.http.root-path=/zelus`

## Root Path + Angular + Quinoa: Known Issues & Solutions

When using `quarkus.http.root-path` with a non-root value (e.g. `/zelus`), the following problems arise and have been solved in this project:

### 1. Angular base href
- `src/main/webui/src/index.html` must have `<base href="/zelus/">`
- This ensures Angular resolves routes and assets relative to `/zelus/`

### 2. Vite HMR in dev mode
- Angular 19 uses Vite internally. In dev mode, Vite injects `<script src="/@vite/client">` as an absolute path
- The browser requests `http://localhost:8080/@vite/client` which is outside `/zelus` → 404
- **Fix**: `package.json` start script uses `ng serve --serve-path /zelus/` so Vite injects `/zelus/@vite/client` instead
- This is dev-only — production builds have no Vite injection

### 3. Trailing slash redirect
- Quarkus returns 404 for `/zelus` (no trailing slash) while `/zelus/` works
- This is a known Quarkus bug: https://github.com/quarkusio/quarkus/issues/35076
- **Fix**: `TrailingSlashRedirect.java` uses `@Observes Filters` (fires at HTTP level, before root-path routing) to 301 redirect `/zelus` → `/zelus/`
- `@Observes Router` does NOT work for this — it gives the sub-router mounted at `/zelus`, which never sees the no-slash request

### 4. API base path in Angular services
- `race.service.ts` uses `private base = '/zelus/api'` to match the full path
- `quarkus.rest.path=/api` makes REST endpoints available at `/zelus/api/*`

## Key Constraints
- Do NOT remove `quarkus.http.root-path=/zelus` — it is intentional
- Do NOT add workaround configs to `application.properties` — keep it clean
- `@Observes Router` registers routes on the sub-router at `/zelus`, not the main HTTP router
- `@Observes Filters` registers filters at the HTTP level before root-path routing — use this for root-level interception
- `@RouteFilter` (from quarkus-reactive-routes) is also scoped under root-path — does NOT help for root-level paths
