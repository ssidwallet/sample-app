import axios from "axios";
import getAccessToken from "./getAccessToken";

export default async function createPresentationRequestTemplate(
  request: any
): Promise<any> {
  const access_token = await getAccessToken();

  const response = await axios.post(
    process.env.FLEXHUB_URL + "/presentations/templates",
    request,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return response.data.id;
}
