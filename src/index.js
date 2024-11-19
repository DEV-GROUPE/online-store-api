
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import categoriesRoutes from "./routes/categories.routes.js";
import {httpStatusText} from "./utils/httpStatusText.js";
dotenv.config();

// express app
const app = express();

// middleware
app.use(express.json());
app.use("/api/category", categoriesRoutes);

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// connect to db
mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log("connected to database");
        // listen to port
        app.listen(process.env.PORT, () => {
            console.log("listening for requests on port", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
