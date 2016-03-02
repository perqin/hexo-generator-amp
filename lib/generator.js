'use strict';

/*

themes/your-theme/layout/_partial/head.ejs

  <% if (is_post() && config.generator_amp){ %>
    <link rel="amphtml" href="./index.amp.html">
  <% } %>

*/

var ejs    = require('ejs');
var pathFn = require('path');
var fs     = require('fs');

//generatorの練習
var ampTmplSrc = pathFn.join(__dirname, '../amp.ejs');
var template   = ejs.compile(fs.readFileSync(ampTmplSrc, 'utf8'), {filename:__dirname});
console.log(__dirname);

// var debug = 0;

module.exports = function(locals){
  
  var config = this.config;
  
  //記事の数だけ ampファイルの生成
  return locals.posts.map(function(post){
    
    // if(debug == 0){
    //   console.log("\n\n\n");
    //   console.log(post);
    //   console.log("\n\n\n");
    //   debug++;
    // }
    
    var replaceStr = post.content;
    
    replaceStr = replaceStr.replace(/\<style\>.*?\<\/style\>/g, "");
    replaceStr = replaceStr.replace(/\<script\>.*?\<\/script\>/g, "");
    replaceStr = replaceStr.replace(/\<div\s.*?\>/g, "");
    replaceStr = replaceStr.replace(/\<\/div\>/g, "");
    replaceStr = replaceStr.replace(/\<span\s.*?\>/g, "");
    replaceStr = replaceStr.replace(/\<\/span\>/g, "");
    
    
    
    //ボタンなどの<a>タグを削除
    replaceStr = replaceStr.replace(/\<a\s((?!>).)*?\>\<\/a\>/g, "");
    
    //imgの抽出と更に諸属性の抽出
    var imgMatch = "";
    var imgSrc = "";
    var imgWidth = "";
    var imgHeight = "";
    imgMatch = replaceStr.match(/\<img\s.*?\>/g);
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
        
        replaceStr = replaceStr.replace(imgMatch[i], '<p><amp-img '+ imgSrc +' '+ imgWidth +' '+ imgHeight +' layout="responsive"></p>');
        
      }
    }
    
    // replaceStr = replaceStr.replace(/<.*?>/g,"");
    
    
    var xml = template({
      config: config,
      post: post ,
      content: replaceStr
    });

    return {
      path: post.path+"index.amp.html",
      data: xml
    };
  });
};


