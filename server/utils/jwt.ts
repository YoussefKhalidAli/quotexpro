import jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}
