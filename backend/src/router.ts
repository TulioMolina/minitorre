import express, { Request, Response } from "express";
// import axios from "axios";

import { updateResource } from "./helpers";

const router = express.Router();

let peopleData: any[];
let opportunitiesData: any[];

router.get(
  "/",
  async (req: Request, res: Response): Promise<void> => {
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
      opportunitiesData = await updateResource(opportBaseUrl);
      res.send(`len ${opportunitiesData.length}`);
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
      peopleData = await updateResource(peopleBaseUrl);
      res.send(`len ${peopleData.length}`);
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  }
);

export default router;
