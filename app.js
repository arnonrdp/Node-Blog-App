const express = require("express");
// const handlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("./routes/admin");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Post");
const Post = mongoose.model("Post");
require("./models/Category");
const Category = mongoose.model("Category");
const users = require("./routes/users");
const passport = require("passport");
require("./config/auth")(passport);
const db = require("./config/db");

//Session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
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
    .connect(db.mongURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting" + err));

app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.get("/", (req, res) => {
    Post.find()
        .populate("category")
        .sort({ data: "desc" })
        .then((posts) => {
            res.render("index", { posts: posts });
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar os posts");
            res.redirect("/404");
        });
});

app.get("/post/:slug", (req, res) => {
    Post.findOne({ slug: req.params.slug })
        .populate("category")
        .then((post) => {
            if (post) {
                res.render("post", { post: post });
            } else {
                req.flash("error_msg", "Post não encontrado");
                res.redirect("/");
            }
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar os posts");
            res.redirect("/");
        });
});

app.get("/categories", (req, res) => {
    Category.find()
        .then((categories) => {
            res.render("categories", { categories: categories });
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/");
        });
});

app.get("/categories/:slug", (req, res) => {
    Category.findOne({ slug: req.params.slug })
        .then((category) => {
            if (category) {
                Post.find({ category: category._id })
                    .populate("category")
                    .then((posts) => {
                        res.render("categories/posts", {
                            posts: posts,
                            category: category,
                        });
                    })
                    .catch((err) => {
                        req.flash(
                            "error_msg",
                            "Houve um erro ao listar os posts",
                        );
                        res.redirect("/");
                    });
            } else {
                req.flash("error_msg", "Categoria não encontrada");
                res.redirect("/");
            }
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/");
        });
});

app.get("/404", (req, res) => {
    res.send("Error 404");
});

app.get("/posts", (req, res) => {
    res.send("Lista de Posts");
});

app.use("/admin", admin);
app.use("/users", users);

// Outros
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/admin/`);
});
