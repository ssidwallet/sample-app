import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  accountNumber: {
    required: true,
    type: Number,
  },
  nationalIdNumber: {
    required: true,
    type: Number,
    unique: true,
  },
  accountType: {
    required: true,
    type: String,
  },
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
