import mongoose from "mongoose";
import { pathToFileURL } from "node:url";

import connectDB from "../config/database.js";
import FileTemplate, {
  type FileTemplateDocument,
} from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Project, { type ProjectLevel } from "../models/projectModel.js";
import Task, {
  type SkillCategory,
  type TaskDifficulty,
} from "../models/taskModel.js";
import TaskFile from "../models/taskFileModel.js";

type SeedFileTemplate = {
  path: string;
  skeleton: string;
  solution: string;
};

type SeedTask = {
  title: string;
  description: string;
  order: number;
  instructions: string;
  difficulty: TaskDifficulty;
  skillCategory: SkillCategory;
  skillPoints: number;
  concepts: string;
  files: SeedFileTemplate[];
};

type SeedModule = {
  title: string;
  description: string;
  order: number;
  tasks: SeedTask[];
};

const projectLevel: ProjectLevel = "Intermediate";

const twitterCloneProject = {
  title: "Build a Full-Stack Twitter Clone",
  description:
    "Build a modern Twitter-inspired platform with reusable UI foundations, routing, auth state, feed rendering, and production deployment patterns.",
  level: projectLevel,
  previewUrl: "https://example.com/twitter-clone-preview",
  systemFlowUrl: "https://example.com/twitter-clone-system-flow",
  techStack: [
    {
      name: "React",
      iconUrl: "https://cdn.simpleicons.org/react/61DAFB",
      category: "Frontend",
    },
    {
      name: "TypeScript",
      iconUrl: "https://cdn.simpleicons.org/typescript/3178C6",
      category: "Frontend",
    },
    {
      name: "Tailwind CSS",
      iconUrl: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      category: "Frontend",
    },
    {
      name: "Node.js",
      iconUrl: "https://cdn.simpleicons.org/nodedotjs/339933",
      category: "Backend",
    },
    {
      name: "Express",
      iconUrl: "https://cdn.simpleicons.org/express/000000",
      category: "Backend",
    },
    {
      name: "MongoDB",
      iconUrl: "https://cdn.simpleicons.org/mongodb/47A248",
      category: "Database",
    },
  ],
  features: [
    {
      title: "JWT Authentication",
      description:
        "Sign in with secure token-based authentication and persistent session state.",
    },
    {
      title: "Tweet Composer",
      description:
        "Compose, validate, and publish posts with responsive character count feedback.",
    },
    {
      title: "Timeline Feed",
      description:
        "Render a real-time style timeline backed by deterministic mock data.",
    },
    {
      title: "Social Interactions",
      description:
        "Like, unlike, follow, and profile interactions with reusable UI patterns.",
    },
    {
      title: "Production Deployment",
      description:
        "Package the frontend with a production Docker image and SPA fallback routing.",
    },
  ],
};

const twitterCloneModules: SeedModule[] = [
  {
    title: "Setup & Foundations",
    description:
      "Create the base Vite application, styling pipeline, and routing structure.",
    order: 1,
    tasks: [
      {
        title: "Initialize React project (Vite + TypeScript)",
        description:
          "Bootstrap the app with scripts and dependencies that support a fast TypeScript React workflow.",
        order: 1,
        instructions:
          "Create the package manifest and Vite config needed to run, build, and preview the app in a production-friendly way.",
        difficulty: "Beginner",
        skillCategory: "Frontend",
        skillPoints: 10,
        concepts: "Vite, TypeScript, project bootstrap, build scripts",
        files: [
          {
            path: "package.json",
            skeleton: `{
  "name": "twitter-clone",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "TODO: wire the Vite dev server",
    "build": "TODO: add the production build command",
    "preview": "TODO: add the preview command"
  },
  "dependencies": {
    "react": "TODO: install react",
    "react-dom": "TODO: install react-dom"
  }
}`,
            solution: `{
  "name": "twitter-clone",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.1"
  }
}`,
          },
          {
            path: "vite.config.ts",
            skeleton: `import { defineConfig } from "vite";
// TODO: install the React plugin and export the app config.

export default defineConfig({
  // TODO: register plugins
});`,
            solution: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});`,
          },
        ],
      },
      {
        title: "Setup Tailwind CSS",
        description:
          "Configure utility-first styling and global design tokens for the app shell.",
        order: 2,
        instructions:
          "Add the Tailwind configuration and global stylesheet so utility classes and base styles are available everywhere.",
        difficulty: "Beginner",
        skillCategory: "Frontend",
        skillPoints: 10,
        concepts: "Tailwind configuration, global CSS, design tokens",
        files: [
          {
            path: "tailwind.config.js",
            skeleton: `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // TODO: add app-specific colors, spacing, and shadows
    },
  },
  plugins: [],
};`,
            solution: `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          900: "#1e3a8a",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};`,
          },
          {
            path: "src/index.css",
            skeleton: `@tailwind base;
