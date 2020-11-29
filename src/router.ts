import express, { Request, Response } from "express";
import mongoClient from "./mongoclient";
// import axios from "axios";

import { updateResourceDb } from "./helpers";

const router = express.Router();

router.get(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    await mongoClient.connect();
    const count = await mongoClient
      .db()
      .collection("opportunities")
      .countDocuments();
    console.log(count);
    res.send("hello");
  }
);

// endpoint that updates and stores in-memory opportunities data. To be used every certain amount of minutes
router.get(
  "/update/opportunities",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // defining base url for people endpoint at torre
      const opportBaseUrl = `https://search.torre.co/opportunities/_search/`;
      await updateResourceDb(opportBaseUrl, "opportunities");
      res.send("successful insertion to opportunities db");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  }
);

// endpoint that updates and stores in-memory people data. To be used every certain amount of minutes
router.get(
  "/update/people",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // defining base url for people endpoint at torre
      const peopleBaseUrl = `https://search.torre.co/people/_search/`;
      await updateResourceDb(peopleBaseUrl, "people");
      res.send("successful insertion to people db");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  }
);

export default router;
