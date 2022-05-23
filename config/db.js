if (process.env.NODE_ENV == "production") {
    module.exports = { mongURI: "mongodb://mongo:Y2nmDxzrNNJpKix8s93S@containers-us-west-53.railway.app:6421" };
} else {
    module.exports = { mongURI: "mongodb://localhost/blogapp" };
}
