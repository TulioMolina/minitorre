import express, { Request, Response } from "express";

import { updateResourceDb, generateSearchQuery } from "./helpers";
import endpointUrls from "./config/endpointUrls";
import mongoClient from "./config/mongoclient";

const router = express.Router();

router.get(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    res.send({ message: "Welcome to minitorre" });
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
      const { logicalOperator } = req.body;
      const size = req.body.size || 10;
      const offset = req.body.offset || 0;
      const searchCriteria = { ...req.body };
      delete searchCriteria.logicOperator;
      delete searchCriteria.size;
      delete searchCriteria.offset;

      const query = generateSearchQuery(logicalOperator, searchCriteria);

      const client = await mongoClient.connect();

      const result = await client
        .db()
        .collection("people")
        .find(query)
        .limit(size)
        .skip(offset)
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
      const { logicalOperator } = req.body;
      const size = req.body.size || 10;
      const offset = req.body.offset || 0;
      const searchCriteria = { ...req.body };
      delete searchCriteria.logicOperator;
      delete searchCriteria.size;
      delete searchCriteria.offset;

      const query = generateSearchQuery(logicalOperator, searchCriteria);

      const client = await mongoClient.connect();

      const result = await client
        .db()
        .collection("opportunities")
        .find(query)
        .limit(size)
        .skip(offset)
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
