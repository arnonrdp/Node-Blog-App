const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("../models/Category");
require("../models/Post");
const Category = mongoose.model("Category");
const Post = mongoose.model("Post");
const { isAdmin } = require("../helpers/isAdmin");

router.get("/", isAdmin, (req, res) => {
    res.render("admin/index");
});

router.get("/categories", isAdmin, (req, res) => {
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

router.get("/categories/add", isAdmin, (req, res) => {
    res.render("admin/addcategories");
});

router.post("/categories/new", isAdmin, (req, res) => {
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

router.get("/categories/edit/:id", isAdmin, (req, res) => {
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

router.post("/categories/edit", isAdmin, (req, res) => {
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

router.post("/categories/delete", isAdmin, (req, res) => {
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

router.get("/posts", isAdmin, (req, res) => {
    Post.find()
        .populate("category")
        .sort({ data: "desc" })
        .then((posts) => {
            res.render("admin/posts", { posts: posts });
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin");
        });
});

router.get("/posts/add", isAdmin, (req, res) => {
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

router.post("/posts/new", isAdmin, (req, res) => {
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

router.get("/posts/edit/:id", isAdmin, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .lean()
        .then((post) => {
            Category.find()
                .lean()
                .then((categories) => {
                    res.render("admin/editposts", {
                        post: post,
                        categories: categories,
                    });
                })
                .catch((err) => {
                    req.flash("error_msg", "Error: " + err);
                    res.redirect("/admin/posts");
                });
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin/posts");
        });
});

router.post("/posts/edit", isAdmin, (req, res) => {
    Post.findOne({ _id: req.body.id })
        .then((post) => {
            post.title = req.body.title;
            post.slug = req.body.slug;
            post.description = req.body.description;
            post.content = req.body.content;
            post.category = req.body.category;

            post.save()
                .then(() => {
                    req.flash("success_msg", "Post edited");
                    res.redirect("/admin/posts");
                })
                .catch((err) => {
                    req.flash("error_msg", "Error: " + err);
                    res.redirect("/admin/posts");
                });
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin/posts");
        });
});

router.get("/posts/delete/:id", isAdmin, (req, res) => {
    Post.remove({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Post deleted");
            res.redirect("/admin/posts");
        })
        .catch((err) => {
            req.flash("error_msg", "Error: " + err);
            res.redirect("/admin/posts");
        });
});

module.exports = router;
