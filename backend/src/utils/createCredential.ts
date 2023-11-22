import axios from "axios";
import getAccessToken from "./getAccessToken";

export default async function createCredential(unsigned: any): Promise<any> {
  const access_token = await getAccessToken();

  const response = await axios.post(
    process.env.FLEXHUB_URL + "/credentials",
    unsigned,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return response.data;
}
