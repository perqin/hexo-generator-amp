
'use strict';
var fs              = require('fs');
var pathFn          = require('path');
var url             = require('url');
var http            = require('http');
var https           = require('https');
var imgSize         = require('image-size');
var lg              = require('./log.js');
var externalPathReg = /^[a-zA-Z0-9]*?\:\/\//;
var config;


module.exports.getSizeInfo = function(imgsrc , data , callback){
  
  var imgWidth;
  var imgHeight;
  var imgDevPath = "";

  if(!externalPathReg.test(imgsrc)){
    // Local image
    if(imgsrc.indexOf(data.path) != -1){
      // console.log("画像パス判定(1): "+ "_posts/**/記事.mdと同階層化に画像がある");
      imgDevPath = pathFn.join(data.asset_dir , pathFn.basename(imgsrc) );
    }else{
      // console.log("画像パス判定(2): "+ "source/**/に画像がある");
      imgDevPath = pathFn.join(process.env.PWD || process.cwd() , "source/" , imgsrc);
    }
    // console.log("  ファイルパス ->"+ imgDevPath );
    // console.log(" 入力値： " + imgsrc);
    // console.log(" 入力値data.path： " + data.path);
    // console.log(" 入力値data.asset_dir： " + data.asset_dir);
  }else{
    // External image
    imgDevPath = imgsrc;
  }
  
  
  if(!externalPathReg.test(imgsrc)){
    // Local image
    if(fs.existsSync(imgDevPath)){
      var ims = imgSize( imgDevPath );
      imgWidth  = ims.width;
      imgHeight = ims.height;
      callback( {"w":imgWidth, "h":imgHeight} );
    }else{
      lg.log("error", "no such file or directory. img path: "+imgDevPath , data.source);
      callback( null );
    }
  }else{
    // external image
    var options = url.parse(imgDevPath);
    if(imgDevPath.match(/^https\:/)){
      https.get(options, function (response) {
        var chunks = [];
        response.on('data', function (chunk) {
          chunks.push(chunk);
        }).on('end', function() {
          getExternalImageSize( chunks, callback , lg , imgDevPath , data );
          // chunks = null;
        });
      });
    }else if(imgDevPath.match(/^http\:/)){
      http.get(options, function (response) {
        var chunks = [];
        response.on('data', function (chunk) {
          chunks.push(chunk);
        }).on('end', function() {
          getExternalImageSize( chunks, callback , lg , imgDevPath , data );
          // chunks = null;
        });
      });
    }else{
      lg.log("error", "This plugin can not acquire the width and height of such url images. Please change the URL to HTTP or HTTPS, or add height and width. \nimg path: "+imgDevPath , data.source);
      callback( null );
    }
  }
};

module.exports.setConfig = function(inConfig){
  config = inConfig;
  lg.setConfig(config);
};

function getExternalImageSize( chunks, callback , inLg , imgDevPath , post ){
  var buffer = Buffer.concat(chunks);
  var ims;
  try{
    ims = imgSize(buffer);
    callback( {"w":ims.width, "h":ims.height} );
  }catch(e){
    inLg.log("error", e + "\n This plugin gets width and height by accessing the external image. However, the plugin could not access the external image. Please confirm that the image URL is correct. Or, add the width and height to the post. : "+imgDevPath , post.source);
    callback( null );
  }
  // buffer = null;
}