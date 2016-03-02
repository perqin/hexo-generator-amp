'use strict';

var assign = require('object-assign');

hexo.config.amp_generator = assign({
  per_page: typeof hexo.config.per_page === "undefined" ? 10 : hexo.config.per_page
}, hexo.config.amp_generator);

hexo.extend.generator.register('amp', require('./lib/generator'));