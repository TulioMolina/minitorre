import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import router from "./router";
import { updateData } from "./helpers";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use(express.static(path.join(__dirname, "public")));

// start app
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

app.get("*", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// initialize data when starting app if configured
if (process.env.INIT_DATA) {
  updateData(parseInt(process.env.DOCS_LIMIT));
}

// set interval to update data from torre every UPDATE_INTERVAL_MINUTES minutes
setInterval(() => {
  updateData(parseInt(process.env.DOCS_LIMIT));
}, parseInt(process.env.UPDATE_INTERVAL_MINUTES) * 60 * 1000);
