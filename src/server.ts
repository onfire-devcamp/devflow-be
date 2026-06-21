import "dotenv/config";
import connectDB from "./config/database.ts";
import { connectRedis } from "./config/redis.ts";
import app from "./app.ts";
import { env } from "./config/environment.ts";
import { startStreakCron } from "./services/streakService.ts";

const port: string = env.PORT as string;

connectDB();
connectRedis();
startStreakCron();
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
