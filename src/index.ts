import express from "express";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import router from "./router";

const app = express();

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
