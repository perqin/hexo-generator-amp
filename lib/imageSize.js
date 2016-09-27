
'use strict';
var fs        = require('fs');
var pathFn    = require('path');
var imgSize   = require('image-size');
var lg        = require('./log.js');
var config;

module.exports.getSizeInfo = function(imgsrc , data){
  
  var imgWidth;
  var imgHeight;
  var imgDevPath = "";

  if(imgsrc.indexOf(data.path) != -1){
    // console.log("画像パス判定(1): "+ "_posts/**/記事.mdと同階層化に画像がある");
    imgDevPath = data.asset_dir + pathFn.basename(imgsrc);
    
  }else{
    // console.log("画像パス判定(2): "+ "source/**/に画像がある");
    imgDevPath = pathFn.join(process.env.PWD , "source/" , imgsrc);
  }
  // console.log("  ファイルパス ->"+ imgDevPath );
  // console.log(" 入力値： " + imgsrc);
  // console.log(" 入力値data.path： " + data.path);
  // console.log(" 入力値data.asset_dir： " + data.asset_dir);
  
  if(fs.existsSync(imgDevPath)){
    //image-size
    var ims = imgSize( imgDevPath );
    // console.log("(image-size) W:" + ims.width+ " H:" + ims.height);
    imgWidth = ims.width;
    imgHeight = ims.height;
  }else{
    lg.log("error", "no such file or directory. img path: "+imgDevPath , data.source);
    return null;
  }

  return {"w":imgWidth, "h":imgHeight};
};

module.exports.setConfig = function(inConfig){
  config = inConfig;
  lg.setConfig(config);
};