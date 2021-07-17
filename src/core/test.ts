import {ImagePreview}  from './image-preview';
import { fps } from '../webgl/tools/index';
fps()()

let isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
if(!isMobile){
    if(confirm(`
        仅适配移动端项目
        only suitable for mobile terminal
    `)){
    }else{
    };
    throw 1;
}
const obj = new ImagePreview({
    imgs: [
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp0.yingleku.com%2Fupload%2Ftele%2F2019%2F05%2F18%2Fa5cdfc8121a424.jpg&refer=http%3A%2F%2Fp0.yingleku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629029117&t=722996578a3aaa26c3e3876a44eedd90',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201909%2F30%2F20190930192812_ZdJUw.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629013294&t=0fefdbd28f9926ff195325bd9d2bd4a9',
        'https://iknow-pic.cdn.bcebos.com/9213b07eca806538184ec36695dda144ad34821a',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2F1e93e74fb4b87734fb11bc487f9d7e2e9ce666f2.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629028767&t=83072eef6345c4169751cef753b79bd7',
        '/testImage/main_body3.png',
        'http://image.uc.cn/s/wemedia/s/upload/2019/120ded45c1c6ac2e7735ab375ac25311.png',
        '/testImage/errorload.jpg',
        '/testImage/BBC82C020430AED149F8D18A0849D241.png',
        '/testImage/more20190627.png',
        '/testImage/cubetexture.png',
        '/testImage/IMG_0512.JPG',
        '/testImage/main_body3.png',
        '/testImage/main_body3.png',
        '/testImage/main_body3.png',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ff.mgame.netease.com%2Fforum%2F201509%2F21%2F171337o26avxzpb6wpowza.gif&refer=http%3A%2F%2Ff.mgame.netease.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628907951&t=85efd61fe8604d1fb018b1555e23d316',
        '/testImage/BBC82C020430AED149F8D18A0849D241.png'
    ]
});
new ImagePreview({
    selector:'.imageWraper img'
})
obj.show(0)
setTimeout( () => {;
    const image = new Image();
    image.crossOrigin='anonymous'
    image.src = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201909%2F30%2F20190930192812_ZdJUw.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629013294&t=0fefdbd28f9926ff195325bd9d2bd4a9'
    // obj.insertImageAfter(image as image,90)
    // obj.delImage(100)
    // obj.show(3)
} ,500)

var statShow = document.querySelector('#stat');

window.onerror=function(message, source, lineno, colno, error){
    statShow.innerHTML=`
        ${message}
        ${source}
        ${lineno}
        ${colno}
        ${error}
    `;
}