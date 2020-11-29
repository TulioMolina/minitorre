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

    while (remaining > 0) {
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
        });
      }

      // inserting resources to db
      await mongoClient.db().collection(resource).insert(resourceBatch);

      // updating counters
      offset += size;
      remaining -= size;

      // check if we got to last iteration
      if (remaining < size) {
        size = remaining;
      }

      console.log(remaining);
    }

    console.log(`finished ${resource} update`);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await mongoClient.close();
  }
};
