import { ImagePreview } from './image-preview';
var Vue = require('vue');
var obj = new ImagePreview({
    curImg: '/testImage/IMG_0512.JPG',
    imgs: [
        '/testImage/main_body3.png',
        'http://image.uc.cn/s/wemedia/s/upload/2019/120ded45c1c6ac2e7735ab375ac25311.png',
        '/testImage/test1.jpg',
        '/testImage/test1.jpg',
        '/testImage/test1.jpg',
        '/testImage/BBC82C020430AED149F8D18A0849D241.png',
        '/testImage/more20190627.png',
        '/testImage/cubetexture.png',
        '/testImage/IMG_0512.JPG',
        '/testImage/main_body3.png',
        '/testImage/main_body3.png',
        '/testImage/main_body3.png',
        '/testImage/BBC82C020430AED149F8D18A0849D241.png'
    ]
});
obj.show(0);
setTimeout(function () {
    ;
    // obj.insertImageAfter('/testImage/IMG_0512.JPG',0)
    // obj.delImage(0)
}, 500);
// Vue.use(ImagePreviewVue)
// new Vue({
//     el:'#el',
//     data:function(){
//         return{
//             outter:[1,2,34],
//             imgs: [
//                         '/testImage/IMG_0512.JPG',
//                         '/testImage/main_body3.png',
//                         '/testImage/main_body3.png',
//                         '/testImage/test1.jpg',
//                         '/testImage/main_body3.png',
//                         '/testImage/main_body3.png',
//                         '/testImage/BBC82C020430AED149F8D18A0849D241.png'
//                     ]
//         }
//     },
//     methods:{
//         increase:function(){
//             this.outter.push(0)
//         },
//         decrease:function(){
//             this.outter.pop();
//         }
//     }
// })
var statShow = document.querySelector('#stat');
window.onerror = function (message, source, lineno, colno, error) {
    statShow.innerHTML = "\n        " + message + "\n        " + source + "\n        " + lineno + "\n        " + colno + "\n        " + error + "\n    ";
};
