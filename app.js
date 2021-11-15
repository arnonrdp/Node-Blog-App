const express = require("express");
// const handlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("./routes/admin");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

//Session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    }),
);
app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.engine("handlebars", handlebars({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "handlebars",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "views");
mongoose
    .connect("mongodb://localhost/blogapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting" + err));

app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/admin", admin);

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/admin/`);
});
