# Changelog

## v1.1.2

### Added or Changed

- **AI Mentor Persona Separation**
  - *Before:* The AI Mentor used a single generic prompt for all interactions, causing inconsistent tone between hinting and code explanation.
  - *After:* We separated the system prompts into distinct personas (`HINT_SYSTEM_PROMPT` vs `EXPLAIN_SYSTEM_PROMPT`), ensuring the AI provides targeted guidance versus strict explanations.
  - PR: [#30](https://github.com/onfire-devcamp/devflow-be/pull/30)
- **Context-Aware AI Generation**
  - *Before:* The AI was unaware of the user's active file name or specific task instructions, often resulting in generic or slightly off-topic feedback.
  - *After:* The prompt is now dynamically formatted with XML tags (`<task_context>` and `<current_file>`) injecting the exact `codeContext` and `currentFileName` for hyper-relevant guidance.
  - PR: [#30](https://github.com/onfire-devcamp/devflow-be/pull/30)
- **Explain-to-Pass Anti-Cheat**
  - *Before:* Users could bypass the conceptual check by thoughtlessly copy-pasting the exact MCQ answer into the "Explain your answer" text area.
  - *After:* A strict anti-cheat evaluation protocol penalizes copy-pasting with an automatic 0 score, and the frontend UI explicitly prompts users to "explain what you did in this task" in their own words.
  - PR: [#30](https://github.com/onfire-devcamp/devflow-be/pull/30)
- **Input and Output Token Handling**
  - *Before:* AI responses were being abruptly cut off mid-sentence (the "token guillotine") because the `maxOutputTokens` limit was too strict, and the model was wasting valuable tokens on unnecessary greetings and pleasantries.
  - *After:* Increased the `maxOutputTokens` safety buffer to `400` and updated the System Prompts with strict directives to eliminate pleasantries, forcing the AI to provide complete, concise, and highly token-efficient answers.
  - *PR:* [#30](https://github.com/onfire-devcamp/devflow-be/pull/30)
- **Dashboard UI Polish**
  - _Before:_ The dashboard page featured a flat MVP aesthetic with a white background and hard borders on empty streak days, causing cards to blend into the main layout.
  - _After:_ We upgraded to a premium SaaS aesthetic by adding a subtle `bg-slate-50` page background to contrast pure white cards, applied `shadow-sm` and hover shadow effects to the main components, and refined the empty states for a cleaner look.
  - PR: [#52](https://github.com/onfire-devcamp/devflow-fe/pull/52)
## v1.1.1

### Added or Changed

- **README Overhaul:** Generated a production-grade `README.md` with full codebase-scanned Tech Stack, 5-tier rate-limiting docs, API reference table, and CI/CD deployment notes.
- **Contributors Section:** Replaced broken HTML-based contributor images with the automated `contrib.rocks` dynamic image link.
- **App Branding:** Added the DevFlow `logo.png` to the repository `<h1>` title in the README header, replacing the generic emoji.
- **Repository Cleanup:** Copied `logo.png` into `.github/assets/` for self-contained README rendering on GitHub.

### Removed

- Removed the broken Google Search-prefixed `<img src>` URLs from the old Contributors HTML block.

---

## v1.1.0

### Added or Changed

- **5-Tier Redis Rate Limiting:** Implemented a granular rate-limiting architecture backed by `ioredis` and `rate-limit-redis`, covering Global, Auth, AI, Auto-Save, and Export tiers (`rateLimiters.ts`, `rateLimitStore.ts`).
- **AI Mentor Context-Awareness:** Integrated `codeContext` and `currentFileName` parameters into the AI chat service, enabling the Gemini model to receive the student's active code and file name with every request.
- **Sliding-Window Token Optimization:** Added `maxOutputTokens` safety buffer to all Gemini API calls to prevent runaway token generation and control response length.
- **Prompt Injection Guards:** Implemented XML `<student_message>` quarantining and prompt sandwiching in `aiChatService.ts` to neutralize prompt injection attacks from user input.
- **4-Line Code Block Sanitization:** Added a regex-based sanitizer that strips code blocks exceeding 4 lines from AI responses to enforce the "no spoon-feeding" policy.
- **CI/CD Pipeline:** Added GitHub Actions workflows for automated linting, typechecking (`tsc --noEmit`), and dependency installation on pushes and PRs to `main`.
- **Docker Containerization:** Created a multi-stage `Dockerfile` (based on `node:20-alpine`) and `docker-compose.yml` for local Redis provisioning.
- **Redis Cache Layer:** Wired a Redis cache layer with a `v2` flush endpoint for cache invalidation.
- **Gamification Model:** Added gamification fields (streaks, badges, scores) to the User model.
- **Scorecard Logic:** Implemented backend scorecard calculation service for user profile aggregation.
- **Profile & Header Service Updates:** Updated user service and header logic to support aggregated profile data.
- **Project Seeding:** Reseeded all projects (Single-Page CV, Twitter Clone, Kahoot Clone, URL Shortener) with updated task files, MCQ options, and module metadata (estimated hours, module count, categories).
- **Project Codebase Controllers:** Added controllers for fetching project codebase file trees.
- **Workspace Lock Logic:** Implemented sequential task-unlocking enforcement in the workspace service.
- **Reverse Proxy Configuration:** Set `app.set('trust proxy', 1)` and reconfigured CORS for deployment behind Render's load balancer.
- **User Progress & Streak APIs:** Added dedicated endpoints for user streak tracking and progress aggregation.
- **Chat History Preservation:** Refactored workspace services to support cursor-paginated chat history with persistent storage.
- **Validation Middleware:** Added request param/query validation middleware with typed Express requests and standardized `SuccessResponse` class.
- **Roadmap Unlock Logic Fix:** Fixed module and task unlock logic for sequential progression.

---

## v1.0.0

### Added or Changed

- **Project Initialization:** Scaffolded the Express + TypeScript backend with Mongoose, configured environment variables, and set up the `devflow-be` repository.
- **Core Schemas:** Implemented Mongoose schemas for Projects, Modules, Tasks, File Templates, Task Files, Users, User Files, and User Progress.
- **AI Context Schemas:** Created dedicated schemas for AI Hints, AI Chats, and AI Evaluations (decoupled AI Context Engine).
- **JWT Authentication:** Implemented full JWT authentication flow with access/refresh token rotation and reuse detection (`authService.ts`).
- **Google OAuth:** Added Google OAuth login endpoint and service with provider/providerId fields on the User model.
- **Security Hardening:** Integrated `helmet`, CORS origin configuration, and body size limits.
- **AI Services:** Implemented core AI chat, hint, and evaluation services with the Gemini client, including structured prompt engineering and response parsing.
- **Explain-to-Pass System:** Built the backend evaluation pipeline requiring users to explain their code logic (score ≥ 7/10 to pass) before unlocking the next task.
- **Activity & Streak Services:** Added activity logging routes and daily streak calculation service.
- **Progress Bar Logic:** Implemented backend progress calculation for skill percentages and module completion.
- **Project & Workspace Services:** Initialized project listing, detail retrieval, and workspace file management services.
- **Slug-Based Routing:** Added slug fields to projects for cleaner frontend routing.
- **PR Template:** Added a standardized pull request template for the repository.
- **Commitlint & Prettier:** Configured `commitlint` with conventional commits and `prettier` for code formatting.
- **TypeScript Migration:** Migrated the entire codebase from JavaScript to TypeScript with strict typing.
