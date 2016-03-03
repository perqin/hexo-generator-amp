'use strict';

var ejs        = require('ejs');
var pathFn     = require('path');
var fs         = require('fs');
var ampTmplSrc = pathFn.join(__dirname, '../amp.ejs');
var template   = ejs.compile(fs.readFileSync(ampTmplSrc, 'utf8'), {filename:__dirname});

module.exports = function(locals){
  
  var config = this.config;
  var cssTxt = "";
  
  if(config.generator_amp && config.generator_amp.cssFilePath){
    var cssFilePath = pathFn.join(process.env.PWD ,config.generator_amp.cssFilePath);
    var cssTxt      = fs.readFileSync(cssFilePath, 'utf8');
    cssTxt          = cssTxt.replace(/\@charset\s\"(UTF\-8|utf\-8)\"\;/g,"").replace(/\!important/g,"").replace(/((?!\s|\;|\{).)*?zoom\:.*?;/g,"");
  }
  return locals.posts.map(function(post){
    
    var replaceStr = post.content;
    
    replaceStr = replaceStr.replace(/\<style\>.*?\<\/style\>/g, "");
    replaceStr = replaceStr.replace(/\<script\>.*?\<\/script\>/g, "");
    replaceStr = replaceStr.replace(/\<div\s.*?\>/g, "");
    replaceStr = replaceStr.replace(/\<\/div\>/g, "");
    replaceStr = replaceStr.replace(/\<span\s.*?\>/g, "");
    replaceStr = replaceStr.replace(/\<\/span\>/g, "");
    
    //delete a tag
    replaceStr = replaceStr.replace(/\<a\s((?!>).)*?\>\<\/a\>/g, "");
    
    //img
    var imgSrc    = "";
    var imgWidth  = "";
    var imgHeight = "";
    var imgMatch  = replaceStr.match(/\<img\s.*?\>/g);
    if(imgMatch){
      for(var i=0; i<imgMatch.length; i++){
        
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
        
        replaceStr = replaceStr.replace(imgMatch[i], '<p><amp-img '+ imgSrc +' '+ imgWidth +' '+ imgHeight +' layout="responsive"></amp-img></p>');
        
      }
    }
    
    // get year
    var nowD = new Date();
    var yy = nowD.getFullYear();
    
    //datePublished
    var pd = new Date(post.date);
    var pdStr = pd.getFullYear() + "-"+ (pd.getMonth() + 1) + "-" + pd.getDate()
    
    var xml = template({
      config       : config,
      post         : post ,
      content      : replaceStr,
      cssTxt       : cssTxt,
      copyrightDate: yy,
      datePublished: pdStr
    });
    
    return {
      path: post.path+"index.amp.html",
      data: xml
    };
  });
};