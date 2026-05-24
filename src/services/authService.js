import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export async function daftar(email, body) {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    const err = new Error("Email has been registered");
    err.statusCode = 409;
    throw err;
  }
  const user = await User.create(body);
  if (!user) {
    const err = new Error("Failed create User, Invalid Input");
    err.statusCode = 400;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN },
  );
  return {
    succes: true,
    message: "Registration Successful",
    data: {
      user: user,
      token: token,
    },
  };
}
export async function masuk(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Email not found");
    err.statusCode = 404;
    throw err;
  }
  const match = await user.comparePassword(password, user.password);
  if (!match) {
    const err = new Error("Wrong password");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN },
  );
  return { succes: true, message: "Login Successfull", token: token };
}
