# hexo-generator-amp

Accelerated Mobile Pages (AMP) generator for [Hexo](https://github.com/hexojs/hexo).

## Orverview

`hexo-generator-amp` helps you hexo's projects that automatically generates AMP. 
Output file path is the `./amp/index.html`.  Also, You can freely choose the template(.ejs) and style(.css).
  
Documents : [read me](https://tea3.github.io/p/published-hexo-generator-amp/)
  
  
## DEMO

DEMO : [HTML page](https://tea3.github.io/p/hexo-markdown-notation/index.html)  |  [generated AMP HTML page](https://tea3.github.io/p/hexo-markdown-notation/index.amp.html#development=1)

## Installation

``` bash
$ npm install hexo-generator-amp --save
```

#### 1. Edit your theme

Then add this theme in your `themes/(your-theme)/layout/_partial/head.ejs`.

``` ejs
  <% if (is_post() && config.generator_amp){ %>
    <link rel="amphtml" href="./amp/index.html">
  <% } %>
```


#### 2. Add your config file

Please set the following options . Please edit your config file (`_config.yml`).

``` yaml
# Quick start Settings of hexo-amp-generator
generator_amp:
  templateDir: amp-template
  assetDistDir: amp-dist
  logo:
    path: sample-logo.png
    width: 600
    height: 60
  substituteTitleImage: 
    path: sample-substituteTitleImage.png
    width: 1024
    height: 800
  google_analytics: UA-123456789-1
  warningLog: false
```

#### 3. Validate AMP

Output file path is the `./amp/index.html`. Validate your AMP pages. Please see below

> Accelerated Mobile Pages Project - [Validate AMP Pages](https://www.ampproject.org/docs/guides/validate.html)

> How to validate AMP - [my blog](https://tea3.github.io/p/how-to-validate-amp/)


## Options

`hexo-generator-amp` can set the following options.

``` yaml
# Advanced Settings of hexo-amp-generator
generator_amp:
  substituteGoogle_adsense:
    data_ad_client: ca-pub-123456789876543
    data_ad_slot: 0123456789
    width: 336
    height: 280
  templateDir: amp-template
  assetDistDir: amp-dist
  logo:
    path: sample-logo.png
    width: 600
    height: 60
  substituteTitleImage: 
    path: sample-substituteTitleImage.png
    width: 1024
    height: 800
  google_analytics: UA-123456789-1
  warningLog: true
  cssFilePath: sample-amp.css #(optional)
  templateFilePath: sample-amp.ejs #(optional)
  
authorDetail:
  authorReading: Your name description #(optional)
  avatar:
    path: asset/path-to-your-avator.jpg #(optional)
    width: 150 #(optional)
    height: 150 #(optional)
  description: Self introduction #(optional)
copyright_notice: The footer copyright notice #(optional)
```




### A description of the options

#### generator_amp settings
- substituteGoogle_adsense
  - **substituteGoogle_adsense.data_ad_client**: substitute data_ad_client id
  - **substituteGoogle_adsense.data_ad_slot**: substitute data_ad_slot id
  - **substituteGoogle_adsense.width**: substitute ad width
  - **substituteGoogle_adsense.height**: substitute ad height
- **templateDir**: File path of a your AMP template files.
- **assetDistDir**: File path of a your AMP Assets.
- logo
  - **logo.path**: File path of a your logo image.
  - **logo.width**: Width of a your logo image. ([width <= 600px](https://developers.google.com/structured-data/carousels/top-stories#logo_guidelines))
  - **logo.height**: Height of a your logo image. ([height <= 60px](https://developers.google.com/structured-data/carousels/top-stories#logo_guidelines))
- **cssFilePath(optional)**: File path of a your css file for AMP. (e.g. ./sample-amp.css)
- **templateFilePath(optional)**: File path of a your template file for AMP. (e.g. ./sample-amp.ejs)
- substituteTitleImage
  - **substituteTitleImage.path**: File path of a your substitute title image. (Use this when the image is not in the markdown)
  - **substituteTitleImage.width**: Width of a your substitute title image. ([width >= 696px](https://developers.google.com/structured-data/carousels/top-stories#markup_specification))
  - **substituteTitleImage.height**: Height of a your substitute title image.
- **google_analytics**: Your google analytics tracking ID.
- **warningLog**: Enabled warnings.

#### Auther detail settings (optional)
- **authorReading**: Your name description.
- avatar
  - **avatar.path**: File path of a your avator image.
  - **avatar.width**: Width of a your avator image.
  - **avatar.height**: Height of a your avator image.
- **description**: Self introduction.

#### Auther copyright settings (optional)

- **copyright_notice**: The footer copyright notice.




## License

MIT

[Hexo]: http://hexo.io/