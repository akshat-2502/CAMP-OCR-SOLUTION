import connectDB from "./db";
import { createApiApp } from "./app";

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  await connectDB();
  const app = await createApiApp();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
