
'use strict';
var cheerio = require('cheerio');
var pathFn  = require('path');
var Promise = require('bluebird');
var gs      = require('./imageSize.js');
var lg      = require('./log.js');
var cache   = require('./cache.js');

module.exports = function(post){
  
  var config = this.config;
  
  return new Promise(function(resolve, reject){
    //------------------
    // get eye catch image
    //------------------
    var excludeTest = /^\_posts\//;
    var imgWidth;
    var imgHeight;
    lg.setConfig(config);
    gs.setConfig(config);
    post.eyeCatchImage    = "";
    post.titleImageForAmp = "";
    
    if( excludeTest.test( post.source ) ){
      
      var cachedData = cache.getCache(post , config);
      if(!cachedData){
        
        // If there is the image path of front-matter.
        if(post.ampSettings && post.ampSettings.titleImage && post.ampSettings.titleImage.path){
          var titleImagePath = post.ampSettings.titleImage.path;
          //Local image files
          var relativePathReg = /^\.\//;
          if(relativePathReg.test(titleImagePath) || pathFn.basename(titleImagePath) == titleImagePath){
            titleImagePath = pathFn.join( post.path , titleImagePath );
          }
          resolve([ post , titleImagePath , imgWidth , imgHeight , gs , cache , config , lg ]);
          
        // If there isn't the image path of front-matter.
        }else{
          var $ = cheerio.load(post.content);
          if( $("img") && $("img").length > 0){
            $("img").each(function(i){
              if( i == 0 ){
                var imgsrc = $(this).attr("src");
                  
                post.eyeCatchImage = imgsrc;
                post.titleImageForAmp = imgsrc;
                
                if( $(this).attr("width") ){
                  imgWidth = $(this).attr("width");
                }
                if($(this).attr("height")){
                  imgHeight = $(this).attr("height");
                }else if($(this).attr("data-height")){
                  imgHeight = $(this).attr("data-height");
                }
                
                resolve([ post , imgsrc , imgWidth , imgHeight , gs , cache , config , lg ]);
                
              }
            });
          }else{
            lg.log("warn", "Because image can not be found in article , this plugin use substitute image for schema.org/BlogPosting. If you want to specify an image of schema.org/BlogPosting , include the image in the article or specify the front-matter option." , post.source);
            setSubstituteTitleImage( config , post );
            resolve([post]);
          }
        }
      
      // use cache data
      }else{
        post.eyeCatchImage    = cachedData.eyeCatchImage;
        post.titleImageForAmp = cachedData.titleImageForAmp;
        post.titleImageForAmp = cachedData.eyeCatchImageProperty;
        resolve([post]);
      }
    
    // file don't contain in _posts.
    }else{
      resolve([post]);
    }
    
  })
  .then(getImgSize);
};


function getImgSize(results){
  return new Promise(function(resolve, reject){
    if(results.length == 1)resolve(results[0]);
    
    var externalPathReg = /^[a-zA-Z0-9]*?\:\/\//;
    var post            = results[0];
    var titleImagePath  = results[1];
    var imgWidth        = results[2];
    var imgHeight       = results[3];
    var gs              = results[4];
    var cache           = results[5];
    var config          = results[6];
    var lg              = results[7];
    
    if(externalPathReg.test(titleImagePath)){
      post.eyeCatchImage       = titleImagePath;
      post.titleImageForAmp    = titleImagePath;
    }else{
      post.eyeCatchImage       = pathFn.join( config.root, titleImagePath );
      post.titleImageForAmp    = config.url + pathFn.join( config.root, titleImagePath);
    }
    
    if( !imgWidth || !imgHeight ){
      gs.getSizeInfo( titleImagePath , post , function (res){
        if(res){
          imgWidth                   = res.w;
          imgHeight                  = res.h;
          
          if(isAmpHeightValid( imgWidth , lg , post )){
            post.eyeCatchImageProperty = { "width": res.w , "height": res.h };
          }else{
            setSubstituteTitleImage( config , post );
          }
          
          cache.saveCache_eyeCatchImg( post, config , function(){
            resolve( post );
          });
        }else{
          setSubstituteTitleImage( config , post );
          lg.log("error", "This plugin could not successfully acquire the width and height of the image. This plugin uses the alternate image of schema.org/BlogPosting instead. img path: " + titleImagePath , post.source);
          resolve( post );
        }
      });
    }else{
      
      if(isAmpHeightValid( imgWidth , lg , post )){
        post.eyeCatchImageProperty = { "width": imgWidth , "height": imgHeight };
      }else{
        setSubstituteTitleImage( config , post );
      }
      cache.saveCache_eyeCatchImg( post, config , function(){
        resolve( post );
      });
    }
  });
}



function isAmpHeightValid( inHeight , inLg , inPost ){
  if( Number( inHeight ) < 696 ){
    inLg.log("warn", "The following image should be at least 696 pixels wide. Please see it for more detail: https://developers.google.com/search/docs/data-types/articles#article_types \n img path: " + inPost.eyeCatchImage , inPost.source);
    return false;
  }else{
    return true;
  }
}



function setSubstituteTitleImage(inConfig , inPost){
  var externalPathReg = /^[a-zA-Z0-9]*?\:\/\//;
  if( inConfig.generator_amp && inConfig.generator_amp.substituteTitleImage && inConfig.generator_amp.substituteTitleImage.path && inConfig.generator_amp.substituteTitleImage.width  && inConfig.generator_amp.substituteTitleImage.height ){
    if(externalPathReg.test(inConfig.generator_amp.substituteTitleImage.path)){
      inPost.eyeCatchImage = inConfig.generator_amp.substituteTitleImage.path;
      inPost.titleImageForAmp = inConfig.generator_amp.substituteTitleImage.path;
    }else{
      inPost.eyeCatchImage = inConfig.url + pathFn.join(inConfig.root , inConfig.generator_amp.assetDistDir ,inConfig.generator_amp.substituteTitleImage.path);
      inPost.titleImageForAmp = pathFn.join(inConfig.root , inConfig.generator_amp.assetDistDir ,inConfig.generator_amp.substituteTitleImage.path);
    }
    inPost.eyeCatchImageProperty = { "width": inConfig.generator_amp.substituteTitleImage.width , "height": inConfig.generator_amp.substituteTitleImage.height };
    
  }
}