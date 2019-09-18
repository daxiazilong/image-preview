# image-preview
front end image preview,for mobile-web application.
### features:
1. most of operation is supported by gensture.
2. rotate and zoom image.
### How to use it:
#### install:
Clone it ,then npm run build,find source image-preview.js in release/ts,finally use it in your project.
Or you can install this project's release/ts/index-prd.js directily.
#### example
[click here](https://daxiazilong.github.io/) . 
#### usage:
``` javascript
//just
let imgObj = new ImagePreview({
  selector:``
})
//or

let imgObj =  new ImagePreview({
  curImg:'imgsrc',
  imgs:[
    'imgsrc',
    'imgsrc',
    'imgsrc'
  ]
})
//then show n-th picture,use
imgObj.show(n);

```
