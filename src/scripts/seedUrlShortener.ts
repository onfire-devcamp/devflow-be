import type { SeedProject } from "./seedTypes.js";

// ═══════════════════════════════════════════════════════════════════════════
// Foundational Files — Read-Only & Always Visible
// ═══════════════════════════════════════════════════════════════════════════

const foundationalFiles: SeedProject["foundationalFiles"] = [
  {
    path: "package.json",
    content: `{
  "name": "url-shortener",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.4.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "tsx": "^4.11.0",
    "typescript": "^5.4.5"
  }
}`,
  },
  {
    path: "tsconfig.json",
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}`,
  },
  {
    path: "src/config/db.ts",
    content: `import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // In our learning environment, we provide a pre-configured in-memory MongoDB connection string.
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/url-shortener";
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};`,
  },
  {
    path: "src/server.ts",
    content: `import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", urlRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
  });
});`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Module 1 — Data Layer
// ═══════════════════════════════════════════════════════════════════════════

const m1t1ValidationSkeleton = `// TODO: Export a function called isValidUrl(url: string) returning boolean.
// Inside it, try to parse the URL using new URL(url). If it throws an error, return false.
// Otherwise, return true if the protocol is 'http:' or 'https:', else false.
`;

const m1t1ValidationSolution = `export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
}`;

const m1t1UrlModelSkeleton = `import mongoose, { Document, Schema } from 'mongoose';
// TODO: Import isValidUrl from '../utils/validation'

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

// TODO: Create the urlSchema using mongoose.Schema.
// It should have 'originalUrl' (String, required, and validate using isValidUrl),
// 'shortCode' (String, required, unique),
// and 'clicks' (Number, default to 0).
const urlSchema = new Schema({
  
}, { timestamps: true });

export const Url = mongoose.model<IUrl>('Url', urlSchema);`;

const m1t1UrlModelSolution = `import mongoose, { Document, Schema } from 'mongoose';
import { isValidUrl } from '../utils/validation';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

const urlSchema = new Schema({
  originalUrl: { 
    type: String, 
    required: true,
    validate: {
      validator: isValidUrl,
      message: "Invalid URL format"
    }
  },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

export const Url = mongoose.model<IUrl>('Url', urlSchema);`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 2 — Encoding Service
// ═══════════════════════════════════════════════════════════════════════════

const m2t1EncodingServiceSkeleton = `const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateShortCode = (length: number = 6): string => {
  // TODO: Implement a random string generator.
  // Use a for loop to pick 'length' random characters from BASE62_ALPHABET.
  // Return the generated string.
  return '';
};`;

const m2t1EncodingServiceSolution = `const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateShortCode = (length: number = 6): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_ALPHABET.length);
    result += BASE62_ALPHABET[randomIndex];
  }
  return result;
};`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 3 — Create Endpoint
// ═══════════════════════════════════════════════════════════════════════════

const m3t1UrlControllerSkeleton = `import { Request, Response } from 'express';
import { Url } from '../models/urlModel';
import { generateShortCode } from '../services/encodingService';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  // TODO: Generate a new short code using generateShortCode()
  // TODO: Create a new Url document using the Url model and save it.
  // TODO: Return a 201 JSON response containing the new url document.
};

// ---------------------------------------------------------
// This endpoint will be implemented in the next module
// ---------------------------------------------------------
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  
  // TODO (Module 4): Find the url by shortCode, increment clicks, and redirect.
};`;

const m3t1UrlControllerSolution = `import { Request, Response } from 'express';
import { Url } from '../models/urlModel';
import { generateShortCode } from '../services/encodingService';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  const shortCode = generateShortCode();
  
  const newUrl = await Url.create({
    originalUrl,
    shortCode
  });

  res.status(201).json(newUrl);
};

// ---------------------------------------------------------
// This endpoint will be implemented in the next module
// ---------------------------------------------------------
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  
  // TODO (Module 4): Find the url by shortCode, increment clicks, and redirect.
};`;

const m3t1UrlRoutesSkeleton = `import { Router } from "express";
import { shortenUrl } from "../controllers/urlController";

const router = Router();

// TODO: Create a POST route on '/shorten' that calls shortenUrl
// router.post('/shorten', ...);

export default router;`;

const m3t1UrlRoutesSolution = `import { Router } from "express";
import { shortenUrl } from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);

