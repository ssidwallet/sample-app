import mongoose from "mongoose";

const issuedCredentialsSchema = new mongoose.Schema({
  flexid: {
    required: true,
    type: String,
  },
  issuedCredentialIds: {
    required: true,
    type: [String],
  },
});

const IssuedCredentials = mongoose.model(
  "IssuedCredentials",
  issuedCredentialsSchema
);

export default IssuedCredentials;
