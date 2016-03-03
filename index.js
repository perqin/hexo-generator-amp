'use strict';

var assign = require('object-assign');

hexo.config.amp_generator = assign({
	
}, hexo.config.amp_generator);

hexo.extend.generator.register('amp', require('./lib/generator'));