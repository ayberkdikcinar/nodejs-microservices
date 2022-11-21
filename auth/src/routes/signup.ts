import express, { Request, Response } from "express";
import { body } from "express-validator";
import { ValidationHandler } from "@ayberkddtickets/common";
import {User} from "../models/user";
import {  BadRequestError } from "@ayberkddtickets/common";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 character."),
  ],
  ValidationHandler,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
      const existingUser = await User.findOne({email});
      if(existingUser){
        throw new BadRequestError("User already exists.");
      }
      
      const user = User.build({email,password});
      await user.save();

      //Generate jwt
      const jwtUser = jwt.sign({
        id:user.id,
        email:user.email,
      },
      process.env.JWT_SECRET!
      );

      req.session = {
        jwt:jwtUser
      };

      res.status(201).send(user);

    } catch (error) {
      throw error;
    }
   
    //hash the password

    //Save it to database
  }
);

export { router as signupRouter };
