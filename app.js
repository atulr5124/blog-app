var express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose");

// App config
mongoose.connect("mongodb://localhost/blog-app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Mongoose/model config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Welcome to Blog-App",
//     image: "http://source.unsplash.com/3NyXqusbMsU",
//     body: "Welcome to Blog-App. An app created to demonstrate restful ruoting in web applications using Node, Mongoose and Express stack."
// });

// Restful routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            res.send(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.listen(3000, function() {
    console.log("blog-app server is running!")
});