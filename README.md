# hexo-generator-amp

Amp generator for [Hexo].

DEMO : [HTML](http://tea3.github.io/p/published-hexo-generator-amp/index.html) | [AMP HTML](http://tea3.github.io/p/published-hexo-generator-amp/index.amp.html#development=1)

## Installation

``` bash
$ npm install hexo-generator-amp --save
```

Then add this theme in your `themes/(your-theme)/layout/_partial/head.ejs`.

``` html
  <% if (is_post() && config.generator_amp){ %>
    <link rel="amphtml" href="./index.amp.html">
  <% } %>
```

.md should contain image file and width height element.

``` markdown
<img src="image.jpg" width="800" height="600">
or
<img src="image.jpg" width="800" data-height="600">
```


## Options

``` yaml
generator_amp:
  logo:
    path: asset/path-to-your-site-logo.jpg
    width: 600
    height: 60
  google_analytics: UA-123456789
  cssFilePath: asset/your-css-file-for-AMP.css
  substituteTitleImage: 
    path: asset/path-to-your-substitute-image.jpg
    width: 800
    height: 600
  
authorDetail:
  authorReading: Your name description
  avatar:
    path: asset/path-to-your-avator.jpg
    width: 150
    height: 150
  description: Self introduction
copyright_notice: The footer copyright notice 
```

### generator_amp settings
- **logo.path**: File path of a your logo image.
- **logo.width**: Width of a your logo image. (width <= 600px)
- **logo.height**: Height of a your logo image. (height <= 60px)
- **google_analytics**: Your google analytics tracking ID.
- **cssFilePath**: File path of a your css file for AMP. (e.g. sample-amp.css)
- **substituteTitleImage.path**: File path of a your substitute title image. (Use this when the image is not in the markdown)
- **substituteTitleImage.width**: Width of a your substitute title image. (width <= 600px)
- **substituteTitleImage.height**: Height of a your substitute title image. (height <= 60px)

### Auther detail settings (optional)
- **authorReading**: Your name description.
- **path**: File path of a your avator image.
- **width**: Width of a your avator image.
- **height**: Height of a your avator image.
- **description**: Self introduction.
- **copyright_notice**: The footer copyright notice.

## License

MIT

[Hexo]: http://hexo.io/