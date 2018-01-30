var Article = require("../models/musicNews.js");
var request = require("request");
var cheerio = require("cheerio");
var path = require("path");



module.exports = function(app) {
app.get('/search', function(req, res) {
  request("https://www.npr.org/series/100920965/music-articles/", function(error, response, html) {
    var $ = cheerio.load(html);

    $("article").each(function(i, element){
      var result = {};
      result.image = $(this).children (".item-image").children(".imagewrap").children("a").children("img").attr("src");
      console.log(result.image)
      result.title = $(this).children  (".item-info").children("h2").children("a").text();
      if (result.title != "" && result.title != null) {

        console.log("*********")
        
        result.link = $(this).children(".item-info").children("h2").children("a").attr("href");
        result.summary = $(this).children(".item-info").children("p").text();
        //Checks to see if the article is already in the database, and if it isn't then it adds it
        Article.findOne({title: result.title}, function(err, doc) {
          if (doc == null) {
            var entry = new Article(result);

            entry.save(function(err, doc) {
              if (err) {
                console.log(err);
              }
              else {
                //console.log(doc);
              }
            });
          }
          else {
            console.log('Already in DB');
          }
        });
          
        // });
      }
    });
  });
  res.sendFile(path.join(__dirname, "../public/search.html"));
  // res.send("Scrape Complete");
});


app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});



// delete all articles
app.delete("/articles/deleteAll", function(req, res) {
  // Remove all the articles
  Article.remove( { } ).then(function(err) {
    res.json(err);
  })
  
    
});



}

