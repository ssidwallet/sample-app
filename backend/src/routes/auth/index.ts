import { Request, Response, Router } from "express";
import PresentationRequestTemplate from "../../database/PresentationRequestTemplates";
import createPresentationRequest from "../../utils/createPresentationRequest";
import createQRCode from "../../utils/createQRCode";
import fetchSubmission from "../../utils/fetchPresentationSubmission";
import * as jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.get("/presentation-request", async (req: Request, res: Response) => {
  // Find DIDAuth Template ID
  const prt = (await PresentationRequestTemplate.findOne({
    type: "DIDAuthCredential",
  })) as any;

  const templateIds = [prt.templateId];

  // Create new Presentation Request
  const presentationRequest = await createPresentationRequest(templateIds);

  // Create QRCode
  const qrCodeData = {
    requestType: "presentationRequest",
    pr: presentationRequest,
  };

  const qrcode = await createQRCode(qrCodeData);

  // Return QRCode and Request ID
  return res.json({
    requestId: presentationRequest.id,
    qrcode: qrcode,
  });
});

authRouter.get("/poll/:requestId", async (req: Request, res: Response) => {
  // Check if a submission has been received yet
  const response = await fetchSubmission(req.params.requestId, true);

  // If not, return an error
  if (response === "NA") {
    return res.status(400).json({
      message: "No submission exists for given requestId",
      error: 400,
    });
  }

  // Create JWT with FlexID
  const token = jwt.sign(
    {
      flexid: response,
    },
    process.env.JWT_SECRET
  );

  // Return JWT and FlexID
  return res.json({
    flexid: response,
    token: token,
  });
});

export default authRouter;
