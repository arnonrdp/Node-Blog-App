if (process.env.NODE_ENV == "production") {
    module.exports = { mongURI: "mongodb://mongo:3YaLw2WEsFG0voaiHox3@containers-us-west-60.railway.app:8044" };
} else {
    module.exports = { mongURI: "mongodb://localhost/blogapp" };
}
