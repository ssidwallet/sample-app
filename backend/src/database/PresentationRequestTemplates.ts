import mongoose from "mongoose";

const prtSchema = new mongoose.Schema({
  type: {
    required: true,
    type: String,
  },
  templateId: {
    required: true,
    type: String,
  },
});

const PresentationRequestTemplate = mongoose.model(
  "PresentationRequestTemplate",
  prtSchema
);

export default PresentationRequestTemplate;
