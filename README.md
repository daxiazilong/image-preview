# image-preview
front end image preview
### how to use it:

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
