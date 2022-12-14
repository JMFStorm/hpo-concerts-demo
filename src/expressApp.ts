import express from "express";
import cors from "cors";
import path from "path";

import databaseController from "./controllers/database";
import performanceController from "./controllers/performance";
import musicianController from "./controllers/musician";
import symphonyController from "./controllers/symphony";
import concertController from "./controllers/concert";
import loginController from "./controllers/login";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Use cors
app.use(cors({ methods: ["GET", "POST"] }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Use static frontend files
const build = path.join(__dirname, "build");
app.use(express.static(build));
console.log("Using static page files from: ", build);

// Use routes
app.use("*", (req, res, next) => {
  next();
});

app.use("/api/database", databaseController);
app.use("/api/performance", performanceController);
app.use("/api/musician", musicianController);
app.use("/api/symphony", symphonyController);
app.use("/api/concert", concertController);
app.use("/api/login", loginController);

// Use error handler endpoint
app.use(errorHandler);

export default app;
