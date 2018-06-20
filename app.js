var express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        methodOverride = require("method-override"),
        expressSanitizer = require("express-sanitizer");

// App config
mongoose.connect("mongodb://localhost/blog-app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

// Index route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            res.send(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// New route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// Create route
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var title = req.body.blog.title;
    var image = req.body.blog.image;
    var body = req.body.blog.body;
    Blog.create({
        title: title,
        image: image,
        body: body
    }, function(err, newBlog) {
        if(err) {
            res.send(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.send(err);
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// Edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.send(err);
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// Update route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBog) {
        if(err) {
            res.send(err);
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// Destroy Route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, deleted) {
        if(err) {
            res.send(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, function() {
    console.log("blog-app server is running!")
});