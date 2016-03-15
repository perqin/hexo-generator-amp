
'use strict';

var cheerio = require('cheerio');

module.exports = function(data){
  //debug
  // console.log("\n\n");
  // console.log("[eyec]-> (" + data.layout + ") " + data.permalink);
  // console.log("\n\n");
  
  //------------------
  // get eye catch image
  //------------------
  var imgWidth;
  var imgHeight;
  var $ = cheerio.load(data.content);
  data.eyeCatchImage = "";
  // if(data.layout == "post"){
    
    $("img").each(function(i){
      if(i == 0){
        var imgsrc = $(this).attr("src");
        data.eyeCatchImage = imgsrc;
        
        
        if( $(this).attr("width") ){
          imgWidth = $(this).attr("width");
        }
        if($(this).attr("height")){
          imgHeight = $(this).attr("height");
        }else if($(this).attr("data-height")){
          imgHeight = $(this).attr("data-height");
        }
        
        if(imgHeight && imgWidth){
          data.eyeCatchImageProperty = {"width":imgWidth , "height":imgHeight};
        }
        
      }
    });
    
    if(data.eyeCatchImage == "" || !data.eyeCatchImageProperty){
      console.log("\u001b[31m[hexo-generator-amp] .md should contain image file and width height element. path: "+ "\u001b[0m" +data.source);
    }
    if( Number(imgWidth) < 696 ){
      console.log("\u001b[31m[hexo-generator-amp] Images should be at least 696 pixels wide. path: "+"\u001b[0m"+data.source);
      
      
    }
  // };
  
  return data;
  
};