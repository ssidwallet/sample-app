import axios from "axios";
import getAccessToken from "./getAccessToken";

export default async function getCredentialByID(id: string): Promise<any> {
  const access_token = await getAccessToken();

  const response = await axios.get(
    process.env.FLEXHUB_URL + "/credentials/" + id,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return response.data;
}
