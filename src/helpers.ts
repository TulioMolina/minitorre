import axios from "axios";
import mongoClient from "./mongoclient";

export const updateResourceDb = async (
  endpointBaseUrl: string,
  resource: string
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
    await mongoClient.connect();

    // constraint of 150000 docs per collection given db space limit
    while (remaining > 0 && offset < 100000) {
      const resources = await axios.post(
        endpointBaseUrl,
        {},
        {
          params: { size, offset },
        }
      );

      const resourceBatch = resources.data.results;

      // delete skills property to save db storage
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
      await mongoClient
        .db()
        .collection(`temp_${resource}`)
        .insertMany(resourceBatch);

      // updating counters
      offset += size;
      remaining -= size;

      // check if we got to last iteration
      if (remaining < size) {
        size = remaining;
      }

      console.log(remaining);
    }

    await mongoClient
      .db()
      .collection(`temp_${resource}`)
      .rename(resource, { dropTarget: true });

    console.log(`finished ${resource} update`);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await mongoClient.close();
  }
};