/*

     { title: '写真ブログを立ててみました',
  date: 
   { _isAMomentObject: true,
     _i: Mon Nov 16 2015 22:54:46 GMT+0900 (JST),
     _isUTC: false,
     _locale: 
      { _ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: [Function],
        _abbr: 'en',
        _ordinalParseLenient: /\d{1,2}(th|st|nd|rd)|\d{1,2}/ },
     _d: Mon Nov 16 2015 22:54:46 GMT+0900 (JST),
     _z: null,
     _pf: 
      { empty: false,
        unusedTokens: [],
        unusedInput: [],
        overflow: -2,
        charsLeftOver: 0,
        nullInput: false,
        invalidMonth: null,
        invalidFormat: false,
        userInvalidated: false,
        iso: false },
     _isValid: true },
  description: 'WordpressからHexoに移行しました。写真展や撮影で名刺とポートフォリオサイトのURLを渡す機会が増えてきました。昔はWordpressでブログを書いていましたが、結局動作がモッサリだったせいで放置気味になってしまいました。ブログはサクサク動く方が絶対いい！そんな事を思いながら何もせず数年が経ってしまいました。',
  _content: '\n{% flickr photo gallery-cool 22700410789 b %}\n\n## 新たに…\n\nWordpressからHexoに移行してブログを立ててみました。自分の写真事情も5年間で大分変わってきたようです。写真展や撮影イベントで名刺とポートフォリオサイトのURLを渡す機会が増えてきました。写真を始めて間もない頃はWordpressでブログを書いていましたが、動作がモッサリだったせいで放置気味になってしまいました。まずログインが面倒なんですよね(←おい)。ブログはサクサク動く環境が絶対いい！そんな事を思いながら何もせず数年が経ってしまいましたが、ようやく求めていた環境と出会えたのでブログを立ち上げ直してみたいと思います。\n\n<!-- more -->\n\n## ポートフォリオサイト設置\n\nまずは名刺に載せる[プロフィールサイト](/profile/index.html)を作ってみました。一先ずこれで各SNSへの紹介はできるようになりました。今の時代、本当に便利なものが沢山あってオリジナルサイトが簡単に無料で作れちゃいます。嬉しいような恐ろしいような(笑) 後は写真をどう見せるかを考え中なんですが、これから投稿する記事の写真をHexoから収集させて[まとめて見せる](/gallery-archive/vivid/)ような形で簡単なポートフォリオとしてみたいと想います。\n\nということで、これからブログのカスタマイズも含めてちょくちょく更新してみたいと想いますので、よろしれけばお付き合いください(^ ^)\n',
  source: '_posts/15/11-new-post.md',
  raw: 'title: 写真ブログを立ててみました\npermalink: p/newpost\ndate: 2015-11-16 22:54:46\ntags:\n  - Hexo\n  - 写真\n  - 人物（ポートレート）\n  - D600\n  - Sigma35mmF1.4\n  - Lightroomのプリセット（クール）\ncategories:\n  - 日記\ndescription: WordpressからHexoに移行しました。写真展や撮影で名刺とポートフォリオサイトのURLを渡す機会が増えてきました。昔はWordpressでブログを書いていましたが、結局動作がモッサリだったせいで放置気味になってしまいました。ブログはサクサク動く方が絶対いい！そんな事を思いながら何もせず数年が経ってしまいました。\n---\n\n{% flickr photo gallery-cool 22700410789 b %}\n\n## 新たに…\n\nWordpressからHexoに移行してブログを立ててみました。自分の写真事情も5年間で大分変わってきたようです。写真展や撮影イベントで名刺とポートフォリオサイトのURLを渡す機会が増えてきました。写真を始めて間もない頃はWordpressでブログを書いていましたが、動作がモッサリだったせいで放置気味になってしまいました。まずログインが面倒なんですよね(←おい)。ブログはサクサク動く環境が絶対いい！そんな事を思いながら何もせず数年が経ってしまいましたが、ようやく求めていた環境と出会えたのでブログを立ち上げ直してみたいと思います。\n\n<!-- more -->\n\n## ポートフォリオサイト設置\n\nまずは名刺に載せる[プロフィールサイト](/profile/index.html)を作ってみました。一先ずこれで各SNSへの紹介はできるようになりました。今の時代、本当に便利なものが沢山あってオリジナルサイトが簡単に無料で作れちゃいます。嬉しいような恐ろしいような(笑) 後は写真をどう見せるかを考え中なんですが、これから投稿する記事の写真をHexoから収集させて[まとめて見せる](/gallery-archive/vivid/)ような形で簡単なポートフォリオとしてみたいと想います。\n\nということで、これからブログのカスタマイズも含めてちょくちょく更新してみたいと想いますので、よろしれけばお付き合いください(^ ^)\n',
  slug: 'p/newpost',
  published: true,
  updated: 
   { _isAMomentObject: true,
     _i: Mon Feb 22 2016 11:49:25 GMT+0900 (JST),
     _isUTC: false,
     _locale: 
      { _ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: [Function],
        _abbr: 'en',
        _ordinalParseLenient: /\d{1,2}(th|st|nd|rd)|\d{1,2}/ },
     _d: Mon Feb 22 2016 11:49:25 GMT+0900 (JST),
     _z: null },
  comments: true,
  layout: 'post',
  photos: [],
  link: '',
  _id: 'cil3gwx8e00004m1k6zzv0ykh',
  postImagaeCategory: 'cool',
  eyeCatchImage: 'https://farm6.staticflickr.com/5669/22700410789_dbdb93c44f_b.jpg',
  content: '<div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img src="https://farm6.staticflickr.com/5669/22700410789_dbdb93c44f_b.jpg" width="1024" class="photo gallery-cool" alt="develop or drink ?" data-height="732" data-share="https%3A%2F%2Fwww.flickr.com%2Fphotos%2Fmasakazu-tea%2F22700410789" data-share-title="develop%20or%20drink%20%3F"><span class="imgIconBlock"><a class="imgShare" data-share="https%3A%2F%2Fwww.flickr.com%2Fphotos%2Fmasakazu-tea%2F22700410789" data-share-title="develop%20or%20drink%20%3F" onclick="javascript:void(0);"><span class="imgShare-iconSet shareIconP imgShareIcon"></span></a></span></div><div class="imgCaption"><span class="imgcap">develop or drink ?</span><span class="photoby">&#xA0;&#xA0;photo&#xA0;by&#xA0;tea&#xA0;&#xA9;</span></div> <h2 id="&#x65B0;&#x305F;&#x306B;">&#x65B0;&#x305F;&#x306B;&#x2026;</h2><p>Wordpress&#x304B;&#x3089;Hexo&#x306B;&#x79FB;&#x884C;&#x3057;&#x3066;&#x30D6;&#x30ED;&#x30B0;&#x3092;&#x7ACB;&#x3066;&#x3066;&#x307F;&#x307E;&#x3057;&#x305F;&#x3002;&#x81EA;&#x5206;&#x306E;&#x5199;&#x771F;&#x4E8B;&#x60C5;&#x3082;5&#x5E74;&#x9593;&#x3067;&#x5927;&#x5206;&#x5909;&#x308F;&#x3063;&#x3066;&#x304D;&#x305F;&#x3088;&#x3046;&#x3067;&#x3059;&#x3002;&#x5199;&#x771F;&#x5C55;&#x3084;&#x64AE;&#x5F71;&#x30A4;&#x30D9;&#x30F3;&#x30C8;&#x3067;&#x540D;&#x523A;&#x3068;&#x30DD;&#x30FC;&#x30C8;&#x30D5;&#x30A9;&#x30EA;&#x30AA;&#x30B5;&#x30A4;&#x30C8;&#x306E;URL&#x3092;&#x6E21;&#x3059;&#x6A5F;&#x4F1A;&#x304C;&#x5897;&#x3048;&#x3066;&#x304D;&#x307E;&#x3057;&#x305F;&#x3002;&#x5199;&#x771F;&#x3092;&#x59CB;&#x3081;&#x3066;&#x9593;&#x3082;&#x306A;&#x3044;&#x9803;&#x306F;Wordpress&#x3067;&#x30D6;&#x30ED;&#x30B0;&#x3092;&#x66F8;&#x3044;&#x3066;&#x3044;&#x307E;&#x3057;&#x305F;&#x304C;&#x3001;&#x52D5;&#x4F5C;&#x304C;&#x30E2;&#x30C3;&#x30B5;&#x30EA;&#x3060;&#x3063;&#x305F;&#x305B;&#x3044;&#x3067;&#x653E;&#x7F6E;&#x6C17;&#x5473;&#x306B;&#x306A;&#x3063;&#x3066;&#x3057;&#x307E;&#x3044;&#x307E;&#x3057;&#x305F;&#x3002;&#x307E;&#x305A;&#x30ED;&#x30B0;&#x30A4;&#x30F3;&#x304C;&#x9762;&#x5012;&#x306A;&#x3093;&#x3067;&#x3059;&#x3088;&#x306D;(&#x2190;&#x304A;&#x3044;)&#x3002;&#x30D6;&#x30ED;&#x30B0;&#x306F;&#x30B5;&#x30AF;&#x30B5;&#x30AF;&#x52D5;&#x304F;&#x74B0;&#x5883;&#x304C;&#x7D76;&#x5BFE;&#x3044;&#x3044;&#xFF01;&#x305D;&#x3093;&#x306A;&#x4E8B;&#x3092;&#x601D;&#x3044;&#x306A;&#x304C;&#x3089;&#x4F55;&#x3082;&#x305B;&#x305A;&#x6570;&#x5E74;&#x304C;&#x7D4C;&#x3063;&#x3066;&#x3057;&#x307E;&#x3044;&#x307E;&#x3057;&#x305F;&#x304C;&#x3001;&#x3088;&#x3046;&#x3084;&#x304F;&#x6C42;&#x3081;&#x3066;&#x3044;&#x305F;&#x74B0;&#x5883;&#x3068;&#x51FA;&#x4F1A;&#x3048;&#x305F;&#x306E;&#x3067;&#x30D6;&#x30ED;&#x30B0;&#x3092;&#x7ACB;&#x3061;&#x4E0A;&#x3052;&#x76F4;&#x3057;&#x3066;&#x307F;&#x305F;&#x3044;&#x3068;&#x601D;&#x3044;&#x307E;&#x3059;&#x3002;</p>  <h2 id="&#x30DD;&#x30FC;&#x30C8;&#x30D5;&#x30A9;&#x30EA;&#x30AA;&#x30B5;&#x30A4;&#x30C8;&#x8A2D;&#x7F6E;">&#x30DD;&#x30FC;&#x30C8;&#x30D5;&#x30A9;&#x30EA;&#x30AA;&#x30B5;&#x30A4;&#x30C8;&#x8A2D;&#x7F6E;</h2><p>&#x307E;&#x305A;&#x306F;&#x540D;&#x523A;&#x306B;&#x8F09;&#x305B;&#x308B;<a href="/profile/index.html">&#x30D7;&#x30ED;&#x30D5;&#x30A3;&#x30FC;&#x30EB;&#x30B5;&#x30A4;&#x30C8;</a>&#x3092;&#x4F5C;&#x3063;&#x3066;&#x307F;&#x307E;&#x3057;&#x305F;&#x3002;&#x4E00;&#x5148;&#x305A;&#x3053;&#x308C;&#x3067;&#x5404;SNS&#x3078;&#x306E;&#x7D39;&#x4ECB;&#x306F;&#x3067;&#x304D;&#x308B;&#x3088;&#x3046;&#x306B;&#x306A;&#x308A;&#x307E;&#x3057;&#x305F;&#x3002;&#x4ECA;&#x306E;&#x6642;&#x4EE3;&#x3001;&#x672C;&#x5F53;&#x306B;&#x4FBF;&#x5229;&#x306A;&#x3082;&#x306E;&#x304C;&#x6CA2;&#x5C71;&#x3042;&#x3063;&#x3066;&#x30AA;&#x30EA;&#x30B8;&#x30CA;&#x30EB;&#x30B5;&#x30A4;&#x30C8;&#x304C;&#x7C21;&#x5358;&#x306B;&#x7121;&#x6599;&#x3067;&#x4F5C;&#x308C;&#x3061;&#x3083;&#x3044;&#x307E;&#x3059;&#x3002;&#x5B09;&#x3057;&#x3044;&#x3088;&#x3046;&#x306A;&#x6050;&#x308D;&#x3057;&#x3044;&#x3088;&#x3046;&#x306A;(&#x7B11;) &#x5F8C;&#x306F;&#x5199;&#x771F;&#x3092;&#x3069;&#x3046;&#x898B;&#x305B;&#x308B;&#x304B;&#x3092;&#x8003;&#x3048;&#x4E2D;&#x306A;&#x3093;&#x3067;&#x3059;&#x304C;&#x3001;&#x3053;&#x308C;&#x304B;&#x3089;&#x6295;&#x7A3F;&#x3059;&#x308B;&#x8A18;&#x4E8B;&#x306E;&#x5199;&#x771F;&#x3092;Hexo&#x304B;&#x3089;&#x53CE;&#x96C6;&#x3055;&#x305B;&#x3066;<a href="/gallery-archive/vivid/">&#x307E;&#x3068;&#x3081;&#x3066;&#x898B;&#x305B;&#x308B;</a>&#x3088;&#x3046;&#x306A;&#x5F62;&#x3067;&#x7C21;&#x5358;&#x306A;&#x30DD;&#x30FC;&#x30C8;&#x30D5;&#x30A9;&#x30EA;&#x30AA;&#x3068;&#x3057;&#x3066;&#x307F;&#x305F;&#x3044;&#x3068;&#x60F3;&#x3044;&#x307E;&#x3059;&#x3002;</p> <p>&#x3068;&#x3044;&#x3046;&#x3053;&#x3068;&#x3067;&#x3001;&#x3053;&#x308C;&#x304B;&#x3089;&#x30D6;&#x30ED;&#x30B0;&#x306E;&#x30AB;&#x30B9;&#x30BF;&#x30DE;&#x30A4;&#x30BA;&#x3082;&#x542B;&#x3081;&#x3066;&#x3061;&#x3087;&#x304F;&#x3061;&#x3087;&#x304F;&#x66F4;&#x65B0;&#x3057;&#x3066;&#x307F;&#x305F;&#x3044;&#x3068;&#x60F3;&#x3044;&#x307E;&#x3059;&#x306E;&#x3067;&#x3001;&#x3088;&#x308D;&#x3057;&#x308C;&#x3051;&#x3070;&#x304A;&#x4ED8;&#x304D;&#x5408;&#x3044;&#x304F;&#x3060;&#x3055;&#x3044;(^ ^)</p>',
  excerpt: '',
  more: '<img src="https://farm6.staticflickr.com/5669/22700410789_dbdb93c44f_b.jpg" width="1024" class="photo gallery-cool" alt="develop or drink ?" data-height="732"> <h2 id="新たに…">新たに…</h2><p>WordpressからHexoに移行してブログを立ててみました。自分の写真事情も5年間で大分変わってきたようです。写真展や撮影イベントで名刺とポートフォリオサイトのURLを渡す機会が増えてきました。写真を始めて間もない頃はWordpressでブログを書いていましたが、動作がモッサリだったせいで放置気味になってしまいました。まずログインが面倒なんですよね(←おい)。ブログはサクサク動く環境が絶対いい！そんな事を思いながら何もせず数年が経ってしまいましたが、ようやく求めていた環境と出会えたのでブログを立ち上げ直してみたいと思います。</p>  <h2 id="ポートフォリオサイト設置">ポートフォリオサイト設置</h2><p>まずは名刺に載せる<a href="/profile/index.html">プロフィールサイト</a>を作ってみました。一先ずこれで各SNSへの紹介はできるようになりました。今の時代、本当に便利なものが沢山あってオリジナルサイトが簡単に無料で作れちゃいます。嬉しいような恐ろしいような(笑) 後は写真をどう見せるかを考え中なんですが、これから投稿する記事の写真をHexoから収集させて<a href="/gallery-archive/vivid/">まとめて見せる</a>ような形で簡単なポートフォリオとしてみたいと想います。</p> <p>ということで、これからブログのカスタマイズも含めてちょくちょく更新してみたいと想いますので、よろしれけばお付き合いください(^ ^)</p>',
  path: [Getter],
  permalink: [Getter],
  full_source: [Getter],
  asset_dir: [Getter],
  tags: [Getter],
  categories: [Getter],
  prev: 
   { layout: 'gl',
     title: 'ビビッド・スタイル',
     date: 
      { _isAMomentObject: true,
        _i: Sun Nov 29 2015 23:58:09 GMT+0900 (JST),
        _isUTC: false,
        _locale: [Object],
        _d: Sun Nov 29 2015 23:58:09 GMT+0900 (JST),
        _z: null,
        _pf: [Object],
        _isValid: true },
     description: 'これまで撮影したものの中から、鮮やかな仕上がりの写真をまとめてみました。',
     _content: '\n鮮やかな仕上がりの写真をまとめてみました。\n<!-- more -->\n\n{% flickr photo 21780533519 b %}\n　\n\n{% gl vivid %}',
     source: '_posts/gallery-archive/vivid.md',
     raw: 'layout: gl\ntitle: ビビッド・スタイル\ndate: 2015-11-29 23:58:09\ntags:\ntags:\n  - 写真\ncategories:\n  - アーカイブギャラリー\ndescription: これまで撮影したものの中から、鮮やかな仕上がりの写真をまとめてみました。\n---\n\n鮮やかな仕上がりの写真をまとめてみました。\n<!-- more -->\n\n{% flickr photo 21780533519 b %}\n　\n\n{% gl vivid %}',
     slug: 'gallery-archive/vivid',
     published: true,
     updated: 
      { _isAMomentObject: true,
        _i: Tue Feb 23 2016 17:04:21 GMT+0900 (JST),
        _isUTC: false,
        _locale: [Object],
        _d: Tue Feb 23 2016 17:04:21 GMT+0900 (JST),
        _z: null },
     comments: true,
     photos: [],
     link: '',
     _id: 'cil3gwx9h000g4m1kfg020b62',
     eyeCatchImage: 'https://farm1.staticflickr.com/683/21780533519_ddcc91035a_b.jpg',
     content: '<p>&#x9BAE;&#x3084;&#x304B;&#x306A;&#x4ED5;&#x4E0A;&#x304C;&#x308A;&#x306E;&#x5199;&#x771F;&#x3092;&#x307E;&#x3068;&#x3081;&#x3066;&#x307F;&#x307E;&#x3057;&#x305F;&#x3002;<br></p> <div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img src="https://farm1.staticflickr.com/683/21780533519_ddcc91035a_b.jpg" width="1024" class="photo" alt="Colorful lake" data-height="565"></div> <p> </p> <div class="masonry-grid"><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm3.staticflickr.com/2832/12142973533_a0530ba92f_b.jpg" alt="DSC_4418.jpg" data-posturl="p/kota-kiteflying-festival-1415/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm9.staticflickr.com/8647/15790475917_4fd64a6344_b.jpg" alt="Nikon D600 " data-posturl="p/kota-kiteflying-festival-1415/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1618/23882984139_98ac4a84c8_b.jpg" alt="Kota Kite flying" data-posturl="p/kota-kiteflying-festival-1415/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm8.staticflickr.com/7552/15970770785_7637cfba37_b.jpg" alt="Sony a7 " data-posturl="p/takeshima-gull/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm1.staticflickr.com/683/21780533519_ddcc91035a_b.jpg" alt="Colorful lake" data-posturl="p/red-leaves-shirokoma-pond/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1652/25190470455_4b133f94cc_b.jpg" alt="Japan hina dolls " data-posturl="p/japan-hina-dolls-kasuisai-hukuroi/"></div></div></div></div></div><div id="loader718"><div class="loader blue-bsm"><div class="loader-inner ball-scale-multiple"></div></div></div>',
     excerpt: '',
     more: '<p>鮮やかな仕上がりの写真をまとめてみました。<br></p> <img src="https://farm1.staticflickr.com/683/21780533519_ddcc91035a_b.jpg" width="1024" class="photo" alt="Colorful lake" data-height="565"> <p> </p> <div class="masonry-grid" class="clearfix"><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm3.staticflickr.com/2832/12142973533_a0530ba92f_b.jpg" alt="DSC_4418.jpg" data-posturl="p/kota-kiteflying-festival-1415/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm9.staticflickr.com/8647/15790475917_4fd64a6344_b.jpg" alt="Nikon D600 " data-posturl="p/kota-kiteflying-festival-1415/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1618/23882984139_98ac4a84c8_b.jpg" alt="Kota Kite flying" data-posturl="p/kota-kiteflying-festival-1415/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm8.staticflickr.com/7552/15970770785_7637cfba37_b.jpg" alt="Sony a7 " data-posturl="p/takeshima-gull/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm1.staticflickr.com/683/21780533519_ddcc91035a_b.jpg" alt="Colorful lake" data-posturl="p/red-leaves-shirokoma-pond/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-718" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1652/25190470455_4b133f94cc_b.jpg" alt="Japan hina dolls " data-posturl="p/japan-hina-dolls-kasuisai-hukuroi/"></div></div></div></div><div id="loader718"><div class="loader blue-bsm"><div class="loader-inner ball-scale-multiple"></div></div></div>',
     path: [Getter],
     permalink: [Getter],
     full_source: [Getter],
     asset_dir: [Getter],
     tags: [Getter],
     categories: [Getter],
     prev: 
      { layout: 'gl',
        title: 'フィルムライク・スタイル',
        date: [Object],
        description: 'これまで撮影したものの中から、フィルム風な仕上がりの写真をまとめてみました。',
        _content: '\n\nこれまで撮影したものの中から、フィルム風な仕上がりの写真をまとめてみました。\n<!-- more -->\n\n{% flickr photo 24168238265 b %}\n　\n\n{% gl filmfake %}',
        source: '_posts/gallery-archive/film-looking.md',
        raw: 'layout: gl\ntitle: フィルムライク・スタイル\ndate: 2015-12-03 22:28:49\ntags:\n  - 写真\ncategories:\n  - アーカイブギャラリー\ndescription: これまで撮影したものの中から、フィルム風な仕上がりの写真をまとめてみました。\n---\n\n\nこれまで撮影したものの中から、フィルム風な仕上がりの写真をまとめてみました。\n<!-- more -->\n\n{% flickr photo 24168238265 b %}\n　\n\n{% gl filmfake %}',
        slug: 'gallery-archive/film-looking',
        published: true,
        updated: [Object],
        comments: true,
        photos: [],
        link: '',
        _id: 'cil3gwx9k000k4m1kfep27grq',
        eyeCatchImage: 'https://farm2.staticflickr.com/1450/24168238265_a3f6c31e9d_b.jpg',
        content: '<p>&#x3053;&#x308C;&#x307E;&#x3067;&#x64AE;&#x5F71;&#x3057;&#x305F;&#x3082;&#x306E;&#x306E;&#x4E2D;&#x304B;&#x3089;&#x3001;&#x30D5;&#x30A3;&#x30EB;&#x30E0;&#x98A8;&#x306A;&#x4ED5;&#x4E0A;&#x304C;&#x308A;&#x306E;&#x5199;&#x771F;&#x3092;&#x307E;&#x3068;&#x3081;&#x3066;&#x307F;&#x307E;&#x3057;&#x305F;&#x3002;<br></p> <div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img src="https://farm2.staticflickr.com/1450/24168238265_a3f6c31e9d_b.jpg" width="1024" class="photo" alt="feel the light | A7R2 + Sonnar T* FE 55mm F1.8 ZA" data-height="1024"></div> <p> </p> <div class="masonry-grid"><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1571/24148327095_667a3aeab9_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1646/23521650963_ac024c96ca_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm6.staticflickr.com/5749/23520089544_da225fca9e_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1673/24148369715_d6df62a765_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><div class="imgw"><span class="imggw imgg-key-off"></span><span class="imgg"></span><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1450/24168238265_a3f6c31e9d_b.jpg" alt="feel the light " data-posturl="p/01-meijopark-portrait-feellight/"></div></div></div></div></div><div id="loader856"><div class="loader blue-bsm"><div class="loader-inner ball-scale-multiple"></div></div></div>',
        excerpt: '',
        more: '<p>これまで撮影したものの中から、フィルム風な仕上がりの写真をまとめてみました。<br></p> <img src="https://farm2.staticflickr.com/1450/24168238265_a3f6c31e9d_b.jpg" width="1024" class="photo" alt="feel the light | A7R2 + Sonnar T* FE 55mm F1.8 ZA" data-height="1024"> <p> </p> <div class="masonry-grid" class="clearfix"><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1571/24148327095_667a3aeab9_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1646/23521650963_ac024c96ca_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm6.staticflickr.com/5749/23520089544_da225fca9e_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1673/24148369715_d6df62a765_b.jpg" alt="HOLGA HL-N + A7R2 " data-posturl="p/01-holga-hl-n-a7r2-takeshima/"></div></div></div><div class="masonry-grid-item"><div class="photoFrame-loadingNow"><div class="gBox materialboxed" data-caption="caption"><img class="lazyG responsive-img loaderID-856" src="/images/100sp.gif" data-original="https://farm2.staticflickr.com/1450/24168238265_a3f6c31e9d_b.jpg" alt="feel the light " data-posturl="p/01-meijopark-portrait-feellight/"></div></div></div></div><div id="loader856"><div class="loader blue-bsm"><div class="loader-inner ball-scale-multiple"></div></div></div>',
        path: [Getter],
        permalink: [Getter],
        full_source: [Getter],
        asset_dir: [Getter],
        tags: [Getter],
        categories: [Getter],
        prev: [Object],
        next: [Circular] },
     next: [Circular] } }

*/


