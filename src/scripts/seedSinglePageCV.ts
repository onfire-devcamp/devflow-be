import type { SeedProject } from "./seedTypes.js";

// ═══════════════════════════════════════════════════════════════════════════
// Foundational Files — Read-Only & Always Visible
// ═══════════════════════════════════════════════════════════════════════════

const foundationalFiles: SeedProject["foundationalFiles"] = [
  {
    path: "package.json",
    content: `{
  "name": "single-page-cv",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
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
  server: { port: 5173 },
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
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          900: "#134e4a",
        },
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

body {
  background-color: #f8fafc;
  color: #0f172a;
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
// Module 1 — Layout & Header
// ═══════════════════════════════════════════════════════════════════════════

const m1t1HeaderSkeleton = `export default function Header() {
  return (
    <header className="flex flex-col items-center gap-4 border-b border-slate-200 pb-8 text-center sm:flex-row sm:text-left">
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
        alt="Profile Avatar"
        className="h-24 w-24 rounded-full object-cover shadow-sm"
      />
      
      <div className="flex-1">
        {/* The Name element is already provided for you */}
        <h1 className="text-3xl font-bold text-slate-900">Alex Developer</h1>
        
        {/* TODO: Add a <p> tag for the Job Title. 
            Use className="mt-1 text-lg font-medium text-brand-600"
            Text: "Full-Stack Software Engineer" */}
            
        {/* TODO: Add a <p> tag for the Location and Contact.
            Use className="mt-2 text-sm text-slate-500"
            Text: "San Francisco, CA • alex@example.com" */}
      </div>
    </header>
  );
}`;

const m1t1HeaderSolution = `export default function Header() {
  return (
    <header className="flex flex-col items-center gap-4 border-b border-slate-200 pb-8 text-center sm:flex-row sm:text-left">
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
        alt="Profile Avatar"
        className="h-24 w-24 rounded-full object-cover shadow-sm"
      />
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900">Alex Developer</h1>
        <p className="mt-1 text-lg font-medium text-brand-600">Full-Stack Software Engineer</p>
        <p className="mt-2 text-sm text-slate-500">San Francisco, CA • alex@example.com</p>
      </div>
    </header>
  );
}`;

const m1t2AppSkeleton = `import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        {/* The Header is rendered for you */}
        <Header />
        
        {/* TODO: Add a <main> tag below the Header.
            Use className="mt-8 space-y-12"
            We will put our experience and education inside this tag in the next module. */}
      </div>
    </div>
  );
}`;

const m1t2AppSolution = `import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
        </main>
      </div>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 2 — Experience & Education
// ═══════════════════════════════════════════════════════════════════════════

const m2t1ExperienceItemSkeleton = `export interface ExperienceItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export default function ExperienceItem({ title, subtitle, period, description }: ExperienceItemProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      {/* The left column with the period is provided */}
      <div className="w-full shrink-0 text-sm font-medium text-slate-500 sm:w-32 sm:text-right">
        {period}
      </div>
      
      <div className="flex-1">
        {/* The title and subtitle are provided */}
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="font-medium text-brand-600">{subtitle}</p>
        
        {/* TODO: Add a <p> tag for the description.
            Use className="mt-2 text-sm leading-relaxed text-slate-600"
            Text: render the {description} prop inside it. */}
      </div>
    </div>
  );
}`;

const m2t1ExperienceItemSolution = `export interface ExperienceItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export default function ExperienceItem({ title, subtitle, period, description }: ExperienceItemProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      <div className="w-full shrink-0 text-sm font-medium text-slate-500 sm:w-32 sm:text-right">
        {period}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="font-medium text-brand-600">{subtitle}</p>
        
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}`;

