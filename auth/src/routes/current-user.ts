import express, { Request, Response } from "express";
import { currentUser } from "@ayberkddtickets/common";
const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => { 
    if(req.currentUser){
        return res.send({currentUser});
    }
    return res.send({currentUser:null}); 
});

export { router as currentUserRouter };
