const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res) => {
    let errors = [];

    if (!req.body.name) errors.push({ text: "Invalid name" });

    if (!req.body.email) errors.push({ text: "Invalid email" });

    if (!req.body.password) errors.push({ text: "Invalid password" });

    if (req.body.password != req.body.password_confirmation)
        errors.push({ text: "Passwords do not match" });

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password_confirmation: req.body.password_confirmation,
        });
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    req.flash("error_msg", "Email already registered");
                    res.redirect("/users/register");
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash("error_msg", "Error registering");
                                res.redirect("/");
                            }
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(() => {
                                    req.flash(
                                        "success_msg",
                                        "You are registered",
                                    );
                                    res.redirect("/users/login");
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        });
                    });
                }
            })
            .catch((err) => {
                req.flash("error_msg", "Something went wrong");
                res.redirect("/users/register");
            });
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;
