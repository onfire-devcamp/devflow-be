<div align="center">
  <h1>DevFlow Backend API</h1>
  <p>The core engine powering DevFlow's interactive coding and AI mentoring platform.</p>
  
  <a href="https://github.com/onfire-devcamp/devflow-fe"><b>🔗 View the Frontend Repository</b></a>
  <br />
  <br />

  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
</div>

---

<details>
  <summary><b>📖 Table of Contents</b></summary>
  
  - [Overview](#overview)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Project Architecture](#project-architecture)
  - [Security & Guardrails](#security--guardrails)
  - [API Documentation](#api-documentation)
  - [CI/CD & Deployments](#cicd--deployments)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
  - [Contributors](#contributors)
  - [License & Feedback](#license--feedback)
</details>

## Overview
The DevFlow Backend API serves as the central nervous system bridging the user's interactive code editor with the AI mentoring engine. It's a robust, stateless Node.js application built with Express and TypeScript, designed to handle high-frequency interactions like real-time workspace auto-saving and low-latency code evaluations. 

By offloading state management to a unified Redis cache and isolating core learning data in MongoDB, the architecture ensures resilient scaling. Crucially, the backend acts as a secure gateway to the Gemini AI models, orchestrating prompts, validating context, and strictly enforcing guardrails to provide Socratic guidance rather than spoon-fed code solutions.

## Tech Stack
* **Runtime/Framework:** Node.js (v20), Express (v5)
* **Language:** TypeScript
* **Database & ORM:** MongoDB (v7), Mongoose (v9)
* **Caching & Rate Limiting:** Redis, `ioredis`, `rate-limit-redis`
* **AI Engine:** Google Generative AI SDK (Gemini 2.5 Flash)
* **Security & Validation:** `helmet`, `bcrypt`, `jsonwebtoken`, `zod`

## Features
* **AI Mentoring Engine:** Seamlessly integrates with Gemini 2.5 Flash, actively preventing spoon-feeding by employing prompt sandwiching and post-generation regex output sanitization.
* **Explain-to-Pass Verification:** A specialized module that grades users' logical explanations of their code using AI heuristics before allowing progression.
* **High-Frequency Auto-Save Workspace:** Manages highly mutable user code workspaces using robust rate limiting, persisting incremental file modifications to the database asynchronously.
* **Mastery-Based Progression State:** Secures the sequential unlocking roadmap, ensuring that learners cannot skip prerequisites, while also tracking daily learning streaks.
* **Secure Authentication & Identity:** Utilizes JSON Web Tokens (JWT) coupled with standard flows and standard email/password flows to manage stateless sessions securely.

## Project Architecture
The backend utilizes a scalable, stateless **MVC (Model-View-Controller)** pattern augmented with specialized Service layers for business logic and AI orchestration. Redis is heavily leveraged as a shared state manager, driving the 5-Tier Rate Limiting system to prevent abuse of our AI models and database. For AI context, the backend dynamically queries decoupled collections (`AI_CHATS`, `AI_HINTS`) to construct sliding window context histories, ensuring the mentor remains aware of previous student interactions while strictly bounding token usage.

## Security & Guardrails
### 1. Redis-Backed Rate Limiting (5-Tier)
Our backend implements a tiered defense mechanism using `express-rate-limit` and `ioredis` to prevent abuse:
- **Global Limiter (`rl:global:`):** 1000 requests per 15 minutes window for all general API traffic.
- **Auth Limiter (`rl:auth:`):** Strict 5 attempts per 5 minutes to mitigate brute-force logins.
- **AI Limiter (`rl:ai:`):** 50 requests per 60 minutes, keyed by User ID to enforce hourly AI quotas.
- **Auto-Save Limiter (`rl:autosave:`):** 30 requests per 10 seconds, allowing for frequent typing saves without overloading the DB.
- **Export Limiter (`rl:export:`):** 5 requests per 5 minutes for heavy payload generation.

### 2. Prompt Injection Defenses
To ensure the AI acts as a mentor and not a code-generator, we employ three defensive layers within our AI services:
- **XML Quarantine:** User input is strictly wrapped inside `<student_message>` tags to isolate it from system instructions.
- **The Sandwich Method:** System re-enforcement instructions (`"Do NOT provide full code solutions..."`) are forcibly appended *after* the user's quarantined input to ensure they are evaluated last.
- **Regex Output Sanitization:** AI responses are intercepted using a code block regex. If the model ignores instructions and generates a code block exceeding 4 lines, the entire response is scrubbed and replaced with a default conceptual hint. Additionally, chat output tokens are strictly hard-capped at 400.

## API Documentation
| Method | Endpoint | Description | Guardrail Middleware |
|--------|----------|-------------|----------------------|
| `POST` | `/api/auth/login` | Authenticates user and returns JWT | `authLimiter` |
| `GET` | `/api/project/:slug` | Retrieves project overview & details | `cacheResponse(1h)` |
| `PUT` | `/api/workspace/file` | Auto-saves user file modifications | `protect`, `autoSaveLimiter` |
| `POST` | `/api/workspace/complete-task`| Submits a task for completion | `protect` |
| `POST` | `/api/ai/chat/message` | Contextual AI chat message | `protect`, `aiRateLimiter` |
| `POST` | `/api/ai/explain-to-pass` | Evaluates student code explanation | `protect`, `aiRateLimiter` |
| `GET` | `/api/user/profile` | Fetches aggregated profile data | `protect` |

## CI/CD & Deployments
The backend utilizes GitHub Actions for its CI pipeline, triggering on pushes and pull requests to the `main` branch. It automatically sets up Node.js v20, installs dependencies cleanly with `npm ci`, runs a full typecheck (`tsc --noEmit`), and executes linting.

For deployment, the app is containerized using a multi-stage `Dockerfile` based on `node:20-alpine`, keeping the production image lightweight. A `docker-compose.yml` file is provided to rapidly spin up a local `redis:7-alpine` container. 
Production deployment requires specific environment variables, most notably `REDIS_URL`, `MONGO_URI`, and `GEMINI_API_KEY`. Crucially, because it is deployed behind reverse proxies or load balancers (like Render), the Express app explicitly enables `app.set('trust proxy', 1)` to accurately resolve client IPs and ensure secure cookie handling.

## Project Structure
```text
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   ├── rateLimitStore.ts
│   │   ├── redis.ts
│   ├── constants/
│   │   ├── aiPrompts.ts
│   │   ├── chatMessages.ts
│   │   ├── evaluationConstant.ts
│   │   ├── streak.ts
│   ├── controllers/
│   │   ├── activityControllers.ts
│   │   ├── aiControllers.ts
│   │   ├── authControllers.ts
│   │   ├── progressBarLogic.ts
│   │   ├── projectControllers.ts
│   │   ├── userControllers.ts
│   │   ├── workspaceControllers.ts
│   ├── middlewares/
│   │   ├── aiValidationMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   ├── cacheMiddleware.ts
│   │   ├── rateLimiters.ts
│   │   ├── validationMiddleware.ts
│   │   ├── workspaceValidationMiddleware.ts
│   ├── models/
│   │   ├── activityModel.ts
│   │   ├── aiChatModel.ts
│   │   ├── aiEvaluationModel.ts
│   │   ├── aiHintModel.ts
│   │   ├── fileTemplateModel.ts
│   │   ├── moduleModel.ts
│   │   ├── projectModel.ts
│   │   ├── refreshTokenModel.ts
│   │   ├── taskFileModel.ts
│   │   ├── taskModel.ts
│   │   ├── userFileModel.ts
│   │   ├── userModel.ts
│   │   ├── userProgressModel.ts
│   ├── routes/
│   │   ├── activityRoute.ts
│   │   ├── aiRoute.ts
│   │   ├── authRoute.ts
│   │   ├── projectRoute.ts
│   │   ├── userRoute.ts
│   │   ├── workspaceRoute.ts
│   ├── services/
│   │   ├── activityService.ts
│   │   ├── aiChatService.ts
│   │   ├── aiEvaluationService.ts
│   │   ├── aiHintService.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   ├── streakService.ts
│   │   ├── userServices.ts
│   │   ├── workspaceService.ts
│   ├── types/
│   │   ├── aiTypes.ts
│   │   ├── projectTypes.ts
│   │   ├── userTypes.ts
│   │   ├── workspaceTypes.ts
│   ├── utils/
│   │   ├── authUtils.ts
│   │   ├── cookieUtils.ts
│   │   ├── customErrors.ts
│   │   ├── geminiClient.ts
│   │   ├── mappers.ts
│   │   ├── responseUtils.ts
│   │   ├── streakUtils.ts
│   │   ├── tokenUtils.ts
│   ├── scripts/
│   │   ├── seedDatabase.ts
│   │   ├── seedKahoot.ts
│   │   ├── seedSinglePageCV.ts
│   │   ├── seedTwitterClone.ts
│   │   ├── seedTypes.ts
│   │   ├── seedUrlShortener.ts
│   │   ├── simulateProjectCompletion.ts
│   │   ├── updateTasksMCQ.ts
```

## Getting Started

### Prerequisites
* Node.js (v20+)
* MongoDB
* Redis (Docker recommended)

### Installation & Local Dev
```bash
# Clone the repository
git clone https://github.com/Duythanducminh/DevFlow-BE.git
cd devflow-be

# Install dependencies
npm ci

# Setup environment variables
cp .env.example .env
# Edit .env and populate MONGO_URI, GEMINI_API_KEY, REDIS_URL, etc.

# Start Redis (using Docker)
docker-compose up -d

# Run the development server
npm run dev
```

## Contributors
* dhp-exe
* Duythanducminh
* huytranminhcs0707-lab
* ShineyIsHere

## License & Feedback
Distributed under the MIT License. If you have feedback or encounter issues, please open an issue in the repository.