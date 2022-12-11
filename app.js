// jshint esversion: 6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// Request for all articles
app.route("/articles")
// Get Request
.get(function(req, res) {
  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(JSON.stringify(foundArticles));
    } else {
      res.send(err);
    }
  });
})

// Post Request
.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added new article");
    } else {
      res.send(err);
    }
  });
})

// Delete Request
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});

// Request for single articles
app.route("/articles/:articleTitle")
// Get Request
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(!err){
      res.send(JSON.stringify(foundArticle));
    } else {
      res.send(err);
    }
  });
})

// Put Request
.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})

// Patch Request
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully patched the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})

// Delete Request
.delete(function(req, res) {
  Article.deleteOne({title: req.params.articleTitle}, function(err) {
    if (!err) {
      res.send("Successfully deleted given article.");
    } else {
      res.send(err);
    }
  });
});


app.listen("3000", function(req, res) {
  console.log("Server started at Port 3000");
});
