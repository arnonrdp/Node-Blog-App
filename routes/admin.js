const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("../models/Category");
const Category = mongoose.model("Category");

router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    res.send("Admin posts page");
});

router.get("/categories", (req, res) => {
    res.render("admin/categories");
});

router.get("/categories/add", (req, res) => {
    res.render("admin/addcategories");
});

router.post("/categories/new", (req, res) => {
    const newCategory = {
        name: req.body.name,
        slug: req.body.slug,
    };

    new Category(newCategory)
        .save()
        .then(() => console.log("Categoria salva com sucesso"))
        .catch((err) => console.log("Erro ao salvar categoria\n" + err));
});

module.exports = router;
