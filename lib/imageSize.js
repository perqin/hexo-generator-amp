
'use strict';
var fs        = require('fs');
var pathFn    = require('path');
var imgSize   = require('image-size');

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
    console.log("\u001b[31m[hexo-generator-amp] (error) no such file or directory. \n img path: "+"\u001b[0m"+ imgDevPath + "\n ( Please check this the file. : " + data.source +" )");
    return null;
  }

  return {"w":imgWidth, "h":imgHeight};
};