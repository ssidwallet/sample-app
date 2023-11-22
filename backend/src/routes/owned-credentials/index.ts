import { Request, Response, Router } from "express";
import IssuedCredentials from "../../database/IssuedCredentials";
import { checkJWT } from "../../middlewares/auth";
import createQRCode from "../../utils/createQRCode";
import getCredentialByID from "../../utils/getCredentialByID";

const ownedCredsRouter = Router();

interface IssuedCredentialData {
  credential: any;
  qrcode: string;
}

ownedCredsRouter.get("/", [checkJWT], async (req: Request, res: Response) => {
  // Extract FlexID from JWT
  const flexid = res.locals.jwtPayload.flexid;
  if (!flexid) {
    return res.status(400).json({
      message: "You need to login first",
      error: 400,
    });
  }

  // Get all issued credential ID's for FlexID
  const issuedData = (await IssuedCredentials.findOne({
    flexid: flexid,
  })) as any;

  let issuedCredentials: IssuedCredentialData[] = [];

  // Get signed credentials and make QR Codes
  for (let id of issuedData.issuedCredentialIds) {
    const signedCredential = await getCredentialByID(id);
    const qrCodeData = {
      requestType: "credentialSave",
      vc: signedCredential,
    };
    const qrcode = await createQRCode(qrCodeData);
    issuedCredentials.push({
      credential: signedCredential,
      qrcode: qrcode,
    });
  }

  // Return all
  return res.json(issuedCredentials);
});

export default ownedCredsRouter;
