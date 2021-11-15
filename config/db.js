if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongURI:
            "mongodb+srv://arnon_blogapp:abcd1234@cluster0.wkpxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    };
} else {
    module.exports = { mongURI: "mongodb://localhost/blogapp" };
}
