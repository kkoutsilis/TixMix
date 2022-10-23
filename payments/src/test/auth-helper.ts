import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getAuthCookie = async (id?: string) => {
  const email = "test@test.com";
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: email,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
