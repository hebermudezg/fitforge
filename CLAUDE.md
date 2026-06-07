# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npx expo start          # Start dev server (press i/a/w for iOS/Android/Web)
npx expo start --ios    # Start directly on iOS simulator
npx expo start --android
npx expo start --web
npx tsc --noEmit        # Type-check without emitting
```

No test runner, linter, or CI pipeline is configured. TypeScript strict mode is enforced via `tsconfig.json` (extends `expo/tsconfig.base`). Path alias `@/*` maps to the repo root.

## Tech Stack

- **React Native 0.81 + Expo 54** (managed workflow, New Architecture enabled)
- **expo-router 6** — file-based routing under `app/`
- **expo-sqlite** — local SQLite on mobile, OPFS on web; no backend API yet
- **TypeScript 5.9** strict mode
- **i18n** — Spanish default (`es`), English available (`en`); translations in `i18n/en.ts` and `i18n/es.ts`; language persisted to AsyncStorage under key `bodysync_lang`
- **RevenueCat** (`react-native-purchases`) — subscription management; API keys are placeholder strings in `contexts/SubscriptionContext.tsx` and must be replaced before shipping

## Architecture

### Routing (expo-router)

All screens live in `app/`. Tab navigation is under `app/(tabs)/` with five tabs: dashboard (`index`), measure, progress, calendar, profile. `app/workout.tsx` is a full-screen non-tab route. Modals (`measurement/[bodyPart]`, `event/new`, `paywall`, `privacy`) use `presentation: 'modal'`.

Auth flow: `app/_layout.tsx` reads AsyncStorage keys `user_session` and `onboarding_complete`, then redirects to `/login` → `/onboarding` → `/(tabs)`.

### Context Providers

All contexts live in `contexts/`. Providers wrap the app in `app/_layout.tsx` in this order (outer → inner):

`ThemeProvider` → `I18nProvider` → `NavThemeProvider` → `DatabaseProvider` → `UserProvider` → `MeasurementProvider` → `SubscriptionProvider`

- **DatabaseContext** — opens SQLite (`bodysync.db`), enables WAL, runs migrations; exposes `useDatabase()` which returns the raw `SQLiteDatabase` instance
- **UserContext** — current user profile and goals, CRUD operations
- **MeasurementContext** — body measurement tracking
- **SubscriptionContext** — RevenueCat tier (`free` | `pro` | `premium`) and `canAccess(feature)` gate; disabled on web and when placeholder keys are detected
- **ThemeContext** — dark (default) / light theme; palette in `constants/Colors.ts`

### Database Layer

All in `database/`:
- `schema.ts` — DDL for initial tables (users, goals, measurements, events)
- `migrations.ts` — sequential versioned migrations (currently v1–v5); add new migrations by appending to the `MIGRATIONS` array with the next version number; `app_meta` table stores `schema_version`
- `*Queries.ts` — CRUD functions that each accept a `SQLiteDatabase` instance
- `seedData.ts` — initial data seeded on first run

Tables: `users`, `goals`, `measurements`, `events`, `workout_sessions`, `workout_sets`, `app_meta`.

### Constants & Data

`constants/` holds app-wide static data:
- `exercises.ts` — 100+ exercises with muscle group mappings
- `routines.ts` — pre-built workout routines (gender-specific)
- `exerciseMedia.ts` — GIF URLs for exercise demos
- `quotes.ts` — motivational quotes (gender-specific, attributed)
- `muscleRanges.ts` — normal measurement ranges per body part
- `achievements.ts` — `Achievement[]` with unlock conditions evaluated against `UserStats`; use `getUnlockedAchievements` / `getNextAchievements`
- `glossary.ts` — fitness term definitions

### Hooks

- `hooks/useUserStats.ts` — queries SQLite for all `UserStats` fields (measurements, workouts, streak, weight change, max muscle growth); consumed by the achievements system

### Body Measurement System

21 interactive muscle groups (rendered via `react-native-body-highlighter` SVG in `components/body/BodyModel.tsx`) plus 4 general metrics (weight, body fat %, waist, hips). Types defined in `types/bodyParts.ts`. Core domain types (User, Goal, Measurement, CalendarEvent) live in `types/models.ts`.

### Subscription Feature Gating

Features and their minimum tier are declared in `FEATURE_TIERS` inside `contexts/SubscriptionContext.tsx`. Call `canAccess('feature_key')` from `useSubscription()` to gate UI. Before shipping, replace `RC_API_KEY_APPLE` and `RC_API_KEY_GOOGLE` with real RevenueCat keys and configure `pro` / `premium` entitlement IDs in the RevenueCat dashboard.

## Infrastructure

Terraform configs in `infra/` target GCP (project `fit-forge-493917`, region `us-central1`): Cloud SQL PostgreSQL 15, Cloud Run, Cloud Storage. Not deployed yet — all data is currently local SQLite only.
