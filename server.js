import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoseConnect from "./src/config/db.js";
import routeAuth from "./src/routes/auth.routes.js";
import routeUser from "./src/routes/user.routes.js";
import routeClass from "./src/routes/class.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDoc = yaml.load(
  readFileSync(join(__dirname, "swagger.yaml"), "utf8"),
);
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
export default app;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON http://localhost:${PORT}`);
  });
}
