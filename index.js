'use strict';

var assign = require('object-assign');
var ic     = require('./lib/copyAssets.js');
var pathFn = require('path');

//default path
var ejsPath     = '../template/sample-amp.ejs';
var cssPath     = '../template/sample-amp.css';
var logoPath    = '../template/sample-logo.png';
var avatorPath  = '../template/sample-avator.png';
var substituteTitleImagePath    = '../template/sample-substituteTitleImage.png';


//------------------------------------
// copy template file
//------------------------------------
if(hexo.config.generator_amp && hexo.config.generator_amp.templateDir && hexo.config.generator_amp.assetDistDir && hexo.config.generator_amp.logo && hexo.config.generator_amp.logo.path && hexo.config.generator_amp.substituteTitleImage && hexo.config.generator_amp.substituteTitleImage.path){
	ic.initCopy(hexo.config.generator_amp.templateDir, [ejsPath, cssPath, logoPath, substituteTitleImagePath, avatorPath]);
}else{
	console.log("\u001b[31m[hexo-generator-amp] (error) please setting option.\u001b[0m ");
	return null;
}

var avatorDefaultPath = pathFn.basename( avatorPath );
if(hexo.config.authorDetail && hexo.config.authorDetail.avatar && hexo.config.authorDetail.avatar.path){
	avatorDefaultPath = hexo.config.authorDetail.avatar.path;
}
var copyAssetsStatus  = ic.copyAssets(hexo.config.generator_amp.templateDir, hexo.config.generator_amp.assetDistDir, [hexo.config.generator_amp.logo.path, hexo.config.generator_amp.substituteTitleImage.path, avatorDefaultPath]);
if(!copyAssetsStatus)return null;



hexo.config.amp_generator = assign({
	
}, hexo.config.amp_generator, {
	"defaultAssetsPath" : {
		"ejs" : ejsPath ,
		"css" : cssPath ,
		"logo": logoPath ,
		"avator" : avatorPath ,
		"substituteTitleImage" : substituteTitleImagePath
	}
});

hexo.extend.generator.register('amp', require('./lib/generator'));
hexo.extend.filter.register('after_post_render', require('./lib/eyeCatchVars') );