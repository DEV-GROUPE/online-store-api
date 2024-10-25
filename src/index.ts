const express = require("express");
const mongoose = require("mongoose");

// express app
const app = express();

const URI = process.env.URI;
const PORT = process.env.PORT;

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.get("/", (req, res) => res.send(`<h1>hello ${URI}</h1>`));

// connect to db
mongoose
    .connect(URI)
    .then(() => {
        console.log("connected to database");
        // listen to port
        app.listen(PORT, () => {
            console.log("listening for requests on port", PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
