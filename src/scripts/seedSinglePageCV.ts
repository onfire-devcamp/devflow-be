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

const m2t1SectionItemSkeleton = `export interface SectionItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export default function SectionItem({ title, subtitle, period, description }: SectionItemProps) {
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

const m2t1SectionItemSolution = `export interface SectionItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export default function SectionItem({ title, subtitle, period, description }: SectionItemProps) {
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

const m2t2ResumeBodySkeleton = `import SectionItem from "./SectionItem";

const experienceData = [
  {
    id: "exp1",
    title: "Senior Frontend Engineer",
    subtitle: "TechStart Inc.",
    period: "2021 - Present",
    description: "Lead the frontend team in building a modern React application. Migrated legacy codebase to TypeScript and improved performance by 40%.",
  },
];

const educationData = [
  {
    id: "edu1",
    title: "B.S. Computer Science",
    subtitle: "State University",
    period: "2017 - 2021",
    description: "Graduated with Honors. Specialized in Human-Computer Interaction and web technologies.",
  },
];

export default function ResumeBody() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Experience</h2>
        <div className="space-y-8">
          {/* Experience mapping is provided for you */}
          {experienceData.map((item) => (
            <SectionItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Education</h2>
        <div className="space-y-8">
          {/* TODO: Follow the pattern above to map over educationData.
              Render a <SectionItem /> for each item, passing the key and spreading the props. */}
        </div>
      </section>
    </div>
  );
}`;

const m2t2ResumeBodySolution = `import SectionItem from "./SectionItem";

const experienceData = [
  {
    id: "exp1",
    title: "Senior Frontend Engineer",
    subtitle: "TechStart Inc.",
    period: "2021 - Present",
    description: "Lead the frontend team in building a modern React application. Migrated legacy codebase to TypeScript and improved performance by 40%.",
  },
];

const educationData = [
  {
    id: "edu1",
    title: "B.S. Computer Science",
    subtitle: "State University",
    period: "2017 - 2021",
    description: "Graduated with Honors. Specialized in Human-Computer Interaction and web technologies.",
  },
];

export default function ResumeBody() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Experience</h2>
        <div className="space-y-8">
          {experienceData.map((item) => (
            <SectionItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Education</h2>
        <div className="space-y-8">
          {educationData.map((item) => (
            <SectionItem key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}`;

// M2T3 Chains App.tsx (MUST EQUAL m1t2AppSolution)
const m2t3AppSkeleton = m1t2AppSolution;

const m2t3AppSolution = `import Header from "./components/Header";
import ResumeBody from "./components/ResumeBody";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
          <ResumeBody />
        </main>
      </div>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 3 — Skills & Polish
// ═══════════════════════════════════════════════════════════════════════════

const m3t1SkillTagsSkeleton = `const frontendSkills = ["React", "TypeScript", "Tailwind CSS", "Next.js"];
const backendSkills = ["Node.js", "Express", "PostgreSQL", "Redis"];

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

const m3t1SkillTagsSolution = `const frontendSkills = ["React", "TypeScript", "Tailwind CSS", "Next.js"];
const backendSkills = ["Node.js", "Express", "PostgreSQL", "Redis"];

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

// M3T2 Chains ResumeBody.tsx (MUST EQUAL m2t2ResumeBodySolution)
const m3t2ResumeBodySkeleton = m2t2ResumeBodySolution;

const m3t2ResumeBodySolution = `import SectionItem from "./SectionItem";
import SkillTags from "./SkillTags";

const experienceData = [
  {
    id: "exp1",
    title: "Senior Frontend Engineer",
    subtitle: "TechStart Inc.",
    period: "2021 - Present",
    description: "Lead the frontend team in building a modern React application. Migrated legacy codebase to TypeScript and improved performance by 40%.",
  },
];

const educationData = [
  {
    id: "edu1",
    title: "B.S. Computer Science",
    subtitle: "State University",
    period: "2017 - 2021",
    description: "Graduated with Honors. Specialized in Human-Computer Interaction and web technologies.",
  },
];

export default function ResumeBody() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Experience</h2>
        <div className="space-y-8">
          {experienceData.map((item) => (
            <SectionItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Education</h2>
        <div className="space-y-8">
          {educationData.map((item) => (
            <SectionItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      <SkillTags />
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
      title: "Experience & Education",
      description:
        "Build reusable components to render dynamic lists of professional experience and education.",
      order: 2,
      tasks: [
        {
          title: "Build the SectionItem component",
          description:
            "Create a reusable component for displaying a single job or degree.",
          order: 1,
          instructions:
            "SectionItem receives props for a timeline item. The period, title, and subtitle are implemented. Add a <p> tag to render the description prop using the classes provided.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts: "React Props, Component Reusability",
          files: [
            {
              path: "src/components/SectionItem.tsx",
              skeleton: m2t1SectionItemSkeleton,
              solution: m2t1SectionItemSolution,
            },
          ],
          mcq: {
            question:
              "How does React know which data to display in the {description} block?",
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
          title: "Map the Education data in ResumeBody",
          description:
            "Render lists of data by mapping over an array and returning React components.",
          order: 2,
          instructions:
            "The experience section successfully maps over 'experienceData' to render <SectionItem /> components. Follow this exact pattern to map over 'educationData' in the Education section.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 15,
          concepts: "Array.map(), React Keys, Data-Driven UI",
          files: [
            {
              path: "src/components/ResumeBody.tsx",
              skeleton: m2t2ResumeBodySkeleton,
              solution: m2t2ResumeBodySolution,
            },
          ],
          mcq: {
            question:
              "When mapping over an array in React, why is the 'key' prop required?",
            options: [
              {
                id: "a",
                text: "It helps React identify which items have changed, been added, or removed, enabling efficient DOM updates.",
              },
              {
                id: "b",
                text: "It is used as a CSS id selector to style individual elements.",
              },
              {
                id: "c",
                text: "It encrypts the data before it is rendered to the screen.",
              },
              {
                id: "d",
                text: "It automatically sorts the array alphabetically before rendering.",
              },
            ],
            correctAnswer: "a",
          },
        },
        {
          title: "Render ResumeBody inside App",
          description:
            "Bring the experience and education sections into the main layout.",
          order: 3,
          instructions:
            "Import ResumeBody from './components/ResumeBody' and render it inside the empty <main> tag you created in Module 1.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Component Composition, Imports",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m2t3AppSkeleton,
              solution: m2t3AppSolution,
            },
          ],
          mcq: {
            question:
              "What happens if you forget to import ResumeBody before trying to use it in App.tsx?",
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
                text: "The app will run, but the ResumeBody area will just appear blank.",
              },
              {
                id: "d",
                text: "The browser will render it as a standard HTML tag named <resumebody>.",
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
        "Finalize the CV by adding styled skill badges using Flexbox wrapping.",
      order: 3,
      tasks: [
        {
          title: "Render backend skill badges",
          description:
            "Use array mapping to generate a flexible grid of skill tags.",
          order: 1,
          instructions:
            "The frontend skills have been mapped into stylish badges. Follow the exact same pattern to map over the 'backendSkills' array in the second section.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Flex wrap, badge styling, array mapping",
          files: [
            {
              path: "src/components/SkillTags.tsx",
              skeleton: m3t1SkillTagsSkeleton,
              solution: m3t1SkillTagsSolution,
            },
          ],
          mcq: {
            question:
              "What does the Tailwind 'flex-wrap' utility do in the skills container?",
            options: [
              {
                id: "a",
                text: "It allows the skill badges to wrap onto a new line if they run out of horizontal space in the container.",
              },
              {
                id: "b",
                text: "It forces all items to shrink until they fit on a single line.",
              },
              {
                id: "c",
                text: "It creates a CSS Grid layout instead of a Flexbox layout.",
              },
              {
                id: "d",
                text: "It hides any items that overflow the container's width.",
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
            "Import SkillTags and render it as the last child inside the ResumeBody container.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Component Composition",
          files: [
            {
              path: "src/components/ResumeBody.tsx",
              skeleton: m3t2ResumeBodySkeleton,
              solution: m3t2ResumeBodySolution,
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
