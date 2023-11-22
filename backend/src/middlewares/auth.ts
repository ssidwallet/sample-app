import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function checkJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] as string;
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    console.log(error);
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).json({
      message: "Invalid JWT token",
      error: 401,
    });
  }

  next();
}
