# Workflow

## User Workflow

The workflow, for the end user, will be the following:

1. User opens the website for `Acme Bank`
2. User is prompted to "Login with FlexID"
   1. User is displayed a QR Code and asked to scan it
   2. User scans the QR Code using the FlexID Wallet app
   3. App receives the User's FlexID and proceeds to the next page
3. The user is then asked to fill a form with their banking information
4. `Acme Bank` checks that information against their database, and if the information is valid - it issues a `Bank Account Credential` to the user
   1. User is displayed a QR code and asked to scan it
   2. User scans the QR code using the FlexID Wallet app
   3. The credential gets saved to the user's wallet
   4. User moves on to the next page, to request a loan from `Acme MFI`
5. User is asked to share their `Banking Credential` for the microfinance division to do their KYC
   1. User is displayed a QR Code and asked to scan it
   2. User scans the QR code using the FlexID Wallet app
   3. The `Banking Credential` gets shared with `Acme MFI`
   4. `Acme MFI` verifies the credential is valid and not revoked
   5. `Acme MFI` does some processing
   6. `Acme MFI` approves the loan request and issues a `Loan Agreement Credential` to the user

## Technical Workflow

### Context

The Flex Hub allows for two primary functions - the issuance and the verification of digital credentials. While by themselves issuances and verifications are single-endpoint features, the actual user flow on the frontend requires a little more interaction.

### Verification

The first step - `Login with FlexID` is an example of verification of a digital credential. When a user registers a FlexID, a default credential is generated automatically. This credential does not contain any information beyond the unique FlexID identifier. An app can request the user to share this credential with them to verify ownership over a certain FlexID - this can thus be used for Login.

There are a few steps that are required for being able to verify a credential. Let's take a look at some terminology.

- **Credential** - A credential is a digitally signed, cryptographically secure, credential containing some information about, or related to, the owner of a FlexID. A credential is issued to a user typically by an organization.
- **Presentation** - A presentation is a digitally signed, cryptographically secure, proof of a credential. When a user is requested to share a credential, they convert their saved credential into a presentation and share that presentation with the requester organization. This allows them to prove ownership of credentials.

So, when we talk about verifying credentials, we actually mean verifying presentations. The default credential that is generated in the user's wallet is converted into a presentation which is then shared with the app to `Login with FlexID`.

To request the user to share a presentation, we need to do the following steps:

1. Create a Presentation Request Template (PRT)

   - A PRT is a template for requesting a certain "type" of presentation from the user. For example, requesting a `DIDAuthCredential` (used for Login), or a `BankAccountCredential` etc.
   - A PRT also specifies trusted credential issuers for the presentation. For eg, you might only trust `BankAccountCredential`s coming from certain issuers i.e. CBZ. `credentialIssuers` is an array where you provide the ID's of issuers you trust.
   - Lastly, a PRT contains a `name` and `reason` for requesting the presentation. In the case of Login, the name can be `Authentication Request` and reason can be `We need this to authenticate your FlexID`
   - Docs about how to create a PRT can be found here - https://hub.flexfintx.com/#create-presentation-request-template

2. Create a specific Presentation Request

   - Once a PRT has been made, each user of the app will be shown unique Presentation Requests that inherit information from the PRT.
   - To create a Presentation Request, you just need to specify all the PRT Template ID's
   - Docs on how to create a Presentation Request can be found here - https://hub.flexfintx.com/#create-presentation-request

3. Display the Presentation Request to the user

   - FlexID supports two methods of exchanging information between the user and the organization. The first is using QR Codes, and the second is using DeepLinks.
   - To display a QR Code, the web app should convert the Presentation Request JSON Object into a QR Code and display it to the user
   - To generate a DeepLink, the web app should apply `base64url` encoding on the Presentation Request JSON object and append it to `flexid://` and present it as a link on the web app

4. Poll for a Presentation Submission

   - Since the user can take an arbitrary amount of time to respond to the Presentation Request, the web app should poll to check if the user has submitted a response to the request yet.
   - To poll for a submission, you need the Presentation Request ID
   - You should do this only once every few seconds to not overload the API server
   - Docs for polling a Presentation Submission can be found here - https://hub.flexfintx.com/#fetch-presentation-submission

   NOTE: When a presentation is submitted, it is automatically verified by the API. If it is an invalid presentation, an error will be displayed to the user and your polling will continue to return empty.

5. Extracting Data from the Presentation Submission

   - The Presentation Submission will provide a JSON object containing a `presentation` object. This object will contain an array of `verifiableCredentials` which will each have the credential-specific data present in the `credentialSubject` fields
   - For the `Login with FlexID` example - you will need to extract the `id` field from within `credentialSubject` in the one and only `verifiableCredential` that is part of the `presentation`. This will give you the user's unique FlexID.
   - In other cases, where one or more credentials were shared which actually contain more information, they can be extracted similarly.

