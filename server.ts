import connectDB from "./server/db";
import { createApiApp } from "./server/app";

export const config = {
  runtime: "nodejs20.x",
};

let appPromise: Promise<any> | null = null;

const getApp = () => {
  if (!appPromise) {
    appPromise = connectDB().then(() => createApiApp(false));
  }
  return appPromise;
};

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
