import "dotenv/config";
import express from "express";
import { createRouteHandler } from "uploadthing/express";
import cors from "cors";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import path from "path";
import { fileURLToPath } from "url";

import fileRouter from "./controllers/file.js";
import directoryRouter from "./controllers/directory.js";
import { uploadRouter } from "./controllers/uploadthing.js";
import clerkRouter from "./controllers/clerk.js";
import { router } from './trpc.js';
import { createContext } from "./context.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "../client/dist");
const port = process.env.PORT || 3000

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(clerkMiddleware())

app.use(express.static(distPath));

app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));
app.use("/api", clerkRouter);

const appRouter = router({
  file: fileRouter,
  directory: directoryRouter,
});
export type AppRouter = typeof appRouter;

app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use((_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});


app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

