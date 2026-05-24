import dotenv from "dotenv";
import { daftar, masuk } from "../services/authService.js";
import catchAsync from "../utils/catchAsync.js";
dotenv.config();
export const register = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await daftar(email, req.body);
  res.status(201).json(result);
});
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await masuk(email, password);
  res
    .setHeader("authorization", `Bearer ${result.token}`)
    .status(200)
    .json(result);
});
