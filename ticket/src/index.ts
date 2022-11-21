import express from "express";
import { json } from "body-parser";
import { RetrieveRouter } from "./routes/retrieve";
import { RetrieveAllRouter } from "./routes/retrieveAll";
import { CreateRouter } from "./routes/create";
import mongoose from "mongoose";
import { currentUser, NotFoundError } from "@ayberkddtickets/common";
import { errorHandler } from "@ayberkddtickets/common";
import cookieSession from "cookie-session";

const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser); //it sets the req.currentUser
app.use(CreateRouter);
app.use(RetrieveRouter);
app.use(RetrieveAllRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    throw new Error("Environment variables must be defined.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db Connected.");
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
