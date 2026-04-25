import "dotenv/config";
import connectDB from "./config/database.js";
import app from "./app.js";
import { env } from "./config/environment.js";
const port = env.PORT;

connectDB();
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
