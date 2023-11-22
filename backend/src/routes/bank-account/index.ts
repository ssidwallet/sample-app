import { Request, Response, Router } from "express";
import BankAccount from "../../database/BankAccounts";
import IssuedCredentials from "../../database/IssuedCredentials";
import PresentationRequestTemplate from "../../database/PresentationRequestTemplates";
import { checkJWT } from "../../middlewares/auth";
import createCredential from "../../utils/createCredential";
import createPresentationRequest from "../../utils/createPresentationRequest";
import createQRCode from "../../utils/createQRCode";
import fetchSubmission from "../../utils/fetchPresentationSubmission";

const bankAccountRouter = Router();

interface SubmitInfo {
  firstName: string;
  lastName: string;
  nationalIdNumber: number;
}

bankAccountRouter.post(
  "/receive-cred",
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

    // Get submitted information
    const info = req.body as SubmitInfo;
    if (!(info.firstName && info.lastName && info.nationalIdNumber)) {
      return res.status(400).json({
        message: "Missing fields",
        error: 400,
      });
    }

    // Try to find a Bank Account with given information
    const account = (await BankAccount.findOne({
      firstName: info.firstName,
      lastName: info.lastName,
      nationalIdNumber: info.nationalIdNumber,
    })) as any;

    // If bank account does not exist, return error
    if (!account) {
      return res.status(400).json({
        message: "Couldn't find a bank account with given information",
        error: 400,
      });
    }

    // Create credential
    const unsignedCredential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.org",
      ],
      name: "Acme Bank Account",
      type: ["VerifiableCredential", "AcmeBankAccountCredential"],
      credentialSubject: {
        id: flexid,
        firstName: info.firstName,
        lastName: info.lastName,
        nationalIdNumber: info.nationalIdNumber,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
      },
      issuerOrganization: "Acme Bank",
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

export default bankAccountRouter;
