import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import express from "express";
import createDBConnection from "./database/createConnection";
import initialize from "./database/initialize";
import router from "./routes";

// Read environment variables from .env file, if exists
dotenv.config();

const PORT: number = parseInt(process.env.PORT, 10);

// Connect to database then start the server
createDBConnection(process.env.DB_CONNECTION_STRING)
  .then(async () => {
    await initialize();
    const app = express();

    // Add middlewares to router
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Apply routes
    app.use(router);

    app.listen(PORT, () => {
      console.log(`Sample App Backend listening on Port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
