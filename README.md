# hexo-generator-amp

Amp generator for [Hexo].

## Installation

``` bash
$ npm install hexo-generator-amp --save
```

Then add this theme in your `themes/your-theme/layout/_partial/head.ejs`.

``` html
  <% if (is_post() && config.generator_amp){ %>
    <link rel="amphtml" href="./index.amp.html">
  <% } %>
```

## Options

``` yaml
generator_amp:
  logo:
    path: asset/path-to-your-site-logo.jpg
    width: 800
    height: 600
  google_analytics: UA-123456789
  cssFilePath: asset/your-css-file-for-AMP.css
  
authorDetail:
  authorReading: Your name description
  avatar:
    path: asset/path-to-your-icon.jpg
    width: 150
    height: 150
  description: Self introduction
copyright_notice: The footer copyright notice 
```
### generator_amp options
- **path**: File path of a your logo image.
- **width**: Width of a your logo image.
- **height**: Height of a your logo image.
- **google_analytics**: Your google analytics tracking ID.
- **cssFilePath**: File path of a your css file for AMP. (e.g. sample-amp.css)

### Auther detail options
- **authorReading**: Your name description.
- **path**: File path of a your icon image.
- **width**: Width of a your icon image.
- **height**: Height of a your icon image.
- **description**: Self introduction.
- **copyright_notice**: The footer copyright notice.

## License

MIT

[Hexo]: http://hexo.io/