
'use strict';

var Promise          = require('bluebird');
var assign           = require('object-assign');

//------------------------------------
// google Adsense to <amp-ad>
//------------------------------------
module.exports.filter_googleAdsense = function(result){
  if(result.tempData.isCacheUse)return Promise.resolve(result);
  return new Promise(function(resolve , reject){
    
    var replaceStr  = result.post.content;
    var config      = result.config;
    
    replaceStr = replaceStr.replace(/\<[^\s\>]*ins[^\S\>]*class="adsbygoogle"[^\S\>]*style="([^"\\]*(?:\\.[^"\\]*)*)"[^\>]*data-ad-client="([^"\\]*(?:\\.[^"\\]*)*)"[^\>]*data-ad-slot="([^"\\]*(?:\\.[^"\\]*)*)"[^\<]*\<\/ins\>/g, function ($1, $2, $3){
      
      var adWidth;
      var adHeight;
      if(arguments[1]){
        var matches = /width:([0-9]*)/g.exec(arguments[1]);
        adWidth     = matches ? matches[1] : config.generator_amp.substituteGoogle_adsense.width;

        matches  = /height:([0-9]*)/g.exec(arguments[1]);
        adHeight = matches ? matches[1] : config.generator_amp.substituteGoogle_adsense.height;
      }else{
        adWidth  = config.generator_amp.substituteGoogle_adsense.width;
        adHeight = config.generator_amp.substituteGoogle_adsense.height;
      }

      var adClient = arguments[2] ? arguments[2] : config.generator_amp.substituteGoogle_adsense.data_ad_client;
      var adSlot   = arguments[3] ? arguments[3] : config.generator_amp.substituteGoogle_adsense.data_ad_slot;

      return "<amp-ad width=\"" + adWidth + "\" height=\"" + adHeight + "\" type=\"adsense\" data-ad-client=\"" + adClient + "\" data-ad-slot=\"" + adSlot + "\"></amp-ad>";
    });
    
    var updateObj = assign(
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
    
    // process.stdout.write('[hexo-generator-amp] Plugin is currently replacing Google Ad ...           \r');
    
    resolve(result);
    
  });
};