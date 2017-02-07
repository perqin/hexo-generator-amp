
'use strict';

var Promise          = require('bluebird');
var assign           = require('object-assign');


//------------------------------------
// other iframe
//------------------------------------
module.exports.filter_otherIframe = function(result){
  if(result.tempData.isCacheUse)return Promise.resolve(result);
  return new Promise(function(resolve , reject){
    
    var updateObj;
    var replaceStr = result.post.content;
    var isElseMatch  = replaceStr.match(/\<iframe.*?\>\<\/iframe\>/g);
    if(isElseMatch){
      for(var i=0; i<isElseMatch.length; i++){
        var iframeSrc = isElseMatch[i].match(/src\="(.*?)"/);
        if(iframeSrc && iframeSrc.length >= 2){
          replaceStr     = replaceStr.replace(isElseMatch[i],'<a href="'+ iframeSrc[1] + '" target="_blank">' + iframeSrc[1] + '</a>');
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
      
      // process.stdout.write('[hexo-generator-amp] Plugin is currently replacing iframe now ...           \r');
      
    }else{
      updateObj = result;
    }

    resolve( updateObj );
  });
};
