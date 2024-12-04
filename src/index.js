import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import categoriesRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import productsRoutes from "./routes/products.routes.js";
import { httpStatusText } from "./utils/httpStatusText.js";
import appError from "./utils/appError.js";
dotenv.config();

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);

// connect to db
mongoose
    .connect(process.env.MONGO_URI, {
        authSource: "admin",
    })
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log(err);
    });
// listen to port
export const server = app.listen(process.env.PORT, () => {
    console.log("listening for requests on port", process.env.PORT);
});
// handle 404 errors
app.all("*", (req, res, next) => {
    const error = appError.create(
        "this resource is not available",
        404,
        httpStatusText.ERROR
    );
    return next(error);
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: error.statusCode || 500,
        data: null,
    });
});
