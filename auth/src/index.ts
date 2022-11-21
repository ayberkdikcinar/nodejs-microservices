import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "@ayberkddtickets/common";
import { NotFoundError } from "@ayberkddtickets/common";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();
app.set("trust proxy",true);
app.use(json());
app.use(cookieSession({
  signed:false,
  secure:true,
}));

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);
app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

async function start() {
  if(!process.env.JWT_SECRET ||!process.env.MONGO_URI){
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
}
start();
