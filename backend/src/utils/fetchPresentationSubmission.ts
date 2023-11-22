import axios from "axios";
import getAccessToken from "./getAccessToken";

export default async function fetchSubmission(
  requestId: string,
  returnDid = false
): Promise<any> {
  const access_token = await getAccessToken();

  try {
    const response = await axios.get(
      process.env.FLEXHUB_URL + "/presentations/submission/" + requestId,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    if (response.status === 200 && returnDid) {
      return response.data.presentation.holder as string;
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return "NA";
  }
}
