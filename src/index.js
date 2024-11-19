
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import categoriesRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/user.js";
dotenv.config();

// express app
const app = express();

// middleware
app.use(express.json());
app.use("/api/category", categoriesRoutes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use("/api/user", userRoutes);

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
