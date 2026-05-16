<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3acd0ea4-8e11-470a-a315-595adb08acf7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel, import the project and set the root to this repository.
3. Add environment variables in Vercel:
   - `NODE_ENV=production`
   - `JWT_SECRET` (your auth secret)
   - `MONGODB_URI` (your MongoDB connection string)
   - `GEMINI_API_KEY` (if using Gemini features)
4. Build command: `npm run build`
5. Output directory: `dist`

The deployment is configured to route `/api/*` to `server.ts` and serve the static React app from `dist`.