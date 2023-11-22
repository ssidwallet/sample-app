import createPresentationRequestTemplate from "../utils/createPresentationRequestTemplate";
import BankAccount from "./BankAccounts";
import IssuedCredentials from "./IssuedCredentials";
import PresentationRequestTemplate from "./PresentationRequestTemplates";

export default async function initialize() {
  console.log("Initializing database...");

  // Remove any existing information in the DB (should NOT be done in a production app)
  await BankAccount.deleteMany({});
  await IssuedCredentials.deleteMany({});
  await PresentationRequestTemplate.deleteMany({});

  // Create Presentation Request Templates
  const didAuthTemplateRequest = {
    name: "Login with FlexID",
    reason: "We need this to authenticate your FlexID",
    credentialType: "DIDAuthCredential",
    credentialIssuers: ["self"],
  };

  const didAuthPRTId = await createPresentationRequestTemplate(
    didAuthTemplateRequest
  );

  const bankAccountTemplateRequest = {
    name: "Bank Account",
    reason: "We need this to verify ownership of an Acme Bank account",
    credentialType: "AcmeBankAccountCredential",
    credentialIssuers: [process.env.ACME_BANK_FLEXID],
  };

  const bankAccountPRTId = await createPresentationRequestTemplate(
    bankAccountTemplateRequest
  );

  // Save PRT Id's in database
  await PresentationRequestTemplate.create([
    {
      type: "DIDAuthCredential",
      templateId: didAuthPRTId,
    },
    {
      type: "AcmeBankAccountCredential",
      templateId: bankAccountPRTId,
    },
  ]);

  // Create test bank account
  await BankAccount.create({
    firstName: "Test",
    lastName: "Account",
    accountNumber: 12345,
    nationalIdNumber: 123456789,
    accountType: "Basic",
  });

  console.log("Database initialized!");
}
