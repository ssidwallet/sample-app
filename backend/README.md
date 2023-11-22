# APIs to hit in order for user workflow

## Auth

`GET /auth/presentation-request`
`GET /auth/poll/:requestId` until it returns success

## Bank Account

`POST /bank-account/receive-cred`

## Loan Request

`GET /loan-request/presentation-request`
`GET /loan-request/poll/:requestId` until it returns success
`POST /receive-cred/:requestId`

## Owned Credentials

`GET /owned-credentials`
