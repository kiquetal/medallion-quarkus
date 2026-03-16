# Strava OAuth2 Integration + Activity Linking for Zelus

## Problem Statement
Integrate Strava's OAuth2 flow into Zelus so the app can fetch the authenticated athlete's profile, stats, and recent activities. Allow linking Strava activities to Zelus races to display route maps and "View on Strava" links. Strava credentials are stored in the database (configurable from UI), tokens are managed server-side with automatic refresh, and data syncs daily.

## Requirements
- Full OAuth2 authorization code flow (redirect → Strava consent → callback → token exchange)
- Store client_id, client_secret, tokens, athlete_id in PostgreSQL
- Auto-refresh expired tokens before API calls
- Fetch: athlete profile, athlete stats, recent activities (with polyline maps)
- Daily background sync via scheduler
- New `/strava` Angular page: configure credentials, connect/disconnect, view profile + stats + activities
- Link Strava activities to races via a dropdown picker in the race form
- Show route map (Leaflet + decoded polyline) and "View on Strava" link on linked races
- Respect existing architecture: root-path `/zelus`, REST at `/api`, Quinoa SPA

## Background
- Strava OAuth2: authorize at `strava.com/oauth/authorize`, exchange code at `strava.com/oauth/token`, refresh with `grant_type=refresh_token`. Tokens expire in 6h.
- Scopes needed: `read,activity:read_all`
- Each Strava activity includes `map.summary_polyline` — an encoded polyline decodable client-side
- Quarkus extensions: `quarkus-rest-client-jackson` (typed HTTP client), `quarkus-scheduler` (daily cron)
- Frontend: Leaflet (no API key, lightweight) for map rendering

## Architecture Flow

```
Browser (Angular) → Quarkus Backend → Strava API

1. POST /api/strava/config {clientId, clientSecret} → Store in DB
2. GET /api/strava/authorize → 302 to strava.com/oauth/authorize
3. Strava redirects to /zelus/api/strava/callback?code=xxx
4. Backend exchanges code for tokens, stores them, syncs data
5. Redirects browser to /zelus/strava (Angular page)
6. Daily cron job refreshes tokens and re-syncs data
7. Race form has Strava activity picker dropdown
8. Race list shows route map + "View on Strava" for linked races
```

## Task Breakdown

### Task 1: Add Maven dependencies and Strava JPA entities
- [x] Add `quarkus-rest-client-jackson` and `quarkus-scheduler` to `pom.xml`
- [x] Create `StravaToken` entity + repository
- [x] Create `StravaCache` entity + repository
- [x] Add `stravaActivityId` and `stravaPolyline` to `Race` entity

### Task 2: Create Strava REST client interface and DTOs
- [x] Define `@RegisterRestClient` interface `StravaClient`
- [x] Create DTOs: StravaTokenResponseDTO, StravaAthleteDTO, StravaStatsDTO, StravaActivityDTO
- [x] Configure REST client URL in application.properties

### Task 3: Build StravaService — token management, API calls, caching
- [x] Create StravaService CDI bean with OAuth + token refresh + sync logic

### Task 4: Create StravaResource — OAuth endpoints and data API
- [x] POST /strava/config, GET /strava/authorize, GET /strava/callback
- [x] GET /strava/status, GET /strava/data, GET /strava/activities
- [x] DELETE /strava/disconnect

### Task 5: Add daily sync scheduler
- [x] Create StravaSyncJob with @Scheduled cron

### Task 6: Create Angular Strava page
- [x] strava.service.ts, strava.model.ts, StravaComponent
- [x] Add Strava link to navbar
- [x] Config form → Connect button → Data display states

### Task 7: Add Strava activity picker to race form + route map
- [x] Leaflet npm packages
- [x] Strava activity dropdown in race form
- [x] RouteMapComponent with polyline decoding
- [x] "View on Strava" link on linked races

### Task 8: Wire together, update config and docs
- [x] Update application.properties, steering.md, README.md
