const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("../models/Category");
require("../models/Post");
const Category = mongoose.model("Category");
const Post = mongoose.model("Post");

router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    res.send("Admin posts page");
});

router.get("/categories", (req, res) => {
    Category.find()
        .lean()
        .sort({ name: "asc" })
        .then((categories) => {
            res.render("admin/categories", { categories: categories });
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin");
        });
});

router.get("/categories/add", (req, res) => {
    res.render("admin/addcategories");
});

router.post("/categories/new", (req, res) => {
    let errors = [];

    if (!req.body.name || req.body.name == "") {
        errors.push({ text: "Invalid name" });
    }

    if (!req.body.slug || req.body.slug.length < 2) {
        errors.push({ text: "Invalid slug" });
    }

    if (errors.length > 0) {
        res.render("admin/addcategories", {
            errors: errors,
            name: req.body.name,
            slug: req.body.slug,
        });
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug,
        };

        new Category(newCategory)
            .save()
            .then(() => {
                req.flash("success_msg", "Category added");
                res.redirect("/admin/categories");
            })
            .catch((err) => req.flash("error_msg", "Error: " + err));
    }
});

router.get("/categories/edit/:id", (req, res) => {
    Category.findOne({ _id: req.params.id })
        .lean()
        .then((category) => {
            res.render("admin/editcategories", { category: category });
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin/categories");
        });
});

router.post("/categories/edit", (req, res) => {
    Category.findOne({ _id: req.body.id })
        .then((category) => {
            category.name = req.body.name;
            category.slug = req.body.slug;
            category
                .save()
                .then(() => {
                    req.flash("success_msg", "Category edited");
                    res.redirect("/admin/categories");
                })
                .catch((err) => {
                    req.flash("error_msg", "Error: " + err);
                    res.redirect("/admin/categories");
                });
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin/categories");
        });
});

router.post("/categories/delete", (req, res) => {
    Category.remove({ _id: req.body.id })
        .then(() => {
            req.flash("success_msg", "Category deleted");
            res.redirect("/admin/categories");
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin/categories");
        });
});

router.get("/posts", (req, res) => {
    res.render("admin/posts");
});

router.get("/posts/add", (req, res) => {
    Category.find()
        .lean()
        .then((categories) => {
            res.render("admin/addpost", { categories: categories });
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin");
        });
});

router.post("/posts/new", (req, res) => {
    let errors = [];

    if (!req.body.title || req.body.title.length < 2)
        errors.push({ text: "Invalid title" });

    if (errors.length > 0) {
        res.render("admin/addpost", {
            errors: errors,
            title: req.body.title,
            body: req.body.body,
            category: req.body.category,
        });
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
        };

        new Post(newPost)
            .save()
            .then(() => {
                req.flash("success_msg", "Post added");
                res.redirect("/admin/posts");
            })
            .catch((err) => req.flash("error_msg", "Error: " + err));
    }
});

module.exports = router;
