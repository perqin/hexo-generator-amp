'use strict';

var assign      = require('object-assign');
var ejs         = require('ejs');
var pathFn      = require('path');
var fs          = require('fs');
var minify      = require('html-minifier').minify;
var cheerio     = require('cheerio');
var gs          = require('./imageSize.js');
var lg          = require('./log.js');
var cache       = require('./cache.js');
var absolutePathReg = /^[a-zA-Z0-9]*?\:\/\//


module.exports = function(locals){
  
  var config          = this.config;
  var ampEjsTmplPath  = "";
  var cssFilePath     = "";
  var template        = "";
  var templateDir     = "";
  var idDecorator     = 0;
  lg.setConfig(config);
  gs.setConfig(config);
  
  //------------------------------------
  // import template file
  //------------------------------------
  var ejsTemplateRelativePath = "sample/" + pathFn.basename(config.generator_amp.defaultAssetsPath.ejs);
  if(config.generator_amp && config.generator_amp.templateFilePath){
    ejsTemplateRelativePath = config.generator_amp.templateFilePath;
  }
  ampEjsTmplPath  = pathFn.join(process.env.PWD , config.generator_amp.templateDir , ejsTemplateRelativePath);
  templateDir     = pathFn.join(process.env.PWD , config.generator_amp.templateDir);
  if(fs.existsSync(ampEjsTmplPath)){
    template        = ejs.compile(fs.readFileSync(ampEjsTmplPath, 'utf8'), {filename: templateDir});
  }else{
    lg.log("error", "Not found the template file. Please check the options." , ampEjsTmplPath);
    return null;
  }
  
  //------------------------------------
  // import CSS file
  //------------------------------------
  cssFilePath = pathFn.join(process.env.PWD , config.generator_amp.templateDir, "sample/" + pathFn.basename(config.generator_amp.defaultAssetsPath.css) );
  if(config.generator_amp && config.generator_amp.cssFilePath){
    cssFilePath = pathFn.join(process.env.PWD , config.generator_amp.templateDir,config.generator_amp.cssFilePath);
  }
  
  var cssTxt = "";
  if(fs.existsSync(cssFilePath)){
    cssTxt    = fs.readFileSync(cssFilePath, 'utf8');
    cssTxt    = cssTxt.replace(/\@charset\s\"(UTF\-8|utf\-8)\"\;/g,"").replace(/\!important/g,"").replace(/((?!\s|\;|\{).)*?zoom\:.*?;/g,"");
  }else{
    lg.log("error", "Not found the css file. Please check the options. " , cssFilePath);
    return null;
  }
  
  //------------------------------------
  // select avator image path
  //------------------------------------
  //authorDetail.avatar.path
  var avatarPath_template;
  if( config.authorDetail && config.authorDetail.avatar && config.authorDetail.avatar.path && config.authorDetail.avatar.width  && config.authorDetail.avatar.height ){
    if(absolutePathReg.test(config.authorDetail.avatar.path)){
      avatarPath_template = config.authorDetail.avatar.path;
    }else{
      avatarPath_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.authorDetail.avatar.path);
    }
  }
  
  //------------------------------------
  // select logo image path
  //------------------------------------
  var logoPath_template;
  var logoPath_for_amp;
  var logoPath_template_width;
  var logoPath_template_height;
  
  //site logo image
  if(config.generator_amp.logo_topImage && config.generator_amp.logo_topImage.path){
    if(config.generator_amp.logo_topImage.width && config.generator_amp.logo_topImage.height){
      if(absolutePathReg.test(config.generator_amp.logo_topImage.path)){
          logoPath_template         = config.generator_amp.logo_topImage.path;
      }else{
        logoPath_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.generator_amp.logo_topImage.path);
      }
      logoPath_template_width   = config.generator_amp.logo_topImage.width;
      logoPath_template_height  = config.generator_amp.logo_topImage.height;
      
    }else{
        lg.log("error", "Please setting the generator_amp.logo_topImage.width and height option." , "_config.yml");
        return null;
    }
  }
  
  //schema.org logo image
  if(absolutePathReg.test(config.generator_amp.logo.path)){
    if(!logoPath_template){
      logoPath_template = config.generator_amp.logo.path;
      logoPath_template_width   = config.generator_amp.logo.width;
      logoPath_template_height  = config.generator_amp.logo.height;
    }
    logoPath_for_amp  = config.generator_amp.logo.path;
  }else{
    if(!logoPath_template){
      logoPath_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.generator_amp.logo.path);
      logoPath_template_width   = config.generator_amp.logo.width;
      logoPath_template_height  = config.generator_amp.logo.height;
    }
    logoPath_for_amp  = config.url + pathFn.join(config.root, config.generator_amp.assetDistDir ,config.generator_amp.logo.path);
  }
  
  
  
  
  
  
  return locals.posts.map(function(post){
    
    var cachedData = cache.getCache(post , config);
    if(!cachedData){
    
    
      // debug
      // console.log("[hexo-generator-amp generator.js] " + data.layout + " " + data.source);
      
      var i                  = 0;
      var replaceStr         = post.content;
      var isYoutubeContain   = false;
      var isVimeoContain     = false;
      var isInstagramContain = false;
      var cssTxt_added       = cssTxt;
      
          
      //------------------------------------
      // escape
      //------------------------------------
      // figure tag
      var figureEscArr = [];
      var figureMatch  = replaceStr.match(/\<figure\s.*?\<\/figure\>/g);
      if(figureMatch){
        for(i=0; i<figureMatch.length; i++){
          replaceStr = replaceStr.replace(figureMatch[i],"<!--figure"+i+"-->");
          figureEscArr.push(figureMatch[i]);
        }
      }

      //------------------------------------
      // Google Adsense
      //------------------------------------

      replaceStr = replaceStr.replace(/\<[^\s\>]*ins[^\S\>]*class="adsbygoogle"[^\S\>]*style="([^"\\]*(?:\\.[^"\\]*)*)"[^\>]*data-ad-client="([^"\\]*(?:\\.[^"\\]*)*)"[^\>]*data-ad-slot="([^"\\]*(?:\\.[^"\\]*)*)"[^\<]*\<\/ins\>/g, function ($1, $2, $3){
        
        var adWidth;
        var adHeight;
        if(arguments[1])
        {
          var matches = /width:([0-9]*)/g.exec(arguments[1]);
          adWidth = matches ? matches[1] : config.generator_amp.substituteGoogle_adsense.width;

          matches = /height:([0-9]*)/g.exec(arguments[1]);
          adHeight = matches ? matches[1] : config.generator_amp.substituteGoogle_adsense.height;
        }
        else
        {
          adWidth = config.generator_amp.substituteGoogle_adsense.width;
          adHeight = config.generator_amp.substituteGoogle_adsense.height;
        }

        var adClient = arguments[2] ? arguments[2] : config.generator_amp.substituteGoogle_adsense.data_ad_client;
        var adSlot = arguments[3] ? arguments[3] : config.generator_amp.substituteGoogle_adsense.data_ad_slot;

        return "<amp-ad width=\"" + adWidth + "\" height=\"" + adHeight + "\" type=\"adsense\" data-ad-client=\"" + adClient + "\" data-ad-slot=\"" + adSlot + "\"></amp-ad>";
      });


      //------------------------------------
      // table's text align
      //------------------------------------
      replaceStr = replaceStr.replace(/\<td\sstyle\=\"text-align\:/g,'<td class="table-align-').replace(/\<th\sstyle\=\"text-align\:/g,'<th class="table-align-');
      
      
      
      
      //------------------------------------
      // figure return
      //------------------------------------
      var figureMatch  = replaceStr.match(/\<\!\-\-figure[0-9]+\-\-\>/g);
      if(figureMatch){
        for(i=0; i<figureMatch.length; i++){
          var figureID = figureMatch[i].match(/[0-9]+/);
          replaceStr = replaceStr.replace( figureMatch[i] , figureEscArr[Number(figureID[0])] );
        }
      }
      
      
      
      
      //------------------------------------
      // img
      //------------------------------------
      var imgSrc;
      var imgWidth;
      var imgHeight;
      var imgMatch  = replaceStr.match(/\<img\s.*?\>/g);
      if(imgMatch){
        for(i=0; i<imgMatch.length; i++){
          
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
                  return null;
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
      }
      
      
      //------------------------------------
      // youtube (1920 x 1080)
      //------------------------------------
      var youtubeMatch  = replaceStr.match(/\<iframe\ssrc\=\"\/\/www\.youtube\.com\/embed\/[0-9a-zA-Z-]+\"\sframeborder\=\"0\"\sallowfullscreen\>\<\/iframe\>/g);
      if(youtubeMatch){
        for(i=0; i<youtubeMatch.length; i++){
          var youtueb_id = youtubeMatch[i].match(/\/embed\/([0-9a-zA-Z-]+)\"/);
          replaceStr     = replaceStr.replace(youtubeMatch[i],'<amp-youtube data-videoid="'+youtueb_id[1]+'" width="1920" height="1080" layout="responsive"></amp-youtube>');
          isYoutubeContain = true;
        }
      }
      
      
      
      //------------------------------------
      // vimeo (1920 x 1080)
      //------------------------------------
      var vimeoMatch  = replaceStr.match(/\<iframe\ssrc\=\"\/\/player\.vimeo\.com\/video\/[0-9a-zA-Z-]+\"\sframeborder\=\"0\"\sallowfullscreen\>\<\/iframe\>/g);
      if(vimeoMatch){
        for(i=0; i<vimeoMatch.length; i++){
          var youtueb_id = vimeoMatch[i].match(/\/video\/([0-9a-zA-Z-]+)\"/);
          replaceStr     = replaceStr.replace(vimeoMatch[i],'<amp-vimeo data-videoid="'+youtueb_id[1]+'" width="1920" height="1080" layout="responsive"></amp-vimeo>');
          isVimeoContain = true;
        }
      }
      
      
      
      //------------------------------------
      // instagram for embed HTML (500 x 500)
      //------------------------------------
      var igMatch  = replaceStr.match(/\<blockquote\s.*?instagram\-media.*?(https\:\/\/www\.instagram\.com\/p\/[0-9a-zA-Z-_]+)\/.*?\<\/blockquote\>/g);
      if(igMatch){
        for(i=0; i<igMatch.length; i++){
          var instagram_shortCode = igMatch[i].match(/https\:\/\/www\.instagram\.com\/p\/([0-9a-zA-Z-_]+)\//);
          if(instagram_shortCode && instagram_shortCode.length >= 2){
            replaceStr     = replaceStr.replace(igMatch[i],'<amp-instagram data-shortcode="' + instagram_shortCode[1] + '" width="500" height="500" layout="responsive"></amp-instagram>');
            isInstagramContain = true;
          }
        }
      }
      
      
      //------------------------------------
      // other iframe
      //------------------------------------
      var ifElseMatch  = replaceStr.match(/\<iframe.*?\>\<\/iframe\>/g);
      if(ifElseMatch){
        for(i=0; i<ifElseMatch.length; i++){
          var iframeSrc = ifElseMatch[i].match(/src\="(.*?)"/);
          if(iframeSrc && iframeSrc.length >= 2){
            replaceStr     = replaceStr.replace(ifElseMatch[i],'<a href="'+ iframeSrc[1] + '" target="_blank">' + iframeSrc[1] + '</a>');
          }
          
        }
      }
      
      
      //------------------------------------
      // video
      //------------------------------------
      var $ = cheerio.load(replaceStr);
      var flg = false;
      $("video").each(function(i){
        
        // I check required attributes in <amp-video> .
        if( !$(this).attr( "width" ) || !$(this).attr("height") || !$(this).attr("poster") ){
          lg.log("warn", "<video> should contain width and height and poster attribute. " , post.source);
        }
        
        // createElement
        var ampVideo = cheerio.load( "<amp-video></amp-video>" );
        // copy attributes
        ampVideo("amp-video").attr( $(this).attr() );
        // move children
        ampVideo("amp-video").append( $(this).contents() );
        // (required attribute) set layout attribute
        ampVideo("amp-video").attr( "layout" , "responsive" );
        // (required attribute) set controls attribute
        if( !ampVideo("amp-video").attr( "autoplay" ) && !ampVideo("amp-video").attr( "controls" ) ){
          ampVideo("amp-video").attr( "controls" , "" );
        }
        
        // replace element
        $(this).replaceWith( ampVideo.html().replace(/\<br\>/g,"") );
        flg = true;
      });
      if(flg){
        replaceStr = $.html();
      }
      
      
      //------------------------------------
      // Sanitize tag
      //------------------------------------
      replaceStr = replaceStr.replace(/\<[\s]*style[^\<]*\<\/[\s]*style[\s]*\>/g, "");
      // replaceStr = replaceStr.replace(/\<[\s]*script[^\<]*\<\/[\s]*script[\s]*\>/g, "");
      replaceStr = replaceStr.replace(/\<[\s]*script[\s\S]*?\<\/[\s]*script[\s]*\>/g, "");

      // Remove style from tags (adding ids and promoting to css)
      replaceStr = replaceStr.replace(/\<\s*([^\s\>]+)((?:[^\>]*\bid[ \t]*="([^"\\]*(?:\\.[^"\\]*)*)"|[^\>]*)[^\>]*)style="([^"\\]*(?:\\.[^"\\]*)*)"((?:[^\>]*\bid[ \t]*="([^"\\]*(?:\\.[^"\\]*)*)"|[^\>]*)[^\>]*\>)/g, function ($1, $2, $3, $4, $5, $6){
        //$1 -> type
        //$2 -> content between type and style (aka id, class, etc.)
        //$3 -> id if on left side of style OR empty
        //$4 -> content of style (you can add this to id OR create a new id for this tag to add to)
        //$5 -> content to end the tag (aka id, class, etc.)
        //$6 -> id if on right side of style OR empty
        var id = (arguments[3] === "") ? arguments[6] : arguments[3];
        var newID = null;
        var idStyle = arguments[4].replace(/\!important/g, "");
        if(id && (typeof id != 'undefined') && id != "")
        {
          //console.log("Found an id");
          cssTxt_added += "#" + id + "{" + idStyle + "}";
        }
        else
        {
          //console.log("Generate a unique qualified id for the amp generator");
          newID = "hexo-amp-id-" + (++idDecorator);
          cssTxt_added += "#" + newID + "{" + idStyle + "}";
        }
        
        //console.log("Style: " + arguments[4]);
        return "<" + arguments[1] + (newID ? " id=\"" + newID + '"' : "") + " " + arguments[2] + " " + arguments[5];
      });

      //delete a tags that contain "javascript:""
      replaceStr = replaceStr.replace(/\<a\s*href\s*=\s*"javascript:[^\>]*\>/g, "");
      
      
      
      // get year
      var nowD = new Date();
      var yy   = nowD.getFullYear();
      
      //datePublished
      var pd    = new Date(post.date);
      var pdStr = pd.getFullYear() + "-"+ (pd.getMonth() + 1) + "-" + pd.getDate()
      var xml   = template({
        config            : config ,
        post              : post ,
        content           : replaceStr ,
        cssTxt            : cssTxt_added ,
        copyrightDate     : yy ,
        datePublished     : pdStr ,
        isYoutubeContain  : isYoutubeContain ,
        isVimeoContain    : isVimeoContain ,
        isInstagramContain: isInstagramContain ,
        avatorPath        : avatarPath_template,
        logoPath          : logoPath_template,
        logoPath_width    : logoPath_template_width,
        logoPath_height   : logoPath_template_height,
        logoPathForAmp    : logoPath_for_amp
        
      });
      
      
      //------------------------------------
      // html minify (option)
      //------------------------------------
      if(typeof config.generator_amp.html_minifier !== "undefined"){
        var minified_option = {
          "caseSensitive"                : false,
          "collapseBooleanAttributes"    : true ,
          "collapseInlineTagWhitespace"  : false,
          "collapseWhitespace"           : true ,
          "conservativeCollapse"         : true ,
          "decodeEntities"               : true,
          "html5"                        : true,
          "includeAutoGeneratedTags"     : false,
          "keepClosingSlash"             : false,
          "minifyCSS"                    : true,
          "minifyJS"                     : true,
          "preserveLineBreaks"           : false,
          "preventAttributesEscaping"    : false,
          "processConditionalComments"   : true,
          "processScripts"               : ["text/html" ,"application/ld+json" ,"application/json"],
          "removeAttributeQuotes"        : true,
          "removeComments"               : true,
          "removeEmptyAttributes"        : true,
          "removeEmptyElements"          : false,
          "removeOptionalTags"           : true,
          "removeRedundantAttributes"    : true,
          "removeScriptTypeAttributes"   : true,
          "removeStyleLinkTypeAttributes": true,
          "removeTagWhitespace"          : true,
          "sortAttributes"               : true,
          "sortClassName"                : true,
          "useShortDoctype"              : true
        };
        
        // orverride html_minifier option
        if( config.generator_amp.html_minifier && typeof config.generator_amp.html_minifier === "object"){
          minified_option = assign({}, minified_option, config.generator_amp.html_minifier);
        }
        var minified_HTML = minify( xml, minified_option);
        xml = minified_HTML;
      }

      cache.saveCache_amp(post, xml , config);

      return {
        path: pathFn.join(post.path , "amp/index.html"),
        data: xml
      };
    
    
    
    }else{
      return {
        path: pathFn.join(post.path , "amp/index.html"),
        data: cachedData.xml
      }
    }
    
    
  });
};