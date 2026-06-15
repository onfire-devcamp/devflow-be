import mongoose from "mongoose";
import connectDB from "../config/database.js";
import Task from "../models/taskModel.js";

async function updateTasksWithMCQs() {
  // Connect to the database using your existing config
  await connectDB();

  try {
    console.info("Starting safe MCQ migration for Task 2 and Task 3...");

    // Update Task 2: Setup Tailwind CSS
    const tailwindResult = await Task.updateOne(
      { title: "Setup Tailwind CSS" },
      {
        $set: {
          mcq: {
            question:
              "What is the primary purpose of the tailwind.config.js file in our project?",
            options: [
              { id: "opt_a", text: "To configure Vite dev server plugins" },
              {
                id: "opt_b",
                text: "To extend the default theme with custom design tokens like brand colors",
              },
              {
                id: "opt_c",
                text: "To define the routing structure of the application",
              },
              { id: "opt_d", text: "To write standard CSS animations" },
            ],
            correctAnswer: "opt_b",
          },
        },
      },
    );
    console.info(
      `Setup Tailwind CSS update result: modified ${tailwindResult.modifiedCount} document(s)`,
    );

    // Update Task 3: Setup React Router
    const routerResult = await Task.updateOne(
      { title: "Setup React Router" },
      {
        $set: {
          mcq: {
            question:
              "In React Router, what is the purpose of the `<Navigate to='/feed' replace />` component used in our fallback route?",
            options: [
              {
                id: "opt_a",
                text: "To redirect the user without pushing a new entry to the browser's history stack",
              },
              { id: "opt_b", text: "To completely refresh the browser window" },
              {
                id: "opt_c",
                text: "To fetch data from the backend before navigating",
              },
              {
                id: "opt_d",
                text: "To visually replace the current DOM node with an iframe",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      },
    );
    console.info(
      `Setup React Router update result: modified ${routerResult.modifiedCount} document(s)`,
    );

    console.info("Migration completed successfully!");
  } catch (error) {
    console.error("Error updating tasks:", error);
  } finally {
    // Safely close the database connection
    await mongoose.disconnect();
  }
}

updateTasksWithMCQs();
