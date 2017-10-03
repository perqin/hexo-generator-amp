## How to customize css of sample AMP template ?

To customize the CSS of the sample AMP template, please follow the steps below.

1. Please copy all the files in the folders below to `/amp-template/style/`

- URL: [https://github.com/tea3/hexo-generator-amp/tree/master/template/style/](https://github.com/tea3/hexo-generator-amp/tree/master/template/style/)

2. To customoize `sample-amp.css` , please edit `/amp-template/style/amp-style.styl` and other file (`/amp-template/style/**.styl`).

3. Please install gulp

```
$ npm install gulp -g
$ npm install gulp glob nib gulp-stylus gulp-plumber gulp-notify gulp-rename --save-dev
$ gulp ampcss
```

4. Please generate the `gulpfile.js` and copy [this program](https://github.com/tea3/hexo-generator-amp/tree/master/template/style/gulpfile.js).

5. Please excute gulp. The `sample-amp.css` is generated.

```
$ gulp ampcss
```