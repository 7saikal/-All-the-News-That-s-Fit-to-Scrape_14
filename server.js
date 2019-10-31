var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapperhomework", { useNewUrlParser: true });




// Route for scraping the data
app.get("/scrape", function (req, res) {

  axios.get("http://www.nytimes.com").then(function (response) {
    //initial cheerio on the page grabbed by axios 
    //boiler plate code
    var $ = cheerio.load(response.data)
    console.log("we are srapping")

    //array to hold each article 
    var article = []
    //loop through the file we grabbed with axios using the cheerio
    //.each uses iterable item and element argument to grap everything contain with our assetWrapper
    $(".assetWrapper").each(function (h, element) {
      var title = $(this).find("h2").text().trim();
      var url = $(this).find("a").attr("href");
      var sum = $(this).find("p").text().trim();
      //build object to push to the database key names should match what is in the db
      var dataObject = {
        headline: title,
        url: url,
        summary: sum
      }
      //pushing object of article into articles of array 
      article.push(dataObject);
    })
    console.log(article);
    db.Article.insertMany(article)
    res.redirect("/");
  })
  console.log("Done Scraping")
});

app.get("/articles", function (req, res) {
  console.log("article routes");
  db.Article.find({})
    .populate("notes")
    .then(function (dbArticles) {
      res.json(dbArticles);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    })
})

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
