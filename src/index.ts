import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, disconnectDB } from "./db/connection";
import errorHandler from "./middlewares/error-handler.middleware";
import router from "./routes";

// Let's config the environment file (.env file)
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:3000"];

// Configure CORS origin to allow requests from specific origins (for front-end)
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON requests (built in middleware by express)
app.use(express.json());

// Configure all app routers
app.use("/", router);

// Middleware to handle all the errors
app.use(errorHandler);

async function main() {
  // Database connection
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Handle graceful shutdown - Disconnect from the database
  process.on("SIGINT", async () => {
    console.log(
      "Received SIGINT - Closing server and disconnecting from MongoDB"
    );

    await disconnectDB();
    server.close(() => {
      process.exit(0);
    });
  });

  process.on("SIGTERM", async () => {
    console.log(
      "Received SIGTERM - Closing server and disconnecting from MongoDB"
    );

    await disconnectDB();
    server.close(() => {
      process.exit(0);
    });
  });
}

// EXECUTE MAIN FUNCTION TO RUN OUR SERVER
main();
