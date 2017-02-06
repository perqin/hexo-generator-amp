
'use strict';

var Promise          = require('bluebird');
var pathFn           = require('path');
var assign           = require('object-assign');
var cache            = require('../cache.js');

//------------------------------------
// check the Cache file
//------------------------------------
module.exports.checkCache = function(result){
  return new Promise(function(resolve , reject){
    var cachedData = cache.getCache( result.post , result.config );
    process.stdout.write('[hexo-generator-amp] Plugin is currently checking the cache now ...           \r');
    if(cachedData){
      resolve(assign( result , {
        path    : pathFn.join( result.post.path , "amp/index.html" ),
        data    : cachedData.xml,
        tempData: assign( result.tempData , { isCacheUse : true } )
      }));
    }else{
      resolve(assign( result , {
        path    : pathFn.join( result.post.path , "amp/index.html" )
      }));
    }
  });
};