const m2t1ExperienceListSkeleton = `import ExperienceItem from "./ExperienceItem";

const experienceData = [
  {
    id: "exp1",
    title: "Senior Frontend Engineer",
    subtitle: "TechStart Inc.",
    period: "2021 - Present",
    description: "Lead the frontend team in building a modern React application. Migrated legacy codebase to TypeScript and improved performance by 40%.",
  },
  {
    id: "exp2",
    title: "Web Developer",
    subtitle: "Creative Agency",
    period: "2019 - 2021",
    description: "Developed responsive websites for clients. Worked closely with designers to implement pixel-perfect UIs.",
  }
];

export default function ExperienceList() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Experience</h2>
      <div className="space-y-8">
        {/* TODO: Map over experienceData.
            Render an <ExperienceItem /> for each item, passing the key={item.id} and spreading the props {...item}. */}
      </div>
    </section>
  );
}`;

const m2t1ExperienceListSolution = `import ExperienceItem from "./ExperienceItem";

const experienceData = [
  {
    id: "exp1",
    title: "Senior Frontend Engineer",
    subtitle: "TechStart Inc.",
    period: "2021 - Present",
    description: "Lead the frontend team in building a modern React application. Migrated legacy codebase to TypeScript and improved performance by 40%.",
  },
  {
    id: "exp2",
    title: "Web Developer",
    subtitle: "Creative Agency",
    period: "2019 - 2021",
    description: "Developed responsive websites for clients. Worked closely with designers to implement pixel-perfect UIs.",
  }
];

export default function ExperienceList() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Experience</h2>
      <div className="space-y-8">
        {experienceData.map((item) => (
          <ExperienceItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}`;

// M2T2 Chains App.tsx (MUST EQUAL m1t2AppSolution)
const m2t2AppSkeleton = m1t2AppSolution;

const m2t2AppSolution = `import Header from "./components/Header";
import ExperienceList from "./components/ExperienceList";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
          <ExperienceList />
        </main>
      </div>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 3 — Skills & Polish
// ═══════════════════════════════════════════════════════════════════════════

const m3t1MockDataSkeleton = `export const frontendSkills = ["React", "TypeScript", "Tailwind CSS", "Next.js"];

// TODO: Export a backendSkills array containing ["Node.js", "Express", "PostgreSQL", "Redis"]
`;

const m3t1MockDataSolution = `export const frontendSkills = ["React", "TypeScript", "Tailwind CSS", "Next.js"];

export const backendSkills = ["Node.js", "Express", "PostgreSQL", "Redis"];
`;

const m3t1SkillTagsSkeleton = `import { frontendSkills } from "../data/mockData";
// TODO: Import backendSkills from "../data/mockData"

