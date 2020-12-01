import express, { Request, Response } from "express";

import { updateResourceDb, generateSearchQuery } from "./helpers";
import endpointUrls from "./config/endpointUrls";
import mongoClient from "./config/mongoclient";

const router = express.Router();

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
      res.status(500).send();
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
      res.status(500).send();
    }
  }
);

router.post(
  "/api/people/search",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // input handling
      const size: any = req.query.size || 10;
      const offset: any = req.query.offset || 0;
      const logicalOperator: any = req.query.logicalOperator || "and";

      const query = generateSearchQuery(logicalOperator, req.body);

      if (Object.keys(query).length === 0) {
        res.status(400).send();
        return;
      }

      const client = await mongoClient;

      const result = await client
        .db()
        .collection("people")
        .find(query)
        .limit(parseInt(size))
        .skip(parseInt(offset))
        .toArray();

      if (result.length === 0) {
        res.status(404).send();
        return;
      }

      res.send({ size, offset, result });
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  }
);

router.post(
  "/api/opportunities/search",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // input handling
      const size: any = req.query.size || 10;
      const offset: any = req.query.offset || 0;
      const logicalOperator: any = req.query.logicalOperator || "and";

      const query = generateSearchQuery(logicalOperator, req.body);

      if (Object.keys(query).length === 0) {
        res.status(400).send();
        return;
      }

      const client = await mongoClient;

      const result = await client
        .db()
        .collection("opportunities")
        .find(query)
        .limit(parseInt(size))
        .skip(parseInt(offset))
        .toArray();

      if (result.length === 0) {
        res.status(404).send();
        return;
      }

      res.send({ size, offset, result });
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  }
);

export default router;
