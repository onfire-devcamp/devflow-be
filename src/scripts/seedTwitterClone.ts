import type { SeedProject } from "./seedTypes.js";

// ---------------------------------------------------------------------------
// Foundational Files — read-only, always visible, not tied to any task
// ---------------------------------------------------------------------------

const foundationalFiles: SeedProject["foundationalFiles"] = [
  {
    path: "package.json",
    content: `{
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
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.2",
    "vite": "^6.0.1"
  }
}`,
  },
  {
    path: "vite.config.ts",
    content: `import { defineConfig } from "vite";
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
  {
    path: "tailwind.config.js",
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
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
    content: `@tailwind base;
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
  {
    path: "src/main.tsx",
    content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Module 1 — Base Routing
// ═══════════════════════════════════════════════════════════════════════════

const m1t1AppSkeleton = `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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
        {/*  The Feed route is already set up for you. */}
        <Route path="/feed" element={<FeedPage />} />

        {/* TODO: Add the "/login" route rendering <LoginPage /> */}
        {/* TODO: Add the "/profile/:username" route rendering <ProfilePage /> */}

        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`;

const m1t1AppSolution = `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 2 — Layout & Navigation
// ═══════════════════════════════════════════════════════════════════════════

const m2t1LayoutSkeleton = `import { Outlet, NavLink } from "react-router-dom";

const navItems = [
  { to: "/feed", label: "Home" },
  { to: "/profile/me", label: "Profile" },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <nav className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-slate-200 bg-white p-4">
        <h1 className="mb-6 text-xl font-bold text-brand-600">Twitter Clone</h1>

        {/*  Here is what a single NavLink looks like with active styling:

            <NavLink
              key="/feed"
              to="/feed"
              className={({ isActive }) =>
                \\\`rounded-xl px-4 py-3 text-sm font-medium transition \\\${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-slate-600 hover:bg-slate-50"
                }\\\`
              }
            >
              Home
            </NavLink>
        */}

        {/* TODO: Map over the 'navItems' array and render a <NavLink> for each item.
            Use item.to as both the 'key' and 'to' props, item.label as children,
            and the className callback pattern shown above. */}
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}`;

const m2t1LayoutSolution = `import { Outlet, NavLink } from "react-router-dom";

const navItems = [
  { to: "/feed", label: "Home" },
  { to: "/profile/me", label: "Profile" },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <nav className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-slate-200 bg-white p-4">
        <h1 className="mb-6 text-xl font-bold text-brand-600">Twitter Clone</h1>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              \`rounded-xl px-4 py-3 text-sm font-medium transition \${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-50"
              }\`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 3 — The Tweet Component
// ═══════════════════════════════════════════════════════════════════════════

const m3t1TweetCardSkeleton = `export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetCardProps {
  id: string;
  author: TweetAuthor;
  text: string;
  likes: number;
  createdAt: string;
}

export default function TweetCard({ id, author, text, likes, createdAt }: TweetCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/*  The author header is already implemented for you. */}
      <header className="flex items-center gap-3">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">{author.name}</h3>
          <p className="text-sm text-slate-500">@{author.handle}</p>
        </div>
        <span className="ml-auto text-xs text-slate-400">{createdAt}</span>
      </header>

      {/* TODO: Render the tweet body — a <p> displaying {text}.
          Use className="mt-4 text-sm leading-6 text-slate-700" */}

      {/* TODO: Render a <footer> displaying the like count.
          Use className="mt-4 flex items-center border-t border-slate-100 pt-4 text-sm text-slate-500"
          Inside, add a <span> showing "{likes} likes". */}
    </article>
  );
}`;

const m3t1TweetCardSolution = `export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetCardProps {
  id: string;
  author: TweetAuthor;
  text: string;
  likes: number;
  createdAt: string;
}

export default function TweetCard({ id, author, text, likes, createdAt }: TweetCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">{author.name}</h3>
          <p className="text-sm text-slate-500">@{author.handle}</p>
        </div>
        <span className="ml-auto text-xs text-slate-400">{createdAt}</span>
      </header>

      <p className="mt-4 text-sm leading-6 text-slate-700">{text}</p>

      <footer className="mt-4 flex items-center border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{likes} likes</span>
      </footer>
    </article>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 4 — The Feed Timeline
// ═══════════════════════════════════════════════════════════════════════════

const m4t1MainFeedSkeleton = `import { useEffect, useState } from "react";
import TweetCard, { type TweetCardProps } from "../../../components/TweetCard";

const mockTweets: TweetCardProps[] = [
  {
    id: "1",
    author: {
      id: "u1",
      name: "Ada Lovelace",
      handle: "ada",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    text: "Just shipped the first version of my Twitter clone timeline. The component composition pattern is so clean!",
    likes: 128,
    createdAt: "2h",
  },
  {
    id: "2",
    author: {
      id: "u2",
      name: "Grace Hopper",
      handle: "grace",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
    text: "A clean component hierarchy makes the feed easy to extend. Separation of concerns FTW.",
    likes: 84,
    createdAt: "5h",
  },
  {
    id: "3",
    author: {
      id: "u3",
      name: "Alan Turing",
      handle: "alan",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    text: "Exploring the limits of computation, one React component at a time.",
    likes: 256,
    createdAt: "8h",
  },
];

export default function MainFeed() {
  const [tweets, setTweets] = useState<TweetCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //  The data-fetching simulation is already set up for you.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTweets(mockTweets);
      setIsLoading(false);
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
        Loading timeline...
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* TODO: Map over the 'tweets' array and render a <TweetCard /> for each tweet.
          Use tweet.id as the key prop and spread the tweet object as props: {...tweet} */}
    </section>
  );
}`;

const m4t1MainFeedSolution = `import { useEffect, useState } from "react";
import TweetCard, { type TweetCardProps } from "../../../components/TweetCard";

const mockTweets: TweetCardProps[] = [
  {
    id: "1",
    author: {
      id: "u1",
      name: "Ada Lovelace",
      handle: "ada",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    text: "Just shipped the first version of my Twitter clone timeline. The component composition pattern is so clean!",
    likes: 128,
    createdAt: "2h",
  },
  {
    id: "2",
    author: {
      id: "u2",
      name: "Grace Hopper",
      handle: "grace",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
    text: "A clean component hierarchy makes the feed easy to extend. Separation of concerns FTW.",
    likes: 84,
    createdAt: "5h",
  },
  {
    id: "3",
    author: {
      id: "u3",
      name: "Alan Turing",
      handle: "alan",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    text: "Exploring the limits of computation, one React component at a time.",
    likes: 256,
    createdAt: "8h",
  },
];

export default function MainFeed() {
  const [tweets, setTweets] = useState<TweetCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTweets(mockTweets);
      setIsLoading(false);
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
        Loading timeline...
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} {...tweet} />
      ))}
    </section>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 5 — Engagement Logic
// ═══════════════════════════════════════════════════════════════════════════

const m5t1UseLikeToggleSkeleton = `import { useState } from "react";

export function useLikeToggle(initialLikes: number, initialLiked = false) {
  //  The state variables are already declared for you.
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  // TODO: Implement the toggleLike function.
  // It should flip 'liked' and adjust 'likes' by +1 or -1.
  // Use the callback form of setLiked to avoid stale closures:
  //   setLiked((currentLiked) => {
  //     const nextLiked = !currentLiked;
  //     setLikes((currentLikes) => nextLiked ? currentLikes + 1 : currentLikes - 1);
  //     return nextLiked;
  //   });
  const toggleLike = () => {};

  return { liked, likes, toggleLike };
}`;

const m5t1UseLikeToggleSolution = `import { useState } from "react";

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

  return { liked, likes, toggleLike };
}`;

// M5T2 chains TweetCard.tsx — skeleton MUST equal M3T1 solution
const m5t2TweetCardSkeleton = m3t1TweetCardSolution;

const m5t2TweetCardSolution = `import { useLikeToggle } from "../features/tweets/hooks/useLikeToggle";

export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetCardProps {
  id: string;
  author: TweetAuthor;
  text: string;
  likes: number;
  createdAt: string;
}

export default function TweetCard({ id, author, text, likes: initialLikes, createdAt }: TweetCardProps) {
  const { liked, likes, toggleLike } = useLikeToggle(initialLikes);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">{author.name}</h3>
          <p className="text-sm text-slate-500">@{author.handle}</p>
        </div>
        <span className="ml-auto text-xs text-slate-400">{createdAt}</span>
      </header>

      <p className="mt-4 text-sm leading-6 text-slate-700">{text}</p>

      <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{likes} likes</span>
        <button
          type="button"
          onClick={toggleLike}
          className={liked ? "font-semibold text-rose-600" : "font-medium text-slate-600 hover:text-rose-500"}
        >
          {liked ? "\\u2665 Liked" : "\\u2661 Like"}
        </button>
      </footer>
    </article>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 6 — Authentication
// ═══════════════════════════════════════════════════════════════════════════

const m6t1LoginFormSkeleton = `import { type FormEvent, useState } from "react";

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
      {/*  The email input is already implemented for you. */}
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

      {/* TODO: Add the password input following the email pattern above.
          Use id="password", type="password", autoComplete="current-password",
          bind value to values.password, update on change, placeholder="Enter your password". */}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {/* TODO: Add a submit <button> with type="submit".
          Disable it when isLoading is true.
          Show "Signing in..." when loading, "Sign in" otherwise.
          Use className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" */}
    </form>
  );
}`;

const m6t1LoginFormSolution = `import { type FormEvent, useState } from "react";

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
}`;

const m6t2AuthStoreSkeleton = `import { create } from "zustand";
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

      //  The login action is already implemented for you.
      login: ({ user, token }) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      // TODO: Implement the logout action.
      // Call set() to reset user to null, token to null, and isAuthenticated to false.
      logout: () => {},
    }),
    {
      name: "twitter-clone-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);`;

const m6t2AuthStoreSolution = `import { create } from "zustand";
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
);`;

// ═══════════════════════════════════════════════════════════════════════════
// Full Project Seed
// ═══════════════════════════════════════════════════════════════════════════

const twitterCloneProject: SeedProject = {
  title: "Build a Full-Stack Twitter Clone",
  slug: "twitter-clone",
  description:
    "Build a modern Twitter-inspired platform with reusable UI foundations, routing, auth state, feed rendering, and interactive social engagement patterns.",
  level: "Intermediate",
  category: "Fullstack",
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
      name: "React Router",
      iconUrl: "https://cdn.simpleicons.org/reactrouter/CA4245",
      category: "Frontend",
    },
    {
      name: "Zustand",
      iconUrl: "https://cdn.simpleicons.org/npm/CB3837",
      category: "Frontend",
    },
    {
      name: "Vite",
      iconUrl: "https://cdn.simpleicons.org/vite/646CFF",
      category: "Frontend",
    },
  ],
  features: [
    {
      title: "Client-Side Routing",
      description:
        "Navigate between feed, login, and profile views with React Router and a shared layout shell.",
    },
    {
      title: "Timeline Feed",
      description:
        "Render a responsive tweet timeline backed by deterministic mock data with loading states.",
    },
    {
      title: "Social Engagement",
      description:
        "Like and unlike tweets with a custom React hook that encapsulates toggle logic.",
    },
    {
      title: "Authentication UI",
      description:
        "Sign in with a controlled form and persist auth state in localStorage via Zustand.",
    },
  ],
  foundationalFiles,
  modules: [
    // ═════════════════════════════════════════════════════════════════════
    // Module 1: Base Routing
    // ═════════════════════════════════════════════════════════════════════
    {
      title: "Base Routing",
      description:
        "Set up client-side routing with React Router by adding routes for login and profile pages.",
      order: 1,
      tasks: [
        {
          title: "Add the login and profile routes to App.tsx",
          description:
            "The BrowserRouter and feed route are already configured. Add the remaining two routes following the same pattern.",
          order: 1,
          instructions:
            "The /feed route is already provided as an example. Follow the exact same <Route> pattern to add a /login route rendering <LoginPage /> and a /profile/:username route rendering <ProfilePage />.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "React Router, Route, path parameters, Navigate redirect",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m1t1AppSkeleton,
              solution: m1t1AppSolution,
            },
          ],
          mcq: {
            question:
              "What does the 'replace' prop on <Navigate to='/feed' replace /> do?",
            options: [
              {
                id: "opt_a",
                text: "It replaces the current entry in the browser history so the user cannot press Back to return to the unknown path",
              },
              {
                id: "opt_b",
                text: "It replaces the text content of the page with the feed content",
              },
              {
                id: "opt_c",
                text: "It replaces the /feed route definition with the catch-all route",
              },
              {
                id: "opt_d",
                text: "It forces the browser to do a full page refresh instead of client-side navigation",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // ═════════════════════════════════════════════════════════════════════
    // Module 2: Layout & Navigation
    // ═════════════════════════════════════════════════════════════════════
    {
      title: "Layout & Navigation",
      description:
        "Build a persistent layout shell with a sidebar navigation using NavLink components.",
      order: 2,
      tasks: [
        {
          title: "Map the navigation links inside the sidebar",
          description:
            "The layout shell, navItems array, and Outlet are provided. Your job is to render the nav links dynamically.",
          order: 1,
          instructions:
            "A commented-out example shows what a single NavLink looks like. Map over the navItems array and render a <NavLink> for each item using item.to as the key and to props, item.label as children, and the className callback with isActive for active/inactive styling.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts:
            "NavLink, isActive callback, array mapping, Outlet, layout composition",
          files: [
            {
              path: "src/components/Layout.tsx",
              skeleton: m2t1LayoutSkeleton,
              solution: m2t1LayoutSolution,
            },
          ],
          mcq: {
            question:
              "What does NavLink's className callback receive that a regular <a> tag does not?",
            options: [
              {
                id: "opt_a",
                text: "An object with an 'isActive' boolean that tells you if the link matches the current URL, enabling dynamic styling",
              },
              {
                id: "opt_b",
                text: "The full browser history stack so you can check which pages were visited before",
              },
              {
                id: "opt_c",
                text: "A ref to the DOM element so you can measure its position on screen",
              },
              {
                id: "opt_d",
                text: "An event object that fires every time the user hovers over the link",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // ═════════════════════════════════════════════════════════════════════
    // Module 3: The Tweet Component
    // ═════════════════════════════════════════════════════════════════════
    {
      title: "The Tweet Component",
      description:
        "Build a presentational tweet card by implementing the body and footer sections.",
      order: 3,
      tasks: [
        {
          title: "Render the tweet body and like count in TweetCard",
          description:
            "The card shell and author header are pre-built. Add the tweet text body and the engagement footer.",
          order: 1,
          instructions:
            "The author header (avatar, name, handle, timestamp) is already implemented. Add a <p> tag below the header to display the tweet text, and a <footer> element showing the like count as '{likes} likes'. Use the className values provided in the TODO comments.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts:
            "Props rendering, JSX expressions, presentational components, TypeScript interfaces",
          files: [
            {
              path: "src/components/TweetCard.tsx",
              skeleton: m3t1TweetCardSkeleton,
              solution: m3t1TweetCardSolution,
            },
          ],
          mcq: {
            question:
              "Why should TweetCard receive its data via props rather than fetching data internally?",
            options: [
              {
                id: "opt_a",
                text: "It makes the component reusable across different contexts (feed, profile, search) without duplicating fetch logic",
              },
              {
                id: "opt_b",
                text: "React components cannot make API calls directly",
              },
              {
                id: "opt_c",
                text: "Props are always faster than state for rendering data",
              },
              {
                id: "opt_d",
                text: "It prevents the component from ever re-rendering after the initial mount",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // ═════════════════════════════════════════════════════════════════════
    // Module 4: The Feed Timeline
    // ═════════════════════════════════════════════════════════════════════
    {
      title: "The Feed Timeline",
      description:
        "Render a feed timeline by mapping mock tweet data into TweetCard components.",
      order: 4,
      tasks: [
        {
          title: "Map the tweets array into TweetCard components",
          description:
            "The mock data, state management, and loading UI are all provided. Your job is to render the tweet list.",
          order: 1,
          instructions:
            "The useEffect already fetches mockTweets into the tweets state, and the loading state is handled. Inside the <section>, map over the tweets array and render a <TweetCard /> for each tweet. Pass tweet.id as the key prop and spread the entire tweet object as props using {...tweet}.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts:
            "List rendering, key prop, spread props, useEffect lifecycle, loading states",
          files: [
            {
              path: "src/features/feed/components/MainFeed.tsx",
              skeleton: m4t1MainFeedSkeleton,
              solution: m4t1MainFeedSolution,
            },
          ],
          mcq: {
            question:
              "Why does the useEffect cleanup function call window.clearTimeout(timer)?",
            options: [
              {
                id: "opt_a",
                text: "To prevent a state update on an unmounted component if the user navigates away before the timeout completes",
              },
              {
                id: "opt_b",
                text: "To reset the timer back to zero every time the component re-renders",
              },
              {
                id: "opt_c",
                text: "To make the setTimeout callback execute faster by freeing memory",
              },
              {
                id: "opt_d",
                text: "To prevent the browser's event loop from freezing during the timeout period",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // ═════════════════════════════════════════════════════════════════════
    // Module 5: Engagement Logic
    // ═════════════════════════════════════════════════════════════════════
    {
      title: "Engagement Logic",
      description:
        "Build a custom hook for like/unlike toggling and wire it into the tweet card.",
      order: 5,
      tasks: [
        {
          title: "Implement the toggleLike function in useLikeToggle",
          description:
            "The hook signature and state declarations are provided. Implement the toggle logic that flips liked and adjusts the count.",
          order: 1,
          instructions:
            "The liked and likes state variables are already declared. Fill in the toggleLike function body. Use the callback form of setLiked to flip the boolean, and inside that callback, call setLikes to increment or decrement the count based on the new liked value.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 16,
          concepts:
            "Custom hooks, useState callback form, state synchronization, closure safety",
          files: [
            {
              path: "src/features/tweets/hooks/useLikeToggle.ts",
              skeleton: m5t1UseLikeToggleSkeleton,
              solution: m5t1UseLikeToggleSolution,
            },
          ],
          mcq: {
            question:
              "Why does toggleLike use the callback form setLiked((currentLiked) => ...) instead of setLiked(!liked)?",
            options: [
              {
                id: "opt_a",
                text: "The callback form guarantees access to the latest state value, preventing bugs from stale closures in rapid event handlers",
              },
              {
                id: "opt_b",
                text: "The callback form is required by React for all boolean state updates",
              },
              {
                id: "opt_c",
                text: "The callback form batches the update so the component re-renders fewer times",
              },
              {
                id: "opt_d",
                text: "The callback form is needed to use TypeScript generics with the useState hook",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
        {
          title: "Wire useLikeToggle into the TweetCard like button",
          description:
            "The TweetCard from Module 3 is your starting point. Import the hook and add an interactive like/unlike button to the footer.",
          order: 2,
          instructions:
            "Import useLikeToggle from the hooks directory. Rename the 'likes' prop to 'initialLikes' in the destructuring to avoid naming conflicts. Call useLikeToggle(initialLikes) to get { liked, likes, toggleLike }. Update the footer to use the hook's 'likes' value and add a <button> that calls toggleLike on click, showing 'Liked' or 'Like' based on the liked state.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 16,
          concepts:
            "Hook integration, prop renaming, event handlers, conditional rendering, component evolution",
          files: [
            {
              path: "src/components/TweetCard.tsx",
              skeleton: m5t2TweetCardSkeleton,
              solution: m5t2TweetCardSolution,
            },
          ],
          mcq: {
            question:
              "Why is the 'likes' prop renamed to 'initialLikes' in the destructuring { likes: initialLikes }?",
            options: [
              {
                id: "opt_a",
                text: "To avoid a naming conflict with the 'likes' value returned from useLikeToggle, which tracks the mutable count",
              },
              {
                id: "opt_b",
                text: "TypeScript requires all props to be renamed when used alongside custom hooks",
              },
              {
                id: "opt_c",
                text: "It creates a new constant that makes the component render more efficiently",
              },
              {
                id: "opt_d",
                text: "React Router requires this naming convention for route parameters passed as props",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // ═════════════════════════════════════════════════════════════════════
    // Module 6: Authentication
    // ═════════════════════════════════════════════════════════════════════
    {
      title: "Authentication",
      description:
        "Build the login form UI and persist authentication state with Zustand.",
      order: 6,
      tasks: [
        {
          title: "Add the password input and submit button to LoginForm",
          description:
            "The form structure, state management, validation, and email input are provided. Follow the email pattern to add the remaining fields.",
          order: 1,
          instructions:
            "The email input is already fully implemented as your reference. Add a password input field following the same pattern (wrapped in a <div> with a <label> and <input>), using type='password' and binding to values.password. Then add a submit <button> that shows 'Signing in...' when isLoading is true and 'Sign in' otherwise.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts:
            "Controlled inputs, form patterns, submit state, disabled state, template duplication",
          files: [
            {
              path: "src/features/auth/components/LoginForm.tsx",
              skeleton: m6t1LoginFormSkeleton,
              solution: m6t1LoginFormSolution,
            },
          ],
          mcq: {
            question:
              "What makes the email input a 'controlled' input in React?",
            options: [
              {
                id: "opt_a",
                text: "Its value is driven by React state (value={values.email}) and updates go through onChange, making React the single source of truth",
              },
              {
                id: "opt_b",
                text: "It has an id attribute that React uses to control the DOM element directly",
              },
              {
                id: "opt_c",
                text: "It is inside a <form> element that has an onSubmit handler attached",
              },
              {
                id: "opt_d",
                text: "It uses the autoComplete attribute to let the browser control its behavior",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
        {
          title: "Implement the logout action in authStore",
          description:
            "The Zustand store with persist middleware and the login action are provided. Add the missing logout action.",
          order: 2,
          instructions:
            "The login action shows exactly how to call set() with a state update object. Follow the same pattern to implement logout — call set() to reset user to null, token to null, and isAuthenticated to false.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts:
            "Zustand, persist middleware, set action, state reset, localStorage hydration",
          files: [
            {
              path: "src/features/auth/stores/authStore.ts",
              skeleton: m6t2AuthStoreSkeleton,
              solution: m6t2AuthStoreSolution,
            },
          ],
          mcq: {
            question:
              "What does the partialize option in Zustand's persist middleware do?",
            options: [
              {
                id: "opt_a",
                text: "It selects which parts of the state to save to localStorage, preventing derived values like isAuthenticated from being persisted unnecessarily",
              },
              {
                id: "opt_b",
                text: "It splits the Zustand store into multiple independent smaller stores for performance",
              },
              {
                id: "opt_c",
                text: "It creates a partial shallow copy of the store state for use in React testing utilities",
              },
              {
                id: "opt_d",
                text: "It prevents certain store actions from being called until the store has hydrated from localStorage",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
  ],
};

export default twitterCloneProject;
