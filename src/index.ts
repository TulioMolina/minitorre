import express from "express";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import router from "./router";
import { updateData } from "./helpers";

const app = express();

app.use(router);

// start app
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

// initialize data when starting app if configured
if (process.env.INIT_DATA) {
  updateData(parseInt(process.env.DOCS_LIMIT));
}

// set interval to update data from torre every UPDATE_INTERVAL_MINUTES minutes
setInterval(() => {
  updateData(parseInt(process.env.DOCS_LIMIT));
}, parseInt(process.env.UPDATE_INTERVAL_MINUTES) * 60 * 1000);
