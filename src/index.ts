import "dotenv/config";
import express from "express";
import { createRouteHandler } from "uploadthing/express";
import cors from "cors";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

import fileRouter from "./controllers/file.js";
import directoryRouter from "./controllers/directory.js";
import pathRouter from "./controllers/path.js";
import { uploadRouter } from "./controllers/uploadthing.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "../client/dist");
const port = process.env.PORT || 3000

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));
app.use("/api", fileRouter);
app.use("/api", directoryRouter);
app.use("/api", pathRouter);

app.use(express.static(distPath));

app.use((_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
