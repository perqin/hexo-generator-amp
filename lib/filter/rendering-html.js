
'use strict';

var Promise          = require('bluebird');
var assign           = require('object-assign');
var moment           = require('moment');

//------------------------------------
// rendering HTML
//------------------------------------
module.exports.rendering_html = function(result){
  if(result.tempData.isCacheUse)return Promise.resolve(result);
  return new Promise(function(resolve , reject){
    
    // get year
    var yy = moment().format("YYYY");
    
    //datePublished - Formatting using formats in Hexo config
    var dateFormat = "YYYY-MM-DD";
    if(result.config.date_format) {
      dateFormat = result.config.date_format;
    }
    var pdStr = moment( Number(result.post.date) ).format(dateFormat);
    
    var htmlData   = result.tempData.template({
      config             : result.config ,
      post               : result.post ,
      content            : result.data ,
      cssTxt             : result.tempData.cssTxt ,
      copyrightDate      : yy ,
      datePublished      : pdStr ,
      isYoutubeContain   : result.tempData.isYoutubeContain ,
      isVimeoContain     : result.tempData.isVimeoContain ,
      isVideoContain     : result.tempData.isVideoContain ,
      isInstagramContain : result.tempData.isInstagramContain ,
      isTwitterContain   : result.tempData.isTwitterContain ,
      isSoundCloudContain: result.tempData.isSoundCloudContain ,
      isIframeContain    : result.tempData.isIframeContain ,
      avatarPath         : result.tempData.avatarPath_template ,
      logoPath           : result.tempData.logoPath_template ,
      logoPath_width     : result.tempData.logoPath_template_width ,
      logoPath_height    : result.tempData.logoPath_template_height ,
      logoPathForAmp     : result.tempData.logoPath_for_amp
    });

    var updateObj = assign(
      result ,
      {
        data : htmlData
      }
    );
    
    // process.stdout.write('[hexo-generator-amp] Plugin is currently rendering html now ...           \r');
    
    resolve( updateObj );
  });
};

