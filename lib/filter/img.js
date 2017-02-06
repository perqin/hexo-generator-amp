
'use strict';

var Promise          = require('bluebird');
var assign           = require('object-assign');
var gs               = require('../imageSize.js');
var lg               = require('../log.js');

//------------------------------------
// <img> to <amp-img>
//------------------------------------
module.exports.filter_img = function(result){

  if(result.tempData.isCacheUse)return Promise.resolve(result);
  
  lg.setConfig(result.config);
  gs.setConfig(result.config);
  
  return new Promise(function(resolve , reject){
    
    var updateObj;
    var absolutePathReg = /^[a-zA-Z0-9]*?\:\/\//;
    var replaceStr      = result.post.content;
    var post            = result.post;
    var imgMatch        = replaceStr.match(/\<img\s.*?\>/g);
    var imgSrc;
    var imgWidth;
    var imgHeight;
    
    if(imgMatch){
      for(var i=0; i<imgMatch.length; i++){
        
        imgSrc    = "";
        imgWidth  = "";
        imgHeight = "";
        
        var imgDataMatch = imgMatch[i].match(/data\-original\=\".*?\"/g);
        if(imgDataMatch && imgDataMatch.length > 0){
          imgSrc = imgDataMatch[0].replace("data-original=","src=");
        }else{
          imgDataMatch = imgMatch[i].match(/src\=\".*?\"/g);
          if(imgDataMatch){
            imgSrc = imgDataMatch[0];
          }
        }
        
        imgDataMatch = imgMatch[i].match(/width\=\".*?\"/g);
        if(imgDataMatch){
          imgWidth = imgDataMatch[0];
        }
        
        imgDataMatch = imgMatch[i].match(/(height|data\-height)\=\".*?\"/g);
        if(imgDataMatch){
          imgHeight = imgDataMatch[0].replace("data-height","height");
        }
        
        if(imgSrc == "" || imgSrc =='src=""'){
          lg.log("error", "<img> should contain image src attribute." , post.source);
        }else{
          if(imgWidth == "" || imgHeight == ""){
            var imgPath = imgSrc.replace(/^src\=\"/,"").replace(/\"$/,"");
            if(absolutePathReg.test(imgPath)){
              //External image file
              lg.log("warn", "<img> should contain image file and width height attribute. img path: "+imgPath , post.source);
            }else{
              //Local image files
              var gsSizeInfo = gs.getSizeInfo(imgPath , post);
              if(gsSizeInfo){
                imgWidth = 'width="' + gsSizeInfo.w + '"';
                imgHeight = 'height="' + gsSizeInfo.h + '"';
              }else{
                reject();
              }
              
            }
          }
        }
        
        // console.log("imgSrc:"+imgSrc + "  imgWidth:"+imgWidth + "  imgHeight:"+imgHeight);
        if(imgSrc != "" && imgWidth != "" && imgHeight != ""){
          replaceStr = replaceStr.replace(imgMatch[i], '<p><amp-img '+ imgSrc +' '+ imgWidth +' '+ imgHeight +' layout="responsive"></amp-img></p>');
        }else{
          //coment out img
          replaceStr = replaceStr.replace(imgMatch[i], "<!-- This img tag couldn't replace. : "+ imgMatch[i] +"-->");
        }
        
      }
      
      updateObj = assign(
        result ,
        {
          post : assign(
            result.post ,
            {
              content : replaceStr
            }
          )
        }
      );
      
      process.stdout.write('[hexo-generator-amp] Plugin is currently replacing <img> now ...           \r');
      
    }else{
      updateObj = result;
    }
    
    resolve(result);
  });
};