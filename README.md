# image-preview
front end image preview
### How to use it:
#### install:
Clone it ,then npm run build,find source image-preview.js in release/ts,finally use it in your project.
Or you can install this project's release/ts/image-preview.js directily.
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
