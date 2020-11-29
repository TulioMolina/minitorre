import axios from "axios";

export const updateResource = async (
  endpointBaseUrl: string
): Promise<any[]> => {
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

  const promiseContainer = [];

  // fetching all resources available at torre, request 5000 resources at a time (size param limit).
  // all requests are triggered in parallel for better network performance
  while (remaining > 0) {
    const resourcePromise = axios.post(
      endpointBaseUrl,
      {},
      {
        params: { size, offset },
      }
    );
    // pushing network request promise to array of promises to fetch in parallel
    promiseContainer.push(resourcePromise);

    offset += size;
    remaining -= size;
    if (remaining < size) {
      size = remaining;
    }

    console.log(remaining);
  }

  const responseArray = await Promise.all(promiseContainer);
  console.log("after promise all");

  let buffer: any = [];

  responseArray.forEach((responseElement) => {
    buffer.push(responseElement.data.results);
  });

  const resultingResources = buffer.flat();

  return resultingResources;
};
