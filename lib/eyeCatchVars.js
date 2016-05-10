
'use strict';
var cheerio = require('cheerio');
var pathFn  = require('path');
var gs      = require('./imageSize.js');

module.exports = function(data){
  
  //------------------
  // get eye catch image
  //------------------
  var excludeTest = /^\_posts\//;
  var absolutePathReg = /^[a-zA-Z0-9]*?\:\/\//
  var imgWidth;
  var imgHeight;
  var isIncompleteProperty = false;
  var config = this.config;
  var $ = cheerio.load(data.content);
  var frontMatterImg = false;
  data.eyeCatchImage = "";
  data.titleImageForAmp = "";
  
  if( excludeTest.test( data.source ) ){
    
    
    // front-matter custom schema.org Image    
    if(data.ampSettings && data.ampSettings.titleImage && data.ampSettings.titleImage.path){
      var titleImagePath = data.ampSettings.titleImage.path;
      
      if(absolutePathReg.test(titleImagePath)){
        //External image file
        if(data.ampSettings.titleImage.width && data.ampSettings.titleImage.height){
          data.eyeCatchImage         = titleImagePath;
          data.titleImageForAmp      = titleImagePath;
          imgWidth                   = data.ampSettings.titleImage.width;
          imgHeight                  = data.ampSettings.titleImage.height;
          data.eyeCatchImageProperty = { "width":imgWidth , "height":imgHeight };
          frontMatterImg             = true;
        }else{
          console.log("\u001b[31m[hexo-generator-amp] (error) Please setting ampSettings.titleImage.width and height option. Check this the file. : "+"\u001b[0m"+data.source );
        }
      }else{
        //Local image files
        var relativePathReg = /^\.\//;
        
        if(relativePathReg.test(titleImagePath) || pathFn.basename(titleImagePath) == titleImagePath){
          titleImagePath = pathFn.join( data.path , titleImagePath );
        }
        
        // data.asset_dir
        var gsSizeInfo = gs.getSizeInfo(titleImagePath , data);
        if(gsSizeInfo){
          data.eyeCatchImage         = pathFn.join(config.root, titleImagePath);
          data.titleImageForAmp      = pathFn.join(config.url , config.root, titleImagePath);
          imgWidth                   = gsSizeInfo.w;
          imgHeight                  = gsSizeInfo.h;
          data.eyeCatchImageProperty = { "width":imgWidth , "height":imgHeight };
          frontMatterImg             = true;
        }
      }
    }
  
  
  
    // debug
    // console.log("[hexo-generator-amp eyeCatchVars.js] " + data.layout + " " + data.source);
    if(!frontMatterImg){
      $("img").each(function(i){
        if(i == 0){
          var imgsrc = $(this).attr("src");
          
          if(absolutePathReg.test(imgsrc)){
            //External image file
            data.eyeCatchImage = imgsrc;
            data.titleImageForAmp = imgsrc;
            
            if( $(this).attr("width") ){
              imgWidth = $(this).attr("width");
            }
            if($(this).attr("height")){
              imgHeight = $(this).attr("height");
            }else if($(this).attr("data-height")){
              imgHeight = $(this).attr("data-height");
            }
          }else{
            //Local image files
            data.eyeCatchImage = pathFn.join(config.root , imgsrc);
            data.titleImageForAmp = pathFn.join(config.url , config.root , imgsrc);
            
            if( $(this).attr("width") ){
              imgWidth = $(this).attr("width");
            }
            if($(this).attr("height")){
              imgHeight = $(this).attr("height");
            }else if($(this).attr("data-height")){
              imgHeight = $(this).attr("data-height");
            }
            
            //get image size
            if(!imgWidth || !imgHeight){
              var gsSizeInfo = gs.getSizeInfo(imgsrc , data);
              if(gsSizeInfo){
                imgWidth = gsSizeInfo.w;
                imgHeight = gsSizeInfo.h;
              }
              
            }
          }
          
          if(imgHeight && imgWidth){
            data.eyeCatchImageProperty = { "width":imgWidth , "height":imgHeight };
          }
          
        }
      });
      
      
      if(data.eyeCatchImage == "" || !data.eyeCatchImageProperty){
        // if(config.generator_amp.warningLog)console.log("\u001b[33m[hexo-generator-amp] (warning) .md should contain image file and width height element. path: "+ "\u001b[0m" +data.source);
        isIncompleteProperty = true;
      }else{
        if( Number(imgWidth) < 696 ){
          if(config.generator_amp.warningLog)console.log("\u001b[33m[hexo-generator-amp] (warning) Images should be at least 696 pixels wide. \n img path: \u001b[0m"+data.eyeCatchImage+"\n ( Please check this the file. : "+data.source + " )");
          isIncompleteProperty = true;
        }
      }
    }
    
    if(isIncompleteProperty){
      if( config.generator_amp && config.generator_amp.substituteTitleImage && config.generator_amp.substituteTitleImage.path && config.generator_amp.substituteTitleImage.width  && config.generator_amp.substituteTitleImage.height ){
        if(absolutePathReg.test(config.generator_amp.substituteTitleImage.path)){
          data.eyeCatchImage = config.generator_amp.substituteTitleImage.path;
          data.titleImageForAmp = config.generator_amp.substituteTitleImage.path;
        }else{
          data.eyeCatchImage = pathFn.join(config.url , config.root , config.generator_amp.assetDistDir ,config.generator_amp.substituteTitleImage.path);
          data.titleImageForAmp = pathFn.join(config.root , config.generator_amp.assetDistDir ,config.generator_amp.substituteTitleImage.path);
        }
        data.eyeCatchImageProperty = { "width": config.generator_amp.substituteTitleImage.width , "height": config.generator_amp.substituteTitleImage.height };
        
      }
    }
  }
  
  return data;
  
};