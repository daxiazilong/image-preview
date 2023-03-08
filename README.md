ENGLISH | [简体中文](./REAEME-zh-CN.md) 

# image-preview
An image preview plugin for mobile web application.

### Features:
1. 🍉 Most operations are supported by gestures.
2. 🎃 Rotate and zoom image.
3. 🍓 Img lazy-loading default.
4. 🍂 Based webgl.
5. ☄🌰 3D view.
<img width="375" alt="image" src="https://user-images.githubusercontent.com/23512886/223669339-d884340f-1976-4483-81c2-983c7290264e.png">


### example
[click here](https://daxiazilong.github.io/image-preview/index.html) . 

### How to use it:
There are three ways:
#### 1. npm install
`npm i @daxiazilong/image-preview`
#### 2. Copy release
* The `release/image-preview` directory is built for different module-system , include AMD,CommonJS,ES6,UMD,IIFE. You can choose one adapt to your project.
#### 3.Install:
* Clone it ,then `npm i & npm run build`
* For different module-sysetem:
* The `release/image-preview` directory is built for different module-system , include AMD,CommonJS,ES6,UMD,IIFE. You can choose one adapt to your project.

### import 
  * script (in iife or umd module system,use namespace imagePreviewModule):
    ``` html
    <script src="js/image-preview-iife.js">
    <script>
      new imagePreviewModule.ImagePreview({
        // something same with below usage
      })
    </script>
    ```
  * esmodule:
    ```javascript
     import {ImagePreview} from 'js/image-preview-esm.js'
    ```
    or if installed in node_modules
    ```javascript
     import {ImagePreview} from '@daxiazilong/image-preview'
    ```
#### usage:
html:
```html
  <div class="imageWraper">
    <img data-src="/images/IMG_0512.JPG" src="/images/IMG_0512.JPG">
    <img data-src="/images/main_body3.png" src="/images/main_body3.png">
  </div>
```
javascript:
``` javascript
//first way:
let imgObj = new ImagePreview({
  selector:`.imageWraper img`
})
//second way:
let imgObj =  new ImagePreview({
  imgs:[
    'imgsrc',
    'imgsrc',
    'imgsrc'
  ]
})
//then show n-th picture,use
imgObj.show(n);

// Distroy image preview instance. Remove HTML generated by this ImagePreview instance and other resources. For better performance, then you can set imgObj = null;
imgObj.destroy();

```
The above code shows two ways about image preview generated, the first way bind click event on the HTMLElement supplied with selector automatically, and the second way requires yourself to bind trigger event manually. Actually, it is very simple, you just call `imgObj.show(n)` in your code where the image preview should open.

#### use with vue:
HTML:
```HTML
<div
    v-for="(item, index) in imgs"
    :key="index"
    @click="showImg(index)"
>
    {{index}}
</div>
```
JS:
```javascript
import {ImagePreview} from '@daxiazilong/image-preview'
export default {
    data () {
        return {
            imgs: [
                'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201909%2F30%2F20190930192812_ZdJUw.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629013294&t=0fefdbd28f9926ff195325bd9d2bd4a9',
                'https://iknow-pic.cdn.bcebos.com/9213b07eca806538184ec36695dda144ad34821a',
                'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2F1e93e74fb4b87734fb11bc487f9d7e2e9ce666f2.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629028767&t=83072eef6345c4169751cef753b79bd7',
                'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp.ssl.qhimg.com%2Ft017bbc635928363c05.jpg&refer=http%3A%2F%2Fp.ssl.qhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629274751&t=89d2696d8027df24bb767e6acb5330ac',
                'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ff.mgame.netease.com%2Fforum%2F201509%2F21%2F171337o26avxzpb6wpowza.gif&refer=http%3A%2F%2Ff.mgame.netease.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628907951&t=85efd61fe8604d1fb018b1555e23d316',
            ],
        }
    },
    // for vue3,  vue2.x is [beforeDestroy](https://cn.vuejs.org/v2/api/#beforeDestroy)
    beforeUnmount () {
        if (this.imgPreview) {
            this.imgPreview.destroy();
        }
    },
    methods: {
        showImg(index: any) {
            if (!this.imgPreview) {
                this.imgPreview = new ImagePreview({
                    imgs: [
                        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201909%2F30%2F20190930192812_ZdJUw.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629013294&t=0fefdbd28f9926ff195325bd9d2bd4a9',
                        'https://iknow-pic.cdn.bcebos.com/9213b07eca806538184ec36695dda144ad34821a',
                        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2F1e93e74fb4b87734fb11bc487f9d7e2e9ce666f2.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629028767&t=83072eef6345c4169751cef753b79bd7',
                        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp.ssl.qhimg.com%2Ft017bbc635928363c05.jpg&refer=http%3A%2F%2Fp.ssl.qhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629274751&t=89d2696d8027df24bb767e6acb5330ac',
                        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ff.mgame.netease.com%2Fforum%2F201509%2F21%2F171337o26avxzpb6wpowza.gif&refer=http%3A%2F%2Ff.mgame.netease.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628907951&t=85efd61fe8604d1fb018b1555e23d316',
                    ]
                });
            }
            this.imgPreview.show(index);
        }
    },
}
```
                
#### use with React:
```javascript

export default() => {
    // a ref 
    const imgInstance = useRef(null as unknown as ImagePreview);
    useEffect(()=> {
        return () => {
            if (imgInstance.current) {
               // never forget to destroy
                imgInstance.current.destroy();
            }
        }
    }, [])

    const imgs =  [
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201909%2F30%2F20190930192812_ZdJUw.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629013294&t=0fefdbd28f9926ff195325bd9d2bd4a9',
        'https://iknow-pic.cdn.bcebos.com/9213b07eca806538184ec36695dda144ad34821a',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2F1e93e74fb4b87734fb11bc487f9d7e2e9ce666f2.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629028767&t=83072eef6345c4169751cef753b79bd7',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp.ssl.qhimg.com%2Ft017bbc635928363c05.jpg&refer=http%3A%2F%2Fp.ssl.qhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629274751&t=89d2696d8027df24bb767e6acb5330ac',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ff.mgame.netease.com%2Fforum%2F201509%2F21%2F171337o26avxzpb6wpowza.gif&refer=http%3A%2F%2Ff.mgame.netease.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628907951&t=85efd61fe8604d1fb018b1555e23d316',
    ];
    function handleClick (index: number) {
        if (!imgInstance.current) {
            imgInstance.current = new ImagePreview({
                imgs,
            })
        }
        imgInstance.current.show(index);
    }

    return (<div>
        {
            imgs.map((src, index) => {
                return (
                    <div key={index} onClick={() =>handleClick(index)}>
                        {index}
                    </div>
                )
            })
        }
    </div>)
}

```

### Api
* `new ImagePreview({imgs?: Array<string|HTMLImageElement>}) ` 
* `new ImagePreview({selector?: string}) ` 
  
   Generate an ImagePreview instance.
* `imagePreview.prototype.show(index:number)` 
  Open index-th img on imagepreivew, index starts from 0.

* `imagePreview.prototype.insertImageAfter( image: string | HTMLImageElement , index: number )` 
   Insert a new image after index, if index < 0, then a new image will be inserted at 0 position. If the index is greater than imgs' length, the new image will be inserted in the last position.
   * Note: If the param image is HTMLImageElement, and it is cross origin, you'd better set the [crossOrigin](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin) attribute.

* `imagePreview.prototype.delImage(index:number)` 
  Delete index-th image. Index below 0 is 0, greater than imgs's length will be set to the last index.

* `imagePreview.prototype.destroy()` 
  Distroy image preview instance. Remove HTML generated by this ImagePreview instance and other resources. For better performance, then you can set imgObj = null;
  
### communicate
Thanks for your star 😜.

yon can join qq-group 977121370 and chat with me.
