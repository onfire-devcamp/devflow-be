import "dotenv/config";
import connectDB from "./config/database.js";
import app from "./app.js";
const port = 3000;

connectDB();
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
