if (process.env.NODE_ENV == "production") {
    module.exports = { mongURI: "mongodb+srv://arnon_blogapp:IOZ0r35Qh4GeQk5C@node-blog-app.wkpxm.mongodb.net/?retryWrites=true&w=majority" };
} else {
    module.exports = { mongURI: "mongodb://localhost/blogapp" };
}
