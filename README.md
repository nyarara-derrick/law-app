# LexiMind

LexiMind is an AI-assisted legal learning application focused on Kenyan law and Islamic jurisprudence. It is being developed as a mobile-friendly web application and an Android app using React, TypeScript, Vite, Express, Capacitor, and Google's Gemini API.

> **Project status:** Active development. The Android release workflow has successfully produced a release APK, but a successful build does not mean every feature has been fully tested on a device or is ready for production. Cloud deployment, backend hardening, persistent accounts, automated tests, and production operations are still part of the work ahead.

## What LexiMind is intended to do

LexiMind is designed as a study companion for law students. Its current interface and source code include the following modules:

| Module | Current capabilities represented in the code |
| --- | --- |
| IRAC Solver | Generate structured Issue, Rule, Application, and Conclusion responses; accept typed scenarios and photo/PDF attachments; extract text from attachments; load problem-question presets and past-paper questions. |
| IRAC Grader | Assess a student's submitted answer and return a structured score, rubric feedback, missing authorities, and model-answer highlights. |
| Case Law Vault | Browse curriculum units and study notes, search and filter material, and request AI-generated case briefs. |
| Note Synthesizer | Create study summaries from a topic, pasted notes, or an attachment; set a target word count; generate active-recall quizzes. |
| Statute Hub | Browse and filter statutory and jurisprudential material, bookmark provisions, and request AI-assisted statute or Sharia lookups. |
| Offline Vault | View, search, and manage locally saved IRAC solutions, case briefs, and note syntheses. |
| Device and accessibility tools | Camera capture, voice dictation/recording, text-to-speech, speech preferences, onboarding, and device-permission controls. |

Some modules use preloaded learning material, while AI-powered actions call the Express API. The accuracy and completeness of AI-generated legal content must be checked against authoritative legislation and court sources.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js, Express
- **AI:** Google Gemini through the `@google/genai` SDK
- **Mobile packaging:** Capacitor 8 and Android
- **Build automation:** GitHub Actions
- **Local persistence:** Browser storage (currently localStorage for learner preferences and saved study material)

## Repository structure

The main project areas include:

- `src/App.tsx` — application shell, navigation, onboarding, and module selection
- `src/components/` — feature views, navigation, camera and voice interfaces, and dialogs
- `src/data/` — preloaded learning content
- `src/utils/` — local storage, learner profile, device permissions, and speech utilities
- `server.ts` — Express API and Gemini integration
- `capacitor.config.ts` — Capacitor application configuration
- `.github/workflows/android-release.yml` — Android release APK workflow

## Requirements

For local development, install:

- Node.js 22 or a compatible current LTS release
- npm
- Git
- Android Studio and Android SDK for local Android builds
- Java 21 for the Android Gradle build

The repository's GitHub Actions workflow currently uses Node.js 22 and Java 21.

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/nyarara-derrick/law-app.git
   cd law-app
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

4. Add your Gemini API key to the local `.env` file:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Use the local URL printed by the development server.

Never commit your real `.env` file or expose the Gemini API key in frontend code, an Android APK, a `VITE_*` variable, screenshots, logs, or public issue reports. The key belongs on the backend only.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Express server with Vite middleware for development. |
| `npm run build` | Build the web frontend and bundle the Express server. |
| `npm start` | Start the bundled Express server. |
| `npm run preview` | Run Vite's preview server for the built frontend. |
| `npm run lint` | Run the TypeScript compiler without emitting files. |
| `npm run clean` | Remove generated build output listed in the script. |

## Backend API

The current Express server defines these AI endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/irac/extract-text` | Extract legal questions and text from an image or PDF attachment. |
| POST | `/api/irac/solve` | Generate an IRAC analysis from a scenario or attachment. |
| POST | `/api/irac/grade` | Grade a student's IRAC answer using a structured rubric. |
| POST | `/api/case/brief` | Generate a structured case brief. |
| POST | `/api/synthesizer/generate` | Synthesize notes and generate an active-recall quiz. |
| POST | `/api/synthesizer/generate-quiz` | Generate a fresh quiz from supplied notes. |
| POST | `/api/statute/lookup` | Generate a statutory or jurisprudential lookup. |

These endpoints currently depend on the server-side `GEMINI_API_KEY`. They are not a substitute for verified legal research.

## Android build

The Android project is packaged with Capacitor. The repository includes a GitHub Actions workflow at `.github/workflows/android-release.yml` that builds a release APK when code is pushed to `main` or when the workflow is manually run.

To build locally after installing the Android prerequisites:

```bash
npm ci
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

The generated APK is produced under:

```
android/app/build/outputs/apk/release/
```

A release APK still needs installation and real-device testing. AI functionality also requires a reachable, correctly configured backend; packaging the frontend does not package the Express server as a running service inside the Android app.

## Current limitations and production-readiness work

The project is not yet an enterprise-ready production service. Before public release, the following areas need implementation and verification:

- Cloud deployment of the Express API and a secure way for the Android app to reach it over HTTPS.
- Centralized frontend API configuration for web and Android builds.
- Backend security: request validation, rate limiting, abuse prevention, safe error responses, CORS policy, and secret management.
- Authentication, authorization, user accounts, and secure session/token handling if multi-user accounts are introduced.
- A managed database and backup/restore strategy if users need accounts, synchronization, or cross-device access. Current saved material and learner preferences use local browser storage.
- Automated unit, integration, API, and end-to-end tests, plus Android device testing.
- Monitoring, structured logs, health checks, uptime/error alerts, and operational runbooks.
- Accessibility, performance, privacy, data-retention, and security reviews.
- Legal-content verification, source attribution, update processes, and clear educational-use disclaimers.
- Release signing, versioning, staged rollout, crash reporting, and a documented support process.

The roadmap should be completed in stages. Features should not be described as production-ready until their acceptance tests pass.

## Legal and AI-use notice

LexiMind is an educational study tool, not a law firm, advocate, court, or official legal-information service. AI-generated explanations, case summaries, statutory references, and answers can be incomplete or incorrect. Users should verify legal authorities using current official sources and consult a qualified legal professional for real legal matters.

Do not submit confidential client information, privileged communications, personal identifiers, or sensitive case documents to an AI feature unless the service's privacy, retention, and data-processing arrangements have been reviewed and approved.

## Contributing and development

During development:

1. Work on a feature branch where practical.
2. Keep API keys and other secrets out of source control.
3. Run the TypeScript check and relevant tests before merging.
4. Test changes in the web app and on a real Android device when they affect mobile behavior.
5. Document new environment variables, API endpoints, and user-facing behavior.

## License

No license has been declared in this repository yet. Unless and until a license is added, the source code should not be assumed to be open for reuse, redistribution, or modification by the public.
