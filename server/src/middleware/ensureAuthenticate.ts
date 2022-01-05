import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  reponse: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return reponse.status(401).json({
      errorCode: "token.invalid",
    });
  }

  // Bearer ds8ad48s0d4as0d40asd4a8d04a80d
  // Desestruturar token

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

    request.user_id = sub;

    return next();
  } catch (error) {
    return reponse.status(401).json({ errorCode: "token.expired" });
  }
}