export default function SkillTags() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Skills</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Frontend</h3>
          <div className="flex flex-wrap gap-2">
            {/* Frontend skills mapping is provided for you */}
            {frontendSkills.map((skill) => (
              <span key={skill} className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Backend</h3>
          <div className="flex flex-wrap gap-2">
            {/* TODO: Follow the frontend pattern above to map over backendSkills.
                Render a <span> for each skill with the exact same className. */}
          </div>
        </div>
      </div>
    </section>
  );
}`;

const m3t1SkillTagsSolution = `import { frontendSkills, backendSkills } from "../data/mockData";

export default function SkillTags() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Skills</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Frontend</h3>
          <div className="flex flex-wrap gap-2">
            {frontendSkills.map((skill) => (
              <span key={skill} className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Backend</h3>
          <div className="flex flex-wrap gap-2">
            {backendSkills.map((skill) => (
              <span key={skill} className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}`;

// M3T2 Chains App.tsx (MUST EQUAL m2t2AppSolution)
const m3t2AppSkeleton = m2t2AppSolution;

const m3t2AppSolution = `import Header from "./components/Header";
import ExperienceList from "./components/ExperienceList";
import SkillTags from "./components/SkillTags";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
          <ExperienceList />
          <SkillTags />
        </main>
      </div>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Full Project Seed
// ═══════════════════════════════════════════════════════════════════════════

const singlePageCvProject: SeedProject = {
  title: "Build a Modern Single-Page CV",
  slug: "single-page-cv",
  description:
    "Master React fundamentals and Tailwind CSS by building a clean, responsive, and data-driven single-page resume.",
  level: "Beginner",
  category: "Frontend",
  previewUrl: "https://example.com/cv-preview",
  systemFlowUrl: "https://example.com/cv-system-flow",
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
  ],
  features: [
    {
      title: "Responsive Layout",
      description:
        "Adapts perfectly to mobile and desktop screens using Tailwind's utility classes.",
    },
    {
      title: "Component Architecture",
      description:
        "Breaks down a complex UI into small, reusable React components.",
    },
    {
      title: "Data-Driven UI",
      description:
        "Renders repeating sections dynamically using array mapping.",
    },
  ],
  foundationalFiles,
  modules: [
    {
      title: "Layout & Header",
      description:
        "Set up the main application shell and extract the personal information header.",
      order: 1,
      tasks: [
        {
          title: "Build the Header component",
          description:
            "Complete the Header layout by adding the job title and contact information.",
          order: 1,
          instructions:
            "The Header skeleton provides your name and avatar. Follow the TODO comments to add two <p> tags for your job title and contact info, applying the exact Tailwind classes provided.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "JSX layout, Tailwind Typography, Functional Components",
          files: [
            {
              path: "src/components/Header.tsx",
              skeleton: m1t1HeaderSkeleton,
              solution: m1t1HeaderSolution,
            },
          ],
          mcq: {
            question:
              "In Tailwind CSS, what does the 'flex-col sm:flex-row' utility combination achieve in the header?",
            options: [
              {
                id: "a",
                text: "Elements stack vertically on mobile screens, but align horizontally side-by-side on screens wider than the 'sm' breakpoint (640px).",
              },
              {
                id: "b",
                text: "Elements are always horizontal, but the 'sm' breakpoint reduces their size.",
              },
              {
                id: "c",
                text: "Elements are completely hidden on mobile and only appear as a row on desktop.",
              },
              {
                id: "d",
                text: "The layout ignores flexbox and falls back to a standard block layout on small screens.",
              },
            ],
            correctAnswer: "a",
          },
        },
        {
          title: "Set up the main App shell",
          description:
            "Initialize the main layout container that will hold the rest of the application.",
          order: 2,
          instructions:
            "The App component provides the outer responsive container and renders the <Header />. Add an empty <main> tag below the Header with the className 'mt-8 space-y-12' to prepare for the body content.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Component Composition, Semantic HTML, CSS spacing",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m1t2AppSkeleton,
              solution: m1t2AppSolution,
            },
          ],
          mcq: {
            question:
              "Why do we use the <main> HTML tag instead of a regular <div>?",
            options: [
              {
                id: "a",
                text: "It represents the dominant, core content of the document, improving semantic meaning for screen readers and search engines.",
              },
              {
                id: "b",
                text: "It is required by React to render children properly.",
              },
              {
                id: "c",
                text: "Tailwind CSS applies special default styling to <main> tags.",
              },
              {
                id: "d",
                text: "It forces the browser to load the contents asynchronously.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Experience Section",
      description:
        "Build reusable components to render dynamic lists of professional experience.",
      order: 2,
      tasks: [
        {
          title: "Build the ExperienceItem and ExperienceList components",
          description:
            "Create a parent list component and a child item component, then map over data.",
          order: 1,
          instructions:
            "1) In ExperienceItem.tsx, render the description prop in a <p> tag using the provided classes.\n2) In ExperienceList.tsx, map over the experienceData array and render an <ExperienceItem /> for each item.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts: "React Props, Component Reusability, Array Mapping",
          files: [
            {
              path: "src/components/ExperienceItem.tsx",
              skeleton: m2t1ExperienceItemSkeleton,
              solution: m2t1ExperienceItemSolution,
            },
            {
              path: "src/components/ExperienceList.tsx",
              skeleton: m2t1ExperienceListSkeleton,
              solution: m2t1ExperienceListSolution,
            },
          ],
          mcq: {
            question:
              "How does React know which data to display in the {description} block of ExperienceItem?",
            options: [
              {
                id: "a",
                text: "The data is passed down from the parent component as a 'prop' (property) and destructured in the function arguments.",
              },
              {
                id: "b",
                text: "React automatically fetches the description from a global state variable.",
              },
              {
                id: "c",
                text: "The description is hardcoded into the component file.",
              },
              {
                id: "d",
                text: "The component reads the description directly from the browser's local storage.",
              },
            ],
            correctAnswer: "a",
          },
        },
        {
          title: "Render ExperienceList inside App",
          description: "Bring the experience section into the main layout.",
          order: 2,
          instructions:
            "Import ExperienceList from './components/ExperienceList' and render it inside the empty <main> tag you created in Module 1.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Component Composition, Imports",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m2t2AppSkeleton,
              solution: m2t2AppSolution,
            },
          ],
          mcq: {
            question:
              "What happens if you forget to import ExperienceList before trying to use it in App.tsx?",
            options: [
              {
                id: "a",
                text: "TypeScript and Vite will throw a ReferenceError, preventing the application from compiling and running.",
              },
              {
                id: "b",
                text: "React will automatically search your folders and import it for you.",
              },
              {
                id: "c",
                text: "The app will run, but the area will just appear blank.",
              },
              {
                id: "d",
                text: "The browser will render it as a standard HTML tag named <experiencelist>.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Skills & Polish",
      description:
        "Finalize the CV by extracting data and adding styled skill badges using Flexbox wrapping.",
      order: 3,
      tasks: [
        {
          title: "Extract mock data and render backend skill badges",
          description:
            "Move data to a dedicated file and generate a flexible grid of skill tags.",
          order: 1,
          instructions:
            "1) In data/mockData.ts, export a backendSkills array containing the suggested skills.\n2) In SkillTags.tsx, import backendSkills from the data file.\n3) Following the frontend pattern, map over backendSkills to render a <span> for each.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts: "Flex wrap, data extraction, array mapping, imports",
          files: [
            {
              path: "src/data/mockData.ts",
              skeleton: m3t1MockDataSkeleton,
              solution: m3t1MockDataSolution,
            },
            {
              path: "src/components/SkillTags.tsx",
              skeleton: m3t1SkillTagsSkeleton,
              solution: m3t1SkillTagsSolution,
            },
          ],
          mcq: {
            question:
              "Why is it a good practice to extract static data arrays (like skills) into a separate data file?",
            options: [
              {
                id: "a",
                text: "It keeps the component files smaller and focuses them strictly on UI rendering logic.",
              },
              {
                id: "b",
                text: "It makes the React components render faster.",
              },
              {
                id: "c",
                text: "It is required by TypeScript in order to infer types correctly.",
              },
              {
                id: "d",
                text: "It allows the browser to cache the data separately from the JavaScript bundle.",
              },
            ],
            correctAnswer: "a",
          },
        },
        {
          title: "Add SkillTags to the Resume",
          description:
            "Complete the CV by inserting the Skills component at the bottom of the body.",
          order: 2,
          instructions:
            "Import SkillTags and render it as the last child inside the <main> tag in App.tsx.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Component Composition",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m3t2AppSkeleton,
              solution: m3t2AppSolution,
            },
          ],
          mcq: {
            question:
              "In a React component, can a component return multiple adjacent elements without a parent wrapper?",
            options: [
              {
                id: "a",
                text: "No, multiple adjacent elements must be wrapped in a single parent element or a React Fragment (<>...</>).",
              },
              {
                id: "b",
                text: "Yes, you can return as many adjacent elements as you want.",
              },
              {
                id: "c",
                text: "Yes, but only if they are all standard HTML elements like <div>.",
              },
              {
                id: "d",
                text: "No, a component is only allowed to return exactly one HTML tag and no custom components.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
  ],
};

export default singlePageCvProject;
