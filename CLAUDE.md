# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npx expo start          # Start dev server (press i/a/w for iOS/Android/Web)
npx expo start --ios    # Start directly on iOS simulator
npx expo start --android
npx expo start --web
```

No test runner, linter, or CI pipeline is configured. TypeScript strict mode is enforced via `tsconfig.json` (extends `expo/tsconfig.base`). Use `npx tsc --noEmit` to type-check.

## Tech Stack

- **React Native 0.81 + Expo 54** (managed workflow, New Architecture enabled)
- **expo-router 6** — file-based routing under `app/`
- **expo-sqlite** — local SQLite on mobile, OPFS on web; no backend API yet
- **TypeScript 5.9** strict mode; path alias `@/*` maps to repo root
- **i18n** — Spanish default (`es`), English available (`en`); translations in `i18n/en.ts` and `i18n/es.ts`

## Architecture

### Routing (expo-router)

All screens live in `app/`. Tab navigation is under `app/(tabs)/` with five tabs: dashboard (`index`), measure, progress, calendar, profile. Modals use `presentation: 'modal'` in `app/_layout.tsx`.

Auth flow: `app/_layout.tsx` checks AsyncStorage for `user_session` and `onboarding_complete`, then redirects to `/login` → `/onboarding` → `/(tabs)`.

### Context Providers

Providers wrap the app in `app/_layout.tsx` in this order (outer → inner):
`ThemeProvider` → `I18nProvider` → `NavThemeProvider` → `DatabaseProvider` → `UserProvider` → `MeasurementProvider` → `SubscriptionProvider`

- **DatabaseContext** — initializes SQLite, runs migrations, handles errors
- **UserContext** — current user profile, goals, CRUD
- **MeasurementContext** — body measurement tracking
- **SubscriptionContext** — premium feature gating
- **ThemeContext** — dark (default) / light theme; colors in `constants/Colors.ts`

### Database Layer

All in `database/`:
- `schema.ts` — DDL for initial tables (users, goals, measurements, events)
- `migrations.ts` — sequential versioned migrations (currently v1–v5); new migrations append to the `MIGRATIONS` array with the next version number
- `*Queries.ts` — CRUD functions that accept an `SQLiteDatabase` instance
- `seedData.ts` — initial data seeded on first run

Tables: `users`, `goals`, `measurements`, `events`, `workout_sessions`, `workout_sets`, `app_meta` (schema versioning).

### Constants & Data

`constants/` holds app-wide static data:
- `exercises.ts` — 100+ exercises with muscle group mappings
- `routines.ts` — pre-built workout routines (gender-specific)
- `exerciseMedia.ts` — GIF URLs for exercise demos
- `quotes.ts` — motivational quotes (gender-specific, attributed)
- `muscleRanges.ts` — normal measurement ranges per body part

### Body Measurement System

21 interactive muscle groups (rendered via `react-native-body-highlighter` SVG in `components/body/BodyModel.tsx`) plus 4 general metrics (weight, body fat %, waist, hips). Types defined in `types/bodyParts.ts`.

## Infrastructure

Terraform configs in `infra/` target GCP (project `fit-forge-493917`, region `us-central1`): Cloud SQL PostgreSQL 15, Cloud Run, Cloud Storage. Not deployed yet — all data is currently local SQLite only.
