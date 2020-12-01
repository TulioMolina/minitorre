import axios from "axios";
import mongoClient from "./config/mongoclient";
import endpointUrls from "./config/endpointUrls";

export const updateResourceDb = async (
  endpointBaseUrl: string,
  resource: string,
  documentsLimit: number
): Promise<void> => {
  try {
    // fetching total number of resources
    const totalResources = (
      await axios.post(
        endpointBaseUrl,
        {},
        {
          params: { size: 0 },
        }
      )
    ).data.total;

    // setting counters
    let offset = 0;
    let size = 5000;
    let remaining = totalResources;

    // connecting to db
    const client = await mongoClient;

    await client.db().collection(`temp_${resource}`).drop();

    // constraint of docs per collection given db storage limit
    while (remaining > 0 && offset < documentsLimit) {
      const resources = await axios.post(
        endpointBaseUrl,
        {},
        {
          params: { size, offset },
        }
      );

      const resourceBatch = resources.data.results;

      // delete people resource properties to save db storage
      if (resource === "people") {
        resourceBatch.forEach((person: any) => {
          delete person.skills;
          delete person.verified;
          delete person.subjectId;
          delete person.compensations;
          delete person.remoter;
        });
      }

      // inserting resources to db
      client.db().collection(`temp_${resource}`).insertMany(resourceBatch);

      // updating counters
      offset += size;
      remaining -= size;

      // check if we got to last iteration
      if (remaining < size) {
        size = remaining;
      }

      console.log(`${offset} ${resource} resources loaded`);
    }

    client
      .db()
      .collection(`temp_${resource}`)
      .rename(resource, { dropTarget: true });

    console.log(`finished ${resource} update`);
  } catch (error) {
    console.log(error);
  }
};

export const updateData = async (documentsLimit: number): Promise<void> => {
  try {
    await updateResourceDb(
      endpointUrls.peopleBaseUrl,
      "people",
      documentsLimit
    );
    console.log("successful insertion to people collection");

    await updateResourceDb(
      endpointUrls.opportBaseUrl,
      "opportunities",
      documentsLimit
    );
    console.log("successful insertion to opportunities collection");
  } catch (error) {
    console.log(error);
  }
};

export const generateSearchQuery = (
  logicalOperator: string,
  search: any
): object => {
  let query: any = {};

  // building query object according to criteria received
  Object.keys(search).forEach((criterion: string) => {
    const value = search[criterion];
    if (!value) {
      return;
    }
    query[criterion] = { $regex: value, $options: "i" };
  });

  if (logicalOperator === "or") {
    query = {
      $or: Object.entries(query).map(([key, value]) => {
        return { [key]: value };
      }),
    };
  }

  return query;
};
