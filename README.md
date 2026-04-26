# DevFlow - Backend

<details>
<summary>Table of Contents</summary>
- [About This Project](#about-this-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Contributors](#contributors)
- [License](#license)
</details>

---

## About This Project

DevFlow Backend is the server-side component of the DevFlow platform — an AI-powered, project-based learning system designed to help developers escape "tutorial hell".

The backend handles:
- Project and module data
- Scenario/step management
- User progress tracking
- AI evaluation orchestration (Explain-to-Pass system)
- Authentication and Progress tracking

It acts as the bridge between the frontend learning experience and AI-powered feedback.

---

## Features

- 📦 Project & Module Management  
- 🧠 AI Evaluation System (Explain-to-Pass)  
- 🧩 Step-based Learning Flow  
- 📊 User Progress Tracking  
- 🔐 Authentication (optional for MVP)  
- ⚙️ Scalable REST API  

---

## Tech Stack

- **Node.js** – Runtime environment  
- **Express.js** – Backend framework  
- **MongoDB** – NoSQL database  
- **Mongoose** – ODM for MongoDB  
- **OpenAI API (or similar)** – AI evaluation service  


---

## Folder Structure
```
backend/
│── src/
│ ├── controllers/ # Handle request logic
│ ├── routes/ # API route definitions
│ ├── models/ # Mongoose schemas
│ ├── services/ # Business logic (AI,..)
│ ├── middlewares/ # Auth, error handling
│ ├── config/ 
│ └── utils/ 
│
│── .env 
│── app.js # Express app setup
│── server.js # Entry point
│── package.json
```

---

## API Endpoints

| Method | Endpoint                | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | /api/projects          | Get all available projects           |
| GET    | /api/projects/:id      | Get project details                  |
// to be filled later

---

## Getting Started

To run this backend locally, ensure you have:

- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)
- API key for AI service (e.g., OpenAI)

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/devflow-backend.git
cd devflow-backend
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file based on `.env.example` and fill in your configuration:
```MONGO_URI=your_mongodb_uri
AI_API_KEY=your_ai_api_key
```
4. Start the server:
```bash
npm start
```

## Contributors

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.