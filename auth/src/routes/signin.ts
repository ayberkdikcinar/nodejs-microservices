import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "@ayberkddtickets/common";
import { ValidationHandler } from "@ayberkddtickets/common";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isEmpty()
      .withMessage("You must supply password."),
  ],
  ValidationHandler,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    
    const existingUser = await User.findOne({email});
    if(existingUser){
      const validPassword = await bcrypt.compare(password,existingUser.password);
      if(!validPassword){
        throw new BadRequestError("Invalid credentials.");
      }
 
    //Generate jwt
    const jwtUser = jwt.sign({
      id:existingUser.id,
      email:existingUser.email,
    },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt:jwtUser
    };

      return res.status(200).send(existingUser);
    } 

    throw new BadRequestError("User not found.");
    
  }
);

export { router as signinRouter };