export default router;`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 4 — Redirect Endpoint
// ═══════════════════════════════════════════════════════════════════════════

// M4T1 Chains from M3T1
const m4t1UrlControllerSkeleton = m3t1UrlControllerSolution;

const m4t1UrlControllerSolution = `import { Request, Response } from 'express';
import { Url } from '../models/urlModel';
import { generateShortCode } from '../services/encodingService';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  const shortCode = generateShortCode();
  
  const newUrl = await Url.create({
    originalUrl,
    shortCode
  });

  res.status(201).json(newUrl);
};

// ---------------------------------------------------------
// This endpoint will be implemented in the next module
// ---------------------------------------------------------
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  
  const urlDoc = await Url.findOneAndUpdate(
    { shortCode: code },
    { $inc: { clicks: 1 } }
  );

  if (!urlDoc) {
    res.status(404).json({ error: 'URL not found' });
    return;
  }

  res.redirect(urlDoc.originalUrl);
};`;

// M4T1 Routes Chain
const m4t1UrlRoutesSkeleton = m3t1UrlRoutesSolution;

const m4t1UrlRoutesSolution = `import { Router } from "express";
import { shortenUrl, redirectUrl } from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);
router.get("/:code", redirectUrl);

export default router;`;

// ═══════════════════════════════════════════════════════════════════════════
// Full Project Seed
// ═══════════════════════════════════════════════════════════════════════════

const urlShortenerProject: SeedProject = {
  title: "Build a Scalable URL Shortener Service",
  slug: "url-shortener-api",
  description:
    "Learn core backend concepts by building an Express API that generates short URLs, handles redirects, and tracks click analytics.",
  level: "Intermediate",
  category: "Backend",
  previewUrl: "https://example.com/url-shortener-preview",
  systemFlowUrl: "https://example.com/url-shortener-system-flow",
  techStack: [
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
    {
      name: "TypeScript",
      iconUrl: "https://cdn.simpleicons.org/typescript/3178C6",
      category: "Backend",
    },
  ],
  features: [
    {
      title: "Base62 Encoding",
      description: "Generate concise, collision-resistant string identifiers.",
    },
    {
      title: "Mongoose ODM",
      description: "Design an elegant MongoDB schema with type safety.",
    },
    {
      title: "Express Routing",
      description:
        "Handle dynamic path parameters for lightning-fast HTTP redirects.",
    },
  ],
  foundationalFiles,
  modules: [
    {
      title: "Data Layer",
      description:
        "Design the MongoDB schema to store long URLs and their short code counterparts.",
      order: 1,
      tasks: [
        {
          title: "Implement the Url Schema and Validation",
          description:
            "Define the Mongoose schema enforcing required fields and custom URL validation.",
          order: 1,
          instructions:
            "1) In utils/validation.ts, implement the isValidUrl utility using the new URL() constructor.\n2) In urlModel.ts, complete the urlSchema configuration block. Add 'originalUrl' with a custom validator using isValidUrl. Add 'shortCode' as a required and unique String, and 'clicks' as a Number that defaults to 0.",
          difficulty: "Beginner",
          skillCategory: "Backend",
          skillPoints: 10,
          concepts: "Mongoose Schema, Data Modeling, Custom Validation",
          files: [
            {
              path: "src/utils/validation.ts",
              skeleton: m1t1ValidationSkeleton,
              solution: m1t1ValidationSolution,
            },
            {
              path: "src/models/urlModel.ts",
              skeleton: m1t1UrlModelSkeleton,
              solution: m1t1UrlModelSolution,
            },
          ],
          mcq: {
            question:
              "Why do we add 'unique: true' to the shortCode field in the Mongoose schema?",
            options: [
              {
                id: "a",
                text: "It tells MongoDB to build a unique index on this field, ensuring two different URLs never receive the same shortCode in the database.",
              },
              {
                id: "b",
                text: "It automatically generates a random string when saving the document.",
              },
              {
                id: "c",
                text: "It prevents users from accessing the URL multiple times.",
              },
              {
                id: "d",
                text: "It encrypts the shortCode for security purposes.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Encoding Service",
      description:
        "Build the core logic for converting an intent into a short, random identifier.",
      order: 2,
      tasks: [
        {
          title: "Generate a Base62 Short Code",
          description:
            "Implement a random string generator using a custom alphabet.",
          order: 1,
          instructions:
            "Using a standard for loop, iterate 'length' times. Inside the loop, pick a random character from BASE62_ALPHABET using Math.random() and append it to your result string.",
          difficulty: "Intermediate",
          skillCategory: "Backend",
          skillPoints: 12,
          concepts: "Algorithms, String manipulation, Randomization",
          files: [
            {
              path: "src/services/encodingService.ts",
              skeleton: m2t1EncodingServiceSkeleton,
              solution: m2t1EncodingServiceSolution,
            },
          ],
          mcq: {
            question:
              "Why is Base62 (a-z, A-Z, 0-9) typically preferred over Base64 for URL shorteners?",
            options: [
              {
                id: "a",
                text: "Because it avoids special characters like + and / which can cause parsing issues when placed in URLs.",
              },
              {
                id: "b",
                text: "Because Base62 algorithms execute faster in Node.js.",
              },
              {
                id: "c",
                text: "Because it requires fewer characters to encode large integers.",
              },
              {
                id: "d",
                text: "Because browsers natively decompress Base62 strings.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Create Endpoint",
      description:
        "Expose an API route that accepts a long URL and returns the generated short code.",
      order: 3,
      tasks: [
        {
          title: "Implement the shortenUrl endpoint",
          description:
            "Tie the service and data layer together in an Express request handler and wire it to the router.",
          order: 1,
          instructions:
            "1) In urlController.ts, call generateShortCode() to get a short string. Use Url.create() to save the originalUrl and shortCode, then respond with status 201.\n2) In urlRoutes.ts, register a POST route on '/shorten' that calls shortenUrl.",
          difficulty: "Intermediate",
          skillCategory: "Backend",
          skillPoints: 15,
          concepts: "Express POST Requests, DB Writes, JSON Responses, Routing",
          files: [
            {
              path: "src/controllers/urlController.ts",
              skeleton: m3t1UrlControllerSkeleton,
              solution: m3t1UrlControllerSolution,
            },
            {
              path: "src/routes/urlRoutes.ts",
              skeleton: m3t1UrlRoutesSkeleton,
              solution: m3t1UrlRoutesSolution,
            },
          ],
          mcq: {
            question:
              "What HTTP status code is conventionally used to indicate that a resource was successfully created?",
            options: [
              { id: "a", text: "201 (Created)" },
              { id: "b", text: "200 (OK)" },
              { id: "c", text: "204 (No Content)" },
              { id: "d", text: "301 (Moved Permanently)" },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Redirect Endpoint",
      description:
        "Intercept the short URL request and forward the client to the actual destination.",
      order: 4,
      tasks: [
        {
          title: "Implement the redirectUrl endpoint",
          description:
            "Read from the database, track the click, and send an HTTP redirect.",
          order: 1,
          instructions:
            "1) In urlController.ts, use Url.findOneAndUpdate() to find the document with 'shortCode: code' and increment the 'clicks' by 1 using {$inc}. If found, execute res.redirect() using the originalUrl.\n2) In urlRoutes.ts, import redirectUrl and add a GET route on '/:code'.",
          difficulty: "Intermediate",
          skillCategory: "Backend",
          skillPoints: 15,
          concepts: "Express Route Parameters, DB Updates, HTTP Redirects",
          files: [
            {
              path: "src/controllers/urlController.ts",
              skeleton: m4t1UrlControllerSkeleton,
              solution: m4t1UrlControllerSolution,
            },
            {
              path: "src/routes/urlRoutes.ts",
              skeleton: m4t1UrlRoutesSkeleton,
              solution: m4t1UrlRoutesSolution,
            },
          ],
          mcq: {
            question:
              "Why is it better to use findOneAndUpdate() with an $inc operator rather than fetching the document, adding 1 to clicks in JS, and calling .save()?",
            options: [
              {
                id: "a",
                text: "It prevents race conditions if multiple people click the link at the exact same millisecond, keeping the click count accurate.",
              },
              { id: "b", text: "It bypasses all Mongoose schema validations." },
              {
                id: "c",
                text: "It prevents the user's browser from caching the redirect.",
              },
              {
                id: "d",
                text: "It encrypts the payload before sending it to the database.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
  ],
};

export default urlShortenerProject;
