import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import Module from "../models/moduleModel.js";
import Task from "../models/taskModel.js";
import TaskFile from "../models/taskFileModel.js";
import UserFile from "../models/userFileModel.js";
import UserProgress from "../models/userProgressModel.js";
import AIEvaluation from "../models/aiEvaluationModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import dotenv from "dotenv";

dotenv.config();

const simulateProjectCompletion = async () => {
  const [userIdStr, projectSlug] = process.argv.slice(2);

  if (!userIdStr || !projectSlug) {
    console.error(
      "Usage: npx tsx src/scripts/simulateProjectCompletion.ts <userId> <projectSlug>",
    );
    process.exit(1);
  }

  if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
    console.error("Invalid User ID format.");
    process.exit(1);
  }

  const userId = new mongoose.Types.ObjectId(userIdStr);

  try {
    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/devflow",
    );
    console.log("Connected to MongoDB.");

    const project = await Project.findOne({ slug: projectSlug });
    if (!project) {
      console.error(`Project with slug '${projectSlug}' not found.`);
      process.exit(1);
    }

    const modules = await Module.find({ projectId: project._id }).sort({
      order: 1,
    });
    if (modules.length === 0) {
      console.error("No modules found for this project.");
      process.exit(1);
    }

    const moduleIds = modules.map((m) => m._id);

    // Make sure UserProgress exists
    let userProgress = await UserProgress.findOne({
      userId,
      projectId: project._id,
    });
    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        projectId: project._id,
        completedTaskIds: [],
        unlockedModuleIds: [moduleIds[0]],
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found.");
      process.exit(1);
    }

    let totalTasks = 0;
    let completedTasks = 0;

    for (const mod of modules) {
      const tasks = await Task.find({ moduleId: mod._id }).sort({ order: 1 });
      totalTasks += tasks.length;

      for (const task of tasks) {
        // 1. Code Submission Simulation
        const taskFiles = await TaskFile.find({ taskId: task._id });
        for (const taskFile of taskFiles) {
          await UserFile.findOneAndUpdate(
            { userId, projectId: project._id, fileId: taskFile.fileId },
            { $set: { content: taskFile.content } },
            { upsert: true, new: true },
          );
        }

        // 2. Explain-to-Pass Simulation
        const simulatedScore = Math.random() > 0.5 ? 9 : 8;

        await AIEvaluation.findOneAndUpdate(
          {
            userId,
            projectId: project._id,
            taskId: task._id,
            type: "explainToPass",
          },
          {
            $set: {
              inputData: {
                mcqAnswer: "simulated",
                explanation: "simulated perfect explanation",
              },
              score: simulatedScore,
              passStatus: "PASS",
              feedback:
                "Excellent explanation. Automated by simulation script.",
            },
          },
          { upsert: true, new: true },
        );

        // 3. Update UserProgress
        if (!userProgress.completedTaskIds.includes(task._id)) {
          userProgress.completedTaskIds.push(task._id);
        }

        // Ensure next module is unlocked if this module is fully complete
        // For simplicity, we just unlock all modules up to the current one
        if (!userProgress.unlockedModuleIds.includes(mod._id)) {
          userProgress.unlockedModuleIds.push(mod._id);
        }

        // Add skill points to user
        const category =
          task.skillCategory.toLowerCase() as keyof typeof user.skills;
        if (user.skills && user.skills[category] !== undefined) {
          user.skills[category] = Math.min(
            100,
            user.skills[category] + task.skillPoints,
          );
        }

        // Log Activity
        await Activity.findOneAndUpdate(
          {
            userId,
            projectId: project._id,
            taskId: task._id,
            type: "TASK_PASS",
          },
          {
            $set: {
              moduleName: mod.title,
              activityTitle: `Passed ${task.title}`,
            },
          },
          { upsert: true },
        );

        completedTasks++;
        console.log(
          `[Task ${completedTasks}/${totalTasks}] Completed '${task.title}' | AI Score: ${simulatedScore}/10 | +${task.skillPoints} ${task.skillCategory} XP`,
        );
      }
    }

    // Unlock all modules since we finished everything
    userProgress.unlockedModuleIds = moduleIds;
    userProgress.lastActiveTaskId = undefined;
    await userProgress.save();
    await user.save();

    console.log(
      `\n🎉 Project '${project.title}' is now 100% completed for user ${userIdStr}!`,
    );
    console.log(
      `All ${totalTasks} tasks processed successfully. The summary page should now be accessible.`,
    );
  } catch (err) {
    console.error("Simulation failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};

simulateProjectCompletion();
