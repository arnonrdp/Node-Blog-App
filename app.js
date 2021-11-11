const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("./routes/admin");
const path = require("path");
const app = express();

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
mongoose
    .connect("mongodb://localhost/blogapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting" + err));

app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use((req, res, next) => {
    console.log("Request received");
    next();
});

// Rotas
app.use("/admin", admin);

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