### Issuance

The process for issuance of new credentials is relatively simpler. The web-app needs to know beforehand is the FlexID of the user who is being issued to, and a FlexID that is owned by the organization.

For the user, this is done using the `Login with FlexID` flow.

For the organization, a list of FlexID's owned by the organization can be fetched using the `Get All DIDs` endpoint and extracting the `id` of any one of them - https://hub.flexfintx.com/#get-all-dids

The docs for issuing a new credential can be found here - https://hub.flexfintx.com/#create-a-credential

- The `@context` field usually does not need to be changed other than what's provided in the example request.

- The `type` field needs to be an array of strings, with the first item necessarily being `VerifiableCredential`. The other items can be anything you want, usually something that is uniquely identifiable.

- The `name` of a credential should be short and explanatory. This is displayed in the user's Wallet application.

- The `image` field is an optional field used to attach a background image to the credential to be displayed in the user's Wallet application. If none is provided, a default image is used instead.

- The `issuer` field should contain a FlexID identifier that is owned by the organization.

- The `credentialSubject` is an object containing information about, or related to, the user being issued to. It NEEDS to contain an `id` field which is the unique FlexID of the user being issued to. It can contain any other arbitrary values in it as well which are considered part of the credential.

- The `issuerOrganization` should be a short human readable name for the Issuer Organization. (e.g. CBZ) This is used to display the organization in the user's Wallet app.

- The `saveToBank` field specifies whether or not the entire credential (including `credentialSubject`) should be saved in the database. This should be set to `true` for easibility, and potential re-issuance of credentials in case someone loses their mobile phone. BUT, if used in production, please ensure it complies with your Data Protection and Data Retention policies.

- The `isRevocable` field specifies whether this credential is something that can be possibly revoked in the future or not. (E.g. A university degree is not revocable, but a driver's license is)

Once a credential is signed using the `Create Credential` endpoint, it can be presented to the user in the form of a QR Code or a Deeplink. Similar to verifications,

- To display a QR Code, the web app should convert the Signed Credential JSON Object into a QR Code and display it to the user
- To generate a DeepLink, the web app should apply `base64url` encoding on the Signed Credential JSON object and append it to `flexid://` and present it as a link on the web app

## Revisiting the User Workflow

With the knowledge of the technical workflow, let's understand exactly what is going on in the User Workflow

1. `Acme Bank` creates a Presentation Request Template (PRT) for `DIDAuth` (Login) and saves it's Template ID
2. `Acme MFI` creates a Presentation Request Template (PRT) for `BankAccountCredential` and saves it's Template ID
3. User opens the website for `Acme Bank`
4. User is prompted to "Login with FlexID"

   - A Presentation Request using the `DIDAuth` PRT is created, the Request ID is stored temporarily in the web app
   - The Presentation Request is displayed to the user in the form of a QR Code

   1. User is displayed a QR Code and asked to scan it

   - The app polls for a Presentation Submission for that Request ID

   2. User scans the QR Code using the FlexID Wallet app

   - The app receives the Presentation Submission Object and extracts the user's FlexID and issues a JWT containing the FlexID

   3. App receives the User's FlexID and proceeds to the next page

5. The user is then asked to fill a form with their banking information
6. `Acme Bank` checks that information against their database, and if the information is valid - it issues a `Bank Account Credential` to the user
   - A credential is signed using the FlexID contained in the JWT provided by the user (earlier issued to him by the web app)
   1. User is displayed a QR code and asked to scan it
   2. User scans the QR code using the FlexID Wallet app
   3. The credential gets saved to the user's wallet
7. User moves on to the next page, to request a loan from `Acme MFI`
8. User is asked to share their `Banking Credential` for the microfinance division to do their KYC

   - A Presentation Request using the `BankAccountCredential` PRT is created, the Request ID is stored temporarily in the web app- The Presentation Request is displayed to the user in the form of a QR Code

   1. User is displayed a QR Code and asked to scan it

   - The app polls for a Presentation Submission for that Request ID

   2. User scans the QR code using the FlexID Wallet app

   - The app receives the Presentation Submission Object and extracts the user's bank account credential information from the presentation

   3. The `Banking Credential` gets shared with `Acme MFI`

9. `Acme MFI` does some processing to review the loan request
10. `Acme MFI` approves the loan request and issues a `Loan Agreement Credential` to the user
    - A credential is signed using the FlexID contained in the JWT provided by the user (earlier issued to him by the web app)
    1. User is displayed a QR code and asked to scan it
    2. User scans the QR code using the FlexID Wallet app
    3. The credential gets saved to the user's wallet
