import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoseConnect from "./src/config/db.js";
import routeAuth from "./src/routes/auth.routes.js";
import routeUser from "./src/routes/user.routes.js";
import routeClass from "./src/routes/class.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import yaml from "js-yaml";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const swaggerDoc = yaml.load(readFileSync("./swagger.yaml", "utf8"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
mongoseConnect();
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Hello Folks!!!",
  });
});
app.use("/api/auth", routeAuth);
app.use("/api/classes", routeClass);
app.use("/api/users", routeUser);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON http://localhost:${PORT}`);
});
