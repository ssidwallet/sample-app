import axios from "axios";
import getAccessToken from "./getAccessToken";

export default async function createPresentationRequest(
  templateIds: string[]
): Promise<any> {
  const access_token = await getAccessToken();

  const request = {
    templates: templateIds,
  };

  const response = await axios.post(
    process.env.FLEXHUB_URL + "/presentations/templates/request",
    request,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return response.data;
}
