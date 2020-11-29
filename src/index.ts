import express from "express";
import dotenv from "dotenv";

import router from "./router";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