@tailwind components;
@tailwind utilities;

/* TODO: add base background, typography, and reusable app styles */`,
            solution: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  font-family: Inter, system-ui, sans-serif;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #eff6ff 100%);
  color: #0f172a;
}

* {
  box-sizing: border-box;
}`,
          },
        ],
      },
      {
        title: "Setup React Router",
        description:
          "Create the routing shell and public/private entry points for the application.",
        order: 3,
        instructions:
          "Build a simple router with feed, login, and profile routes, then add a fallback redirect for unknown paths.",
        difficulty: "Beginner",
        skillCategory: "Frontend",
        skillPoints: 12,
        concepts: "React Router, route layout, navigation shell",
        files: [
          {
            path: "src/App.tsx",
            skeleton: `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: define public and protected routes */}
        {/* TODO: add a redirect from unknown paths */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`,
            solution: `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function LoginPage() {
  return <div>Login page</div>;
}

function FeedPage() {
  return <div>Feed page</div>;
}

function ProfilePage() {
  return <div>Profile page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`,
          },
        ],
      },
    ],
  },
  {
    title: "Auth & User Accounts",
    description:
      "Build the first sign-in surface and a client-side auth state store.",
    order: 2,
    tasks: [
      {
        title: "Create JWT Login Form UI",
        description:
          "Design a login form with email/password fields, validation affordances, and submit state.",
        order: 1,
        instructions:
          "Create a presentational login form that can be wired to a future API while staying fully typed.",
        difficulty: "Beginner",
        skillCategory: "Frontend",
        skillPoints: 14,
        concepts: "Forms, validation, controlled inputs, accessibility",
        files: [
          {
            path: "src/features/auth/components/LoginForm.tsx",
            skeleton: `import { FormEvent, useState } from "react";

export interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  // TODO: manage form state and validation feedback
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: send the credentials to the auth API
  };

  return <form onSubmit={handleSubmit}>{/* TODO: add fields and submit button */}</form>;
}`,
            solution: `import { FormEvent, useState } from "react";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.email.trim() || !values.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
          placeholder="Enter your password"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}`,
          },
        ],
      },
      {
        title: "Setup Auth Context/Zustand store",
        description:
          "Persist the authenticated user, token, and login/logout actions in a client store.",
        order: 2,
        instructions:
          "Create a Zustand store that can hydrate from local storage and expose simple login/logout actions.",
        difficulty: "Intermediate",
        skillCategory: "Frontend",
        skillPoints: 16,
        concepts: "Zustand, persistence, auth state, token storage",
        files: [
          {
            path: "src/features/auth/stores/authStore.ts",
            skeleton: `import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  // TODO: add login and logout actions
}

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  token: null,
  isAuthenticated: false,
}));`,
            solution: `import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { user: AuthUser; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: ({ user, token }) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "twitter-clone-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);`,
          },
        ],
      },
    ],
  },
  {
    title: "Tweets & Feeds",
    description:
      "Create reusable tweet UI and a feed timeline backed by deterministic mock data.",
    order: 3,
    tasks: [
      {
        title: "Build the Tweet Component",
        description:
          "Create a typed, reusable tweet card that receives the author, text, and engagement state via props.",
        order: 1,
        instructions:
          "Build a presentational tweet card that can be reused in the feed and profile timelines.",
        difficulty: "Beginner",
        skillCategory: "Frontend",
        skillPoints: 14,
        concepts: "Props typing, component composition, UI presentation",
        files: [
          {
            path: "src/components/Tweet.tsx",
            skeleton: `export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetProps {
  user: TweetAuthor;
  text: string;
  likes: number;
}

export default function Tweet({ user, text, likes }: TweetProps) {
  // TODO: render tweet header, body, and engagement bar
  return <article>{/* TODO: implement the tweet card */}</article>;
}`,
            solution: `export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetProps {
  user: TweetAuthor;
  text: string;
  likes: number;
  createdAt?: string;
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

export default function Tweet({ user, text, likes, createdAt, isLiked = false, onLikeToggle }: TweetProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <h3 className="font-semibold text-slate-900">{user.name}</h3>
          <p className="text-sm text-slate-500">@{user.handle}</p>
        </div>
        {createdAt ? <span className="ml-auto text-xs text-slate-400">{createdAt}</span> : null}
      </header>

      <p className="mt-4 text-sm leading-6 text-slate-700">{text}</p>

      <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{likes} likes</span>
        {onLikeToggle ? (
          <button
            type="button"
            onClick={onLikeToggle}
            className={isLiked ? "font-semibold text-rose-600" : "font-medium text-slate-600"}
          >
            {isLiked ? "Unlike" : "Like"}
          </button>
        ) : null}
      </footer>
    </article>
  );
}`,
          },
        ],
      },
      {
        title: "Create the Main Feed timeline",
        description:
          "Render a responsive feed that simulates data fetching and displays a list of tweets.",
        order: 2,
        instructions:
          "Build a feed container that fetches mock timeline data, handles a loading state, and renders Tweet cards.",
        difficulty: "Intermediate",
        skillCategory: "Frontend",
        skillPoints: 18,
        concepts: "Mock fetching, useEffect, list rendering, loading states",
        files: [
          {
            path: "src/features/feed/components/MainFeed.tsx",
            skeleton: `import { useEffect, useState } from "react";
import Tweet, { type TweetProps } from "../../../components/Tweet";

const mockTweets: TweetProps[] = [];

export default function MainFeed() {
  // TODO: fetch mock data and render the timeline
  return <section>{/* TODO: render tweets here */}</section>;
}`,
            solution: `import { useEffect, useState } from "react";
import Tweet, { type TweetProps } from "../../../components/Tweet";

const mockTweets: TweetProps[] = [
  {
    user: {
      id: "1",
      name: "Ada Lovelace",
      handle: "ada",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    text: "Shipping the first version of my Twitter clone timeline today.",
    likes: 128,
    createdAt: "2h",
  },
  {
    user: {
      id: "2",
      name: "Grace Hopper",
      handle: "grace",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
    text: "A clean component hierarchy makes the feed easy to extend.",
    likes: 84,
    createdAt: "5h",
  },
];

export default function MainFeed() {
  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTweets(mockTweets);
      setIsLoading(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Loading timeline...</div>;
  }

  return (
    <section className="space-y-4">
      {tweets.map((tweet) => (
        <Tweet key={tweet.user.id + tweet.createdAt} {...tweet} />
      ))}
    </section>
  );
}`,
          },
        ],
      },
    ],
  },
  {
    title: "Follows & Profile",
    description:
      "Build the profile surface and the first social graph view for the application.",
    order: 4,
    tasks: [
      {
        title: "Build the User Profile page header",
        description:
          "Create a profile header with avatar, counts, and a follow action button.",
        order: 1,
        instructions:
          "Build a reusable profile header component that can power both self-profile and visited-profile screens.",
        difficulty: "Beginner",
        skillCategory: "Frontend",
        skillPoints: 14,
        concepts: "Profile UI, props, layout, stat presentation",
        files: [
          {
            path: "src/features/profile/components/ProfileHeader.tsx",
            skeleton: `interface ProfileHeaderProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
}

export default function ProfileHeader(props: ProfileHeaderProps) {
  // TODO: render avatar, profile meta, stats, and follow button
  return <header>{/* TODO: implement profile header */}</header>;
}`,
            solution: `interface ProfileHeaderProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  tweets: number;
  isOwnProfile?: boolean;
}

export default function ProfileHeader({
  name,
  handle,
  bio,
  avatarUrl,
  followers,
  following,
  tweets,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  return (
    <header className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <img src={avatarUrl} alt={name} className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-100" />

        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
              <p className="text-sm text-slate-500">@{handle}</p>
            </div>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isOwnProfile ? "Edit profile" : "Follow"}
            </button>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{bio}</p>

          <div className="mt-5 flex gap-6 text-sm text-slate-600">
            <span><strong className="text-slate-900">{tweets}</strong> Tweets</span>
            <span><strong className="text-slate-900">{followers}</strong> Followers</span>
            <span><strong className="text-slate-900">{following}</strong> Following</span>
          </div>
        </div>
      </div>
    </header>
  );
}`,
          },
        ],
      },
    ],
  },
  {
    title: "Engagement & Interactions",
    description:
      "Implement the interaction logic that powers simple social engagement states.",
    order: 5,
    tasks: [
      {
        title: "Implement the Like/Unlike toggle logic",
        description:
          "Create a small hook that tracks the liked state and updates the count correctly.",
        order: 1,
        instructions:
          "Write a custom hook that encapsulates the like state transitions without mixing UI markup into the logic.",
        difficulty: "Intermediate",
        skillCategory: "Frontend",
        skillPoints: 16,
        concepts: "Custom hooks, local state, derived state, interaction logic",
        files: [
          {
            path: "src/features/tweets/hooks/useLikeToggle.ts",
            skeleton: `import { useState } from "react";

export function useLikeToggle(initialLikes: number, initialLiked = false) {
  // TODO: track liked state and keep the counter in sync
  return {
    liked: initialLiked,
    likes: initialLikes,
    toggleLike: () => undefined,
  };
}`,
            solution: `import { useState } from "react";

export function useLikeToggle(initialLikes: number, initialLiked = false) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = () => {
    setLiked((currentLiked) => {
      const nextLiked = !currentLiked;
      setLikes((currentLikes) => (nextLiked ? currentLikes + 1 : currentLikes - 1));
      return nextLiked;
    });
  };

  return {
    liked,
    likes,
    toggleLike,
  };
}`,
          },
        ],
      },
    ],
  },
  {
    title: "Deploy the App",
    description:
      "Package the frontend in a production-ready Docker image with SPA fallback routing.",
    order: 6,
    tasks: [
      {
        title: "Write the Dockerfile for the frontend",
        description:
          "Build a multi-stage Docker image that compiles the frontend and serves it with nginx.",
        order: 1,
        instructions:
          "Create a production Dockerfile that installs dependencies, builds the app, and serves the dist folder through nginx.",
        difficulty: "Intermediate",
        skillCategory: "DevOps",
        skillPoints: 20,
        concepts: "Docker, nginx, multi-stage builds, SPA fallback",
        files: [
          {
            path: "Dockerfile",
            skeleton: `FROM node:20-alpine AS builder
WORKDIR /app

# TODO: copy manifests, install dependencies, and build the production bundle

FROM nginx:1.27-alpine
# TODO: copy the built assets and configure nginx for SPA routing`,
            solution: `FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
          },
        ],
      },
    ],
  },
];

async function createTaskArtifacts(
  projectId: mongoose.Types.ObjectId,
  moduleId: mongoose.Types.ObjectId,
  task: SeedTask,
) {
  const fileTemplates: FileTemplateDocument[] = await FileTemplate.insertMany(
    task.files.map((file) => ({
      projectId,
      path: file.path,
      content: file.skeleton,
    })),
  );

  const createdTask = await Task.create({
    moduleId,
    fileId: fileTemplates.map((fileTemplate) => fileTemplate._id),
    title: task.title,
    description: task.description,
    order: task.order,
    instructions: task.instructions,
    difficulty: task.difficulty,
    concepts: task.concepts,
    skillCategory: task.skillCategory,
    skillPoints: task.skillPoints,
  });

  await TaskFile.insertMany(
    fileTemplates.map((fileTemplate, index) => ({
      taskId: createdTask._id,
      fileId: fileTemplate._id,
      content: task.files[index].solution,
    })),
  );
}

export async function seedTwitterClone(): Promise<void> {
  await connectDB();

  try {
    console.info("Seeding Twitter clone project data...");

    await Promise.all([
      TaskFile.deleteMany({}),
      Task.deleteMany({}),
      Module.deleteMany({}),
      FileTemplate.deleteMany({}),
      Project.deleteMany({}),
    ]);

    const project = await Project.create(twitterCloneProject);

    for (const moduleSeed of twitterCloneModules) {
      const module = await Module.create({
        projectId: project._id,
        title: moduleSeed.title,
        description: moduleSeed.description,
        order: moduleSeed.order,
      });

      for (const task of moduleSeed.tasks) {
        await createTaskArtifacts(project._id, module._id, task);
      }
    }

    console.info("Twitter clone project seeded successfully.");
  } finally {
    await mongoose.disconnect();
  }
}

const shouldRunDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (shouldRunDirectly) {
  void seedTwitterClone().catch((error: unknown) => {
    console.error("Twitter clone seed failed:", error);
    process.exitCode = 1;
  });
}

export default seedTwitterClone;
