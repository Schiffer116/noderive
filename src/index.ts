import "dotenv/config"
import express from "express";
import { createRouteHandler } from "uploadthing/express";
import cors from "cors";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

import fileRouter from "./controllers/file.ts";
import directoryRouter from "./controllers/directory.ts";
import pathRouter from "./controllers/path.ts";

import { uploadRouter } from "./controllers/uploadthing.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors())
app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));

app.use(express.json());
app.use(morgan("dev"));
app.use("/static", express.static(path.join(__dirname, "frontend/dist")));

app.use("/api", fileRouter);
app.use("/api", directoryRouter);
app.use("/api", pathRouter);


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
