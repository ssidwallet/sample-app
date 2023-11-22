import mongoose from "mongoose";

export default function createDBConnection(
  connectionString: string
): Promise<mongoose.Mongoose> {
  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}
