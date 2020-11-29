import express, { Request, Response } from "express";
import mongoClient from "./mongoclient";
// import axios from "axios";

import { updateResourceDb } from "./helpers";

const router = express.Router();

router.get(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    res.send("hello");
  }
);

// endpoint that updates and stores opportunities data in db
router.get(
  "/update/opportunities",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // defining base url for people endpoint at torre
      const opportBaseUrl = `https://search.torre.co/opportunities/_search/`;
      await updateResourceDb(
        opportBaseUrl,
        "opportunities",
        parseInt(process.env.DOCS_LIMIT)
      );
      res.send("successful insertion to opportunities collection");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  }
);

// endpoint that updates and stores people data in db
router.get(
  "/update/people",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // defining base url for people endpoint at torre
      const peopleBaseUrl = `https://search.torre.co/people/_search/`;
      await updateResourceDb(
        peopleBaseUrl,
        "people",
        parseInt(process.env.DOCS_LIMIT)
      );
      res.send("successful insertion to people collection");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  }
);

export default router;
