var axios = require("axios");
var cheerio = require("cheerio");

function scrape (){
axios.get("http://www.nytimes.com").then(function(response){
    //initial cheerio on the page grabbed by axios 
    //boiler plate code
    var $ = cheerio.load(response.data)
    console.log("we are srapping")
    console.log($)
    //array to hold each article 
    var article = []
    //loop through the file we grabbed with axios using the cheerio
    //.each uses iterable item and element argument to grap everything contain with our assetWrapper
    $(".assetWrapper").each(function(h, element){
        var title= $(this).find("h2").text().trim();
        var url = $(this).find("a").attr("href");
        var sum = $(this).find("p").text().trim();
        //build object to push to the database key names should match what is in the db
        var dataObject = {
            headline:title, 
            url:url,
            summary:sum
        }
        //pushing object of article into articles of array 
article.push(dataObject);
    })
    console.log(article);

})

}

scrape()