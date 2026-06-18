import mongoose from "mongoose";
import { pathToFileURL } from "node:url";

import connectDB from "../config/database.js";
import FileTemplate, {
  type FileTemplateDocument,
} from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import TaskFile from "../models/taskFileModel.js";
import type { SeedProject, SeedTask } from "./seedTypes.js";

// ---------------------------------------------------------------------------
// Project imports — add new projects here
// ---------------------------------------------------------------------------

import twitterCloneProject from "./seedTwitterClone.js";

const ALL_PROJECTS: readonly SeedProject[] = [twitterCloneProject];

// ---------------------------------------------------------------------------
// Chaining Validation
// ---------------------------------------------------------------------------

class ChainingError extends Error {
  constructor(
    projectSlug: string,
    moduleName: string,
    taskTitle: string,
    filePath: string,
  ) {
    super(
      `[Chaining Error] Project "${projectSlug}" → Module "${moduleName}" → Task "${taskTitle}" → File "${filePath}": ` +
        `The skeleton does NOT match the solution from the previous task that modified this file. ` +
        `Chained files must have skeleton === previous solution.`,
    );
    this.name = "ChainingError";
  }
}

/**
 * Validates that file chaining is consistent across all tasks in a project.
 *
 * For every file that appears in multiple tasks, the skeleton in the later
 * task must be byte-for-byte identical to the solution in the earlier task.
 */
const validateChaining = (project: SeedProject): void => {
  // Track the latest solution for each file path across all modules & tasks
  const latestSolutionByPath = new Map<string, string>();

  for (const module of project.modules) {
    // Tasks within a module are ordered
    const sortedTasks = [...module.tasks].sort((a, b) => a.order - b.order);

    for (const task of sortedTasks) {
      for (const file of task.files) {
        const previousSolution = latestSolutionByPath.get(file.path);

        if (previousSolution !== undefined) {
          // This file was seen in a prior task — assert chaining consistency
          if (file.skeleton !== previousSolution) {
            throw new ChainingError(
              project.slug,
              module.title,
              task.title,
              file.path,
            );
          }
        }

        // Record this task's solution as the latest for this file path
        latestSolutionByPath.set(file.path, file.solution);
      }
    }
  }
};

// ---------------------------------------------------------------------------
// Database Insertion
// ---------------------------------------------------------------------------

const createFoundationalFiles = async (
  projectId: mongoose.Types.ObjectId,
  files: SeedProject["foundationalFiles"],
): Promise<void> => {
  if (files.length === 0) return;

  await FileTemplate.insertMany(
    files.map((file) => ({
      projectId,
      path: file.path,
      content: file.content,
      readOnly: true,
    })),
  );

  console.info(`  ✓ Created ${files.length} foundational file(s)`);
};

const createTaskArtifacts = async (
  projectId: mongoose.Types.ObjectId,
  moduleId: mongoose.Types.ObjectId,
  task: SeedTask,
): Promise<void> => {
  const fileTemplates: FileTemplateDocument[] = await FileTemplate.insertMany(
    task.files.map((file) => ({
      projectId,
      path: file.path,
      content: file.skeleton,
      readOnly: false,
    })),
  );

  const createdTask = await Task.create({
    moduleId,
    fileId: fileTemplates.map((ft) => ft._id),
    title: task.title,
    description: task.description,
    order: task.order,
    instructions: task.instructions,
    difficulty: task.difficulty,
    concepts: task.concepts.split(",").map((concept) => concept.trim()),
    mcq: task.mcq,
    skillCategory: task.skillCategory,
    skillPoints: task.skillPoints,
  });

  await TaskFile.insertMany(
    fileTemplates.map((ft, index) => ({
      taskId: createdTask._id,
      fileId: ft._id,
      content: task.files[index].solution,
    })),
  );
};

const seedProject = async (project: SeedProject): Promise<void> => {
  console.info(`\nSeeding project: "${project.title}"...`);

  // Step 1: Validate chaining consistency before any DB writes
  validateChaining(project);
  console.info("  ✓ Chaining validation passed");

  // Step 2: Create the Project document
  const projectDoc = await Project.create({
    title: project.title,
    slug: project.slug,
    description: project.description,
    level: project.level,
    previewUrl: project.previewUrl,
    systemFlowUrl: project.systemFlowUrl,
    techStack: project.techStack,
    features: project.features,
  });

  // Step 3: Create foundational files (read-only, no TaskFile link)
  await createFoundationalFiles(projectDoc._id, project.foundationalFiles);

  // Step 4: Create modules and their tasks
  const sortedModules = [...project.modules].sort((a, b) => a.order - b.order);

  for (const moduleSeed of sortedModules) {
    const moduleDoc = await Module.create({
      projectId: projectDoc._id,
      title: moduleSeed.title,
      description: moduleSeed.description,
      order: moduleSeed.order,
    });

    const sortedTasks = [...moduleSeed.tasks].sort((a, b) => a.order - b.order);

    for (const task of sortedTasks) {
      await createTaskArtifacts(projectDoc._id, moduleDoc._id, task);
    }

    console.info(
      `  ✓ Module ${moduleSeed.order}: "${moduleSeed.title}" (${moduleSeed.tasks.length} task(s))`,
    );
  }

  const totalTasks = project.modules.reduce(
    (sum, m) => sum + m.tasks.length,
    0,
  );
  console.info(
    `  ✓ Project "${project.title}" seeded — ${project.modules.length} module(s), ${totalTasks} task(s), ${project.foundationalFiles.length} foundational file(s)`,
  );
};

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function seedDatabase(): Promise<void> {
  await connectDB();

  try {
    console.info("═══════════════════════════════════════════════");
    console.info("  DevFlow Seed Script — Starting...");
    console.info("═══════════════════════════════════════════════");

    // Clear all existing data
    await Promise.all([
      TaskFile.deleteMany({}),
      Task.deleteMany({}),
      Module.deleteMany({}),
      FileTemplate.deleteMany({}),
      Project.deleteMany({}),
    ]);
    console.info("\n✓ Cleared existing data");

    // Seed all projects
    for (const project of ALL_PROJECTS) {
      await seedProject(project);
    }

    console.info("\n═══════════════════════════════════════════════");
    console.info(
      `  Done — ${ALL_PROJECTS.length} project(s) seeded successfully`,
    );
    console.info("═══════════════════════════════════════════════\n");
  } finally {
    await mongoose.disconnect();
  }
}

// ---------------------------------------------------------------------------
// Direct execution support
// ---------------------------------------------------------------------------

const shouldRunDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (shouldRunDirectly) {
  void seedDatabase().catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  });
}

export default seedDatabase;
