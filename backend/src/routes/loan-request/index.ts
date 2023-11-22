import { Request, Response, Router } from "express";
import IssuedCredentials from "../../database/IssuedCredentials";
import PresentationRequestTemplate from "../../database/PresentationRequestTemplates";
import { checkJWT } from "../../middlewares/auth";
import createCredential from "../../utils/createCredential";
import createPresentationRequest from "../../utils/createPresentationRequest";
import createQRCode from "../../utils/createQRCode";
import fetchSubmission from "../../utils/fetchPresentationSubmission";

const loanRouter = Router();

interface SubmitInfo {
  amount: number;
}

loanRouter.get(
  "/presentation-request",
  [checkJWT], // Apply middleware
  async (req: Request, res: Response) => {
    // Extract FlexID from JWT
    const flexid = res.locals.jwtPayload.flexid;
    if (!flexid) {
      return res.status(400).json({
        message: "You need to login first",
        error: 400,
      });
    }

    // Find AcmeBankAccountCredential template ID
    const prt = (await PresentationRequestTemplate.findOne({
      type: "AcmeBankAccountCredential",
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
  }
);

loanRouter.get(
  "/poll/:requestId",
  [checkJWT],
  async (req: Request, res: Response) => {
    // Extract FlexID from JWT
    const flexid = res.locals.jwtPayload.flexid;
    if (!flexid) {
      return res.status(400).json({
        message: "You need to login first",
        error: 400,
      });
    }

    // Check if a submission has been received yet
    const response = await fetchSubmission(req.params.requestId);

    // If not, return an error
    if (response === "NA") {
      return res.status(400).json({
        message: "No submission exists for given requestId",
        error: 400,
      });
    }

    // Ensure submission is done by logged-in FlexID
    if (response.presentation.holder !== flexid) {
      return res.status(400).json({
        message: "Submission is not owned by current user",
        error: 400,
      });
    }

    // If it has, return the submission
    return res.json({
      response,
    });
  }
);

loanRouter.post(
  "/receive-cred/:requestId",
  [checkJWT],
  async (req: Request, res: Response) => {
    // Extract FlexID from JWT
    const flexid = res.locals.jwtPayload.flexid;
    if (!flexid) {
      return res.status(400).json({
        message: "You need to login first",
        error: 400,
      });
    }

    // Get submitted information
    const info = req.body as SubmitInfo;
    if (!info.amount) {
      return res.status(400).json({
        message: "Missing fields",
        error: 400,
      });
    }

    // Fetch submission again to include information in LoanAgreemntCredential
    const response = await fetchSubmission(req.params.requestId);

    // Ensure submission is done by logged-in FlexID
    if (response.presentation.holder !== flexid) {
      return res.status(400).json({
        message: "Submission is not owned by current user",
        error: 400,
      });
    }

    const subject =
      response.presentation.verifiableCredential[0].credentialSubject;

    // Create credential
    const unsignedCredential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.org",
      ],
      name: "Acme Loan Agreement",
      type: ["VerifiableCredential", "AcmeLoanAgreementCredential"],
      credentialSubject: {
        id: flexid,
        amount: info.amount,
        firstName: subject.firstName,
        lastName: subject.lastName,
        accountNumber: subject.accountNumber,
      },
      issuerOrganization: "Acme MFI",
      issuer: process.env.ACME_BANK_FLEXID,
      saveToBank: true,
      isRevocable: false,
    };

    const signedCredential = await createCredential(unsignedCredential);

    // Add signed credential ID in database
    const issuedCredentialData = await IssuedCredentials.findOne({
      flexid: flexid,
    });
    if (issuedCredentialData) {
      await IssuedCredentials.findOneAndUpdate(
        { flexid: flexid },
        {
          $push: { issuedCredentialIds: signedCredential.id },
        }
      );
    } else {
      await IssuedCredentials.create({
        flexid: flexid,
        issuedCredentialIds: [signedCredential.id],
      });
    }

    // Create QRCode
    const qrCodeData = {
      requestType: "credentialSave",
      vc: signedCredential,
    };

    const qrcode = await createQRCode(qrCodeData);

    // Return QRCode
    return res.json({
      qrcode: qrcode,
    });
  }
);

export default loanRouter;
