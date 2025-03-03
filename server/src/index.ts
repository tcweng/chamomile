import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// ROUTE IMPORTS
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import salesRoutes from "./routes/salesRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
// Create the endpoint url for us to connect
// This to be added after we created a controller and added a router.
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/sales", salesRoutes); // http://localhost:8000/sales
app.use("/collections", collectionRoutes); //http://localhost:8000/collections
app.use("/upload", uploadRoutes); //http://localhost:8000/upload

// SERVER
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on ${port}`);
});
