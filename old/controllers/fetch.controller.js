var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
//download thumbnail
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


exports.fetchVideo = (req, res) => {
request(req.body.scrapeurl, function (error, response, html) {
  const theresult ={};
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const filePath = "/files/cached/"+Math.round(new Date().getTime()/1000)+".jpg"
    theresult.title = $("meta[property='og:title']").attr("content");
    theresult.description = $("meta[property='og:description']").attr("content");
    theresult.image = $("meta[property='og:image']").attr("content");
    download(theresult.image, filePath, function(){
      // TODO save image with lower resolution
      theresult.cachedImage = "https://"+process.env.VIRTUAL_HOST+filePath;
      res.status(200).send(theresult);
    });
  }
});
};
