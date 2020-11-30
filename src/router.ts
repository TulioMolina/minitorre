import express, { Request, Response } from "express";

import { updateResourceDb } from "./helpers";
import endpointUrls from "./config/endpointUrls";
import mongoClient from "./config/mongoclient";

const router = express.Router();

router.get(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    res.send("hello");
  }
);

// endpoint that updates and stores opportunities data in db
router.get(
  "/api/opportunities/update",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // defining base url for people endpoint at torre
      await updateResourceDb(
        endpointUrls.opportBaseUrl,
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
  "/api/people/update",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // defining base url for people endpoint at torre
      await updateResourceDb(
        endpointUrls.peopleBaseUrl,
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

router.post("/api/people/search", async (req: Request, res: Response) => {
  const query: any = {};

  // building query object according to criteria received
  Object.keys(req.body).forEach((criterion) => {
    const value = req.body[criterion];
    query[criterion] = { $regex: `.*${value}.*` };
  });

  const client = await mongoClient.connect();

  const result = await client.db().collection("people").find(query).toArray();

  res.send(result);
});

export default router;
